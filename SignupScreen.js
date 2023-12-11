import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
      return;
    }
     
    try {
      const response = await axios.post(
        'http://192.168.10.12/api/Patient_L/CreateLogin',
        {
          first_Name: firstName,
          last_Name: lastName, 
          user_Email: email,
          user_Contact: contactNumber,
          user_Password: password,
        }
      );

      if (response.data.message !== 'Email is Already Exist') {
        // Show the success alert
        Alert.alert('Signup Successfully', 'You have successfully signed up!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('User already Exists');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  return (
    <ImageBackground source={require('./bg2.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Signup Here</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name:</Text>
          <View style={styles.inputWrapper}>
            <Icon name="user" size={20} color="black" style={styles.userIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              onChangeText={(text) => setFirstName(text)}
              value={firstName}
            />
          </View>
          <Text style={styles.label}>Last Name:</Text>
          <View style={styles.inputWrapper}>
            <Icon name="user" size={20} color="black" style={styles.userIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              onChangeText={(text) => setLastName(text)}
              value={lastName}
            />
          </View>
          <Text style={styles.label}>Email:</Text>
          <View style={styles.inputWrapper}>
            <Icon name="envelope" size={20} color="black" style={styles.userIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </View>
          <Text style={styles.label}>Contact Number:</Text>
          <View style={styles.inputWrapper}>
            <Icon name="phone" size={20} color="black" style={styles.userIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your contact number"
              onChangeText={(text) => setContactNumber(text)}
              value={contactNumber}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.label}>Password:</Text>
          <View style={styles.passwordInputContainer}>
            <Icon name="lock" size={20} color="black" style={styles.userIcon} />
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'purple' }]} onPress={handleSignup}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginBottom: 150,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  userIcon: {
    padding: 10,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 50,
    color: 'white',
  },
  label: {
    fontSize: 16,
    color: 'white',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    color: 'black',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    color: 'black',
  },
  button: {
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default SignupScreen;
