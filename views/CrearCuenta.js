import React, {useState} from 'react';
import {View} from 'react-native';
import {
  Box,
  Button,
  Text,
  Heading,
  Input,
  FormControl,
  Stack,
  useToast,
  NativeBaseProvider,
} from 'native-base';
import globalStyles from '../styles/global';
import {useNavigation} from '@react-navigation/native';

//Apollo
import {gql, useMutation} from '@apollo/client';

const NUEVA_CUENTA = gql`
  mutation crearUsuario($input: UsuarioInput) {
    crearUsuario(input: $input)
  }
`;

const CrearCuenta = () => {
  //Satate del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [mensaje, guardarMensaje] = useState(null);

  const navigation = useNavigation();

  //Mutation de apollos
  const [crearUsuario] = useMutation(NUEVA_CUENTA);

  const toast = useToast();
  //cuando el usuario presione crear cuenta
  const handleSUmbit = async () => {
    //validar
    if (nombre === '' || email === '' || password === '') {
      //Mostrar un error
      guardarMensaje('Todos los campos son obligatorios');

      return;
    }
    //password almenos 6 caracteres

    //guardar usuario
    try {
      const {data} = await crearUsuario({
        variables: {
          input: {
            nombre,
            email,
            password,
          },
        },
      });
      guardarMensaje(data.crearUsuario);
      navigation.navigate('Login');
    } catch (error) {
      guardarMensaje(error.message.replace('GrapQL error:', ''));
    }
  };

  //muestra un mensaje toast
  const mostrarAlerta = () => {
    console.log('desde Mostar alerta');
    toast.show({
      description: mensaje,
      buttonText: 'OK',
      duration: 5000,
    });
  };

  const [show, setShow] = React.useState(false);
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
                  placeholder="Nombre"
                  onChangeText={texto => setNombre(texto)}
                />
              </Stack>
              <Stack style={globalStyles.input}>
                <Input
                  w={{
                    base: '95%',
                    md: '25%',
                  }}
                  placeholder="Email"
                  onChangeText={texto => setEmail(texto)}
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
          <Button style={globalStyles.boton} onPress={() => handleSUmbit()}>
            <Text style={globalStyles.botonText}>Crear Cuenta</Text>
          </Button>
          {mensaje && mostrarAlerta()}
        </View>
      </Box>
    </NativeBaseProvider>
  );
};

export default CrearCuenta;
