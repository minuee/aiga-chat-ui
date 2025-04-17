import React from 'react';
import { TypeAnimation } from 'react-type-animation';
 
type TypeAnimationProps = {
    msg: string;
};
  
const TypeAnimationScreen = ({ msg }:TypeAnimationProps) => {
  
    return (
    <TypeAnimation
        //splitter={(str) => str.split(/(?= )/)} // 'Lorem ipsum dolor' -> ['Lorem', ' ipsum', ' dolor']
        sequence={[msg]}
        //speed={{ type: 'keyStrokeDelayInMs', value: 1 }}
        speed={msg?.length >  50 ? 90 : 30}
        cursor={false}
        omitDeletionAnimation={true}
        //style={{ fontSize: '1em', display: 'block', minHeight: '200px' }}
        //repeat={Infinity}
        repeat={0}
    />
  );
};

export default React.memo(TypeAnimationScreen);