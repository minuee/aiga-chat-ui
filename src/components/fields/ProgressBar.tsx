import { Progress } from '@chakra-ui/react';

export interface ProgressBarProps {
  value: number;
  colorScheme: string;
  height: string;
  width: string;
  borderRadius: string;
  bg: string;
}
export default function ProgressBar(props: ProgressBarProps) {
    const { value, colorScheme, height, width, borderRadius, bg } = props;
    return ( 
        <Progress colorScheme={colorScheme} height={height} width={width} value={value} borderRadius={borderRadius} bg={bg} />
  );
}