import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {gql, useMutation} from '@apollo/client';

const ACTUALIZAR_TAREA = gql`
  mutation actualizarTarea($id: ID!, $input: TareaInput, $estado: Boolean) {
    actualizarTarea(id: $id, input: $input, estado: $estado) {
      nombre
      id
      proyecto
      estado
    }
  }
`;

const ELIMINAR_TAREA = gql`
  mutation eliminarTarea($id: ID!) {
    eliminarTarea(id: $id)
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

export default function Tarea(props) {
  const {item, proyectoId} = props;
  //Apollo
  const [actualizarTarea] = useMutation(ACTUALIZAR_TAREA);
  const [eliminarTarea] = useMutation(ELIMINAR_TAREA, {
    update(cache) {
      const {obtenerTareas} = cache.readQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: proyectoId,
          },
        },
      });

      cache.writeQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: proyectoId,
          },
        },
        data: {
          obtenerTareas: obtenerTareas.filter(
            tareaActual => tareaActual.id !== item.id,
          ),
        },
      });
    },
  });

  const cambiarEstado = async () => {
    //obtenr el id de la tarea
    const {id} = item;
    console.log(id);
    console.log(!item.estado);
    try {
      const {data} = await actualizarTarea({
        variables: {
          id,
          input: {
            nombre: item.nombre,
          },
          estado: !item.estado,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Dialogo para mostrar cuando se elimina una tarea
  const mostrarEliminar = async () => {
    Alert.alert('Eliminar tarea', 'Deseas eliminar esta tarea?', [
      {text: 'Cancelar', style: 'cancel'},
      {text: 'OK', onPress: () => eliminarTareaDB()},
    ]);
  };

  //Eliminar de la base de datos
  const eliminarTareaDB = async () => {
    const {id} = item;

    try {
      const {data} = await eliminarTarea({
        variables: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TouchableOpacity
      onPress={() => cambiarEstado()}
      onLongPress={() => mostrarEliminar()}>
      <View style={styles.item}>
        <Text style={styles.text}>{item.nombre}</Text>
        {item.estado ? (
          <Icon style={styles.completo} name="check-circle" size={32} />
        ) : (
          <Icon name="check-circle" size={32} style={styles.incompleto} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    marginHorizontal: '2.5%',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#d4d4d4',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  completo: {
    color: 'green',
  },
  incompleto: {
    color: '#E1E1E1',
  },
});
