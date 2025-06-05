import { useColorModeValue, Flex} from '@chakra-ui/react';
import { motion } from "framer-motion";
type MotionWelcomeProps = {
    msg: string;
};

const MotionWelcome = ({ 
    msg = "AIGA",
  }: MotionWelcomeProps) => {

  const textColor = useColorModeValue('navy.700', 'white')
  
  return (
    <Flex w="100%" mt="10px" flexDirection={'column'} pt="50px">
      <div className="opening_wrap">
        <motion.div
          className="opening_box"
          animate={{ scale: [1, 1.5, 1.1] }}
          transition={{ duration: 3, times: [0, 0.2, 1] }}
        >
          {msg}
        </motion.div>
      </div>
    </Flex>
  );
};
  
export default MotionWelcome;