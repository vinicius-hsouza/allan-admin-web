import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  phone: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

type Props = {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: Props): JSX.Element {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@AllanHebert:token');
    const user = localStorage.getItem('@AllanHebert:user');


    if (token && user) {
      api.defaults.headers.common['authorization'] = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signOut = useCallback(() => {
    localStorage.removeItem('@AllanHebert:token');
    localStorage.removeItem('@AllanHebert:user');

    setData({} as AuthState);
  }, []);

  const signIn = useCallback(async ({ phone, password }: any) => {
    const response = await api.post('sessions', {
      phone,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@AllanHebert:token', token);
    localStorage.setItem('@AllanHebert:user', JSON.stringify(user));

    api.defaults.headers.common['authorization'] = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@AllanHebert:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
