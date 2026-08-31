/**
 * usePhoneAuthCodeSendMutation이 SMS 발송 시 국내 번호(01012345678)를 E.164(+8210...)로
 * 변환해 Firebase Auth에 등록하는 것과 동일한 규칙으로 변환해, 클라이언트가 보낸 phoneNumber가
 * 실제로 Firebase Auth(Admin SDK)에 인증·연동된 번호와 일치하는지 검증한다.
 * 요청 body의 phoneNumber를 그대로 신뢰해 저장하면 SMS 인증 절차를 API 직접 호출로 우회할 수 있다.
 */
export function isOwnedPhoneNumber(localPhoneNumber: string, verifiedE164PhoneNumber: string | undefined): boolean {
  if (!verifiedE164PhoneNumber) return false;
  return `+82${localPhoneNumber.substring(1)}` === verifiedE164PhoneNumber;
}
