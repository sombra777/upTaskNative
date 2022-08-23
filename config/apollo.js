import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import {setContext} from 'apollo-link-context';

import {Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const httpLink = createHttpLink({
  uri:
    Platform.OS === 'ios' ? 'http://localhost:4000/' : 'http://10.0.2.2:4000/',
});

const authLink = setContext(async (_, {headers}) => {
  //leer token
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default client;
