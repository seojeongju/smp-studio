# 그레이스 샵 (Grace Shop) - SMP & 반영구 뷰티 스튜디오

그레이스 샵(Grace Shop)은 반영구 눈썹 문신 및 두피 시술(SMP)을 전문으로 하는 프리미엄 뷰티 스튜디오의 모바일 최적화 웹 애플리케이션입니다.

## 주요 기능
- **데스크톱 디바이스 프레임 뷰포트**: 데스크톱 환경에서도 모바일 단말기 느낌(스마트폰 목업)의 UI를 제공하며, 왼쪽에는 세련된 브랜드 배너 레이아웃이 노출됩니다.
- **자가 진단 테스트 (Diagnostic Test)**: 사용자가 탈모 상태나 눈썹 상태를 자가 진단하고 알맞은 솔루션을 제안받을 수 있습니다.
- **케어 가이드 (Care Guide)**: 시술 종류별(SMP, 반영구 눈썹 등) 시술 후 주의사항과 사후 관리 가이드를 친절하게 안내합니다.
- **시술 후기 (Review)**: D1 데이터베이스와 연동되어 사용자들이 생생한 후기를 작성하고 별점을 등록할 수 있습니다. (R2 미디어 버킷을 통한 이미지 업로드 지원)

## 기술 스택
- **프론트엔드**: React, TypeScript, Vite, Vanilla CSS
- **백엔드 (Edge API)**: Cloudflare Pages Functions (Edge Runtime)
- **데이터베이스**: Cloudflare D1 (SQLite 기반)
- **오브젝트 스토리지**: Cloudflare R2 (이미지 업로드용)

## 로컬 개발 및 실행
1. 의존성 설치:
   ```bash
   npm install
   ```
2. 로컬 wrangler 개발 서버 기동:
   ```bash
   npx wrangler pages dev dist --d1 DB --r2 MEDIA_BUCKET
   ```

## Cloudflare 배포 구성
- **Wrangler 바인딩**: `wrangler.toml`의 설정을 기반으로 D1 DB와 R2 버킷이 Pages Functions에 연동됩니다.
