'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Checkbox,useColorModeValue} from '@chakra-ui/react';
import mConstants from '@/utils/constants';
import Image from 'next/image';
import ImageEntire from "@/assets/images/img-entire.png";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";

export interface EntireModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  onHandleEntire : (data:any) => void;
}

function EntireModal(props: EntireModalProps) {

  const { isOpen, setClose, onHandleEntire } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [inputs, setInputs] = React.useState<any>({
    comment: null,
    isAgree : false,
    isAgree2 : false
  });
  const bgColor = useColorModeValue('blue', 'white');
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('blue', 'yellow');
  const textColor2 = useColorModeValue('black', 'white');
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 60)
  }, [isOpen]);

  if ( isLoading ) {
    return (
      <Box padding='6' boxShadow='lg' bg={skeletonColor}>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      </Box>
    )
  }else{

    return (
      <>
        <Flex display={'flex'} flexDirection={'column'} minHeight={'calc( 100vh - 120px )'} justifyContent={'space-between'}> 
          <Box flex={1} display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} minHeight={'50px'} width={'100%'}>
            <Flex  justifyContent={'center'} minHeight={'50px'} width={'98%'} mt={5}>
              <Box flex={3} pr={'20px'}> 
                <CustomTextBold700 fontSize={'24px'} color={textColor2}>
                  탈퇴 전, 다음 사항을 꼭 확인해 주세요
                </CustomTextBold700>
              </Box>
              <Box flex={1} minWidth={"104px"}> 
                <Image 
                  src={ImageEntire}
                  alt="ImageEntire"
                  style={{width:'104px',objectFit: 'contain',maxWidth:"104px"}}
                />
              </Box>
            </Flex>
            <Box display={'flex'} flexDirection={'column'}  minHeight={'50px'} width={'100%'} mt={10}>
              <Box display={'flex'} flexDirection={'row'}   minHeight={'50px'} width={'100%'}>
                <Checkbox
                  colorScheme='blue'
                  isChecked={inputs.isAgree}
                  onChange={(e) => setInputs({...inputs, isAgree: e.target.checked})}
                >
                  <CustomText color='#7F879B' fontSize={'13px'} lineHeight={'150%'}>
                    리뷰에 기여하신 글과 댓글들은 삭제되지 않습니다. 삭제를 원하시는 내용이 있다면 탈퇴하기 전에 삭제 처리를 부탁드립니다.
                  </CustomText>
                </Checkbox>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'100%'} mt={5}>
              <Box display={'flex'} flexDirection={'row'} alignContent={'center'} minHeight={'50px'} width={'100%'}>
                <Checkbox
                  colorScheme='blue'
                  isChecked={inputs.isAgree2}
                  onChange={(e) => setInputs({...inputs, isAgree2: e.target.checked})}
                >
                  <CustomText color='#7F879B' fontSize={'13px'} lineHeight={'150%'}>
                    삭제된 정보는 다시 되살릴 수 없습니다.
                  </CustomText>
                  <CustomText color='#7F879B' fontSize={'13px'} lineHeight={'150%'}>
                    또한 탈퇴 후 24시간 동안 재가입이 어렵습니다.
                  </CustomText>
                </Checkbox>
              </Box>
            </Box>
          </Box>
          
          <Box position={'fixed'} bottom={0} left={0} padding={'10px'} width={'100%'} height={'100px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Button 
              colorScheme='blue' 
              //bg='#E9EDF3'
              variant='solid' 
              width={'95%'} 
              maxWidth={`${mConstants.modalMaxWidth-50}px`} 
              borderRadius={'10px'}
              onClick={() => onHandleEntire(inputs)}
              isDisabled={(inputs.isAgree && inputs.isAgree2 ) ? false : true}
              id="button_entire"
            >
              탈퇴하기
            </Button>
          </Box>
        </Flex>
      </>
    )
  }
}

export default EntireModal;