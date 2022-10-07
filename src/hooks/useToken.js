import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const userToken = JSON.parse(localStorage.getItem('token'));
    return userToken?.access_token
  }

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken?.access_token);
  };

  return {
    setToken: saveToken,
    token
  }
}