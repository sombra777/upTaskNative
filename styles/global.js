import {StyleSheet} from 'react-native';

const globalStyles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subTitulo: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  contenido: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: '2.5%',
    flex: 1,
  },
  input: {
    backgroundColor: '#FFF',
    marginBottom: 20,
  },
  boton: {
    backgroundColor: '#28303B',
  },
  botonText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#fff',
  },
  enlace: {
    color: '#FFF',
    marginTop: 60,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
});

export default globalStyles;
