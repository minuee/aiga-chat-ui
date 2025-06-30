import { useEffect, useState } from 'react'

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    let prevHeight = window.innerHeight

    const handleResize = () => {
      const newHeight = window.innerHeight
      const heightDiff = prevHeight - newHeight

      if (heightDiff > 100) {
        // 키보드 올라옴
        setKeyboardHeight(heightDiff)
      } else {
        // 키보드 내려감
        setKeyboardHeight(0)
      }

      prevHeight = newHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return keyboardHeight
}
