import React from 'react';
import { Slider,SliderTrack,SliderFilledTrack,SliderThumb,SliderMark,Icon } from '@chakra-ui/react';
import { MdOutlineStarPurple500 } from 'react-icons/md';

type SliderProps = {
    data: any;
    setInputs: (value:any) => void;
};
  
const labelStylesStart = {
  mt: '2',
  ml: '0',
  fontSize: 'sm',
  color:'#7F879B'
}
const labelStylesMiddle = {
  mt: '2',
  ml: '1',
  fontSize: 'sm',
  color:'#7F879B'
}
const labelStylesEnd = {
  mt: '2',
  ml: '-2.5',
  fontSize: 'sm',
  color:'#7F879B'
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
          <SliderMark value={1} {...labelStylesMiddle}>
            1
          </SliderMark>
          <SliderMark value={2} {...labelStylesMiddle}>
            2
          </SliderMark>
          <SliderMark value={3} {...labelStylesMiddle}>
            3
          </SliderMark>
          <SliderMark value={4} {...labelStylesMiddle}>
            4
          </SliderMark>
          <SliderMark value={5} {...labelStylesEnd}>
            5
          </SliderMark>
          <SliderMark
            value={parseInt(data)}
            textAlign='center'
            bg='blue.500'
            color='white'
            mt='5'
            ml='-1'
            w='20px'
            borderRadius={'50%'}
            fontSize={'13px'}
            display={showTooltip ? 'block' : 'none'}
          >
            {data}
          </SliderMark>
        <SliderTrack>
          <SliderFilledTrack 
            bgColor="#97E2D1"
          />
        </SliderTrack>
        <SliderThumb bg={'white'} boxSize={7}>
          <Icon color='gold' as={MdOutlineStarPurple500}  />
        </SliderThumb>
      </Slider>
    </>
  )
};

export default React.memo(SliderScreen);