import { SEO_INTRO_PARAGRAPHS, SITE_NAME } from '../constants/seo';

/** 홈 공개 소개 — 검색·AEO용 키워드를 자연문장으로 노출 */
export function HomeSeoIntro() {
  return (
    <section className="home-seo-intro" aria-labelledby="home-seo-intro-title">
      <h2 id="home-seo-intro-title" className="home-seo-intro-title">
        {SITE_NAME} · 대구 반영구 전문
      </h2>
      {SEO_INTRO_PARAGRAPHS.map((text) => (
        <p key={text.slice(0, 24)} className="home-seo-intro-text">
          {text}
        </p>
      ))}
    </section>
  );
}
