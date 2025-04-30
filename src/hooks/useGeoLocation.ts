import { useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react';

interface ILocation {
  latitude: number
  longitude: number
}

export const useGeoLocation = (options = {}) => {
  const [location, setLocation] = useState<ILocation>()
  const [error, setError] = useState('')
  const toast = useToast();

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords

    setLocation({
      latitude,
      longitude,
    })
  }

  const handleError = (err: GeolocationPositionError) => {
    /* if (error === '') {
      toast({
        title: '[AIGA] 위치 정보 수집',
        position: 'top-right',
        description: '위치정보를 이용한 서비스를 이용시 승인하시면 됩니다.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      setError(err.message)
    } */
  }

  useEffect(() => {
    const { geolocation } = navigator;
    let map: any, infoWindow: any;

    if (!geolocation) {
      setError('Geolocation is not supported.')
      return
    }

    
    geolocation.getCurrentPosition(handleSuccess, handleError, options)
  }, [options])

  return { location, error }
}