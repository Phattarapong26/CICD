import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);  // Add user state

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      setToken(storedToken);
      validateToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:3000/api/validate-token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsAuthenticated(response.data.valid);
      if (response.data.valid) {
        setUser(response.data.user);  // Set user data from response
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setIsAuthenticated(false);
      localStorage.removeItem('jwtToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = (newToken: string, userData: any) => {  // Accept user data on login
    localStorage.setItem('jwtToken', newToken);
    setToken(newToken);
    setUser(userData);  // Set user data
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
    setUser(null);  
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, token, user, login, logout };  // Return user
};
