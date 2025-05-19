'use client';
import React, { PropsWithChildren } from 'react';
// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Divider,Icon,Textarea,Checkbox,Card,useColorModeValue,CardBody,Stack,StackDivider,Heading} from '@chakra-ui/react';
import mConstants from '@/utils/constants';

export interface ReviewModalProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  onHandleEntire : (data:any) => void;
}

function ReviewModal(props: ReviewModalProps) {

  const { isOpen, setClose, onHandleEntire } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [inputs, setInputs] = React.useState<any>({
    comment: null,
    isAgree : false,
  });
  const bgColor = useColorModeValue('blue', 'white');
  const skeletonColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('blue', 'yellow');
  const textColor2 = useColorModeValue('gray.500', 'white');
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
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
        <Flex display={'flex'} flexDirection={'column'} minHeight={'calc( 100vh - 120px )'} padding={'0 10px'} mt={5} justifyContent={'space-between'}> 
          <Box flex={1} display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} minHeight={'50px'} width={'98%'}>
            <Text fontSize={'15px'} color={textColor2} fontWeight={'bold'}>
               탈퇴전 다음사항을 꼭 확인해주십시요
            </Text>
            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} minHeight={'50px'} width={'98%'} mt={5}>
              <Text fontSize={'14px'} fontWeight={'bold'}>
                  탈퇴에 관련 안내사항
              </Text>
              <Box display={'flex'} flexDirection={'row'} alignContent={'center'} minHeight={'50px'} width={'98%'}>
                <Checkbox
                  colorScheme='blue'
                  isChecked={inputs.isAgree}
                  onChange={(e) => setInputs({...inputs, isAgree: e.target.checked})}
                >
                  (필수) 탈퇴에 동의합니다.
                </Checkbox>
              </Box>
            </Box>
          </Box>
          
          <Box position={'fixed'} bottom={0} left={0} padding={'10px'} width={'100%'} height={'100px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Button 
              colorScheme='blue' 
              variant='solid' 
              width={'95%'} 
              maxWidth={`${mConstants.modalMaxWidth-50}px`} 
              borderRadius={'10px'}
              onClick={() => onHandleEntire(inputs)}
              isDisabled={(inputs.isAgree ? false : true)}
            >
              탈퇴하기
            </Button>
          </Box>
        </Flex>
      </>
    )
  }
}


export default ReviewModal;
