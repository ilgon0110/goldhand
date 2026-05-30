#!/bin/bash
# scripts/deploy.sh
# EC2에서 실행. 환경변수: DOCKERHUB_USERNAME, DOCKERHUB_TOKEN, IMAGE_TAG
set -euo pipefail

IMAGE="${DOCKERHUB_USERNAME}/goldhand"
NEW_TAG="${IMAGE_TAG:-latest}"

# ── Docker Hub 로그인 (private repo) ──────────────────────────────
echo "▶ Logging in to Docker Hub"
echo "${DOCKERHUB_TOKEN}" | docker login -u "${DOCKERHUB_USERNAME}" --password-stdin
trap 'docker logout > /dev/null 2>&1' EXIT

# ── 현재 실행 중인 태그 저장 (롤백용) ─────────────────────────────
PREV_TAG=""
OLD_CONTAINER_ID=$(docker compose ps -q nextjs 2>/dev/null || echo "")
if [ -n "${OLD_CONTAINER_ID}" ]; then
  PREV_IMAGE=$(docker inspect --format='{{.Config.Image}}' "${OLD_CONTAINER_ID}" 2>/dev/null || echo "")
  PREV_TAG=$(echo "${PREV_IMAGE}" | cut -d: -f2)
  echo "▶ Previous tag: ${PREV_TAG}"
else
  echo "▶ No running container (first deploy)"
fi

# ── 새 이미지 pull ─────────────────────────────────────────────────
echo "▶ Pulling ${IMAGE}:${NEW_TAG}"
docker pull "${IMAGE}:${NEW_TAG}"

# ── 컨테이너 교체 ─────────────────────────────────────────────────
echo "▶ Starting containers with tag ${NEW_TAG}"
IMAGE_TAG="${NEW_TAG}" docker compose up -d --force-recreate

# ── 헬스체크 (24회 × 5초 = 120초) ──────────────────────────────────
echo "▶ Waiting for health check..."
NEW_CONTAINER_ID=$(docker compose ps -q nextjs 2>/dev/null || echo "")
for i in $(seq 1 24); do
  HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "${NEW_CONTAINER_ID}" 2>/dev/null || echo "unknown")
  if [ "${HEALTH}" = "healthy" ]; then
    echo "✓ Healthy — deploy complete (tag: ${NEW_TAG})"
    exit 0
  fi
  echo "  [${i}/24] status: ${HEALTH} — retrying in 5s..."
  sleep 5
done

# ── Loop 종료 후 최종 확인 ────────────────────────────────────────────
HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "${NEW_CONTAINER_ID}" 2>/dev/null || echo "unknown")
if [ "${HEALTH}" = "healthy" ]; then
  echo "✓ Healthy — deploy complete (tag: ${NEW_TAG})"
  exit 0
fi

# ── 헬스체크 실패 → 롤백 ──────────────────────────────────────────
echo "✗ Health check timed out after 120s"
if [ -n "${PREV_TAG}" ]; then
  echo "▶ Rolling back to ${IMAGE}:${PREV_TAG}"
  IMAGE_TAG="${PREV_TAG}" docker compose up -d --force-recreate \
    || { echo "✗ ROLLBACK ALSO FAILED — service is down!"; exit 2; }
  echo "✗ Rolled back to ${PREV_TAG} — please investigate"
else
  echo "✗ No previous tag — manual intervention required"
fi
exit 1
