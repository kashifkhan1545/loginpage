import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ route }) => {
  const [patientName, setPatientName] = useState('');
  const [contact, setContact] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [appointment_Status, setAppointmentStatus] = useState('');
  const [open, setOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(new Date());

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.145/tasks/api/Appoinment_Schedule/GetUserByID?user_ID=${route.params.userId}`
        );

        if (response.data.statusCode === 200) {
          const totalAppointments = response.data.result.Schedule;

          let lastAppointmentResult = 'Pending';

          if (totalAppointments.length > 0) {
            const lastAppointment = totalAppointments[totalAppointments.length - 1];

            if (lastAppointment && lastAppointment.appointment_Status) {
              lastAppointmentResult = lastAppointment.appointment_Status;
            }
          }

          console.log('Last Appointment Result:', lastAppointmentResult);

          const { first_Name, last_Name, user_Contact } = response.data.result.Patient[0];
          setPatientName(`${first_Name} ${last_Name}`);
          setContact(user_Contact);
          setAppointmentStatus(lastAppointmentResult);
        } else {
          Alert.alert('Error', 'Failed to fetch user information. User not found.');
        }
      } catch (error) {
        console.error('Error during user information retrieval:', error);
        Alert.alert('Error', 'Failed to fetch user information. Please try again later.');
      }
    };

    fetchUserInfo();
  }, [route.params.userId]);

  const navigation = useNavigation(); // Add this line

  const handleAppointmentSubmit = async () => {
    if (!doctorName.trim()) {
      Alert.alert('Validation Error', 'Please enter the doctor\'s name.');
      return;
    }

    if (appointmentDate <= new Date()) {
      Alert.alert(
        'Validation Error',
        'Please select a future date and time for the appointment.'
      );
      return;
    }

    try {
      const formattedDateTime = moment(appointmentDate).format('YYYY-MM-DDTHH:mm:ss');

      const response = await axios.post(
        'http://192.168.0.145/tasks/api/Appoinment_Schedule/AddAppoinment',
        {
          user_Id: route.params.userId,
          patient_Name: patientName,
          doctor_Name: doctorName,
          patient_Contact: contact,
          appointment_Status: 'Pending',
          appoinment_Date_Time: formattedDateTime,
        }
      );

      if (response.status === 200) {
        Alert.alert(
          'Appointment Booked Successfully',
          `${appointmentDate.toLocaleDateString()}:${appointmentDate.toTimeString()}`
        );

        setDoctorName('');
        setAppointmentDate(new Date());
      } else {
        Alert.alert('Failed to Book Appointment', 'Please try again.');
      }
    } catch (error) {
      console.error('Error during appointment submission:', error);
      Alert.alert('Error', 'Failed to submit appointment');
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.heading}>Appointment Information</Text>

      {/* User ID */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>User ID:</Text>
        <TextInput style={styles.input} value={` ${route.params.userId}`} editable={false} />
      </View>

      {/* Patient Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Patient Name:</Text>
        <TextInput style={styles.input} value={patientName} editable={false} />
      </View>

      {/* Contact No */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contact No:</Text>
        <TextInput style={styles.input} value={contact} editable={false} />
      </View>

      {/* Doctor Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Doctor Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Doctor Name"
          onChangeText={(text) => setDoctorName(text)}
          value={doctorName}
        />
      </View>

      {/* Appointment Status */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Appointment Status:</Text>
        <TextInput style={styles.input} value={appointment_Status} editable={false} />
      </View>

      <View style={styles.inputContainer}>
  <Text style={styles.label}>Appointment Date&Time:</Text>
  <TouchableOpacity style={styles.datePicker} onPress={() => setOpen(true)}>
    <Text>{`${appointmentDate.toLocaleDateString()} ${appointmentDate.toLocaleTimeString()}`}</Text>
  </TouchableOpacity>

  <DatePicker
    modal
    open={open}
    date={appointmentDate}
    minimumDate={new Date()} // Set the minimum date to today
    onConfirm={(date) => {
      setAppointmentDate(date);
      setOpen(false);
    }}
    onCancel={() => {
      setOpen(false);
    }}
  />
</View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleAppointmentSubmit}>
        <Text style={styles.buttonText}>Submit Appointment</Text>
      </TouchableOpacity>
  
      <TouchableOpacity
  style={styles.submitButton}
  onPress={() => navigation.navigate('ViewStatus', { userId: route.params.userId })}
>
  <Text style={styles.buttonText}>View Appointment Status</Text>
</TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginBottom: 70,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 36,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    padding: 8,
  },
  datePicker: {
    width: '100%',
    height: 36,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    padding: 8,
    justifyContent: 'center',
  },
  submitButton: {
    width: '80%',
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'purple',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  disabledInput: {
    backgroundColor: '#f2f2f2',
  },
});

export default HomeScreen;
