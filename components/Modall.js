import React from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Modall({ cart, modalVisibleView, setModalVisibleView }) {
  console.log(cart.imageurl);
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleView}
        onRequestClose={() => setModalVisibleView(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Image source={{ uri: cart.imageurl }} style={{ width: '100%', height: 500, borderRadius: 10, paddingTop: 10 }} />
              <Text style={styles.productName}>{'Название: ' + cart.name}</Text>
              <Text style={styles.productName}>{'Описание: ' + cart.desc}</Text>
              <Text style={styles.productPrice}>{"Цена в шт: " + cart.price}</Text>
              <Text style={styles.productPrice}>{'Цена оптом: ' + cart.priceWhole}</Text>
              <Text style={styles.productDate}>{`${new Date(cart?.date?.seconds * 1000).toLocaleString()}`}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalContent: {
    flex: 1,
    width: '100%',
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    backgroundColor: 'white',
  },
  sectionButton: {
    marginBottom: 5,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  productName: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    marginBottom: 5,
  },
  productDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  todoItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  camera: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'blue',
    padding: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    resizeMode: 'cover',
  },
});
