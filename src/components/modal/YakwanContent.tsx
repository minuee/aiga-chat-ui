'use client';
import React from 'react';
import { Box,Text,Flex} from '@chakra-ui/react';
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
function YakwanModal() {

  // SIDEBAR
  return (
    <Flex flexDirection={'column'}  width="100%" height='100%' overflowY={'auto'}>
      <Box  as="pre" wordBreak="break-all" whiteSpace="pre-wrap"><CustomTextBold400 fontSize={"17px"}>
      {`      
“AIGA”서비스 이용약관
제1조 (목적)
본 약관은 주식회사 AIGA(이하 "회사"라 함)에서 제공하는 인공지능(AI)을 활용한 비의료 건강관리 서비스(이하 "서비스"라 함)의 이용과 관련하여, 회사와 회원(이하 "이용자"라 함) 간의 권리, 의무, 책임사항 및 이용조건과 절차를 규정함을 목적으로 합니다. 본 약관은 서비스가 의료법상 의료행위에 해당하지 않으며, 건강관리 및 생활습관 개선을 위한 참고용 정보 제공에 한정된다는 점을 명확히 합니다.

제2조 (용어의 정의)
이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
(1) "회사"라 함은 "콘텐츠" 산업과 관련된 경제활동을 영위하는 자로서 콘텐츠 및 제반서비스를 제공하는 자를 말합니다.
(2) "회원"이라 함은 회사의 "서비스"에 접속하여 이 약관에 따라 "회사"와 이용계약을 체결하고 "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다.
(3) "서비스"라 함은 구현되는 단말기(PC, 휴대형 단말기 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 AIGA 관련 제반 서비스를 의미합니다.
(4) "아이디(ID)"라 함은 "회원"의 식별과 "서비스"이용을 위하여 "회원"이 정하고 회사가 승인하는 문자와 숫자의 조합을 말합니다.
(5) "비밀번호(PASSWORD)"라 함은 "회원"이 부여 받은"아이디(ID)"와 일치하는 회원임을 확인하고 비밀보호를 위해 “회원” 자신이 정한 문자 또는 숫자의 조합을 말합니다.
(6) "개인정보"라 함은 살아있는 개인에 관한 정보로서 해당 정보에 포함되어 있는 성명, 생년월일, 등의 사항에 의하여 해당 개인을 식별할 수 있는 정보(해당 정보만으로는 특정 개인을 식별할 수 없더라도 다른 정보와 쉽게 결합하여 알아볼 수 있는 것을 포함)를 말합니다.
(7) "게시물"이라 함은 "회원"이 "서비스"를 이용함에 있어 서비스 상에 게시한 부호, 문자, 음성, 음향, 화상, 동영상 등의 정보 형태의 글, 사진, 동영상 및 각종 파일과 링크 등을 말합니다.
(8) "회원탈퇴” 혹은 “해지"라 함은 "회원"이 회사의 서비스 “이용계약”을 해약하는 것을 의미합니다.
(9) “비의료 건강관리서비스”라 함은 건강의 유지·증진과 생활습관 개선 등을 목적으로 하며, 의료법상 의료행위에 해당하지 않는 정보 제공, 상담, 교육, 동기 부여, 목표 설정 및 관리 서비스를 의미합니다.
제3조 (약관의 명시와 개정)
(1) "회사"는 이 약관의 내용을 "회원"이 쉽게 알 수 있도록 서비스 내 설정에 게시합니다.
(2) "회사"는 약관의 규제에 관한 법률, 정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 "정보통신망법"), 개인정보보호법 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
(3) "회사"가 약관을 개정할 경우에는 적용일자 및 개정내용, 개정 사유 등을 명시하여 그 적용일자로부터 최소한 7일 이전(회원에게 불리하거나 중대한 사항의 변경은 30일 이전)부터 그 적용일자 경과 후 상당한 기간이 경과할 때까지 초기화면 또는 초기화면과의 연결화면을 통해 공지합니다.
(4) "회사"가 전항에 따라 "회원"에게 개정약관을 공지 또는 통지하면서 개정약관의 시행일 7일 후까지 거부의사를 표시하지 않으면 의사표시가 표명된 것으로 본다는 뜻을 명확하게 공지 또는 통지하였음에도 회원이 명시적으로 거부 의사표시를 하지 아니한 경우 회원이 개정약관에 동의한 것으로 봅니다.
(5) "회원"이 개정약관에 동의하지 아니하는 경우 서비스의 이용을 중단하고 이용계약을 해지할 수 있습니다.
(6) 회사는 서비스가 의료행위로 오인되지 않도록 관련 법령 및 가이드라인에 따라 서비스를 운영하며, 필요한 경우 보건복지부의 유권해석을 받을 수 있습니다.
제4조 (약관의 해석)
(1) "회사"는 "유료서비스" 및 개별 서비스에 대해서는 별도의 이용약관 및 정책(이하 "유료서비스약관 등")을 둘 수 있으며, 해당 내용이 이 약관과 상충할 경우에는 "유료서비스약관 등"이 우선하여 적용됩니다.
(2) 이 약관에서 정하지 아니한 사항이나 해석에 대해서는 온라인 디지털 콘텐츠산업 발전법, 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한 법률, 문화체육관광부장관이 정하는 디지털 콘텐츠 이용자 보호지침, 기타 관계법령 또는 상관례에 따릅니다.

제5조 (회원가입)
(1) 회원이 되려고 하는 자는 약관의 내용에 대하여 동의를 하고, 카카오톡 또는 네이버 등 회사가 지정한 SNS 계정을 통한 연동 로그인 방식으로 이용신청을 하여야 합니다. (2) 회사는 회원이 되려고 하는 자에게 SNS 플랫폼을 통한 본인인증 및 다음 각 호의 정보 제공에 대한 동의를 요구할 수 있습니다.
가) SNS 계정 고유식별정보
나) SNS 프로필 정보(닉네임 등)"
다) 전자우편주소
라) 이용하려는 "콘텐츠"의 종류
마) 기타 "회사"가 필요하다고 인정하는 사항
(3) 회사는 상기 "이용자"의 신청에 대하여 회원가입을 승낙함을 원칙으로 합니다. 다만, "회사"는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않을 수 있습니다.
가) 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우
나) 실명이 아니거나 타인의 명의를 이용한 경우
다) SNS 플랫폼에서 제공하는 필수 정보에 대한 동의를 거부한 경우 
라) 회원의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반하며 신청하는 경우 
마) 사회의 안녕질서 또는 미풍양속을 저해하거나, 저해할 목적으로 신청하는 경우 
(4) "회사"는 서비스 관련 설비의 여유가 없거나, 기술상 또는 업무상 문제가 있는 경우, 또는 SNS 플랫폼과의 연동에 장애가 발생한 경우에는 승낙을 유보할 수 있습니다.
(5) 제3항과 제4항에 따라 회원가입신청의 승낙을 하지 아니하거나 유보한 경우, "회사"는 이를 신청자에게 알려야 합니다. "회사"의 귀책사유 없이 신청자에게 통지할 수 없는 경우에는 예외로 합니다.
(6) 회원가입계약의 성립 시기는 "회사"가 SNS 연동을 통한 가입완료를 신청절차 상에 표시한 시점으로 합니다.

제6조 (개인정보의 처리)
"회사"는 서비스를 제공하기 위하여 관련 법령의 규정에 따라 "회원"으로부터 필요한 개인정보를 수집하여 처리하며, 개인정보의 처리와 관련해 자세한 사항은 별도의 개인정보처리방침에 따릅니다.

제7조 (회원정보의 변경)
(1) "회원"은 개인정보관리 화면을 통하여 언제든지 개인정보를 열람하고 수정할 수 있습니다. 다만, 서비스 관리를 위해 필요한 아이디(ID), 이메일 및 연락처를 포함한 본인 인증 정보 등 일부 정보는 수정이 불가능 합니다.
(2) "회원"은 회원가입시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 전자우편 기타 방법으로 "회사"에 대하여 그 변경사항을 알려야 합니다.
(3) 제2항의 변경사항을 "회사"에 알리지 않아 발생한 불이익에 대하여 "회사"는 책임지지 않습니다.

제8조 (개인정보보호 의무)
"회사"는 "정보통신망법", "개인정보보호법" 등 관계 법령이 정하는 바에 따라, "회원"의 개인정보를 보호하기 위하여 노력합니다. 개인정보의 안전한 처리에 대해서는 관련법령에 따른 "회사"의 개인정보처리방침이 적용됩니다. 

(1) "회사"는 개인정보의 안전한 처리를 위해 다음과 같은 기술적, 관리적 보호조치를 시행합니다.
  가) 개인정보의 암호화: 회원의 개인정보는 저장 및 전송 시 암호화 기술을 사용하여 보호됩니다.
  나) 접근 통제: 개인정보에 대한 불법적 접근을 방지하기 위해 권한 관리를 포함한 접근 통제 시스템을 운영합니다.
  다) 정기 보안 점검: 개인정보 보호를 위해 주기적으로 시스템 점검 및 취약점 분석을 수행합니다.
  라) 교육 및 훈련: 개인정보를 처리하는 직원들에게 개인정보보호법 및 보안 조치와 관련한 교육을 정기적으로 제공합니다.

(2) "회사"는 개인정보의 유출, 분실, 도난, 변조로 인한 피해를 방지하기 위하여 최선의 노력을 다하며, 문제가 발생한 경우 관계 법령에 따라 즉시 필요한 조치를 취합니다.
제9조 (회원의 아이디 및 비밀번호 관리 의무)
(1) "회원"의 "아이디(ID)"와 "비밀번호"에 관한 관리 책임은 "회원"에게 있으며, 이를 제3자가 이용하도록 하여서는 안 됩니다.
(2) "회원"은 "아이디(ID)" 및 "비밀번호"가 도용되거나 제3자가 사용하고 있음을 인지한 경우에는 이를 즉시 회사에 통지하고 회사의 안내에 따라야 합니다.
(3) 제2항의 경우 해당 "회원"이 그 사실을 통지하지 않거나, 통지한 경우에도 "회사"의 안내에 따르지 않아 발생한 불이익에 대하여 "회사"는 책임지지 않습니다.
(4) "회사"는 "회원"의 "아이디"가 개인정보 유출 우려가 있거나, 반사회적 또는 미풍양속에 어긋나거나 "회사" 및 "회사"의 운영자로 오인한 우려가 있는 경우, 해당 "아이디"의 이용을 제한할 수 있습니다.
(5) 회원의 아이디는 원칙적으로 변경이 불가하며 부득이한 사유로 인하여 변경하고자 하는 경우에는 해당 아이디를 해지하고 재가입해야 합니다.

제10조 (회사의 의무)
(1) 회사는 관련법과 이 약관이 금지하는 행위를 하지 않으며, 지속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다하여 노력합니다.
(2) 회사는 "회원"의 개인정보를 본인의 승낙 없이 제3자에 누설, 배포하지 않고 이를 보호하기 위하여 노력합니다.
(3) 회사는 회원이 안전하게 서비스를 이용할 수 있도록 회원의 개인정보보호를 위한 보안 시스템을 갖추어야 하며 개인정보처리방침을 공시하고 준수합니다.
(4) 회사는 계속적이고 안정적인 서비스의 제공을 위하여 서비스 개선을 하던 중 설비에 장애가 생기거나 데이터 등이 멸실ㆍ훼손된 때에는 천재지변, 비상사태, 현재의 기술로는 해결이 불가능한 장애나 결함 등 부득이한 사유가 없는 한 지체 없이 이를 수리 또는 복구하도록 최선의 노력을 다합니다.

제11조 (회원의 의무)
(1) "회원"은 다음 행위를 하여서는 안 됩니다.
가) "회사"의 동의 없이 영리를 목적으로 서비스를 사용하는 행위
나) 타인의 정보를 도용하는 행위
다) 다른 회원의 명예를 훼손하거나 권리를 침해하는 행위
라) 다른 회원의 아이디를 부정 사용하는 행위
마) 범죄행위를 목적으로 하거나 기타 범죄행위와 관련된 행위
바) 타인의 명예를 훼손하거나 모욕하는 행위
사) 타인의 지적재산권 등의 권리를 침해하는 행위
아) 해킹행위 또는 바이러스의 유포 행위
자) 타인의 의사에 반하여 광고성 정보 등 일정한 내용을 계속적으로 전송하는 행위
차) 서비스의 안정적인 운영에 지장을 주거나 줄 우려가 있다고 판단되는 행위
카) 사이트의 정보 및 서비스를 이용한 영리 행위
타) 그밖에 선량한 풍속, 기타 사회질서를 해하거나 관계법령에 위반하는 행위
(2) "회사"는 "회원"이 제1항의 행위를 하는 경우 서비스의 이용을 일시 또는 영구히 제한할 수 있습니다.
(3) “회원”은 “서비스”를 통해 열람한 모든 의료기록 및 개인정보 대한 내용을 당사자의 허락없이 재배포 및 다른곳에 활용할 수 없으며, 모든 관리 책임은 전적으로 “회원”에게 있다.
(4) “회원”은 회원가입 신청 또는 회원정보 변경 시 모든 사항을 사실에 근거하여 본인의 진정한 정보로 작성하여야 하며, 허위 또는 타인의 정보를 등록할 경우 이와 관련된 모든 권리를 주장할 수 없습니다.

제12조 (서비스의 이용)
(1) 서비스 이용은 회원의 로그인 여부에 따라 서비스 이용 범위를 달리 제공합니다. 비로그인 회원은 회원에 비해 일부 기능 이용 및 질문 횟수 등에 제한이 있을 수 있습니다.
(2) 서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다. 다만, 서비스의 제공에 필요한 경우 정기점검을 실시할 수 있으며, "회사"가 별도로 날짜와 시간을 정할 수 있습니다.
(3) "회사"는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우 "서비스"의 제공을 일시적으로 중단할 수 있습니다. 이 경우 "회사"는 홈페이지 및 어플리케이션에 팝업 메시지 또는 푸시 알림, 개별 문자 발송 등을 통하여 "회원"에게 통지합니다. 다만, "회사"가 사전에 통지할 수 없는 부득이한 사유가 있는 경우 사후에 통지할 수 있습니다.

제13조 (서비스의 변경 등)
(1) "회사"는 운영상ㆍ기술상의 필요에 따라 제공하고 있는 서비스의 전부 또는 일부를 변경할 수 있습니다.
(2) "서비스"의 내용, 이용방법에 대하여 중차대한 변경이 있는 경우 변경사유, 변경될 서비스의 내용 및 제공일자 등은 변경 전에 해당 서비스 초기화면에 게시하여야 합니다.
(3) "회사"는 무료로 제공되는 서비스의 일부 또는 전부를 회사의 정책 및 운영의 필요에 따라 수정하거나 중단 또는 변경할 수 있으며, 이에 대하여 관련법에 특별한 규정이 없는한 "회원"에게 별도의 보상을 하지 않습니다.

제14조 (게시물의 저작권)
(1) "회원"이 서비스 내에 게시한 "게시물"이 저작권 기타 지식재산권을 갖고 있는 경우 해당 권리는 그 권리자에게 귀속됩니다.
(2) "회사"는 “회원”의 저작물을 회원의 동의를 받아 이용할 수 있습니다. 단, “회사”의 내부적인 통계 분석 및 연구개발 목적의 활용은, 개별적인 동의가 아닌 본 약관에 의한 동의를 통해 포괄적으로 이루어집니다.
(3) “회원”의 저작물을 활용해 연구개발된 기술에 대한 저작권은 “회사”에 있습니다.
(4) 회원은 자신의 게시물을 회사가 국내외에서 다음 각 호의 어느 하나의 목적으로 사용하는 것을 허락합니다.
가) 회사의 서비스 또는 회사의 공식 사이트 이외의 회사의 업무와 연계된 사이트 내에서 회원의 게시물의 전송, 복제, 전시 및 우수 게시물을 회사의 서비스 또는 회사의 공식 사이트 이외의 회사의 업무와 연계된 사이트 화면 등에 노출하고 이를 위하여 이용자 게시물의 크기를 변환하거나 이미지 변경, 단순화하는 등의 방식으로 수정하는 것.
나) 회사의 서비스를 홍보하기 위한 목적으로 미디어, 언론기관 등에게 “회원”의 게시물 내용을 보도, 방영하게 하는 것. 단, 이 경우 회사는 “회원” 당사자의 동의 없이 미디어, 언론기관 등에게 개인정보를 제공하지 않습니다.
(5) 전항의 규정에도 불구하고 회사가 이용자의 게시물을 전항 각 호의 어느 하나에 기재된 목적 이외의 방법으로 사용하는 경우에는 사전에 해당 “회원”으로부터 동의를 얻어야 합니다. 게시물에 대한 회사의 사용 요청, “회원”의 동의 및 동의철회는 전화, 전자우편 등 회사가 요청하는 방식에 따릅니다. 이 경우 회사는 게시물의 출처를 표시합니다.
(6) “회원”이 서비스의 이용계약을 해지하더라도 “회원” 명의로 서비스에 등록한 게시물은 삭제되지 않습니다. “회원”은 자신의 게시물이 회원 탈퇴 후 서비스에서 이용되는 것을 원하지 않는 경우 회원 탈퇴 전에 직접 게시물을 삭제하여야 합니다. (단, 제3자가 다시 게시하거나 저장한 게시물은 삭제되지 않을 수 있습니다.)
(7) 회사는 회사의 운영정책상의 판단, 회사 합병, 서비스 양도 등의 사유로 원래의 게시물의 내용을 변경하지 않고 게시물의 게시 위치를 변경할 수 있습니다.

제15조 (데이터의 가공과 제공)
(1) 회사는 회원으로부터 수집한 데이터를 바탕으로 건강관리, 서비스 품질 향상을 위해 비식별화된 데이터를 분석하며, 의료법에 따른 제한을 준수합니다. 
(2) 회사는 회원의 동의 없이 데이터를 제3자에게 제공하지 않으며, 데이터를 활용할 경우 공신력 있는 기준과 통계 자료를 기반으로 건강관리 정보를 제공합니다.
(3) 회사는 회원이 제공한 데이터를 인공지능 모델 학습 및 서비스 개선을 위해 활용할 수 있으며, 이 과정에서 모든 데이터는 비식별화 처리되어 회원 개인을 식별할 수 없도록 보호됩니다. 회사는 학습된 AI 모델이 생성한 결과물을 상업적, 연구 목적으로 활용할 수 있습니다.

제16조 (데이터 자료의 제공)
(1) "회원"이 채팅창을 통해 직접 입력한 텍스트 형태의 질문 등 "회원"의 저작물은 해당 "회원"의 동의하에 다음 각 호의 목적에 따라 "회사" 또는 해당하는 자에게 제공되어 활용될 수 있습니다.

1.자사의 AI 학습 연구를 위한 사용
2. OOOOOOO
3. OOOOOOOOOO
(2) “회사”는 모든 ‘데이터’를 암호화, IP암호화, 서비스 접속 암호화를 통해 보호합니다.
(3) “회사”는 “데이터”를 사업의 목적으로 제3자에게 제공할 수 있습니다. 단, 인위적 방법을 통한 가공 이전의 정보는 “회원”의 동의 없이 제3자에게 제공하지 아니하며, 개인정보는 비식별 처리과정을 통해 가공됩니다.
(4) 회원은 언제든지 본인의 데이터 활용에 대한 동의를 철회할 수 있으며, 철회 시 해당 데이터는 서비스에서 즉시 삭제됩니다. 다만, 비식별화된 데이터 또는 AI 학습에 활용된 결과물은 삭제되지 않을 수 있습니다.

제17조(이용계약 해지 및 이용제한 등)
(1) "회원"은 회사에 언제든지 이용계약 해지 신청을 할 수 있으며, "회사"는 관련법이 정하는 바에 따라 이를 즉시 처리하여야 합니다.
(2) “회원”이 이용계약을 해지하고자 하는 때에는 회원 본인이 회사에 해지신청을 하거나 모바일 또는 PC 웹사이트의 회원 탈퇴하기 메뉴를 통해 이에 따른 탈퇴 절차를 거침으로써 이용계약을 해지할 수 있습니다.
(3) "회원"이 계약을 해지할 경우, 관련법 및 개인정보보호방침에 따라 "회사"가 회원정보를 보유하는 경우 및 필요한 경우를 제외하고는 해지 즉시 "회원"의 모든 데이터는 삭제됩니다.
(4) "회사"는 "회원"이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스의 이용을 단계적으로 제한할 수 있습니다.
(5) "회사"는 전항에도 불구하고, "주민등록법"을 위반한 명의도용 및 결제도용, "저작권법" 및 "컴퓨터프로그램보호법"을 위반한 불법프로그램의 제공 및 운영방해, "정보통신망법"을 위반한 불법통신 및 해킹, 악성프로그램의 배포, 접속권한 초과행위 등과 같이 관련법을 위반한 경우에는 즉시 영구이용정지를 할 수 있습니다. 본 항에 따른 영구이용정지 시 "서비스" 이용을 통해 제공되었던 혜택이 있을 경우 해당 혜택은 모두 소멸될 수 있으며, "회사"는 이에 대해 별도로 보상하지 않습니다.
(6) "회사"는 본 조에 따라 서비스 이용을 제한하거나 계약을 해지하는 경우, 그 사실을 적절한 방법으로 "회원"에게 통지합니다. 
(7) "회원"은 본 조에 따른 이용제한 등에 대하여 회사가 정한 절차에 따라 이의신청을 할 수 있습니다. 이 때 이의가 사유가 정당하다고 "회사"가 인정하는 경우 "회사"는 즉시 서비스 이용을 재개합니다.

제18조(책임제한)
(1) "회사"는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
(2) "회사"는 "회원"의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
(3) "회사"는 "회원"이 서비스를 통해 게재하거나 유포, 전송한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임지지 않습니다.
(4) "회사"는 회원간 또는 회원과 제3자 상호간에 서비스를 매개로 하여 거래 등을 한 경우 에는 책임이 면제됩니다.
(5) "회사"는 사용자에게 제공되는 서비스 이용과 관련하여 관련법에 특별한 규정이 없는 한 책임을 지지 않습니다.
가) “챗봇 서비스”를 통해 제공받은 고민글에 대한 답변글은 기계학습 모델의 분석 결과로, 정확성이 보장되지 않으며 또한 신뢰할 수 있는 의학정보 내지는 기본 정보가 아니기에, 이를 참조하여 이루어진 의학적, 경제적, 일반적 등 여타 모든 판단에 대하여 “회사”는 책임지지 않습니다.
나) 본 서비스는 의료법상 비의료 건강관리서비스로 한정되며, 질병 진단, 치료, 예방을 직접적으로 수행하거나 대체하지 않습니다.
다) 회사는 제공하는 서비스가 의료행위에 해당하지 않음을 명확히 고지하며, 이용자는 본 서비스가 의료인의 진단이나 치료를 대체하지 않음을 인지해야 합니다.
라) 본 서비스는 건강관리 참고용 정보를 제공하며, 이를 통해 이루어진 판단 및 결과에 대한 책임은 전적으로 이용자에게 있습니다. 
마) 회사의 서비스는 최신 AI 기술을 활용하여 데이터를 분석하고 정보를 제공하지만, AI 알고리즘이 제공하는 결과의 정확성 및 완전성을 보장하지 않습니다. 이용자는 본 서비스를 참고용으로만 활용해야 하며, 필요 시 반드시 의료 전문가의 상담을 받아야 합니다.
(6) 회사는 회원의 게시물을 등록 전에 사전심사 하거나 상시적으로 게시물의 내용을 확인 또는 검토하여야 할 의무가 없으며, 그 결과에 대한 책임을 지지 않습니다.
(7) 회사는 회원의 컴퓨터 환경이나 회사의 관리 범위에 있지 아니한 보안 문제로 인하여 발생하는 제반 문제 또는 현재의 보안기술 수준으로 방어가 곤란한 네트워크 해킹 등 회사의 귀책사유 없이 발생하는 문제에 대해서 책임을 지지 않습니다.

제19조 (손해배상)
(1) 회원이 본 약관의 규정을 위반함으로 인하여 회사에 손해가 발생하게 되는 경우, 본 약관을 위반한 회원은 회사에 발생하는 모든 손해를 배상하여야 합니다.
(2) 회원이 서비스를 이용하는 과정에서 행한 불법행위나 본 약관 위반행위로 인하여 회사가 당해 회원 이외의 제3자로부터 손해배상 청구 또는 소송을 비롯한 각종 이의제기를 받는 경우 당해 회원은 자신의 책임과 비용으로 회사를 면책시켜야 하며, 회사가 면책되지 못한 경우 당해 회원은 그로 인하여 회사에 발생한 모든 손해를 배상하여야 합니다.

제20조(정보의 제공)
(1) 회사는 서비스를 운영함에 있어 각종 정보를 서비스 화면에 게재하거나 전자우편, 서신우편, 문자 메시지, 푸시 알림 등의 방법으로 회원에게 제공할 수 있습니다.
(2) 회사는 LLM(Large Language Model)을 기반으로 서비스를 제공하며, 답변의 출처를 명확히 명시하기 어려울 수 있습니다. 회사는 정보의 정확성, 완전성, 신뢰성에 대해 보장하지 않으며, 이에 대한 책임은 제18조를 따릅니다.
(3) 회사는 서비스 내에서 공신력 있는 기관에서 검증된 건강관리 정보를 별도로 제공할 수 있으며, 이 경우 정보 출처 및 기준을 명확히 명시합니다. 다만, LLM 기반 정보 제공에 관해서는 제2항을 따릅니다.

제21조 (분쟁 해결)
(1) 회사는 회원이 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치ㆍ운영합니다.
(2) 회사는 회원으로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 사용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.
(3) 회사와 회원 간에 발생한 전자상거래 분쟁과 관련하여 회원의 피해구제신청이 있는 경우에는 공정거래위원회 또는 시ㆍ도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.

제22조 (재판권 및 준거법)
(1) 회사와 회원 간에 발생한 분쟁에 관한 소송은 민사소송법상의 관할 법원에 제소합니다.
(2) 회사와 회원 간에 발생한 분쟁에 대하여는 대한민국 법을 준거법으로 합니다.

제23조 (회사의 연락처)
1. 상호: 주식회사 AIGA
2. 대표자: O O O 
3. 주소: OOO OOOO OOOO OOOOO
4. 대표전화: OOO-OOOO-OOO
5. 이메일주소: contact@aiga.com

부 칙
공고일자: OOOO년 O월 O일
시행일자: OOOO년 O월 O일


`}</CustomTextBold400>
      </Box>
    </Flex>
  );
}

export default YakwanModal;