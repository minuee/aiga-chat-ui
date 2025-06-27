import { Box, HStack } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const colorChange = keyframes`
  0% {
    background-color: rgba(10, 164, 100, 0); /* green.500 */
  }
  33% {
    background-color:rgba(10, 164, 100, 0.3); /* green.300 */
  }
  66% {
    background-color: rgba(10, 164, 100, 0.6); /* green.200 */
  }
  100% {
    background-color:rgba(10, 164, 100, 1); /* green.500 */
  }
`;

const Dot = ({ delay }: { delay: string }) => (
  <Box
    w="12px"
    h="12px"
    borderRadius="full"
    animation={`${colorChange} 1.5s infinite`}
    sx={{
      animationDelay: delay,
    }}
  />
);

export default function LoadingDotsColorFade() {
  return (
    <HStack spacing="8px">
      <Dot delay="0s" />
      <Dot delay="0.2s" />
      <Dot delay="0.4s" />
    </HStack>
  );
}
