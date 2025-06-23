'use client';
import React, { ReactNode,Children } from 'react';
import {Link} from '@/i18n/routing';
import '@/styles/Main.css';
import AppWrappers from '@/components/layout/AppWrappers';


type Props = {
  children?: ReactNode;
  title: string;
};

export default function BarndLayout({children, title}: Props) {
  return (
    <>
     <AppWrappers>
      <div className='fix_nav'>
          <div className="root_container">
              <div className="nav-container">
                  <div className="main_logo">AIGA</div>
                  <ul className="nav-links">
                      <li>
                      <Link
                        href="/"
                        target='_self'
                        className="bubble-link"
                      >
                        홈
                      </Link>
                    </li>
                  </ul>
              </div>
          </div>
      </div>
      <section className="mainContainer_title_wrap">
        <h2 className="main-title">{title}</h2>
      </section>
      <section className="mainContainer">
        {children}
      </section>
      <footer>
        <div className="root_container">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-logo">
                        <div className="logo-text">AIGA</div>
                        <div className="logo-subtitle">AI Guardian Angel</div>
                    </div>
                </div>
                <div className="footer-section">
                    <h4>법적 정보</h4>
                    <Link
                        href="/regulation"
                        target='_self'
                        className="bubble-link"
                    >
                        이용약관
                    </Link><br />
                    <Link
                        href="/policy"
                        target='_self'
                        className="bubble-link"
                    >
                        개인정보처리방침
                    </Link><br />
                    <Link
                        href="/sensitive"
                        target='_self'
                        className="bubble-link"
                    >
                        민감정보 이용
                    </Link>
                </div>
                <div className="footer-section">
                    <h4>고객지원</h4>
                    <a href="#">공지사항</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 AIGA Inc. All rights reserved. | 사업자등록번호: 123-45-67890 | 대표: 김의료</p>
                <p style={{marginTop: '10px', color:' #ff6b6b', fontWeight: 'bold'}}>
                    ⚠️ 본 서비스는 의료행위를 대체하지 않으며, 응급상황 시 즉시 119 또는 응급실로 연락하시기 바랍니다.
                </p>
            </div>
        </div>
    </footer>
      </AppWrappers>
    </>
  );
}