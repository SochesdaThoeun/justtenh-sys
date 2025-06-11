/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthResponse } from '../models'
import { authRepository } from './auth.service'
import store from '@/app/redux/store'
import { loginUser, logoutUser } from './auth.slice'

// Get auth from Redux store or repository
const getAuth = (): { api_token: string } | undefined => {
  // Try to get from Redux first
  const state = store.getState();
  const token = state.auth.token;
  
  // Fallback to repository if not in Redux
  if (!token) {
    const repoToken = authRepository.getUserToken();
    if (!repoToken) {
      return undefined;
    }
    return {
      api_token: repoToken
    };
  }
  
  return {
    api_token: token
  };
}

// Set auth in repository and dispatch to Redux if needed
const setAuth = (auth: { api_token: string }) => {
  if (auth && auth.api_token) {
    // This will create a pseudo-response to match the expected format
    const authResponse: AuthResponse = {
      token: auth.api_token,
      user: store.getState().auth.user || {
        id: '',
        name: '',
        email: '',
        role: ''
      }
    };
    
    // Only dispatch if we're not already logged in with this token
    const currentState = store.getState().auth;
    if (!currentState.isLoggedIn || currentState.token !== auth.api_token) {
      store.dispatch(loginUser.fulfilled(authResponse, '', {
        email: '',
        password: ''
      }));
    }
  }
}

// Remove auth from repository and dispatch logout
const removeAuth = () => {
  store.dispatch(logoutUser());
}

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json'
  axios.interceptors.request.use(
    (config: {headers: {Authorization: string}}) => {
      // Get token from Redux state for most current value
      const token = store.getState().auth.token || authRepository.getUserToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (err: any) => Promise.reject(err)
  )
}

export { getAuth, setAuth, removeAuth }
