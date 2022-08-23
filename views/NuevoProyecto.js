import React, {useState} from 'react';
import {View, ToastAndroid} from 'react-native';
import {
  Text,
  NativeBaseProvider,
  Button,
  Heading,
  FormControl,
  Input,
  Stack,
  Box,
} from 'native-base';
import globalStyles from '../styles/global';
import {useNavigation} from '@react-navigation/native';
import {gql, useMutation} from '@apollo/client';

const NUEVO_PROYECTO = gql`
  mutation nuevoProyecto($input: ProyectoInput) {
    nuevoProyecto(input: $input) {
      nombre
      id
    }
  }
`;

const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id
      nombre
    }
  }
`;

const NuevoProyecto = () => {
  const navigation = useNavigation();

  const [mensaje, guardarMensaje] = useState(null);
  const [nombre, setNombre] = useState('');

  //Apollo
  const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
    update(cache, {data: {nuevoProyecto}}) {
      const {obtenerProyectos} = cache.readQuery({query: OBTENER_PROYECTOS});
      cache.writeQuery({
        query: OBTENER_PROYECTOS,
        data: {obtenerProyectos: obtenerProyectos.concat([nuevoProyecto])},
      });
    },
  });

  const handleSubmit = async () => {
    //validar crear proytecto
    if (nombre === '') {
      guardarMensaje('El nombre del Proyecto es Obligatorio');
      return;
    }

    //Guardar el proyecto en la base de datos
    try {
      const {data} = await nuevoProyecto({
        variables: {
          input: {
            nombre,
          },
        },
      });
      //console.log(data);
      guardarMensaje('Proyecto Creado Correctamente');
      navigation.navigate('Proyectos');
    } catch (error) {
      //console.log(error);
      guardarMensaje(error.message.replace('GraphQL error:', ''));
    }
  };

  //muestra un mensaje toast
  const showToast = () => {
    console.log('siuuu');
    ToastAndroid.show(mensaje, ToastAndroid.LONG);
  };

  return (
    <NativeBaseProvider>
      <Box style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
        <View style={globalStyles.contenido}>
          <Heading style={globalStyles.subTitulo}>Nuevo Proyecto</Heading>

          <FormControl>
            <Stack space={4} w="100%" alignItems="center">
              <Stack style={globalStyles.input}>
                <Input
                  w={{
                    base: '95%',
                    md: '25%',
                  }}
                  placeholder="Nombre del Proyecto"
                  onChangeText={texto => setNombre(texto)}
                />
              </Stack>
            </Stack>
          </FormControl>
          <Button
            style={[globalStyles.boton, {marginTop: 30}]}
            onPress={() => handleSubmit()}>
            <Text style={globalStyles.botonText}>Crear Proyecto</Text>
          </Button>

          {mensaje && showToast()}
        </View>
      </Box>
    </NativeBaseProvider>
  );
};

export default NuevoProyecto;
