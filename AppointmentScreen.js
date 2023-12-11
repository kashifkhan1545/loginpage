import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const AppointmentScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const tableHead = ['ID', 'Patient Name', 'Doctor Name', 'Status', 'Date Time', 'Actions'];
  const tableWidths = [30, 55, 65, 50, 90, 60];

  useEffect(() => {
    axios
      .get('http://192.168.0.145/tasks/api/Appoinment_Schedule/GetUser')
      .then((response) => {
        if (response.data && response.data.result) {
          setAppointments(response.data.result);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      const data = appointments.map((appointment) => [
        appointment.user_ID.toString(),
        appointment.patient_Name,
        appointment.doctor_Name,
        appointment.appointment_Status,
        formatDateAndTime(appointment.appoinment_Date_Time),
        appointmentActions(appointment),
      ]);
      setTableData(data);
    }
  }, [appointments]);

  const formatDateAndTime = (dateTimeString) => {
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric' };

    const datePart = new Date(dateTimeString).toLocaleDateString(undefined, optionsDate);
    const timePart = new Date(dateTimeString).toLocaleTimeString(undefined, optionsTime);

    return `${datePart} ${timePart}`;
  };

  const appointmentActions = (appointment) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity onPress={() => handleEdit(appointment)}>
        <Icon name="check" size={20} color="purple" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(appointment)}>
        <Icon name="trash" size={20} color="red" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setUpdatedStatus(appointment.appointment_Status);
    setSelectedDate(new Date(appointment.appoinment_Date_Time));
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingAppointment) {
      const formattedDateTime = moment(selectedDate).format('YYYY-MM-DDTHH:mm:ss');

      const payload = {
        user_ID: editingAppointment.user_ID,
        patient_Name: editingAppointment.patient_Name,
        doctor_Name: editingAppointment.doctor_Name,
        appointment_Status: updatedStatus || editingAppointment.appointment_Status,
        appoinment_Date_Time: formattedDateTime,
      };

      axios
        .put(`http://192.168.0.145/tasks/api/Appoinment_Schedule/UpdateUser?serial_No=${editingAppointment.serial_No}`, payload)
        .then((response) => {
        
        
          if (response.data && response.data.result) {
            Alert.alert('Updated', 'Appointment Updated Successfully!');
            setEditModalVisible(false);
            setEditingAppointment(response.data.result);
            refreshAppointments();
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
    setEditingAppointment(null);
  };

  const handleDelete = (appointment) => {
    const { serial_No } = appointment;

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this appointment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => confirmDelete(serial_No),
        },
      ],
      { cancelable: false }
    );
  };

  const confirmDelete = (serial_No) => {
    axios
      .delete(`http://192.168.0.145/tasks/api/Appoinment_Schedule/DeleteUser?serial_No=${serial_No}`)
      .then((response) => {
        if (response.data && response.data.statusCode === 200) {
          const updatedAppointments = appointments.filter((app) => app.serial_No !== serial_No);
          setAppointments(updatedAppointments);

          const updatedTableData = updatedAppointments.map((app) => [
            app.user_ID.toString(),
            app.patient_Name,
            app.doctor_Name,
            app.appointment_Status,
            formatDateAndTime(app.appoinment_Date_Time),
            appointmentActions(app),
          ]);
          setTableData(updatedTableData);

          Alert.alert('Success', 'Appointment Deleted Successfully');
        } else {
          Alert.alert('Error', 'Failed to delete appointment. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error deleting appointment:', error);
        Alert.alert('Error', 'An error occurred while deleting appointment. Please try again.');
      });
  };

  const refreshAppointments = () => {
    axios
      .get('http://192.168.0.145/tasks/api/Appoinment_Schedule/GetUser')
      .then((response) => {
        if (response.data && response.data.result) {
          setAppointments(response.data.result);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Appointment Schedule</Text>
        <Table borderStyle={{ borderWidth: 1, borderColor: 'lightblue' }}>
          <Row data={tableHead} style={styles.head} widthArr={tableWidths} textStyle={styles.headText} />
          <Rows data={tableData} widthArr={tableWidths} textStyle={styles.rowText} />
        </Table>
      </View>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Appointment</Text>
            <TextInput
              placeholder="Status"
              value={updatedStatus}
              onChangeText={(text) => setUpdatedStatus(text)}
              style={styles.inputField}
            />
            <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.datePicker}>
              <Text>{selectedDate.toISOString().split('T')[0]}</Text>
            </TouchableOpacity>
            {datePickerVisible && (
              <DatePicker
                mode="datetime"
                date={selectedDate}
                minimumDate={new Date()} // Set the minimum date to today
                onDateChange={(date) => setSelectedDate(date)}
              
                textColor="#2196F3"
              />
            )}
            <TouchableOpacity onPress={handleSaveEdit} style={styles.saveButton}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 60, backgroundColor: '#f1f8ff' },
  headText: { fontWeight: 'bold', marginLeft: 6, fontSize: 12, color:'purple' },
  rowText: { margin: 6, textAlign: 'center', fontSize: 10, textAlign: 'center' },
  title: { fontSize: 25, textAlign: 'center', marginBottom: 20 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  icon: { margin: 5 },
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
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  inputField: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    width: '100%',
  },
  datePicker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    padding: 10,
    margin: 10,
    width: 270,
    alignItems: 'center',
    marginLeft: -1,
  },
  cancelButton: {
    backgroundColor: 'red',
    borderRadius: 4,
    padding: 10,
    margin: 10,
    width: 270,
    alignItems: 'center',
    marginLeft: -1,
  },
  buttonText: {
    color: 'white',
  },
});

export default AppointmentScreen;
