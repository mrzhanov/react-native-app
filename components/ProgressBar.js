import React, { useState } from 'react'
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SectionTab({selectedSection,setSelectedSection}) {
    const [modalVisible, setModalVisible] = useState(false);
    const sections = ['Спорт питание', 'Беговой', 'Бокс', 'Спорт Аксессуары'];
  
    return (
    <View>

    <Button title="Выбрать раздел" onPress={() => setModalVisible(true)} />
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
     
      {selectedSection && <Text style={{margin:5}}>Выбран раздел: {selectedSection}</Text>}
      </View>
  
  )
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