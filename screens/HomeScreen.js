import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
    
  return (
    <View style={styles.container}>
      <Button
      
        title="Сканировать"
        onPress={() => navigation.navigate('Scanner')}
      />
      <View style={{marginTop:10}}>
      <Button
      
      title="Добавить товар"
      onPress={() => navigation.navigate('AddProduct')}
      />
      </View>
      <View style={{marginTop:10}}>
      <Button
      
      title="Поиск"
      onPress={() => navigation.navigate('Search')}
      />
      </View>
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:20,
},
});
