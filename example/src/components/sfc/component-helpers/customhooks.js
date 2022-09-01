import { useState, useEffect } from 'react'

function useCanNativeLazyLoad() {
  const [canNativeLazyload, setCanNativeLazyload] = useState('pending')

  useEffect(() => {
    if ('loading' in HTMLImageElement.prototype) {
      setCanNativeLazyload(true)
    } else {
      setCanNativeLazyload(false)
    }
  }, [])

  return canNativeLazyload
}

export { useCanNativeLazyLoad }
