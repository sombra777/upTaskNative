import React, {useState} from 'react';
import {View, ToastAndroid} from 'react-native';
import {
  Box,
  Button,
  Text,
  Heading,
  Input,
  FormControl,
  Stack,
  NativeBaseProvider,
} from 'native-base';
import globalStyles from '../styles/global';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import {gql, useMutation} from '@apollo/client';

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticaInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [mensaje, guardarMensaje] = useState(null);

  const navigation = useNavigation();
  const [show, setShow] = useState(false);

  //Mutation de apollo
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  //cuando el Usuario presione en iniciar sesion
  const handleSubmit = async () => {
    if (email === '' || password === '') {
      //Mostrar un error
      guardarMensaje('Todos los campos son obligatorios');

      return;
    }

    try {
      //autenticar usuario
      const {data} = await autenticarUsuario({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
      const {token} = data.autenticarUsuario;
      //Colocar token en el storage
      await AsyncStorage.setItem('token', token);

      //Redireccionar a proyectos
      navigation.navigate('Proyectos');
    } catch (error) {
      guardarMensaje(error.message.replace('GrapgQL error: ', ''));
    }
  };

  //muestra un mensaje toast
  const showToast = () => {
    console.log('siuuu');
    ToastAndroid.show(mensaje, ToastAndroid.LONG);
  };

  return (
    <NativeBaseProvider>
      <Box style={[{backgroundColor: '#e84347'}, globalStyles.contenedor]}>
        <View style={globalStyles.contenido}>
          <Heading style={globalStyles.titulo}>UpTask</Heading>
          <FormControl>
            <Stack space={4} w="100%" alignItems="center">
              <Stack style={globalStyles.input}>
                <Input
                  w={{
                    base: '95%',
                    md: '25%',
                  }}
                  placeholder="Email"
                  onChangeText={texto => setEmail(texto)}
                  value={email}
                />
              </Stack>
              <Stack style={globalStyles.input}>
                <Input
                  w={{
                    base: '95%',
                    md: '25%',
                  }}
                  type={show ? 'text' : 'password'}
                  placeholder="Password"
                  onChangeText={texto => setPassword(texto)}
                />
              </Stack>
            </Stack>
          </FormControl>
          <Button style={globalStyles.boton} onPress={() => handleSubmit()}>
            <Text style={globalStyles.botonText}>Iniciar sesión</Text>
          </Button>
          <Text
            style={globalStyles.enlace}
            onPress={() => navigation.navigate('CrearCuenta')}>
            Crear Cuenta
          </Text>
        </View>
        {mensaje && showToast()}
      </Box>
    </NativeBaseProvider>
  );
};

export default Login;
