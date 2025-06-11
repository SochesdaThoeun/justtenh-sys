import React, {FC, useEffect, PropsWithChildren} from 'react'

const MetronicSplashScreenProvider: FC<PropsWithChildren> = ({children}) => {
  return <>{children}</>
}

const LayoutSplashScreen: FC<{visible?: boolean}> = ({visible = true}) => {
  useEffect(() => {
    if (visible) {
      //document.body.classList.remove('page-loading')
    } else {
      document.body.classList.add('page-loading')
    }
    return () => {
      //document.body.classList.remove('page-loading')
    }
  }, [visible])

  return null
}

export {MetronicSplashScreenProvider, LayoutSplashScreen}
