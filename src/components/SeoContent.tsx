import { SEO_FAQS, SEO_INTRO_PARAGRAPHS, SEO_TARGET_KEYWORDS, SITE_NAME, SITE_TAGLINE } from '../constants/seo';
import { SHOP_LOCATION } from '../constants/location';
import { DIRECTOR } from '../constants/director';

/**
 * 크롤러·AI 답변 엔진이 읽을 수 있는 시맨틱 본문.
 * 시각적으로는 숨기되 스크린리더·검색봇에는 노출 (clip 방식).
 */
export function SeoContent() {
  return (
    <section
      className="seo-aeo-content"
      aria-label={`${SITE_NAME} 검색·안내 정보`}
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      <h2>
        {SITE_NAME} — {SITE_TAGLINE}
      </h2>
      {SEO_INTRO_PARAGRAPHS.map((text) => (
        <p key={text.slice(0, 20)}>{text}</p>
      ))}
      <p>주소: {SHOP_LOCATION.fullAddress}</p>
      <p>
        원장: {DIRECTOR.nameKo} ({DIRECTOR.title})
      </p>
      <p>운영: 100% 사전 예약제 · 네이버 예약 및 네이버 톡톡 상담</p>
      <p>
        고객 후기: 남구 대명동 두피문신·대구 남구 눈썹문신·대구남구반영구 실제 리뷰는
        <a href="/reviews">고객 후기 페이지</a>에서 확인할 수 있습니다.
      </p>
      <h3>주요 키워드</h3>
      <ul>
        {SEO_TARGET_KEYWORDS.map((keyword) => (
          <li key={keyword}>{keyword}</li>
        ))}
      </ul>

      <h3>자주 묻는 질문</h3>
      <dl>
        {SEO_FAQS.map((faq) => (
          <div key={faq.question}>
            <dt>{faq.question}</dt>
            <dd>{faq.answer}</dd>
          </div>
        ))}
      </dl>

      <nav aria-label="주요 메뉴">
        <ul>
          <li>
            <a href="#home">홈</a>
          </li>
          <li>
            <a href="#portfolio">전후사진</a>
          </li>
          <li>
            <a href="#gallery">갤러리</a>
          </li>
          <li>
            <a href="#services">시술 안내</a>
          </li>
          <li>
            <a href="#care">케어 가이드</a>
          </li>
          <li>
            <a href="/reviews">고객 후기</a>
          </li>
          <li>
            <a href="#location">오시는 길</a>
          </li>
          <li>
            <a href="#profile">원장 소개</a>
          </li>
        </ul>
      </nav>
    </section>
  );
}
