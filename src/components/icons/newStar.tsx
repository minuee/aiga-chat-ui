import { useState } from 'react';
import { FaStar } from 'react-icons/fa6'; 
interface IStarProps {   
    w: string;    
    h: string;    
    readonly: boolean;    
    rate?: number;
}

export default function Star({ w, h, readonly, rate }: IStarProps) {    
    
    const [rating, setRating] = useState(rate || 0);     
    const handleClickStar = (index: number) => {        
        if (!readonly) {            
            setRating(index + 1);        
        }    
    };     

    const calculateRate = (rate: number, index: number) => {        
        if (rate >= index) {            
            return '100%';        
        }        
        
        if (Math.floor(index - rate) > 0) {            
            return '0%';        
        }        
        const percentage = ((rate % 1) * 100).toFixed();        
        return `${percentage}%`;    
    };     
    
    
    return (        
        <div className={`flex`}>            
        {
            Array.from({ length: 5 }).map((_, index) => (                
            <div                    
                className={`relative ${w} ${h} cursor-pointer`}                    
                key={index}                
            >                    
                <FaStar                        
                    onClick={() => handleClickStar(index)}                        
                    className={`${w} ${h} ${!readonly && rating >= index + 1 ? 'text-primary-review' : 'text-gray200'}`}                   
                />                    
                    {readonly && (                        
                        <span                            
                            style={                                
                                rate                                    
                                ? 
                                {                                          
                                    width: calculateRate(                                              
                                        rating,                                              
                                        index + 1,                                          
                                    ),                                      
                                }
                                : 
                                {

                                }                            
                            }                            
                            className={`${h} absolute left-0 top-0 overflow-hidden`}                        
                        >                            
                            <FaStar 
                                className={'h-full w-auto text-primary-review'}                            
                            />                        
                        </span>                    
                        )
                    }                
                </div>            
            )
        )}        
    </div>    
    );
}
