import { useColorModeValue, Flex, useColorMode} from '@chakra-ui/react';
import { motion } from "framer-motion";
import WelcomeLogoImage from "@/assets/images/welcom-logo.png";
import Image from "next/image";
import CustomText, { CustomTextBold400,CustomTextBold700 } from "@/components/text/CustomText";
type MotionWelcomeProps = {
    msg: string;
    pt : string;
    classNames : string
};

const MotionWelcome = ({ 
    msg = "AIGA",
    pt="0px",
    classNames="opening_wrap"
  }: MotionWelcomeProps) => {

  const textColor = useColorModeValue('navy.700', 'white')
  return (
    <Flex flexDirection={'column'} pt={pt}>
      <div className="opening_wrap">
        <motion.div
          className={classNames}
          animate={{ scale: [1, 1.5, 1.1] }}
          transition={{ duration: 3, times: [0, 0.2, 1] }}
        >
          <CustomTextBold700>{msg}</CustomTextBold700>
        </motion.div>
      </div>
    </Flex>
  );
};
  

type MotionWelcomeImageProps = {
  pt : string;
};

export const MotionWelcomeImage = ({ 
  pt="0px",
}: MotionWelcomeImageProps) => {

const textColor = useColorModeValue('navy.700', 'white')

return (
  <Flex flexDirection={'column'} pt={pt}>
    <div className="opening_wrap">
      <motion.div
        className={'opening_wrap'}
        animate={{ scale: [1, 1.5, 1.1] }}
        transition={{ duration: 3, times: [0, 0.2, 1] }}
      >
       <Image 
          src={WelcomeLogoImage}
          alt="Aiga Logo"
          style={{width:'70px',objectFit: 'contain'}}
        />
      </motion.div>
    </div>
  </Flex>
);
};

export default MotionWelcome;