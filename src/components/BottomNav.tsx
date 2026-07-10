import React from 'react';
import { Home, Image, MessageSquare, BookOpen, Compass, MapPin, UserRound } from 'lucide-react';

export type TabType =
  | 'home'
  | 'gallery'
  | 'reviews'
  | 'services'
  | 'care'
  | 'location'
  | 'profile'
  | 'admin';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  // 관리자(admin)는 하단 탭에 노출하지 않음 — #admin URL로만 접근
  const navItems = [
    { id: 'home' as TabType, label: '홈', icon: Home },
    { id: 'gallery' as TabType, label: '전후사진', icon: Image },
    { id: 'reviews' as TabType, label: '고객후기', icon: MessageSquare },
    { id: 'profile' as TabType, label: '원장소개', icon: UserRound },
    { id: 'services' as TabType, label: '케어안내', icon: BookOpen },
    { id: 'care' as TabType, label: '맞춤케어', icon: Compass },
    { id: 'location' as TabType, label: '오시는길', icon: MapPin },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            aria-label={item.label}
          >
            <div className="nav-icon-wrapper">
              <IconComponent size={17} />
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
