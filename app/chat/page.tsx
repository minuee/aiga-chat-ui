'use client';
/*eslint-disable*/

import functions from '@/utils/functions';
import MessageBoxChat from '@/components/MessageBox';
import { ChatBody, OpenAIModel } from '@/types/types';
import { Box,Button,Flex,Icon,Textarea,Input,Text,useColorModeValue,} from '@chakra-ui/react';
import { useEffect, useState,useRef } from 'react';
import Image from "next/image";
import { MdAutoAwesome, MdFitbit, MdEdit, MdPerson } from 'react-icons/md';
import DoctorModal  from '@/components/modal/Doctor';
import SelectBody  from '@/components/msgType/SelectBody';
import SelectDoctor  from '@/components/msgType/SelectDoctor';
import SelectName  from '@/components/msgType/SelectName';
import Welcome  from '@/components/msgType/Welcome';
import { MdOutlineArrowDownward } from "react-icons/md";
import LoadingBar from "@/assets/icons/loading.gif";


export default function Chat() {
  // Input States
  const [isAccessFirst, setAccessFirst] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>('');
  const [isShowScroll, setShowScroll] = useState(false);
  const [isReceiving, setReceiving] = useState(false);
  // Response message
  const [outputCode, setOutputCode] = useState<any>([]);
  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  // Loading state
  const [isOpenDoctorModal, setIsOpenDoctorModal] = useState<boolean>(false);
  const navbarIcon = useColorModeValue('gray.500', 'white');

  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);
  const borderColor = useColorModeValue('gray.200', 'gray');
  const inputColor = useColorModeValue('navy.700', 'black');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue('14px 27px 45px rgba(112, 144, 176, 0.2)','none');
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue({ color: 'gray.500' },{ color: 'gray' });

  useEffect(() => {
    if ( !isAccessFirst ) {
      
    }
    return () => setAccessFirst(false);
  }, [isAccessFirst]);
  
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      setShowScroll((prev) => {
        const goingUp = e.deltaY < 0;
        const shouldUpdate = goingUp !== prev;
        if (shouldUpdate) {
          console.log("스크롤 상태 변경:", !prev);
          return !prev;
        }
        return prev;
      });
    };

    el.addEventListener("wheel", handleWheel);
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // 스크롤을 맨 아래로 내리는 함수
  const scrollToBottom = () => {
   
    const el = scrollBottomRef.current;
    if (el) {
      console.log("scrollToBottom",el)
      scrollBottomRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      setShowScroll(false)
    }
  };

  const handleTranslate = async( isText:any = '') => {

    if ( functions.isEmpty(inputCode) && functions.isEmpty(isText) ) return;
    setReceiving(true);
    const msgLen = parseInt(outputCode.length+1);
    const inputCodeText = inputCode || isText;
    setOutputCode((prevCode: any[]) => [...prevCode, { ismode: "me", msg: inputCodeText }]);
    setInputCode('')

    const response = await fetch('http://localhost:9999/api/v1/see',{credentials: 'include'});
    const reader = response?.body?.getReader();

    const decoder = new TextDecoder();
    
    let streamData:string = "";
    while (true) {
      const { value, done } : any = await reader?.read();
    
      if (done) {
        setLoading(false);
        setReceiving(false);
        console.log('🔚 스트림 종료됨');
        break;
      }
    
      const chunk = decoder.decode(value, { stream: true });
      console.log('📥 받은 메시지:', chunk);
     
      if ( chunk ) {
        //setOutputCode((prevCode) => prevCode + chunk);
        //setOutputCode((prevCode:any) => prevCode.push({ismode:"server",msg:chunk}));
        streamData = streamData.concat(chunk);
      }else{
        console.error('data가 null입니다. getReader를 호출할 수 없습니다.');
      }
      //setOutputCode((prevCode: any[]) => [...prevCode, { ismode: "server", msg: streamData }]);
      // 필요하다면 chunk를 파싱해서 처리하세요 (예: data: ... 형식 파싱)
      setOutputCode((prevCode: any[]) => {
       
        const newArray = [...prevCode];
        const lastIndex = msgLen;
        if ( !newArray[lastIndex]?.msg ) {
          newArray[lastIndex] = {
            ismode : 'server',
            msg:chunk,
          };
        }else{
          const tmpMsg = prevCode[lastIndex].msg;
          newArray[lastIndex] = {
            ...prevCode[lastIndex],
            msg: tmpMsg.concat(chunk)
          };
        }
        
        return newArray;
      });
    }
    //setOutputCode((prevCode: any[]) => [...prevCode, { ismode: "server", msg: streamData }]);
    //if (scrollRef?.current) scrollRef?.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowScroll(false)
      scrollBottomRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 0); // or 100ms 정도로 조정 가능
    console.log("outputCode",outputCode)
    return () => clearTimeout(timeout);
  }, [outputCode]);
  

  const handleTranslate_old = async () => {
    let apiKey = localStorage.getItem('apiKey');
    
    // Chat post conditions(maximum number of characters, valid message etc.)
    const maxCodeLength = model === 'gpt-4o' ? 700 : 700;

    if (!apiKey?.includes('sk-')) {
      alert('Please enter an API key.');
      return;
    }

    if (!inputCode) {
      alert('Please enter your message.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }
 
    const controller = new AbortController();
    const body: ChatBody = {
      inputCode,
      model,
      apiKey,
    };

    // -------------- Fetch --------------
    /* const response = await fetch('./api/chatAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      if (response) {
        alert(
          'Something went wrong went fetching from the API. Make sure to use a valid API key.',
        );
      }
      return;
    } */
    /* const response = await fetch('http://localhost:9999/api/v1/see', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
      //signal: controller.signal
    }); */

   /*  const eventSource = new EventSource('http://localhost:9999/api/v1/see',{withCredentials: true});

    let response: {
      ok: boolean;
      data: ReadableStream<Uint8Array> | null;
    } = {
      ok: false,
      data: null
    };
    eventSource.onmessage = function (event) {
      response = {
        ok : true,
        data : event.data
      }
      console.log('받은 데이터:', response);
    };

    eventSource.onerror = function (err) {
      response = {
        ok : false,
        data : null
      }
      console.error('SSE 연결 오류:', err);
    };

    console.log('response ',response);

    if (!response?.ok) {
      setLoading(false);
      if (response) {
        alert(
          'Something went wrong went fetching from the API. Make sure to use a valid API key.',
        );
      }
      return;
    }

    const data = response?.data;
    console.log('response data',data);
    if (!data) {
      setLoading(false);
      alert('Something went wrong');
      return;
    }
    if ( data ) {
      const reader = data?.getReader();
      const decoder = new TextDecoder();
      let done = false;
  
      while (!done) {
        setLoading(true);
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setOutputCode((prevCode) => prevCode + chunkValue);
      }
    }else{
      console.error('data가 null입니다. getReader를 호출할 수 없습니다.');
    } */
    

    //setLoading(false);
  };
  // -------------- Copy Response --------------
  // const copyToClipboard = (text: string) => {
  //   const el = document.createElement('textarea');
  //   el.value = text;
  //   document.body.appendChild(el);
  //   el.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(el);
  // };

  // *** Initializing apiKey with .env.local value
  // useEffect(() => {
  // ENV file verison
  // const apiKeyENV = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  // if (apiKey === undefined || null) {
  //   setApiKey(apiKeyENV)
  // }
  // }, [])

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  const onSendButton = async( str : string) => {
    console.log("onSendButton",str)
    await handleTranslate(str);
  }

  const onSendWelcomeButton = async( str : string) => {
    console.log("onSendButton",str)
    await handleTranslate(str);
  }

  const onSendDoctorButton = async( isBool : boolean) => {
    console.log("onSendDoctorButton",isBool)
    setIsOpenDoctorModal(isBool);
  }

  const onSendNameButton = async( str : string) => {
    console.log("onSendButton",str)
    await handleTranslate(str);
  }

  

  return (
    <Flex
      w="100%"
      //pt={{ base: '0px', lg: '70px' }}
      direction="column"
      position="relative"
    >
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%',sm : '100%', md: '100%', xl: '100%' }}
        overflowY='scroll'
        //minH={{ base: '75vh', md: '85vh'  }}
        //minH="calc(100vh - 150px)"
        //maxH={{ base: '75vh', md: '85vh'  }}
        //height={`calc(var(--vh, 1vh) * 85)`}
        maxW="1024px"
        minH="calc(100vh - 100px)"
      >
        {/* <Flex direction={'column'} w="100%" mb={outputCode ? '20px' : 'auto'}>
          
        </Flex> */}
        <Flex
          direction="column"
          w="100%"
          //maxH={{ base: '75vh', md: '85vh' }}
          //height={`calc(var(--vh, 1vh) * 100)`}
          maxH="calc(100vh - 150px)"
          overflowY='auto'
          mx="auto"
          display={outputCode ? 'flex' : 'none'}
          mb={'auto'}
          ref={scrollRef}
        >
          <Box>
            <Welcome 
              msg={`안녕하세요? 건강AI AIGA에요\r\n누가 아프신가요?`}
              onSendButton={onSendButton}
            />
          </Box>
          <Box>
            <SelectBody 
              onSendButton={onSendWelcomeButton}
            />
          </Box>
          <Box>
            <SelectDoctor 
              onSendButton={onSendDoctorButton}
            />
          </Box>
          <Box mb={3}>
            <SelectName 
              data={[]}
              onSendButton={onSendNameButton}
            />
          </Box>
          { 
            outputCode.map((element:any,index:number) => {
              if ( element.ismode == 'me') {
                return (
                  <Flex w="100%" align={'center'} mb="10px" key={index} justifyContent='flex-end'>
                    <Flex
                      p="10px"
                      border="1px solid"
                      borderColor={borderColor}
                      borderRadius="14px"
                      w="auto"
                      zIndex={'2'}
                    >
                      <Text
                        color={textColor}
                        fontWeight="600"
                        fontSize={{ base: 'sm', md: 'md' }}
                        lineHeight={{ base: '24px', md: '26px' }}
                        whiteSpace="pre-line"
                      >
                        {element?.msg}
                      </Text>
                    </Flex>
                    <Flex
                      borderRadius="full"
                      justify="center"
                      align="center"
                      bg={'transparent'}
                      border="1px solid"
                      borderColor={borderColor}
                      ms="10px"
                      h="40px"
                      minH="40px"
                      minW="40px"
                    >
                      <Icon
                        as={MdPerson}
                        width="20px"
                        height="20px"
                        color={brandColor}
                      />
                    </Flex>
                  </Flex>
                )
              }else{
                return (
                  <Flex w="100%" key={index} mb="10px">
                    <Flex
                      borderRadius="full"
                      justify="center"
                      align="center"
                      bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
                      me="10px"
                      h="40px"
                      minH="40px"
                      minW="40px"
                    >
                      <Icon
                        as={MdFitbit}
                        width="20px"
                        height="20px"
                        color="white"
                      />
                    </Flex>
                    <MessageBoxChat output={element.msg} />
                  </Flex>
                )
              }
            })
          }
          
          { isShowScroll &&  
            (
              <Box
                position={'absolute'}
                right="10px"
                bottom={{base : "100px", md:"150px"}}
                width="50px"
                height={"50px"}
                zIndex={10}
                display={'flex'}
                justifyContent='center'
                alignItems={'center'}
                onClick={()=> scrollToBottom()}
              >
                <Icon
                  as={MdOutlineArrowDownward}
                  width="40px"
                  height="40px"
                  color={navbarIcon}
                />
              </Box>
            )
          }
          <Box ref={scrollBottomRef} h="1px" />
        </Flex>
        {/* Chat Input */}
        {/* <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="20px"
          maxH="60px"
          justifySelf={'flex-end'}
        > */}
        <Flex
          position="fixed"          // ✅ 고정 위치
          bottom="0"                // ✅ 화면 하단에 붙임
          left="0"
          w="100%"                  // ✅ 전체 너비
          px="20px"                 // 양쪽 여백
          py="10px"                 // 위아래 여백
          bg={"white"}                // 배경색 (필수! 안 넣으면 뒤 채팅이 비쳐요)
          zIndex="100"              // 채팅보다 위에 오게
          //boxShadow="0 -2px 10px rgba(0,0,0,0.05)" // 선택: 살짝 그림자 효과
        >
          <Textarea
            minH="40px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            readOnly={isReceiving}
            borderRadius="45px"
            //p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            value={inputCode}
            placeholder="Type your message here..."
            onChange={handleChange}
          />
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={() => handleTranslate(inputCode)}
            isLoading={loading ? true : false}
          >
            {
              isReceiving
              ?
              <Image 
                src={LoadingBar}  
                alt="LoadingBar" 
                style={{width:'30px', height:'30px'}}
              /> 
              :
              <Text>
                전송
              </Text>
            }
          </Button>
          
        </Flex>
        <DoctorModal
          isOpen={isOpenDoctorModal}
          setClose={() => setIsOpenDoctorModal(false)}
        />
      </Flex>
    </Flex>
  );
}
