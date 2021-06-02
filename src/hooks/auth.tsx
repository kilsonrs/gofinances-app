/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as GoogleAuthentication from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthProviderProps {
  children: ReactNode;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextData {
  user: IUser;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  userStorageLoading: boolean;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState({} as IUser);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const userStorageKey = '@gofinances:user';

  useEffect(() => {
    async function loadUserStorageData() {
      const storageUser = await AsyncStorage.getItem(userStorageKey);
      if (storageUser) setUser(JSON.parse(storageUser!) as IUser);
      setUserStorageLoading(false);
    }
    loadUserStorageData();
  }, []);

  async function signOut() {
    setUser({} as IUser);

    await AsyncStorage.removeItem(userStorageKey);
  }

  async function signInWithGoogle() {
    try {
      const result = await GoogleAuthentication.logInAsync({
        iosClientId:
          '727457708552-71i9pb6lefdusg35srr4vr7paptf2esp.apps.googleusercontent.com',
        androidClientId:
          '727457708552-pugkbnmsoec759dfv1t16k39puc64q17.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        const userLogged = {
          id: String(result.user.id),
          email: result.user.email!,
          name: result.user.name!,
          photo: result.user.photoUrl!,
        };
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
        setUser(userLogged);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const name = credential.fullName!.givenName!;
        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name,
          photo: `https://ui-avatars.com/api/?name=${name}&length=1`,
        };
        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <AuthContext.Provider
      value={
        {
          user,
          signInWithGoogle,
          signInWithApple,
          signOut,
          userStorageLoading,
        } as AuthContextData
      }
    >
      {children}
    </AuthContext.Provider>
  );
}
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  return context;
}
export { AuthProvider, useAuth };
