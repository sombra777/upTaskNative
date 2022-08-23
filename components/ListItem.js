import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

export default function ListItem(props) {
  const {data} = props;
  console.log(data);
  return (
    <View style={styles.item}>
      <Text style={styles.text}>{data.nombre}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    marginHorizontal: '2.5%',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#d4d4d4',
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
});
