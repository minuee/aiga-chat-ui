import React from 'react';
import { Slider,SliderTrack,SliderFilledTrack,SliderThumb,SliderMark, } from '@chakra-ui/react';
type SliderProps = {
    data: any;
    setInputs: (value:any) => void;
};
  
const labelStylesStart = {
  mt: '2',
  ml: '0',
  fontSize: 'sm',
}
const labelStylesEnd = {
  mt: '2',
  ml: '-2.5',
  fontSize: 'sm',
}

const SliderScreen = ({ data, setInputs }:SliderProps) => {
    const [showTooltip, setShowTooltip] = React.useState(false);
   
    return (
      <>
        <Slider 
          aria-label='slider-ex-1' 
          value={parseInt(data)} 
          onChange={(value) => setInputs(value)}
          min={0}
          max={5}
          step={1}
          onMouseEnter={() => setShowTooltip(true)}
          onFocus={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onBlur={() => setShowTooltip(false)}
        >
          <SliderMark value={0} {...labelStylesStart}>
            0
          </SliderMark>
          <SliderMark value={5} {...labelStylesEnd}>
            5
          </SliderMark>
          <SliderMark
            value={parseInt(data)}
            textAlign='center'
            bg='blue.500'
            color='white'
            mt='3'
            ml='-3'
            w='6'
            fontSize={'13px'}
            display={showTooltip ? 'block' : 'none'}
          >
            {data}
          </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb bg={'blue.500'} />
      </Slider>
    </>
  )
};

export default React.memo(SliderScreen);