'use client';

// 클라이언트 전용 public API. 서버 컴포넌트가 index.ts를 거치면 uploadSingleImage → firebase 클라이언트 SDK까지 서버 모듈 그래프에 들어가므로 분리한다.
export { type IImagesContextFile, ImagesContext, useImagesContext } from './model/ImagesContext';
