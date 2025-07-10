
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
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated exampl＿＿es if they are too long to reasonably include in the README.

## Support＿
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


くもり硝子の向うは風の街
問わず語りの心が切ないね
枯葉ひとつの重さもない命
貴女あなたを失ってから

背中を丸めながら
指のリング抜き取ったね
俺に返すつもりならば
捨ててくれ

そうね　誕生石ならルビーなの
そんな言葉が頭に渦巻くよ
あれは八月　目映い陽の中で
誓った愛の幻

孤独が好きな俺さ
気にしないで行っていいよ
気が変わらぬうちに早く
消えてくれ

くもり硝子の向うは風の街
さめた紅茶が残ったテーブルで
襟を合わせて日暮れの人波に
紛れる貴女あなたを見てた

そして二年の月日が流れ去り
街でベージュのコートを見かけると
指にルビーのリングを探すのさ
貴女あなたを失ってから

そして二年の月日が流れ去り
街でベージュのコートを見かけると
指にルビーのリングを探すのさ
貴女あなたを失ってから…

동해물과 백두산이 마르고 닳도록
하느님이 보우하사 우리나라 만세
무궁화 삼천리 화려강산
대한사람 대한으로 길이 보전하세요
이기상과 이맘으로 충성으로 다하여
괴로우나 즐거우나 잎편단심일세
