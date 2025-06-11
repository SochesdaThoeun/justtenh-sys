import { FC, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { LayoutSplashScreen } from '../../../_metronic/layout/core'
import { WithChildren } from '../../../_metronic/helpers'
import { checkToken } from '@/app/redux/auth/auth.slice'
import { fetchSellerInfo } from '@/app/redux/vendor/vendorSlice'
import { AppDispatch } from '@/app/redux/store'

// Only need to handle loading state in the components
const AuthInit: FC<WithChildren> = ({children}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for token in localStorage via Redux
        await dispatch(checkToken());
        await dispatch(fetchSellerInfo());
        // Added test timer delay of 1 second to simulate loading
      } catch (error) {
        console.error(error);
      } finally {
        // Hide the splash screen once initialization is complete.
        setShowSplashScreen(false);
      }
    };

    initAuth();
    // eslint-disable-next-line
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
}

// We don't need AuthProvider anymore since Redux manages all auth state
// Export only the AuthInit component
export { AuthInit }
