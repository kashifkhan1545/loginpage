import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';

const ViewStatusScreen = ({ route }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.145/tasks/api/Appoinment_Schedule/GetUserByID?user_ID=${route.params.userId}`
        );

        if (response.data.statusCode === 200) {
          const appointmentData = response.data.result.Schedule;
          setAppointments(appointmentData);
        } else {
          setAppointments([]);
          Alert.alert('Error', 'Failed to fetch appointment status.');
        }
      } catch (error) {
        console.error('Error fetching appointment status:', error);
        Alert.alert('Error', 'Failed to fetch appointment status. Please try again later.');
      }
    };

    fetchAppointments();
  }, [route.params.userId]);

  const formatDateTime = (dateTime) => {
    const formattedDate = new Date(dateTime).toLocaleDateString();
    const formattedTime = new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `${formattedDate} ${formattedTime}`;
  };

  const getStatusColor = (status) => {
    return status === 'Approved' ? 'green' : status === 'Pending' ? 'red' : 'black';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Appointment Status</Text>

      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => (item.serial_No ? item.serial_No.toString() : item.user_ID.toString())}
          renderItem={({ item }) => (
            <View style={[styles.appointmentContainer, { borderColor: getStatusColor(item.appointment_Status) }]}>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentText}>Serial No:</Text>
                <Text style={styles.appointmentValue}>{item.serial_No}</Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentText}>Patient Name:</Text>
                <Text style={styles.appointmentValue}>{item.patient_Name}</Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentText}>Doctor Name:</Text>
                <Text style={styles.appointmentValue}>{item.doctor_Name}</Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentText}>Status:</Text>
                <Text
                  style={[
                    styles.appointmentValue,
                    { color: getStatusColor(item.appointment_Status), fontWeight: 'bold' },
                  ]}
                >
                  {item.appointment_Status}
                </Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentText}>Date/Time:</Text>
                <Text style={styles.appointmentValue}>{formatDateTime(item.appoinment_Date_Time)}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.flatListContainer}
        />
      ) : (
        <Text>No appointment status available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'purple'
  },
  appointmentContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 14,
    margin: 8,
    width: 300,
    borderWidth: 1,
  },
  appointmentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  appointmentText: {
    fontSize: 14,
    color: '#555',
  },
  appointmentValue: {
    fontSize: 14,
    color: '#333',
  },
  flatListContainer: {
    alignItems: 'flex-start',
  },
});

export default ViewStatusScreen;
