'use client';
// Chakra Imports
import * as React from 'react';
import { Box,Button,Center,Flex,Icon,Link,Menu,MenuButton,MenuItem,MenuList,Text,useColorMode,useColorModeValue,useToast} from '@chakra-ui/react';
import { SidebarResponsive } from '@/components/sidebar/Sidebar';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { MdInfoOutline } from 'react-icons/md';
import NoticerModal  from '@/components/modal/Notice';
import LoginModal  from '@/components/modal/LoginForm';
import NavLink from '../link/NavLink';
import routes from '@/routes';
import functions from '@/utils/functions';

export default function HeaderLinks(props: {secondary: boolean;}) {

  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  // Loading state
  const [isOpenNoticeModal, setIsOpenNoticeModal] = React.useState<boolean>(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = React.useState<boolean>(false);
  const [buttonText, setButtonText] = React.useState<string>('구독하기');
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.500', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '0px 41px 75px #081132',
  );
  const buttonBg = useColorModeValue('transparent', 'navy.800');
  const hoverButton = useColorModeValue(
    { bg: 'gray.100' },
    { bg: 'whiteAlpha.100' },
  );
  const activeButton = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.200' },
  );

  const [myToken, setMyToken] = React.useState<PushSubscription | null>(null);
  const sendNotification = async() => {
    try {
      console.log('myToken',myToken);
      const bodyDat = {
        ...myToken,
        endpoint: "http://localhost:3000/chat"
      }
      const response = await fetch('/api/sendpush', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(myToken),
      }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));;
     /*  if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data); */
    } catch (error) {
        console.error('Error sending notification:', error);
    }
  }

  const requestPermission = async () => {
    try {
        const registration = await navigator.serviceWorker.ready;
        console.log('registration',registration);
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            // 이미 구독이 되어있다면 해지하기
            // TODO: DB에 구독 해지 정보 보내기
            setButtonText('구독하기');
            subscription.unsubscribe();
        } else {
            // 구독이 되어있지 않으면 구독하기
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            });
            // TODO: DB에 구독 정보 보내기
            console.log('subscription => ', subscription.toJSON());
            setButtonText('구독 해지하기');
        }
    } catch (e:any) {
        console.error(e.message);
    }
  }

   const subscribeUser = async() => {
    console.log('subscription 111');
  

    navigator.serviceWorker.ready.then((registration) => {
      console.log('registration',registration);
      registration.pushManager.getSubscription().then((subscription) => {
        console.log('subscription',subscription);
        if (subscription) {
          setMyToken(subscription);
          console.log('Already subscribed',subscription);
          toast({
            title: 'Already subscribed',
            position: 'top-right',
            description: 'You are already subscribed to the push notifications',
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
        } else {
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            })
            .then((subscription) => {
              console.log('subscription',subscription);
              setMyToken(subscription);
              // save subscription on DB
              /* fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription),
              }); */
            });
        }
      });
    }).catch(e => {
      console.error(e);
    });
  }

  return (
    <Flex
      zIndex="100"
      //w={{ sm: '100%', md: 'auto' }}
      w={'auto'}
      alignItems="center"
      justifyContent={'flex-end'}
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      {/* <SearchBar
        mb={() => {
          if (secondary) {
            return { base: '10px', md: 'unset' };
          }
          return 'unset';
        }}
        me="10px"
        borderRadius="30px"
      /> */}
      <SidebarResponsive routes={routes} />
      {/* <APIModal setApiKey={setApiKey} /> */}

      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdInfoOutline}
            color={navbarIcon}
            w="18px"
            h="18px"
            me="10px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          me={{ base: '30px', md: 'unset' }}
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          minW={{ base: 'unset' }}
          maxW={{ base: '360px', md: 'unset' }}
        >
          {/* <Flex bgImage={navImage} borderRadius="16px" mb="28px" alt="" /> */}
          <Flex flexDirection="column">
            <Link
              isExternal
              w="100%"
            >
              <Button
                w="100%"
                h="44px"
                variant="no-hover"
                color={textColor}
                fontSize="sm"
                borderRadius="45px"
                bg="transparent"
                onClick={() => setIsOpenNoticeModal(!isOpenNoticeModal)}
              >
                공지사항
              </Button>
            </Link>
            <Link
              isExternal
              w="100%"
              href="https://kormedi.com/"
              target='_blank'
            >
              <Button
                w="100%"
                h="44px"
                variant="no-hover"
                color={textColor}
                fontSize="sm"
                borderRadius="45px"
                bg="transparent"
              >
                회사소개
              </Button>
            </Link>
            <Link
              isExternal
              w="100%"
              href="https://kormedi.com/%ec%9d%b4%ec%9a%a9%ec%95%bd%ea%b4%80-%ec%bd%94%eb%a9%94%eb%94%94%eb%8b%b7%ec%bb%b4/"
              target='_blank'
            >
              <Button
                w="100%"
                h="44px"
                variant="no-hover"
                color={textColor}
                fontSize="sm"
                borderRadius="45px"
                bg="transparent"
              >
                이용약관
              </Button>
            </Link>
            <Link
              w="100%"
              isExternal
              href="https://kormedi.com/%ea%b0%9c%ec%9d%b8%ec%a0%95%eb%b3%b4%ec%b2%98%eb%a6%ac%eb%b0%a9%ec%b9%a8-%ec%bd%94%eb%a9%94%eb%94%94%eb%8b%b7%ec%bb%b4/"
              target='_blank'
            >
              <Button
                w="100%"
                h="44px"
                variant="no-hover"
                color={textColor}
                fontSize="sm"
                borderRadius="45px"
                bg="transparent"
              >
                개인정보처리방침
              </Button>
            </Link>
          </Flex>
        </MenuList>
      </Menu>

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
      <Menu>
        <MenuButton p="0px" style={{ position: 'relative' }}>
          <Box
            _hover={{ cursor: 'pointer' }}
            color="white"
            bg="#11047A"
            w="40px"
            h="40px"
            borderRadius={'50%'}
          />
          <Center top={0} left={0} position={'absolute'} w={'100%'} h={'100%'}>
            <Text fontSize={'xs'} fontWeight="bold" color={'white'}>
              성남
            </Text>
          </Center>
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey, 성남
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <NavLink href="/settings">
              <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color={textColor}
                borderRadius="8px"
                px="14px"
                //onClick={()=> handleApiKeyChange(process.env.NEXT_PUBLIC_OPENAI_API_KEY)}
              >
                
                <Text fontWeight="500" fontSize="sm">
                  Profile Settings
                </Text>
   
              </MenuItem>
            </NavLink>
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color={textColor}
              borderRadius="8px"
              px="14px"
            >
              <Text fontWeight="500" fontSize="sm">
                History
              </Text>
            </MenuItem>
            {/* <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="blue.500"
              borderRadius="8px"
              px="14px"
              onClick={()=> subscribeUser()}
            >
              <Text fontWeight="500" fontSize="sm">
                구독
              </Text>
            </MenuItem>
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="blue.500"
              borderRadius="8px"
              px="14px"
              onClick={()=> sendNotification()}
            >
              <Text fontWeight="500" fontSize="sm">
                푸시발송
              </Text>
            </MenuItem> */}
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="blue.500"
              borderRadius="8px"
              px="14px"
              onClick={()=> setIsOpenLoginModal(!isOpenLoginModal)}
            >
              <Text fontWeight="500" fontSize="sm">
                Log In
              </Text>
            </MenuItem>
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
            >
              <Text fontWeight="500" fontSize="sm">
                Log out
              </Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
      {
        isOpenNoticeModal && (
          <NoticerModal
            isOpen={isOpenNoticeModal}
            setClose={() => setIsOpenNoticeModal(false)}
          />
        )
      }
      {
        isOpenLoginModal && (
          <LoginModal
            isOpen={isOpenLoginModal}
            setClose={() => setIsOpenLoginModal(false)}
          />
        )
      }
      
    </Flex>
  );
}
