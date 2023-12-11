// Import necessary modules and libraries

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Required Email and Password!');
    } else {
      try {
        const response = await axios.get(
          `http://192.168.0.145/tasks/api/Patient_L/Login?UserEmail=${email}&UserPassword=${password}`
        );

        if (response.data.message === 'User Login successfully!') {
          const { role, userId } = response.data.result;

          if (role === 'Admin') {
            navigation.navigate('UserData', { userId });
            Alert.alert('Login successful', 'You are now logged in as an Admin.');
          } else {
            // console.warn(response.data.result.user_ID);

            const userId=response.data.result.user_ID;
            // console.warn(userId);
            
            navigation.navigate('Home', { userId });
            Alert.alert('Login successful', 'You are now logged in.');
          }

          setEmail('');
          setPassword('');
        } else {
          Alert.alert('Login Failed', 'Invalid credentials.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        Alert.alert('Error', 'Failed to log in. Please try again later.');
      }
    }
  };

  return (
    <ImageBackground source={require('./bg1.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <View style={styles.inputWrapper}>
            <Icon name="envelope" size={17} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </View>
          <Text style={styles.label}>Password:</Text>
          <View style={styles.passwordInputContainer}>
            <Icon name="lock" size={20} color="black" style={styles.icon} />
            <TextInput
              style={styles.passwordInput}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={!showPassword}
              placeholder="Enter your password"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcon name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="black" style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.signupText}>Don't Have an Account?</Text>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('Signup')}
          >
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
    marginBottom: 100,
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
  loginButton: {
    width: '100%',
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
  signupText: {
    color: 'white',
  },
  signupButton: {
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'purple',
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
  },
  icon: {
    marginRight: 8,
    marginLeft: 10,
  },
});

export default LoginScreen;
