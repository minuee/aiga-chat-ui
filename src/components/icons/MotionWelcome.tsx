import React from 'react';
import { useColorModeValue, Flex, useColorMode} from '@chakra-ui/react';
import { motion } from "framer-motion";
import {IconAiga} from '@/components/icons/svgIcons';

import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";

type MotionWelcomeProps = {
    msg: string;
    pt : string;
    classNames : string;
    isMobile : boolean;
};

const MotionWelcome = ({ 
    msg = "AIGA",
    pt="0px",
    classNames="opening_wrap",
    isMobile = false
  }: MotionWelcomeProps) => {

  const textColor = useColorModeValue('navy.700', 'white')
  return (
    <Flex flexDirection={'column'} pt={pt}>
      {
        isMobile
        ?
        <CustomTextBold700>{msg}</CustomTextBold700>
        :
        <div className="opening_wrap">
          <motion.div
            className={classNames}
            animate={{ scale: [1, 1.5, 1.1] }}
            transition={{ duration: 3, times: [0, 0.2, 1] }}
          >
            <CustomTextBold700>{msg}</CustomTextBold700>
          </motion.div>
        </div>
      }
    </Flex>
  );
};
  

type MotionWelcomeImageProps = {
  pt : string;
  isMobile : boolean;
};

export const MotionWelcomeImage = React.memo(({ 
  pt="0px",
  isMobile = false
}: MotionWelcomeImageProps) => {

const textColor = useColorModeValue('navy.700', 'white')

  return (
    <Flex flexDirection={'column'} pt={pt}>
      {
        isMobile
        ?
        <IconAiga boxSize={'70px'} />
        :
        <div className="opening_wrap">
          <motion.div
            className={'opening_wrap'}
            animate={{ scale: [1, 1.5, 1.1] }}
            transition={{ duration: 3, times: [0, 0.2, 1] }}
          >
            <IconAiga boxSize={'70px'} />
          </motion.div>
        </div>
      }
    </Flex>
  );
});

export default React.memo(MotionWelcome);