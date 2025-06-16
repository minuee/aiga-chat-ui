'use client';
import React, { Children } from 'react';
import {Link} from '@/i18n/routing';
import '@/styles/Main.css';

export default function MainPage() {
  
  return (
    <>
    <div className='fix_nav'>
        <div className="root_container">
            <div className="nav-container">
                <div className="main_logo">AIGA</div>
                <ul className="nav-links">
                    <li><a href="#home">홈</a></li>
                    <li><a href="#about">회사소개</a></li>
                    <li><a href="#team">서비스</a></li>
                    <li><a href="#contact">CONTACT</a></li>
                </ul>
            </div>
        </div>
    </div>


    <section className="hero" id="home">
        <div className="root_container">
            <div className="hero-content">
                <h1>AI 기반 맞춤형<br />의료진 추천 서비스</h1>
                <p>인공지능이 당신의 증상을 분석하여 가장 적합한 의료진을 추천해드립니다.<br />더 빠르고 정확한 의료 서비스의 첫걸음을 시작하세요.</p>
                
                <div className="disclaimer">
                    <strong>중요 안내:</strong> 본 서비스는 의료진 정보 제공 목적으로, 의료 진단이나 처방을 대체하지 않습니다. 응급상황 시 즉시 119 또는 가까운 응급실로 연락하세요.
                </div>
                
                <a href="#about" className="cta-button">서비스 알아보기</a>
            </div>
        </div>
    </section>


    <section className="features">
        <div className="root_container">
            <h2 className="section-title">내 몸에 꼭 맞는 주치의, AIGA가 찾아드립니다.</h2>
            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">🔍</div>
                    <h3>AI 증세체크</h3>
                    <p>최신 인공지능 기술로 사용자의 증상 분석</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>의사 추천</h3>
                    <p>현재 질환에 가장 적합한 의료진과 진료과를 정확하게 추천</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3>AI 기반 감성 분석</h3>
                    <p>AI 기반 감성 분석으로 온라인 환우 리뷰를 심층 분석.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🔒</div>
                    <h3>안전한 정보관리</h3>
                    <p>의료정보보호법을 준수하며, 사용자의 개인정보와 건강정보를 안전하게 보호합니다.</p>
                </div>
            </div>
        </div>
    </section>

 
    <section className="about" id="about">
        <div className="root_container">
            <div className="about-content">
                <div className="about-text">
                    <h2>데이터 기반 AI 추천으로, 이제 헤매지 않고 내게 딱 맞는 의사를 찾으세요.</h2>
                    <p>AIGA은 <strong>인공지능 기술</strong>을 활용하여 환자 개개인에게 <strong>최적화된 의료진을 추천</strong>하는 플랫폼입니다. 우리는 복잡한 의료 정보 속에서 헤매지 않고 <strong>누구나 자신에게 딱 맞는 의사를 쉽게 찾을 수 있도록 돕습니다.</strong></p>
                    <p>의료 정보의 불균형을 해소하고, <strong>최신 AI 기술</strong>을 통해 더욱 <strong>정확하고 개인화된 의료 서비스 경험</strong>을 제공하는 것이 저희의 목표입니다. <strong>방대한 의료 데이터와 전문 의료진 네트워크, 그리고 혁신적인 AI 기술</strong>을 결합하여, <strong>신뢰할 수 있고 접근하기 쉬운 맞춤형 의료 추천 서비스</strong>를 제공하고 있습니다.</p>
                </div>
                <div className="about-image">
                    <div className="stats">
                        <div className="stat-item">
                            <div className="stat-number">1,000+</div>
                            <div className="stat-label">전국 47개 상급종합병원 의료진</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">50+</div>
                            <div className="stat-label">전문 진료과</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">100,000+</div>
                            <div className="stat-label">AI 분석 환우 리뷰</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <section className="team" id="team">
        <div className="root_container">
            <h2 className="section-title">AIGA 주요 기능 <span className="star-icon">🌟</span></h2>
            <div className="service-demo">
                <div className="mobile-mockup">
                    <div className="mobile-header">
                        <div className="status-bar">
                            <span>11:00</span>
                            <div className="signal-battery">
                                <span>●●●●</span>
                                <span>📶</span>
                                <span>🔋</span>
                            </div>
                        </div>
                        <div className="app-header">
                            <span className="back-btn">←</span>
                            <span className="app-title">AIGA</span>
                            <span className="menu-btn">☰</span>
                        </div>
                    </div>
                    
                    <div className="chat-interface">
                        <div className="user-message">
                            <div className="message-bubble user">
                                머리에 열이 나고 온 몸이 쑤시는 거 같아.
                            </div>
                        </div>
                        
                        <div className="bot-response">
                            <div className="aiga-logo">🤖 AIGA</div>
                            <div className="message-bubble bot">
                                머리에 열이 나고 온몸이 쑤시며, 목도 아픈 증상은 주로 감기, 독감, 인후염(목감기) 등 바이러스성 감염에서 흔하게 나타나는 증상입니다. 이런 경우 대부분 다음과 같은 증상이 동반될 수 있습니다:
                                <br /><br />
                                위 증상에 맞는 이비인후과 의사를 추천해드립니다.
                            </div>
                        </div>
                        
                        <div className="doctor-recommendations">
                            <div className="doctor-card">
                                <div className="doctor-avatar">👨‍⚕️</div>
                                <div className="doctor-info">
                                    <div className="doctor-name">김건강</div>
                                    <div className="hospital-name">서울대학교병원</div>
                                    <div className="specialty">이비인후과</div>
                                </div>
                            </div>
                            <div className="doctor-card">
                                <div className="doctor-avatar">👨‍⚕️</div>
                                <div className="doctor-info">
                                    <div className="doctor-name">김건강2</div>
                                    <div className="hospital-name">가톨릭대학교...</div>
                                    <div className="specialty">이비인후과</div>
                                </div>
                            </div>
                            <div className="doctor-card">
                                <div className="doctor-avatar">👨‍⚕️</div>
                                <div className="doctor-info">
                                    <div className="doctor-name">김건강</div>
                                    <div className="hospital-name">삼성서울병원</div>
                                    <div className="specialty">이비인후과</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="input-area">
                            <input type="text" placeholder="메시지 입력" disabled />
                            <button className="send-btn">→</button>
                        </div>
                    </div>
                </div>
                
                <div className="demo-description">
                    <p>간단한 증상 입력만으로도 AI가 정확한 분석을 통해 가장 적합한 의료진을 추천해드립니다.</p>
                    <ul>
                        <li><strong>내 이야기만 해도 충분해요:</strong> 복잡한 의학 용어 대신, <strong>일상적인 언어로 증상을 입력</strong>해도 AI가 정확하게 이해하고 분석합니다.</li>
                        <li><strong>AI가 똑똑하게 분석해줘요:</strong> 입력된 증상을 바탕으로 <strong>AI가 질병을 예측하고, 발생 가능한 위험도를 분석</strong>해줍니다.</li>
                        <li><strong>나에게 딱 맞는 의사를 바로 찾아줘요:</strong> AI 분석 결과를 토대로, <strong>개인의 증상과 상황에 가장 적합한 전문 의료진을 추천</strong>해드립니다.</li>
                        <li><strong>궁금했던 의사 정보, 한눈에 확인해요:</strong> 추천받은 의료진은 물론, <strong>병원별 전문의의 상세 정보와 전문 분야</strong>를 쉽고 빠르게 탐색할 수 있습니다.</li>
                    </ul>
                </div>
            </div>
            
           
            <div className="review-section">
                <div className="review-mockup">
                    <div className="ai-review-section">
                        <div className="section-header">
                            <h3>AI 소셜 리뷰 ⓘ</h3>
                        </div>
                        <div className="ai-metrics">
                            <div className="metric-item">
                                <div className="metric-icon">💙</div>
                                <div className="metric-label">친절·배려</div>
                                <div className="metric-score">4.6</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-icon">👨‍⚕️</div>
                                <div className="metric-label">치료 만족</div>
                                <div className="metric-score">4.6</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-icon">💭</div>
                                <div className="metric-label">쉬운 설명</div>
                                <div className="metric-score">4.6</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-icon">👍</div>
                                <div className="metric-label">추천 의향</div>
                                <div className="metric-score">4.6</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="aiga-review-section">
                        <div className="section-header">
                            <h3>AIGA 리뷰 ⓘ</h3>
                        </div>
                        <div className="overall-rating">
                            <div className="rating-number">3.8</div>
                            <div className="rating-stars">⭐⭐⭐⭐⭐</div>
                        </div>
                        <div className="rating-breakdown">
                            <div className="rating-item">
                                <span className="rating-label">친절·배려</span>
                                <div className="rating-bar">
                                    <div className="rating-fill" style={{ width: '60%' }}></div>
                                </div>
                                <span className="rating-value">3.0</span>
                            </div>
                            <div className="rating-item">
                                <span className="rating-label">치료 만족</span>
                                <div className="rating-bar">
                                    <div className="rating-fill" style={{ width: '60%' }}></div>
                                </div>
                                <span className="rating-value">3.0</span>
                            </div>
                            <div className="rating-item">
                                <span className="rating-label">쉬운 설명</span>
                                <div className="rating-bar">
                                    <div className="rating-fill" style={{ width: '40%' }}></div>
                                </div>
                                <span className="rating-value">2.0</span>
                            </div>
                            <div className="rating-item">
                                <span className="rating-label">추천 의향</span>
                                <div className="rating-bar">
                                    <div className="rating-fill" style={{ width: '20%' }}></div>
                                </div>
                                <span className="rating-value">1.0</span>
                            </div>
                        </div>
                        
                        <div className="review-sample">
                            <div className="reviewer-info">
                                <strong>보라비콩콩이</strong>
                                <span className="review-date">2025.05.05</span>
                            </div>
                            <div className="review-tags">
                                <span className="tag positive">친절·배려 ⭐ 4.6</span>
                                <span className="tag positive">치료 만족 ⭐ 4.6</span>
                                <span className="tag positive">쉬운 설명 ⭐ 4.6</span>
                                <span className="tag positive">추천 의향 ⭐ 4.6</span>
                            </div>
                            <div className="review-text">
                                참 친절하게 진료해주셨어요.<br />
                                다음에도 또 방문하고 싶습니다.
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="review-description">
                    <h3>실제 환자 리뷰 기반 AI 분석</h3>
                    <p>AIGA는 <strong>실제 환자들의 솔직한 리뷰를 AI로 분석</strong>하여 의료진의 장단점을 객관적으로 제시합니다.</p>
                    <ul>
                        <li><strong>AI 감성 분석으로 정확도 UP:</strong> 수천 개의 리뷰를 <strong>AI가 감성 분석하여 의료진의 실제 평가</strong>를 정확하게 제공합니다.</li>
                        <li><strong>숨겨진 진실까지 파악:</strong> 단순한 별점이 아닌 <strong>친절도, 치료 만족도, 설명력</strong> 등 세부 항목별 분석을 통해 내가 원하는 의사를 찾을 수 있습니다.</li>
                        <li><strong>실시간 업데이트:</strong> 새로운 리뷰가 등록될 때마다 <strong>AI 분석 결과가 실시간으로 업데이트</strong>되어 항상 최신 정보를 제공합니다.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    
    <section className="contact" id="contact">
        <div className="root_container">
            <h2>환자 중심의 건강 솔루션</h2>
            <p>저희는 <strong>건강한 미래를 위한 혁신적인 환자 중심의 서비스</strong>를 개발하고 있습니다.</p>
            
            <div className="contact-info">
                <div className="contact-item">
                    <h4>📧 이메일</h4>
                    <p>contact@aiga.co.kr</p>
                </div>
                <div className="contact-item">
                    <h4>🚀 주요 서비스 계획</h4>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.9rem'}}>
                        <strong>단계별 확대 계획:</strong><br />
                        📍 3차 병원 (1단계)<br />
                        📍 2차 병원 (2단계) 확대 예정
                    </div>
                </div>
                <div className="contact-item">
                    <h4>🏢 주소</h4>
                    <p>서울시 중구 퇴계로 324<br />성우빌딩 7층</p>
                </div>
            </div>
        </div>
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
                    <a href="#">이용약관</a><br />
                    <a href="#">개인정보처리방침</a><br />
                    <a href="#">민감정보 이용 동의</a>
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

    
    <div className="chatbot-preview" id="chatbot-preview">
        <div className="chat-header">
            <div className="chat-icon">🩺</div>
            <span>AIGA AI</span>
            <button className="close-chat">×</button>
        </div>
        <div className="chat-messages">
            <div className="message bot-message">
                <div className="message-icon">🩺</div>
                <div className="message-content">
                    안녕하세요! AIGA AI입니다. 증상이나 건강 고민을 말씀해주시면 가장 적합한 의료진을 추천해드릴게요.
                </div>
            </div>
            <div className="message bot-message">
                <div className="message-icon">🩺</div>
                <div className="message-content">
                    어떤 증상이 있으신가요? 예: "두통이 계속돼요", "무릎이 아파요" 등
                </div>
            </div>
            <div className="message bot-message">
                <div className="message-icon">🩺</div>
                <div className="message-content">
                    ⚠️ 응급상황이라면 즉시 119에 신고하세요. 본 서비스는 정보 제공 목적입니다.
                </div>
            </div>
        </div>
        <div className="chat-input">
            <input type="text" placeholder="증상을 입력해주세요..." disabled />
            <button disabled>전송</button>
        </div>
    </div>
    <div className="chat-toggle-wrapper">
    <button className="chat-toggle-btn" title="AI 챗봇 미리보기">
        <Link
            href="/chat"
            target='_blank'
            className="bubble-link"
        >
        <div className="chat-btn-icon">🩺</div>
        </Link>
    </button>

    <div className="floating-message" id="floating-message">
        
        <div className="bubble-content">
            <Link
                href="/chat"
                target='_blank'
            >
            질환별 맞춤형 AI의사 추천서비스 AIGA를 써보세요.
            </Link>
        </div>
        <div className="bubble-arrow" />
    </div>
    </div>
    </>
  )
}
