import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

interface ILocation {
  latitude: number;
  longitude: number;
}

export const useGeoLocation = (options = {}) => {
  const [location, setLocation] = useState<ILocation>();
  const [error, setError] = useState('');
  const toast = useToast();

  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    setLocation({
      latitude,
      longitude,
    });
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    setError(err.message);
    let description = err.message;
    if (err.code === 1) {
      description = '위치 정보 접근 권한이 거부되었습니다. 브라우저 설정을 확인해주세요.';
    } else if (err.code === 2) {
      description = '현재 위치를 확인할 수 없습니다.';
    } else if (err.code === 3) {
      description = '위치 정보를 가져오는 요청이 시간 초과되었습니다.';
    }

    toast({
      title: '위치 정보 오류',
      position: 'top-right',
      description,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }, [toast]);

  useEffect(() => {
    const { geolocation } = navigator;
    if (!geolocation) {
      setError('Geolocation is not supported.');
      return;
    }

    const getPosition = () => {
      geolocation.getCurrentPosition(handleSuccess, handleError, options);
    };

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
        if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
          getPosition();
        } else if (permissionStatus.state === 'denied') {
          handleError({
            code: 1,
            message: 'User has denied Geolocation permission.',
          } as GeolocationPositionError);
        }

        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            getPosition();
          }
        };
      });
    } else {
      getPosition();
    }
  }, [options, handleSuccess, handleError]);

  return { location, error };
};