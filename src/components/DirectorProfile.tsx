import { Award, BadgeCheck, Briefcase, CheckCircle2, Sparkles } from 'lucide-react';
import {
  DIRECTOR,
  DIRECTOR_AWARDS,
  DIRECTOR_CAREER,
} from '../constants/director';

interface DirectorProfileProps {
  onStartConsulting?: () => void;
}

export function DirectorProfile({ onStartConsulting }: DirectorProfileProps) {
  return (
    <div className="director-profile" style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* 히어로: 사진 + 이름 */}
      <section className="director-hero">
        <div className="director-hero-bg" aria-hidden />
        <div className="director-photo-wrap">
          <img
            src={DIRECTOR.photo}
            alt={`${DIRECTOR.nameKo} 원장 프로필`}
            className="director-photo"
          />
          <span className="director-photo-badge">
            <BadgeCheck size={14} />
            DIRECTOR
          </span>
        </div>

        <div className="director-identity">
          <p className="director-eyebrow">Grace Shop · Founder</p>
          <h2 className="director-name notranslate">
            {DIRECTOR.nameKo}
            <span className="director-name-en">{DIRECTOR.nameEn}</span>
          </h2>
          <p className="director-title">{DIRECTOR.title}</p>
          <p className="director-intro">{DIRECTOR.intro}</p>
        </div>

        <div className="director-highlights notranslate">
          {DIRECTOR.highlights.map((item) => (
            <div key={item.label} className="director-highlight">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 경력사항 */}
      <section className="director-section">
        <div className="director-section-head">
          <div className="director-section-icon">
            <Briefcase size={16} />
          </div>
          <div>
            <h3>경력사항</h3>
            <p>협회·심사·교육 현장에서의 전문 이력</p>
          </div>
        </div>
        <ul className="director-list">
          {DIRECTOR_CAREER.map((item) => (
            <li key={item}>
              <CheckCircle2 size={14} className="director-list-icon" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 수상·자격 */}
      <section className="director-section">
        <div className="director-section-head">
          <div className="director-section-icon director-section-icon--award">
            <Award size={16} />
          </div>
          <div>
            <h3>수상·자격</h3>
            <p>국가자격과 국제 대회 수상 이력</p>
          </div>
        </div>
        <ul className="director-list">
          {DIRECTOR_AWARDS.map((item) => (
            <li key={item}>
              <Award size={14} className="director-list-icon director-list-icon--award" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      {onStartConsulting && (
        <button
          type="button"
          className="btn btn-primary director-cta"
          onClick={onStartConsulting}
        >
          <Sparkles size={16} />
          원장 1:1 상담 신청하기
        </button>
      )}
    </div>
  );
}
