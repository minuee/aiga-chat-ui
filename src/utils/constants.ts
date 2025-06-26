export const apiSuccessCode = [200,201,202,203,300,301,302];
export const apiAllowOriginCode = ["https://aigadev.kormedi.com","http://localhost:3000"]

const chatAnswerType = ['recommand_doctor','search_doctor','recommand_hospital','general']

const sample_msg_1 = {
  "session_id": "sid_dc6226ca-e898-452e-a661-1013a255f8cc",
  "chat_id": 18,
  "chat_type": "recommand_doctor",
  "question": "고혈압 치료를 잘하는 의사를 소개해줘",
  "answer": {
      "disease": "고혈압",
      "hospital": "",
      "doctors": [
          {
              "doctor_id": 997,
              "hospital": "고려대안암병원",
              "address": "서울특별시 성북구 고려대로 73, 고려대병원 (안암동5가)",
              "lat": 127.026248862202,
              "lon": 37.5873771473625,
              "telephone": "1577-0083",
              "name": "조상경",
              "deptname": "신장내과",
              "specialties": "신장질환,고혈압",
              "url": "https://anam.kumc.or.kr/kr/doctor-department/doctor/view.do?drNo=802",
              "education": "[{\"type\":\"학력\",\"period\":\"~ 1993\",\"action\":\"고려대학교 의과대학\",\"url\":\"\"}]",
              "career": "[{\"type\":\"경력\",\"period\":\"2012 ~\",\"action\":\"고려대학교 의과대학 교수\",\"url\":\"\"},{\"type\":\"경력\",\"period\":\"2007 ~ 2012\",\"action\":\"고려대학교 의과대학 부교수\",\"url\":\"\"},{\"type\":\"경력\",\"period\":\"2006 ~ 2007\",\"action\":\"Research Associate in University of Virginia, USA\",\"url\":\"\"},{\"type\":\"경력\",\"period\":\"2003 ~ 2006\",\"action\":\"고려대학교 의과대학 조교수\",\"url\":\"\"},{\"type\":\"경력\",\"period\":\"2001 ~ 2003\",\"action\":\"visiting fellow in National Institute of Health, USA\",\"url\":\"\"}]",
              "paper": [
                  "[국외논문]Inflammatory cytokines and lipopolysacharride induce Fas-mediated apoptosis in renal tubular cells",
                  "[국외논문]Urine Neutrophil Gelatinase-Associated Lipocalin: An Independent Predictor of Adverse Outcomes In acute Kindey Injury",
                  "[국외논문]Macrophages contribute to the initiation of ischaemic acute renal failure in rats"
              ],
              "photo": "https://anam.kumc.or.kr/displayFile.do?name=20221102.1042.39.233.png",
              "doctor_score": {
                  "paper_score": 1,
                  "patient_score": 0,
                  "public_score": 0.004993479467403029,
                  "peer_score": 0
              },
              "ai_score": {
                  "kindness": 0.023252236016075886,
                  "satisfaction": 0,
                  "explanation": 0,
                  "recommendation": 0.5743914483784636
              },
              "review": [
                  {
                      "review_id": 5,
                      "user_id": "uid_ebf18c19-a57e-49a0-acbd-30dd635844a5",
                      "nickname": null,
                      "doctor_id": 997,
                      "content": "조상경 첫번재 리뷰 \n嵐のように心を裂く\n永遠の意味　知らぬ君に\n答えを示す時だ\n夢幻に続く螺旋の先で\n鬼哭に耳を傾けた仕舞よ\nこの身に宿る万物で終いよ\n夢幻を他者に託した弱き人\n命の輝きは幾星霜に\n祈りの瞬きが照らす斜陽に\n千夜を身に宿し\n解を押し付ける\n枯らしていく　枯らしていく\n夢幻の夜に花を裂く\n繋いでいく繋いでいく\n嵐に種を撒いていく\nゆらいでいる ゆらいでる\n花のように意思を繋ぐ\n奪っていく 奪っていく\n嵐のように心を裂く\n永遠の意味　知らぬ君に\n答えを示す時だ\n夢幻に続く螺旋の先で\n待つのは誰",
                      "total_score": null,
                      "kindness_score": 4,
                      "explaination_score": 4,
                      "satisfaction_score": 4,
                      "recommand_score": 4,
                      "createAt": "2025-06-19T08:12:24.304Z",
                      "updateAt": null
                  }
              ]
          },
          {
              "doctor_id": 2032,
              "hospital": "서울대병원",
              "address": "서울특별시 종로구 대학로 101 (연건동)",
              "lat": 126.997196437908,
              "lon": 37.5804523853297,
              "telephone": "1588-5700",
              "name": "김형관",
              "deptname": "순환기내과",
              "specialties": "비후성 심근병증, 폐고혈압, 심장판막질환, 호흡곤란 / 심부전, 성인 선천성 심질환",
              "url": "https://www.snuh.org//blog/01177/career.do",
              "education": "[{\"type\":\"학력\",\"period\":\"2005 ~ 2008\",\"action\":\"서울대학교 의과대학원 의학박사\"},{\"type\":\"학력\",\"period\":\"2000 ~ 2002\",\"action\":\"서울대학교 의과대학원 의학석사\"},{\"type\":\"학력\",\"period\":\"1994 ~ 1998\",\"action\":\"서울대학교 의과대학 의학과\"}]",
              "career": "[{\"type\":\"경력\",\"period\":\"2018. 9. ~ 현재\",\"action\":\"서울대학교병원 순환기 내과 교수\"},{\"type\":\"경력\",\"period\":\"2014. 8. ~ 2016. 2.\",\"action\":\"Cardiac Diagnostic Unit, Duke University Medical Center, Duke University\"},{\"type\":\"경력\",\"period\":\"2013. 4. ~ 2018. 8.\",\"action\":\"서울대학교병원 순환기 내과 부교수\"},{\"type\":\"경력\",\"period\":\"2012. 7. ~ 2014. 7.\",\"action\":\"서울대학교병원 QA 담당교수\"},{\"type\":\"경력\",\"period\":\"2008. 3. ~ 2014. 3.\",\"action\":\"서울대학교병원 순환기 내과 조교수\"},{\"type\":\"경력\",\"period\":\"2006. 5. ~ 2008. 2.\",\"action\":\"서울대학교병원 순환기 내과 전임의\"},{\"type\":\"경력\",\"period\":\"2006. 4.\",\"action\":\"39회 유한의학상 대상\"},{\"type\":\"경력\",\"period\":\"2005. 9.\",\"action\":\"대한심장학회 젊은 연구자상\"},{\"type\":\"경력\",\"period\":\"2003. 3. ~ 2006. 4.\",\"action\":\"군복무 (서울응급의료센터 공중보건의사)\"},{\"type\":\"경력\",\"period\":\"1999. 3. ~ 2003. 2.\",\"action\":\"서울대학교병원 내과 전공의\"},{\"type\":\"경력\",\"period\":\"1998. 3. ~ 1999. 2.\",\"action\":\"서울대학교병원 인턴\"}]",
              "paper": [
                  "Diagnostic yield of coronary angiography in patients with acute chest pain: role of noninvasive test",
                  "Deterioration of myocardial function in paradoxical low-flow severe aortic stenosis: two-dimensional strain analysis",
                  "Left Ventricular Twist Mechanics in Patients with Apical Hypertrophic Cardiomyopathy: Assessment with 2D Speckle Tracking Echocardiography."
              ],
              "photo": "https://www.snuh.org/upload/med/dr/06d5525da3bc4d8fbaf1e1d2c7123af3.jpg",
              "doctor_score": {
                  "paper_score": 1,
                  "patient_score": 0,
                  "public_score": 0.003290412873332856,
                  "peer_score": 0
              },
              "ai_score": {
                  "kindness": 0,
                  "satisfaction": 0,
                  "explanation": 0,
                  "recommendation": 0
              },
              "review": []
          },
          {
              "doctor_id": 1370,
              "hospital": "삼성서울병원",
              "address": "서울특별시 강남구 일원로 81 (일원동, 삼성의료원)",
              "lat": 127.089590154403,
              "lon": 37.49034450782,
              "telephone": "1599-3114",
              "name": "허준",
              "deptname": "소아청소년 심장분과",
              "specialties": "청소년·성인선천성심장병(GUCH), 선천성심장병, 소아부정맥, 유전성부정맥, 선천성심장병부정맥, 소아심근병증, 실신, 인공심장박동기, 가와사끼병, 폐동맥고혈압",
              "url": "http://www.samsunghospital.com/home/reservation/common/doctorProfile.do?DR_NO=433",
              "education": "[{\"type\":\"학력\",\"period\":\"2001.02\",\"action\":\"서울대학교 대학원 의학과 (박사)\"},{\"type\":\"학력\",\"period\":\"1994.02\",\"action\":\"서울대학교 대학원 의학과 (석사)\"},{\"type\":\"학력\",\"period\":\"1989.02\",\"action\":\"서울대학교 의과대학 졸업 (의학사)\"},{\"type\":\"학력\",\"period\":\"1983.02\",\"action\":\"서울대학교 의과대학 의예과 수료\"},{\"type\":\"학력\",\"period\":\"2023.04 ~현재\",\"action\":\"삼성서울병원 소아청소년과장\"},{\"type\":\"학력\",\"period\":\"2023.04 ~현재\",\"action\":\"성균관의대 소아청소년과학교실 주임교수\"},{\"type\":\"학력\",\"period\":\"2013.04 ~현재\",\"action\":\"성균관대학교 의과대학 소아청소년과 교수\"},{\"type\":\"학력\",\"period\":\"2021.04 ~ 2023.03\",\"action\":\"삼성서울병원 심장뇌혈관병원 심장센터장\"},{\"type\":\"학력\",\"period\":\"2015.04 ~ 2017.03\",\"action\":\"삼성서울병원 심장뇌혈관병원 운영지원실장\"},{\"type\":\"학력\",\"period\":\"2003.03 ~ 2013.03\",\"action\":\"성균관대학교 의과대학 소아청소년과 부교수\"},{\"type\":\"학력\",\"period\":\"2006.09 ~ 2007.08\",\"action\":\"캐나다 토론토 Hospital for Sick children, Division of Cardiology 장기 연수 (소아 및 선천성 심장병 관련 부정맥 진단 및 치료)\"},{\"type\":\"학력\",\"period\":\"2001.09 ~ 2003.02\",\"action\":\"삼성서울병원 소아과 임상 조교수\"},{\"type\":\"학력\",\"period\":\"2001.06 ~ 2001.07\",\"action\":\"캐나다 토론토 Hospital for sick children, Department of critical care medicine 단기연수\"},{\"type\":\"학력\",\"period\":\"1999.03 ~ 2001.02\",\"action\":\"한림대학교 의과대학 소아과 조교수 대우\"},{\"type\":\"학력\",\"period\":\"1997.05 ~ 1999.02\",\"action\":\"서울대학교 병원 소아과 전임의 (소아심장 전공)\"},{\"type\":\"학력\",\"period\":\"1994.02\",\"action\":\"소아과 전문의 자격 취득\"},{\"type\":\"학력\",\"period\":\"1990.03 ~ 1994.02\",\"action\":\"서울대학교병원 소아과 레지던트 과정 수료\"},{\"type\":\"학력\",\"period\":\"1989.03 ~ 1990.02\",\"action\":\"서울대학교병원 인턴과정 수료\"},{\"type\":\"학력\",\"period\":\"2024.01 ~ 현재\",\"action\":\"대한부정맥학회 회장\"},{\"type\":\"학력\",\"period\":\"2014.03 ~ 현재\",\"action\":\"대한소아응급의학회 기획이사\"},{\"type\":\"학력\",\"period\":\"2009.06 ~ 현재\",\"action\":\"IBHRE (International Board of Heart Rhythm Examiners) Electrophysiology test writing committee MD EP sub-specialty section Advisory panel 위원\"}]",
              "career": "[{\"type\":\"경력\",\"period\":\"2001.02\",\"action\":\"서울대학교 대학원 의학과 (박사)\"},{\"type\":\"경력\",\"period\":\"1994.02\",\"action\":\"서울대학교 대학원 의학과 (석사)\"},{\"type\":\"경력\",\"period\":\"1989.02\",\"action\":\"서울대학교 의과대학 졸업 (의학사)\"},{\"type\":\"경력\",\"period\":\"1983.02\",\"action\":\"서울대학교 의과대학 의예과 수료\"},{\"type\":\"경력\",\"period\":\"2023.04 ~현재\",\"action\":\"삼성서울병원 소아청소년과장\"},{\"type\":\"경력\",\"period\":\"2023.04 ~현재\",\"action\":\"성균관의대 소아청소년과학교실 주임교수\"},{\"type\":\"경력\",\"period\":\"2013.04 ~현재\",\"action\":\"성균관대학교 의과대학 소아청소년과 교수\"},{\"type\":\"경력\",\"period\":\"2021.04 ~ 2023.03\",\"action\":\"삼성서울병원 심장뇌혈관병원 심장센터장\"},{\"type\":\"경력\",\"period\":\"2015.04 ~ 2017.03\",\"action\":\"삼성서울병원 심장뇌혈관병원 운영지원실장\"},{\"type\":\"경력\",\"period\":\"2003.03 ~ 2013.03\",\"action\":\"성균관대학교 의과대학 소아청소년과 부교수\"},{\"type\":\"경력\",\"period\":\"2006.09 ~ 2007.08\",\"action\":\"캐나다 토론토 Hospital for Sick children, Division of Cardiology 장기 연수 (소아 및 선천성 심장병 관련 부정맥 진단 및 치료)\"},{\"type\":\"경력\",\"period\":\"2001.09 ~ 2003.02\",\"action\":\"삼성서울병원 소아과 임상 조교수\"},{\"type\":\"경력\",\"period\":\"2001.06 ~ 2001.07\",\"action\":\"캐나다 토론토 Hospital for sick children, Department of critical care medicine 단기연수\"},{\"type\":\"경력\",\"period\":\"1999.03 ~ 2001.02\",\"action\":\"한림대학교 의과대학 소아과 조교수 대우\"},{\"type\":\"경력\",\"period\":\"1997.05 ~ 1999.02\",\"action\":\"서울대학교 병원 소아과 전임의 (소아심장 전공)\"},{\"type\":\"경력\",\"period\":\"1994.02\",\"action\":\"소아과 전문의 자격 취득\"},{\"type\":\"경력\",\"period\":\"1990.03 ~ 1994.02\",\"action\":\"서울대학교병원 소아과 레지던트 과정 수료\"},{\"type\":\"경력\",\"period\":\"1989.03 ~ 1990.02\",\"action\":\"서울대학교병원 인턴과정 수료\"},{\"type\":\"경력\",\"period\":\"2024.01 ~ 현재\",\"action\":\"대한부정맥학회 회장\"},{\"type\":\"경력\",\"period\":\"2014.03 ~ 현재\",\"action\":\"대한소아응급의학회 기획이사\"},{\"type\":\"경력\",\"period\":\"2009.06 ~ 현재\",\"action\":\"IBHRE (International Board of Heart Rhythm Examiners) Electrophysiology test writing committee MD EP sub-specialty section Advisory panel 위원\"}]",
              "paper": [
                  "Clinical outcomes of slide tracheoplasty in congenital tracheal stenosis",
                  "The effect of balloon valvuloplasty for bioprosthetic valve stenosis at pulmonary positions",
                  "Clinical Experience of Chest Pain in Adults with Congenital Heart Disease in a Single Tertiary Center"
              ],
              "photo": "http://www.samsunghospital.com//upload/deptdoctors/1452476771835_0567525.jpg",
              "doctor_score": {
                  "paper_score": 1,
                  "patient_score": 0,
                  "public_score": 0,
                  "peer_score": 0
              },
              "ai_score": {
                  "kindness": 0.6394882714131107,
                  "satisfaction": 0,
                  "explanation": 0,
                  "recommendation": 0
              },
              "review": []
          }
      ]
  },
  "used_token": 538,
  "in24_used_token": 538
}

const sample_msg_2 = {
  "session_id": "sid_bc4aa0d7-c4e5-4fd9-ad6e-8d44fb2cdd86",
  "chat_id": 8,
  "chat_type": "general",
  "question": "수술을 잘하는 병원을 소개해줘",
  "answer": "자 어떤 종류의 수술을 염두에 두고 계신지 말씀해주시면, 해당 진료과에 맞는 병원을 추천해드릴 수 있습니다. 예를 들어, 심장 수술, 정형외과 수술, 또는 신경외과 수술 등 구체적인 정보를 알려주시면 도움이 됩니다.\n\n1. 수술 종류를 알려주시면 해당 진료과의 병원을 추천해드릴 수 있습니다.\n2. 특정 지역의 병원을 찾고 계신다면 지역을 말씀해 주세요.\n3. 수술 외에 다른 건강 관련 질문이 있으시면 말씀해 주세요.\n\n번호를 입력해서 선택해도 됩니다.",
  "used_token": 647
}

const sample_msg_3 = {
  "session_id": "sid_798ba5c8-cdc9-47ec-873b-105bf3ad94bb",
  "chat_id": 9,
  "chat_type": "recommand_hospital",
  "question": "고혈압을 잘 하는 병원을 추천해줘",
  "answer": {
    "department": "심장내과",
    "hospitals": [
      {
        "hospital_id": "H01KR-11000014",
        "name": "한양대병원",
        "address": "서울특별시 성동구 왕십리로 222-1 (사근동)",
        "lat": 127.045715688792,
        "lon": 37.5585815432773
      },
      {
        "hospital_id": "H01KR-11000003",
        "name": "경희대병원",
        "address": "서울특별시 동대문구 경희대로 23 (회기동)",
        "lat": 127.050741696591,
        "lon": 37.5937762050989
      },
      {
        "hospital_id": "H01KR-11000009",
        "name": "강남세브란스병원",
        "address": "서울특별시 강남구 언주로 211, 강남세브란스병원 (도곡동)",
        "lat": 127.04631039276,
        "lon": 37.4928059943729
      }
    ]
  },
  "used_token": 528
}

const sample_msg_4 = {
  "session_id": "sid_e630fa20-0b4d-4ad3-8b10-b491958ef779",
  "chat_id": 19,
  "chat_type": "search_doctor",
  "question": "삼성서울병원 허준을 소개해줘",
  "answer": {
      "name": "허준",
      "hospital": "삼성서울병원",
      "deptname": "",
      "doctors": [
          {
              "doctor_id": 1370,
              "hospital": "삼성서울병원",
              "address": "서울특별시 강남구 일원로 81 (일원동, 삼성의료원)",
              "lat": 127.089590154403,
              "lon": 37.49034450782,
              "telephone": "1599-3114",
              "name": "허준",
              "deptname": "소아청소년 심장분과",
              "specialties": "청소년·성인선천성심장병(GUCH), 선천성심장병, 소아부정맥, 유전성부정맥, 선천성심장병부정맥, 소아심근병증, 실신, 인공심장박동기, 가와사끼병, 폐동맥고혈압",
              "url": "http://www.samsunghospital.com/home/reservation/common/doctorProfile.do?DR_NO=433",
              "education": "[{\"type\":\"학력\",\"period\":\"2001.02\",\"action\":\"서울대학교 대학원 의학과 (박사)\"},{\"type\":\"학력\",\"period\":\"1994.02\",\"action\":\"서울대학교 대학원 의학과 (석사)\"},{\"type\":\"학력\",\"period\":\"1989.02\",\"action\":\"서울대학교 의과대학 졸업 (의학사)\"},{\"type\":\"학력\",\"period\":\"1983.02\",\"action\":\"서울대학교 의과대학 의예과 수료\"},{\"type\":\"학력\",\"period\":\"2023.04 ~현재\",\"action\":\"삼성서울병원 소아청소년과장\"},{\"type\":\"학력\",\"period\":\"2023.04 ~현재\",\"action\":\"성균관의대 소아청소년과학교실 주임교수\"},{\"type\":\"학력\",\"period\":\"2013.04 ~현재\",\"action\":\"성균관대학교 의과대학 소아청소년과 교수\"},{\"type\":\"학력\",\"period\":\"2021.04 ~ 2023.03\",\"action\":\"삼성서울병원 심장뇌혈관병원 심장센터장\"},{\"type\":\"학력\",\"period\":\"2015.04 ~ 2017.03\",\"action\":\"삼성서울병원 심장뇌혈관병원 운영지원실장\"},{\"type\":\"학력\",\"period\":\"2003.03 ~ 2013.03\",\"action\":\"성균관대학교 의과대학 소아청소년과 부교수\"},{\"type\":\"학력\",\"period\":\"2006.09 ~ 2007.08\",\"action\":\"캐나다 토론토 Hospital for Sick children, Division of Cardiology 장기 연수 (소아 및 선천성 심장병 관련 부정맥 진단 및 치료)\"},{\"type\":\"학력\",\"period\":\"2001.09 ~ 2003.02\",\"action\":\"삼성서울병원 소아과 임상 조교수\"},{\"type\":\"학력\",\"period\":\"2001.06 ~ 2001.07\",\"action\":\"캐나다 토론토 Hospital for sick children, Department of critical care medicine 단기연수\"},{\"type\":\"학력\",\"period\":\"1999.03 ~ 2001.02\",\"action\":\"한림대학교 의과대학 소아과 조교수 대우\"},{\"type\":\"학력\",\"period\":\"1997.05 ~ 1999.02\",\"action\":\"서울대학교 병원 소아과 전임의 (소아심장 전공)\"},{\"type\":\"학력\",\"period\":\"1994.02\",\"action\":\"소아과 전문의 자격 취득\"},{\"type\":\"학력\",\"period\":\"1990.03 ~ 1994.02\",\"action\":\"서울대학교병원 소아과 레지던트 과정 수료\"},{\"type\":\"학력\",\"period\":\"1989.03 ~ 1990.02\",\"action\":\"서울대학교병원 인턴과정 수료\"},{\"type\":\"학력\",\"period\":\"2024.01 ~ 현재\",\"action\":\"대한부정맥학회 회장\"},{\"type\":\"학력\",\"period\":\"2014.03 ~ 현재\",\"action\":\"대한소아응급의학회 기획이사\"},{\"type\":\"학력\",\"period\":\"2009.06 ~ 현재\",\"action\":\"IBHRE (International Board of Heart Rhythm Examiners) Electrophysiology test writing committee MD EP sub-specialty section Advisory panel 위원\"}]",
              "career": "[{\"type\":\"경력\",\"period\":\"2001.02\",\"action\":\"서울대학교 대학원 의학과 (박사)\"},{\"type\":\"경력\",\"period\":\"1994.02\",\"action\":\"서울대학교 대학원 의학과 (석사)\"},{\"type\":\"경력\",\"period\":\"1989.02\",\"action\":\"서울대학교 의과대학 졸업 (의학사)\"},{\"type\":\"경력\",\"period\":\"1983.02\",\"action\":\"서울대학교 의과대학 의예과 수료\"},{\"type\":\"경력\",\"period\":\"2023.04 ~현재\",\"action\":\"삼성서울병원 소아청소년과장\"},{\"type\":\"경력\",\"period\":\"2023.04 ~현재\",\"action\":\"성균관의대 소아청소년과학교실 주임교수\"},{\"type\":\"경력\",\"period\":\"2013.04 ~현재\",\"action\":\"성균관대학교 의과대학 소아청소년과 교수\"},{\"type\":\"경력\",\"period\":\"2021.04 ~ 2023.03\",\"action\":\"삼성서울병원 심장뇌혈관병원 심장센터장\"},{\"type\":\"경력\",\"period\":\"2015.04 ~ 2017.03\",\"action\":\"삼성서울병원 심장뇌혈관병원 운영지원실장\"},{\"type\":\"경력\",\"period\":\"2003.03 ~ 2013.03\",\"action\":\"성균관대학교 의과대학 소아청소년과 부교수\"},{\"type\":\"경력\",\"period\":\"2006.09 ~ 2007.08\",\"action\":\"캐나다 토론토 Hospital for Sick children, Division of Cardiology 장기 연수 (소아 및 선천성 심장병 관련 부정맥 진단 및 치료)\"},{\"type\":\"경력\",\"period\":\"2001.09 ~ 2003.02\",\"action\":\"삼성서울병원 소아과 임상 조교수\"},{\"type\":\"경력\",\"period\":\"2001.06 ~ 2001.07\",\"action\":\"캐나다 토론토 Hospital for sick children, Department of critical care medicine 단기연수\"},{\"type\":\"경력\",\"period\":\"1999.03 ~ 2001.02\",\"action\":\"한림대학교 의과대학 소아과 조교수 대우\"},{\"type\":\"경력\",\"period\":\"1997.05 ~ 1999.02\",\"action\":\"서울대학교 병원 소아과 전임의 (소아심장 전공)\"},{\"type\":\"경력\",\"period\":\"1994.02\",\"action\":\"소아과 전문의 자격 취득\"},{\"type\":\"경력\",\"period\":\"1990.03 ~ 1994.02\",\"action\":\"서울대학교병원 소아과 레지던트 과정 수료\"},{\"type\":\"경력\",\"period\":\"1989.03 ~ 1990.02\",\"action\":\"서울대학교병원 인턴과정 수료\"},{\"type\":\"경력\",\"period\":\"2024.01 ~ 현재\",\"action\":\"대한부정맥학회 회장\"},{\"type\":\"경력\",\"period\":\"2014.03 ~ 현재\",\"action\":\"대한소아응급의학회 기획이사\"},{\"type\":\"경력\",\"period\":\"2009.06 ~ 현재\",\"action\":\"IBHRE (International Board of Heart Rhythm Examiners) Electrophysiology test writing committee MD EP sub-specialty section Advisory panel 위원\"}]",
              "paper": [
                  "Clinical outcomes of slide tracheoplasty in congenital tracheal stenosis",
                  "The effect of balloon valvuloplasty for bioprosthetic valve stenosis at pulmonary positions",
                  "Clinical Experience of Chest Pain in Adults with Congenital Heart Disease in a Single Tertiary Center"
              ],
              "photo": "http://www.samsunghospital.com//upload/deptdoctors/1452476771835_0567525.jpg",
              "doctor_score": {
                  "paper_score": 1,
                  "patient_score": 1,
                  "public_score": 0,
                  "peer_score": 0
              },
              "ai_score": {
                  "kindness": 0.15987206785327768,
                  "satisfaction": 0.08631400525650446,
                  "explanation": 0,
                  "recommendation": 0.15404049733935501
              },
              "review": []
          }
      ]
  },
  "used_token": 542,
  "in24_used_token": 1080
}

const sample_msg_5 = {
    "chat_id": 35,
    "user_id": "uid_a6868590-16a4-48c7-970b-04a862f94238",
    "session_id": "sid_4107c664-3117-45c6-8cd5-8c273dc5d3cb",
    "chat_type": "general",
    "question": "추가 추천",
    "question_time": "2025-06-25T23:32:23.131Z",
    "answer": "\"유방암 치료에 대한 명의를 추가로 추천해드리겠습니다. 다음은 유방암 분야에서 뛰어난 의사들입니다:\\n\\n1. **정일용** - 서울아산병원 유방외과\\n   - 전문 분야: 유방질환, 유방암, 유방암수술\\n   - 주소: 서울특별시 송파구 올림픽로43길 88, 서울아산병원 (풍납동)\\n   - 전화번호: 1688-7575\\n   - [프로필 보기](https://www.amc.seoul.kr/asan/staff/base/staffBaseInfoDetail.do?drEmpId=eEh4bDd3dlZ1ZWNwVGowdC9rc2RTUT09&searchHpCd=D342&pageIndex=1&tabIndex1=3&tabIndex2=)\\n\\n2. **임석아** - 서울대병원 혈액종양내과\\n   - 전문 분야: 유방암, 위장관기질종양(GIST), 임상시험, 맞춤치료\\n   - 주소: 서울특별시 종로구 대학로 101 (연건동)\\n   - 전화번호: 1588-5700\\n   - [프로필 보기](https://www.snuh.org//blog/00867/career.do)\\n\\n3. **한원식** - 서울대병원 유방내분비외과\\n   - 전문 분야: 암성형술, 유방암\\n   - 주소: 서울특별시 종로구 대학로 101 (연건동)\\n   - 전화번호: 1588-5700\\n   - [프로필 보기](https://www.snuh.org//blog/00941/career.do)\\n\\n이 외에도 추가적인 추천이 필요하시면 말씀해 주세요.\"",
    "answer_time": "2025-06-25T23:32:23.131Z",
    "used_token": 3704,
    "createAt": "2025-06-25T23:32:23.131Z",
    "updateAt": null
}

const contrants  = {
  defaultColor : '#6c62d1',
  projectTitle : 'AIGA WEB',
  popDetailSizeRule1 : 1024,// 멀티뷰 최소너비 기준지점
  popDetailSizeRule2 : '800px',//멀티뷰최소너비
  popDetailSizeRule3 : '80%',//  멀티뷰 최소너비 이상일때 너비 비율
  popDetailSizeRule4 : '700px',// 싱글뷰 기준 너비
  rightFixedWidth : '550px',
  apiTokenName : "aiga-minuee",
  userMaxToken : 10, //주문조회리스트 하이라이트 기준주문금액
  userRetryLimitSec : 60,
  sidebarWidth: 86,
  headerHeight: 56,
  mobileSidebarWidth: 0,
  mobileHeaderHeight: 60,
  modalMaxWidth : 640,
  desktopMinWidth : 640,
  inputMaxMessage : 100,
  nickNameAbleString : /^[가-힣a-zA-Z0-9_]+$/,
  apiSuccessCode,
  apiAllowOriginCode,
  pathname_modal_1 : "modal_doctor_list",
  pathname_modal_2 : "modal_doctor_detail",
  pathname_modal_2_2 : "modal_doctor_detail2",
  pathname_modal_3 : "modal_doctor_review",
  pathname_modal_3_2 : "modal_doctor_review2",
  pathname_modal_4 : "modal_doctor_request",
  pathname_modal_5 : "modal_mypage_notice",
  pathname_modal_5_2 : "modal_mypage_notice_detail",
  pathname_modal_6 : "modal_mypage_request",
  pathname_modal_7 : "modal_mypage_entire",
  pathname_modal_8 : "modal_mypage_use_yakwan",
  pathname_modal_8_2 : "modal_mypage_use_yakwan2",
  pathname_modal_9 : "modal_mypage_use_policy",
  pathname_modal_9_2 : "modal_mypage_use_policy2",
  pathname_modal_12_2 : "modal_mypage_mingam",
  pathname_modal_10 : 'modal_mypage_profile',
  pathname_modal_11 : 'modal_signup_agree',
  pathname_modal_20 : 'drawer_history',
  pathname_modal_21 : 'drawer_signup',
  pathname_modal_21_2 : 'drawer_signup2',
  chatAnswerType,
  sample_msg_1,
  sample_msg_2,
  sample_msg_3,
  sample_msg_4,
  sample_msg_5
}

export default contrants;
