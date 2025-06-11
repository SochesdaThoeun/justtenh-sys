import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/app/redux/auth/auth.slice';
import { Navigate } from 'react-router-dom';

export function Logout() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(logoutUser() as any);
  }, [dispatch]);
  
  return <Navigate to='/auth/login' />;
}
