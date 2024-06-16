import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, Modal, Pressable, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import TrashModal from './TrashModal';
import moment from 'moment/moment';
import { db, storage,ref } from '../services/firebase.service';
import { CameraView } from 'expo-camera';
import { deleteObject, getDownloadURL, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';
import defaultImage, { playSound } from '../constants/constants';
export default function Scanner() {
  const [todos, setTodos] = useState([]);
  const cameraRef = useRef(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [cameraVisible, setCameraVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [image, setimage] = useState('');
  const [photo,setPhoto] = useState(false)
  const [editedTodo, setEditedTodo] = useState({})
  const [trashModalVisible, setTrashModalVisible] = useState(false);
  // Добавьте функцию для открытия и закрытия модального окна корзины
  const openTrashModal = () => {
    setTrashModalVisible(true);
  };
  const sections = ['Спорт питание', 'Беговой', 'Бокс', 'Спорт Аксессуары'];
  
  const closeTrashModal = () => {
    setTrashModalVisible(false);
  };
  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    checkForExpiredDeletes();
  }, [todos]);
  const isFormValid =  selectedSection && photo 

  const fetchTodos = async () => {
    const todosCollection = await getDocs(collection(db, 'products'));
    const todosData = todosCollection.docs.map(doc => ({ id: doc.id, docId: doc.id, ...doc.data() }));
    setTodos(todosData);
  };

  const closeScanner = () => {
    setScanning(false);
    setScannedData('');
  };
  const takePhoto = async () => {
    setCameraVisible(true);
  };
  const handleBarCodeScanned = async ({ data }) => {
    setScanning(false);
    setScannedData(data);
    const existingTodo = todos.find(todo => todo.id === data);
    if (existingTodo) {
      setEditedTodo(existingTodo);
      setEditModalVisible(true);

    playSound()

    } else {
      const newTodo = {
        id: data,
        name: '',
        price: '',
        imageurl:'',
        priceWhole: '',
        desc: '',
        selectedSection:sections,
        date: new Date(),
        deleted: false,
        deletedAt: null,

      };
      const docRef = await addDoc(collection(db, 'products'), newTodo);
      fetchTodos()
    playSound()
      ;
      setEditedTodo({ ...newTodo, docId: docRef.id });
    }
  };
  const capturePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCameraVisible(false);
      uploadPhoto(photo.uri);
      setimage(photo.uri)
    }
  };

  const uploadPhoto = async (uri) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }], // You can adjust the width as needed
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    try {
      const blob = await new Promise((resolve,reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => {
          resolve(xhr.response)
        }
        xhr.onerror = (e) =>{
          reject(new TypeError('NetWork request Failed'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET',manipulatedImage.uri,true)
        xhr.send(null)

        })
        const metadata = {
          contentType: 'image/jpeg'
        };
        const storageRef = ref(storage, 'images/' + Date.now());
const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        console.log(error.message);
        break;
      case 'storage/canceled':
        // User canceled the upload
        console.log(error);
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setEditedTodo((prev) => ({...prev,imageurl:downloadURL}))
      console.log('File available at', downloadURL);
      Alert.alert('фото загрузилось')
      console.log(editedTodo);
      setPhoto(true)
      
    });
  }
);

    } catch (error) {
      console.error(error)

    }

  };

  const restartScanner = () => {
    setScanning(true);
    setScannedData('');
  };

  const openEditModal = (todo) => {
    console.log(todo);
    setEditedTodo(todo);
    setEditModalVisible(true);
  };

  const saveEditedTodo = async () => {
    const updatedTodos = todos.map(todo => (todo.id === editedTodo.id ? editedTodo : todo));
  
    setTodos(updatedTodos);
    setEditModalVisible(false);

    const todoRef = doc(db, 'products', editedTodo.docId);
    
    await updateDoc(todoRef, editedTodo);
    fetchTodos();

  };

  const deleteTodo = async (id) => {
    const todoRef = doc(db, 'products', id);
    await updateDoc(todoRef, { deleted: true, deletedAt: new Date() });
    fetchTodos();
  };

 const deleteFull = async (id,imageurl) => {
  const storageRef = ref(storage, imageurl);
    await deleteObject(storageRef);
    console.log('Photo deleted successfully');
  const todoRef = doc(db, 'products', id);
await deleteDoc(todoRef).then(()=>Alert.alert('Успешно удален'))
fetchTodos()
 }

  const restoreTodo = async (id) => {
    const todoRef = doc(db, 'products', id);
    await updateDoc(todoRef, { deleted: false, deletedAt: null });
    fetchTodos();
  };

  const checkForExpiredDeletes = async () => {
    const now = new Date();
    const expiredTodos = todos.filter(todo => todo.deleted && (now - new Date(todo.deletedAt)) > 3 * 30 * 24 * 60 * 60 * 1000);
    for (let todo of expiredTodos) {
      const todoRef = doc(db, 'products', todo.docId);
      await deleteDoc(todoRef)
    }
  };

  const renderDeleteButtons = (item) => {
    if (item.deleted) {
      return (
        <>
          <Button title="Восстановить" onPress={() => restoreTodo(item.id)} />

        </>
      );
    } else {
      return (
        <Button title="Удалить" onPress={() => deleteTodo(item.docId)} />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginBottom:10}}>
  
        <Button title="Открыть корзину" onPress={openTrashModal} />
      </View>
  <TrashModal
  closeTrashModal={closeTrashModal}
    visible={trashModalVisible}
    todos={todos.filter(todo => todo.deleted)}
    deleteFull={deleteFull}
    restoreTodo={restoreTodo} // Передайте функцию для восстановления товара
  />

      <Button title="Открыть камеру" onPress={restartScanner} />
      <FlatList
        style={{ marginTop: 15 }}
        data={todos.filter(product => product.deleted == false)}
        renderItem={({ item }) => (
          
          <TouchableOpacity key={item.id} onPress={() => openEditModal(item)} style={styles.todoItem}>
               <Image
        src={item.imageurl}
        style={{ width:'auto', height: 300 ,borderRadius:10}}
        />

            <Text style={{fontSize:20,fontWeight:'bold',marginTop:10,}}>{`${item.name}`}</Text>
            <Text style={styles.productDate}>{`${new Date(item.date.seconds * 1000).toLocaleString()}`}</Text>

            {renderDeleteButtons(item)}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={scanning}
        onRequestClose={() => setScanning(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            {scanning && (
              <CameraView
                style={styles.camera}
                onBarcodeScanned={handleBarCodeScanned}
                facing="back"
              />
            )}
            <Pressable style={styles.button} onPress={closeScanner}>
              <Text style={styles.buttonText}>Закрыть сканер</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Редактировать задачу</Text>
            <TextInput
              style={styles.input}
              placeholder="название товара"
              value={editedTodo.name}
              onChangeText={(text) => setEditedTodo(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="цена"
              value={editedTodo.price}
        keyboardType='numeric'

              onChangeText={(text) => setEditedTodo(prev => ({ ...prev, price: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Цена оптом"
        keyboardType='numeric'

              value={editedTodo.priceWhole}
              onChangeText={(text) => setEditedTodo(prev => ({ ...prev, priceWhole: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Описание"
              value={editedTodo.desc}
              onChangeText={(text) => setEditedTodo(prev => ({ ...prev, desc: text }))}
            />
            
           <Button title="Выбрать раздел" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Выберите раздел</Text>
            {sections.map((section, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sectionButton}
                onPress={() => {
                  setSelectedSection(section);
                  setModalVisible(false);
                }}
              >
                <Text style={{fontSize:30}}>{section}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      </Modal>
      <View style={{width:'100%'}}>
      {selectedSection && <Text style={{margin:5}}>Выбран раздел: {selectedSection}</Text>}
{editedTodo?.imageurl && <Image style={{width:'100%',height:300}} src={editedTodo.imageurl}/>}
      </View>
             <Modal
        animationType="slide"
        transparent={true}
        visible={cameraVisible}
        onRequestClose={() => setCameraVisible(false)}
      >
        <CameraView
          style={{flex:1}}
          facing="back"
          ref={cameraRef}
        >
          <View style={styles.cameraContainer}>
            <TouchableOpacity onPress={capturePhoto} style={styles.cameraButton}>
              <Text style={styles.cameraButtonText}>Сделать фото</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
     
      </Modal>
              <View style={{paddingBottom:10}}>
            <Button title="Снять фото" onPress={takePhoto} />
              </View>
            <Button title="Сохранить" onPress={saveEditedTodo}  disabled={!isFormValid} />
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
  cameraContainer:{
    display:'flex',
    alignItems:'center',
    justifyContent:'flex-end',
    height:'100%',
  },cameraButton:{
backgroundColor:'blue',
  height:50,
  justifyContent:'center',
width:'100%'
  },
  cameraButtonText:{
  textAlign:'center',
    fontSize:30
},
  title: {
    
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalContent:{
    flex:1,
    width:'100%',
    paddingLeft:10,
    paddingRight:10,
    backgroundColor:'white',
  },
  sectionButton:{
    marginBottom:5,
    borderColor:'black',
    borderRadius:10,
    borderWidth:1,
    padding:10,
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
    paddingTop: 100,
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
