import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const UserDataScreen = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedPassword, setEditedPassword] = useState('');
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const tableHead = ['ID', 'First Name', 'Last Name', 'Email', 'Contact', 'Action'];

  useEffect(() => {
    axios
      .get('http://192.168.0.145/tasks/api/Patient_L/GetUser')
      .then((response) => {
        if (response.data && response.data.result) {
          setUserData(response.data.result);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (userData.length > 0) {
      const data = userData.map((user) => [
        user.user_ID.toString(),
        user.first_Name,
        user.last_Name,
        user.user_Email,
        user.user_Contact,
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => handleEdit(user)}>
            <Text>
              <Icon name="pencil" size={18} color="purple" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(user)}>
            <Text>
              <Icon name="trash" size={18} color="red" />
            </Text>
          </TouchableOpacity>
        </View>,
      ]);
      setTableData(data);
    }
  }, [userData]);

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setEditedPassword(user.user_Password);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingUser) {
      const payload = {
        ...editingUser,
        user_Password: editedPassword || editingUser.user_Password,
      };

      axios
        .put(`http://192.168.0.145/tasks/api/Patient_L/UpdateUser?user_ID=${editingUser.user_ID}`, payload)
        .then((response) => {
          if (response.status === 200) {
            alert('User Updated Successfully!');
            setEditModalVisible(false);
            setEditingUser(null);
            refreshUserData();
          } else {
            console.error('Error updating data:', response.data.message);
          }
        })
        .catch((error) => {
          console.error('Error updating data:', error);
        });
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingUser(null);
  };

  const handleDelete = (user) => {
    setDeletingUser(user);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (deletingUser) {
      axios
        .delete(`http://192.168.0.145/tasks/api/Patient_L/DeleteUser?user_ID=${deletingUser.user_ID}`)
        .then((response) => {
          if (response.status === 200) {
            alert('User Deleted Successfully!');
            setDeleteModalVisible(false);
            refreshUserData();
          } else {
            console.error('Error deleting data:', response.data.message);
          }
        })
        .catch((error) => {
          console.error('Error deleting data:', error);
        });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeletingUser(null);
  };

  const refreshUserData = () => {
    axios
      .get('http://192.168.0.145/tasks/api/Patient_L/GetUser')
      .then((response) => {
        if (response.data && response.data.result) {
          setUserData(response.data.result);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>User Login Data</Text>
      <Table borderStyle={{ borderWidth: 1, borderColor: 'lightblue' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.headText} />
        <Rows data={tableData} textStyle={styles.rowText} />
      </Table>
      <TouchableOpacity onPress={() => navigation.navigate('Appointments')} style={styles.viewAppointmentsButton}>
        <Text style={styles.buttonText}>View Appointments</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Edit User Data:</Text>
            <TextInput
              placeholder="First Name"
              value={editingUser ? editingUser.first_Name : ''}
              onChangeText={(text) => setEditingUser({ ...editingUser, first_Name: text })}
              style={styles.inputField}
            />
            <TextInput
              placeholder="Last Name"
              value={editingUser ? editingUser.last_Name : ''}
              onChangeText={(text) => setEditingUser({ ...editingUser, last_Name: text })}
              style={styles.inputField}
            />
            <TextInput
              placeholder="Email"
              value={editingUser ? editingUser.user_Email : ''}
              onChangeText={(text) => setEditingUser({ ...editingUser, user_Email: text })}
              style={styles.inputField}
            />
            <TextInput
              placeholder="Contact"
              value={editingUser ? editingUser.user_Contact : ''}
              onChangeText={(text) => setEditingUser({ ...editingUser, user_Contact: text })}
              style={styles.inputField}
            />
            <TextInput
              placeholder="Password"
              value={editedPassword}
              onChangeText={(text) => setEditedPassword(text)}
              secureTextEntry
              style={styles.inputField}
            />
            <TouchableOpacity onPress={handleSaveEdit} style={styles.saveButton}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Confirm Deletion</Text>
            <Text>{deletingUser ? `Are you sure you want to delete ${deletingUser.first_Name}?` : ''}</Text>
            <TouchableOpacity onPress={confirmDelete} style={styles.saveButton}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelDelete} style={styles.cancelButton}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 60, backgroundColor: '#f1f8ff' },
  headText: { fontWeight: 'bold', marginLeft: 6, fontSize: 12, color:'purple' },
  rowText: { margin: 6, textAlign: 'center', fontSize: 10, textAlign: 'center' },
  title: { fontSize: 25, textAlign: 'center', marginBottom: 20 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  inputField: {
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  viewAppointmentsButton: {
    backgroundColor: 'purple',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 30,
  },
});

export default UserDataScreen;
