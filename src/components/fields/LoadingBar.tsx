'use client';
// Chakra imports
import { Flex,SkeletonText,SkeletonCircle,useColorModeValue} from '@chakra-ui/react';
import mConstants from '@/utils/constants';

export interface SkeletonTextProps  {
    isOpen : boolean;
    lineNum : number;

  }
const SkeletonDefaultText = ( props: SkeletonTextProps)=>  {
    const { isOpen, lineNum = 4} = props;

    return (
        <Flex
            display={ isOpen ? 'block' : 'none' }
            w={{ base: '100%',md: `${mConstants.desktopMinWidth}px` }}
            maxWidth={{ base: '100%', md: `${mConstants.desktopMinWidth-30}px` }}
            height={'100%'}
            padding={"10px"}
            direction="column"
            position="relative"
        >
            <Flex direction="column" mx="auto" w={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                <SkeletonText mt='4' noOfLines={lineNum} spacing='4' skeletonHeight='2' />
            </Flex>
        </Flex>
    )
}

export const SkeletonDefaultMixed = ( props: SkeletonTextProps)=>  {
    const { isOpen, lineNum = 4} = props;
    const skeletonColor = useColorModeValue('white', 'gray.700');
    return (
        <Flex padding='6' boxShadow='lg' bg={skeletonColor}>
            <SkeletonCircle size='10' />
            <SkeletonText mt='4' noOfLines={lineNum} spacing='4' skeletonHeight='2' />
        </Flex>
    )
}
export default SkeletonDefaultText;