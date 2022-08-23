import {FlatList, ToastAndroid} from 'react-native';
import React, {useState} from 'react';
import {
  Text,
  NativeBaseProvider,
  Button,
  FormControl,
  Input,
  Stack,
  Box,
  Heading,
} from 'native-base';
import globalStyles from '../styles/global';
import {gql, useMutation, useQuery} from '@apollo/client';
import Tarea from '../components/Tarea';

const NUEVA_TAREA = gql`
  mutation nuevaTarea($input: TareaInput) {
    nuevaTarea(input: $input) {
      nombre
      id
      proyecto
      estado
    }
  }
`;

const OBTENER_TAREAS = gql`
  query obtenerTareas($input: ProyectoIDInput) {
    obtenerTareas(input: $input) {
      id
      nombre
      estado
    }
  }
`;

const Proyecto = ({route}) => {
  //console.log(route.params);
  const {id} = route.params;

  //STATE del conponente
  const [nombre, setNombre] = useState('');
  const [mensaje, guardarMensaje] = useState(null);

  //Apollo obtener tareas
  const {data, loading, error} = useQuery(OBTENER_TAREAS, {
    variables: {
      input: {
        proyecto: id,
      },
    },
  });

  console.log(data);

  //Apollo crear  tareas
  const [nuevaTarea] = useMutation(NUEVA_TAREA, {
    update(cache, {data: {nuevaTarea}}) {
      const {obtenerTareas} = cache.readQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: id,
          },
        },
      });
      cache.writeQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: id,
          },
        },
        data: {
          obtenerTareas: [...obtenerTareas, nuevaTarea],
        },
      });
    },
  });

  //validar y crear tareas
  const handleSubmit = async () => {
    if (nombre === '') {
      guardarMensaje('El Nombre de la tarea es obligatorio');
      return;
    }

    //almacenarlo en la base de datos
    try {
      const {data} = await nuevaTarea({
        variables: {
          input: {
            nombre,
            proyecto: id,
          },
        },
      });
      setNombre('');
      guardarMensaje('Tarea Creada');
    } catch (error) {
      console.log(error);
    }
  };
  //muestra un mensaje toast
  const showToast = () => {
    console.log('siuuu');
    ToastAndroid.show(mensaje, ToastAndroid.LONG);
  };

  //Si apollo esta consultadndo
  // if (loading)
  // return (
  //   <NativeBaseProvider>
  //     <Text>Cargando...</Text>
  //   </NativeBaseProvider>
  // );
  return (
    <NativeBaseProvider>
      <Box style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
        <FormControl style={{marginTop: 20}}>
          <Stack space={4} w="100%" alignItems="center">
            <Stack style={globalStyles.input}>
              <Input
                w={{
                  base: '95%',
                  md: '25%',
                }}
                placeholder="Nombre Tarea"
                value={nombre}
                onChangeText={texto => setNombre(texto)}
              />
            </Stack>
          </Stack>
          <Button
            style={[globalStyles.boton, {marginHorizontal: '2.5%'}]}
            onPress={() => handleSubmit()}>
            <Text style={globalStyles.botonText}>Crear Tarea</Text>
          </Button>
        </FormControl>
        <Heading style={globalStyles.subTitulo}>
          Tareas: {route.params.nombre}
        </Heading>
        <Box>
          <FlatList
            data={data?.obtenerTareas}
            keyExtractor={item => item.id}
            renderItem={({item}) => <Tarea item={item} proyectoId={id} />}
          />
        </Box>
        {mensaje && showToast()}
      </Box>
    </NativeBaseProvider>
  );
};

export default Proyecto;
