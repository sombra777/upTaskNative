import React from 'react';
import {StyleSheet, FlatList, Text, TouchableOpacity} from 'react-native';
import {
  Box,
  Button,
  Heading,
  Left,
  Right,
  NativeBaseProvider,
} from 'native-base';
import globalStyles from '../styles/global';
import {useNavigation} from '@react-navigation/native';
import {gql, useQuery} from '@apollo/client';
import ListItem from '../components/ListItem';

const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id
      nombre
    }
  }
`;

const Proyectos = () => {
  const navigation = useNavigation();

  //en los mutation son array destructuring pero en las query son object
  const {data, loading, error} = useQuery(OBTENER_PROYECTOS);
  return (
    <NativeBaseProvider>
      <Box style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
        <Button
          style={[globalStyles.boton, {marginTop: 30}]}
          onPress={() => navigation.navigate('NuevoProyecto')}>
          <Text style={globalStyles.botonText}>Nuevo Proyecto</Text>
        </Button>
        <Heading style={globalStyles.subTitulo}>Selecciona un Proyecto</Heading>
        <FlatList
          data={data?.obtenerProyectos}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Proyecto', item)}>
              <ListItem data={item} />
            </TouchableOpacity>
          )}
        />
      </Box>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  contenido: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: '2.5%',
  },
});

export default Proyectos;
