import React from 'react';
import { View, Text, Modal, Button, FlatList, StyleSheet, Image } from 'react-native';

export default function TrashModal({ visible, todos,closeTrashModal,deleteFull, restoreTodo }) {
    return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Корзина</Text>
          <FlatList
            data={todos}
            renderItem={({ item }) => (
              <View style={styles.trashItem}>
                <Image src={item.imageurl} style={{width:200,height:200}}/>
                <Text>{`название: ${item.name} Цена ${item.price}`}</Text>
              <View style={styles.trashButton}>
                <Button title="Восстановить" onPress={() => restoreTodo(item.docId)} />
               <Button title="удалить навсегда" onPress={() => deleteFull(item.docId,item.imageurl)} />
              </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <Button title="Закрыть" onPress={() => closeTrashModal()} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  trashButton:{
    width:'80%',
    display:'flex',
    gap:4,
  },
  modal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  trashItem: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
