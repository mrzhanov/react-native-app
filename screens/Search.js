import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../services/firebase.service';
import { collection, getDocs } from 'firebase/firestore';
import { CameraView } from 'expo-camera';
import { playSound, playSoundError } from '../constants/constants';
import SectionTab from '../components/ProgressBar';
import Modall from '../components/Modall';


export default function Search() {
  const [search, setSearch] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleView, setModalVisibleView] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [cart, setCart] = useState([]);
 const [scanning,setScanning]= useState(false)
 const [trash,setTrash] = useState([])
 const [selectedSection, setSelectedSection] = useState(null);
 const [totalPrice, setTotalPrice] = useState(0);

 useEffect(() => {
   calculateTotal();
 }, [trash]);

 const calculateTotal = () => {
   let price = 0;
   trash.forEach(item => {
     price += parseFloat(Number(item.price)) * item.quantity; // Умножаем цену на количество товаров
   });
   setTotalPrice(price);
 };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    searchTodos();
  }, [search, allProducts]);

  const sections = ['Спорт питание', 'Беговой', 'Бокс', 'Спорт Аксессуары'];
  

  const fetchAllProducts = async () => {
    // Получаем все товары из базы данных
    const todosCollection = await getDocs(collection(db, 'products'));
    const todosData = todosCollection.docs.map(doc => ({ id: doc.id, docId: doc.id, ...doc.data() }));
    setAllProducts(todosData);
  };
  const handleBarCodeScanned = async ({ data }) => {
    setScanning(false);
    const existingTodo = todos.find((todo) => todo.id === data);
    const existingItem = trash.find((existingItem) => existingItem.id === data);
  
    if (existingItem) {
      playSound();
      const updatedTrash = trash.map((trashItem) =>
        trashItem.id === data ? { ...trashItem, quantity: trashItem.quantity + 1 } : trashItem
      );
      setTrash(updatedTrash);
    } else if (existingTodo) {
      playSound();
      setTrash((prev) => [...prev, { ...existingTodo, quantity: 1 }]);
    } else {
      Alert.alert('Товар не найден');
      playSoundError()
    }
  };
  
  const addToTrash = (item) => {
    // Проверяем, есть ли товар уже в корзине
    const existingItem = trash.find((existingItem) => existingItem.id === item.id);
    if (existingItem) {
      playSound()
      // Если товар уже есть в корзине, увеличиваем его количество на 1
      const updatedTrash = trash.map((trashItem) =>
        trashItem.id === item.id ? { ...trashItem, quantity: trashItem.quantity + 1 } : trashItem
      );
      setTrash(updatedTrash);
    } else {
      playSound()
      // Если товара нет в корзине, добавляем его с начальным количеством 1
      setTrash([...trash, { ...item, quantity: 1 }]);
    }
  };
  const decreaseQuantity = (itemId) => {
    const updatedTrash = trash.map((item) =>
      item.id === itemId && item.quantity > 0
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setTrash(updatedTrash);
  };
  
  const searchTodos = () => {
    // Если есть текст поиска, фильтруем товары
    if (search) {
      const filteredTodos = allProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) && !product.deleted
      );
      setTodos(filteredTodos);
    } else {
      // Если поиск пуст, отображаем все товары (невыполненные и удаленные)
      const filteredTodos = allProducts.filter(product => !product.deleted);
      setTodos(filteredTodos);
    }
  };

  const deleteFull = (itemId) => {
    const updatedTrash = trash.filter((item) => item.id !== itemId);
    setTrash(updatedTrash);
  };

  return (
    <View style={styles.container}>

      <TextInput
        value={search}
        placeholder="Название товара"
        style={styles.input}
        
        onChangeText={text => setSearch(text)}
      />
      <TouchableOpacity onPress={() =>{
        setScannerVisible(true)
        setScanning(true)
      }} style={styles.scanButton}>
        <Text style={{ color: 'white' }}>Сканировать QR-код</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.trashInput}>
        <Text style={{ color: 'white' }}>Открыть счет</Text>
      </TouchableOpacity>
      <SectionTab 
        setSelectedSection={setSelectedSection}
        selectedSection={selectedSection}
        
        />
        
      <FlatList
        style={{ marginTop: 15 }}
        data={todos}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} onLongPress={()=> {
            setCart(item)
            setModalVisibleView(true)
            }} style={styles.todoItem}>
            <Image source={{ uri: item.imageurl }} style={styles.image} />
            <Text style={styles.productName}>{`Название: ${item.name}`}</Text>
            <Text style={styles.productPrice}>{`Цена: ${item.price}`}</Text>
            <Text style={styles.productDate}>{`${new Date(item?.date?.seconds * 1000).toLocaleString()}`}</Text>
            <Button onPress={() =>addToTrash(item)} title='Добавить в счет'/>
            
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      
      <Modall 
      setModalVisibleView={setModalVisibleView}
       modalVisibleView={modalVisibleView} 
       cart={cart}
       />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
        <FlatList
        style={{ marginTop: 15 }}
        data={trash}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} style={styles.todoItemModal}>
            <Image source={{ uri: item.imageurl }} style={styles.modalImage} />
            <View>
            <Text style={styles.productName}>{`Название: ${item.name}`}</Text>
            <Text style={styles.productPrice}>{`Описание: ${item.desc}`}</Text>
            <Text style={styles.productPrice}>{`Цена: ${item.price}`}</Text>
            <Text style={styles.productPrice}>{`Цена в оптом: ${item.priceWhole}`}</Text>
            <Text style={styles.productDesc}>{`Количество: ${item.quantity}`}</Text>
            <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
          <Text style={styles.productQuantity}>Уменьшить</Text>
            </TouchableOpacity>
            
            </View>
            
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
       <View style={styles.totalContainer}>
      </View>
      <Text style={styles.totalText}>{`Общая цена: ${totalPrice} Сом`}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFull()}>
        <Text style={styles.deleteButtonText}>Удалить все</Text>
      </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={scanning}
        onRequestClose={() => setScannerVisible(false)}
      >
         {scanning && (<CameraView
                style={styles.camera}
                onBarcodeScanned={handleBarCodeScanned}
                facing="back"
              />)}
              <Button onPress={() => setScanning(false)} title='закрыть'/>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  productQuantity:{
    fontSize:20,
  },
  todoItemModal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
  },
  totalContainer: {
    marginTop: 20,
    
    alignItems: 'center',
  },
  totalText: {
    backgroundColor:'white',
    fontSize: 18,
    padding:20,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  scanButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  trashInput: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  todoItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  todoItemModal: {
    flexDirection:'row',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  modalImage:{
    width:200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    marginRight:10,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
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
    marginBottom:10,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 20,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  buttonTouchable: {
    padding: 16,
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
});
