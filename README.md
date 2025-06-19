
### Installation

1. Clone the repo
   ```
   git clone http://10.4.20.180:8081/gitlab-instance-e12220eb/sw_frontend_groupwareapp.git
   ```
2. 서버 환경설정(options)
    ```
    ```
3. 라이브러리 설치
    ```
    $npm install
    ```
    
    만약 에러가 있다면
    ```
    $npm install --force

    ```
    색상관련 정리
    ````
    navy.800처럼 색상 이름 뒤에 숫자가 붙는 형식은 주로 디자인 시스템이나 UI 프레임워크(예: Tailwind CSS, Chakra UI 등)에서 사용하는 색상 팔레트 시스템입니다. 이 방식은 색상의 밝기 또는 채도 수준을 표현하기 위해 사용됩니다.

    🔹 구조: 색상이름.숫자
    예: navy.800

    navy: 색상 기본값 (짙은 남색 계열)

    800: 밝기나 채도를 나타내는 숫자 등급 (보통 50~900까지 있음)
    ````

4. 실행 (package.json의 script 참조)
    
   ```
   $npm run dev OR $yarn dev
   ```
  
## Framework 설명
1. Node
    ```
    nvm use 20
    ```
2. React v19 with NextJs ON TypeScript
    ```
    px create-next-app@latest project "project_name" --version 0.70
    ```
3. Style 
    ```
    react-native core stylesheet활용
    ```
4. Statement Adminstor
    ```
    (내장)context-api
    ```
5. Navigation 
    ```
    yarn add react-navigation // v6임
    ```
6. Networking 
    ```
    (내장)fetch _ costomize minueefetch활용
    yarn add react-query //this is option 
    ```

### 주요 기능 안내
1. Module추가
    ```
    yarn add react-query ( 서버상태관리 _ 필요시에만 )

    ```
## File & Directory 구조
```
aiga_frontend_userSite
├── app                     => 페이징 설정
│   ├── api                 => 로컬 API 주소 ( 주로 테스트 )
│   ├── chat                => 챗봇 메인화면
│   ├── layout              => auth, non-auth등 구분에 의한 레이아웃
│   └── page                => root index page
├── node_modules            => library
├── src
│   ├── assets              => 각종 이미지,글꼴,아이콘등
│   ├── components          => 공통 단위 컴포넌트 관리
│   ├── contexts            => react Core형 state management
│   ├── style               => style, theme등 설정
│   ├── types               => typescript type 설정 
│   └── utils               => 각종함수
├── assets                  => 위 assets 상세
│   ├── icons               => icons files
│   ├── images              => images files
│   ├── fonts               => custom fonts
│   └── etc                 => etc files
├── .gitignore              => git 관리 비대상 설정 파일
├── .env                    => 환경설정파일
├── next.config.js          => nextjs 설정파일
├── pacakge-lock.json       => 의존성에 관한 구체적인 정보를 갖는 파일(package-lock.json이 있을경우 package.json을 참조하지 않는다)
├── package.json            => Module정보 설정 파일
├── README.md               => 프로젝트 설명 파일
├── tsconfig.json           => typescript 설정 파일
└── yarn.lock               => yarn의 package-lock.json
```

### Original README.md
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`
### "start": "react-app-rewired start",

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`
"build": "react-app-rewired build && open build",

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


# original sw_frontend_groupwareapp`s README

## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin http://10.4.20.180:8081/gitlab-instance-e12220eb/sw_frontend_groupwareapp.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](http://10.4.20.180:8081/gitlab-instance-e12220eb/sw_frontend_groupwareapp/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Automatically merge when pipeline succeeds](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing(SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thank you to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README
Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.

{"message":"성공적으로 로그인 인증이 완료되었습니다.","statusCode":200,"data":{"user":{"user_id":"uid_ebf18c19-a57e-49a0-acbd-30dd635844a5","sns_type":"kakao","sns_id":"4291885223","email":"minuee47@gmail.com","nickname":"노성남","profile_img":"http://k.kakaocdn.net/dn/JtoEt/btsNpPXtydu/BEfaJiGKIBGnoOgmTnJpH0/img_640x640.jpg","regist_date":"2025-06-05T07:46:52.061Z","unregist_date":null,"createdAt":"2025-06-05T07:46:52.061Z","updatedAt":null},"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidWlkX2ViZjE4YzE5LWE1N2UtNDlhMC1hY2JkLTMwZGQ2MzU4NDRhNSIsInNuc190eXBlIjoia2FrYW8iLCJzbnNfaWQiOiI0MjkxODg1MjIzIiwiaWF0IjoxNzQ5MTA5NjEyLCJleHAiOjE3NDkxOTYwMTJ9.p7hlsd2YRcJdNu6OJrIoDhEydUiDEeEtBXTz9YMBEsY"}}

嵐のように心を裂く
永遠の意味　知らぬ君に
答えを示す時だ
夢幻に続く螺旋の先で
鬼哭に耳を傾けた仕舞よ
この身に宿る万物で終いよ
夢幻を他者に託した弱き人
命の輝きは幾星霜に
祈りの瞬きが照らす斜陽に
千夜を身に宿し
解を押し付ける
枯らしていく　枯らしていく
夢幻の夜に花を裂く
繋いでいく繋いでいく
嵐に種を撒いていく
ゆらいでいる ゆらいでる
花のように意思を繋ぐ
奪っていく 奪っていく
嵐のように心を裂く
永遠の意味　知らぬ君に
答えを示す時だ
夢幻に続く螺旋の先で
待つのは誰


recommand_doctor
{
    "session_id": "sid_9f2874f8-67e2-4058-995e-d7ab1475584f",
    "chat_id": 7,
    "chat_type": "",
    "question": "고혈압을 잘 아는 의사를 추천해줘",
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
                "ai_score": "",
                "review": []
            },
            {
                "doctor_id": 2032,
                "hospital": "서울대병원",
                "address": "서울특별시 종로구 대학로 101 (연건동)",
                "lat": 126.997196437908,
                "lon": 37.5804523853297,
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
                "ai_score": "",
                "review": []
            },
            {
                "doctor_id": 1370,
                "hospital": "삼성서울병원",
                "address": "서울특별시 강남구 일원로 81 (일원동, 삼성의료원)",
                "lat": 127.089590154403,
                "lon": 37.49034450782,
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
                "ai_score": "",
                "review": []
            }
        ]
    },
    "used_token": 529
}
general
{
    "message": "성공적으로 질의 요청이 처리되었습니다.",
    "statusCode": 201,
    "data": {
        "session_id": "sid_bc4aa0d7-c4e5-4fd9-ad6e-8d44fb2cdd86",
        "chat_id": 8,
        "chat_type": "general",
        "question": "수술을 잘하는 병원을 소개해줘",
        "answer": "어떤 종류의 수술을 염두에 두고 계신지 말씀해주시면, 해당 진료과에 맞는 병원을 추천해드릴 수 있습니다. 예를 들어, 심장 수술, 정형외과 수술, 또는 신경외과 수술 등 구체적인 정보를 알려주시면 도움이 됩니다.\n\n1. 수술 종류를 알려주시면 해당 진료과의 병원을 추천해드릴 수 있습니다.\n2. 특정 지역의 병원을 찾고 계신다면 지역을 말씀해 주세요.\n3. 수술 외에 다른 건강 관련 질문이 있으시면 말씀해 주세요.\n\n번호를 입력해서 선택해도 됩니다.",
        "used_token": 647
    }
}
recommand_hospital
{
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