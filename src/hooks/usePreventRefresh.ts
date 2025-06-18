import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const PreventRefresh = () => {
    const toast = useToast();
    useEffect(() => {
        const handleKeyDown = (e:any) => {
        // F5 또는 Ctrl+R (또는 Command+R) 감지
        if (
            e.key === 'F5' ||
            (e.ctrlKey && e.key === 'r') ||
            (e.metaKey && e.key === 'r') // macOS의 Command+R
        ) {
            e.preventDefault();
            e.stopPropagation();
            toast({
                title: 'AIGA',
                position: 'top-right',
                description: '새로고침을 할수 없는 페이지입니다.',
                status: 'info',
                containerStyle: {
                    color: '#ffffff',
                },
                duration: 1500,
                isClosable: true,
              });
        }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return null;
};

export default PreventRefresh;