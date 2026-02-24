import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native'
import React from 'react'
import axios from 'axios';

const Register = () => {

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function hadelRegister() {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    axios.post('https://api.thurunu.me/api/auth/register', { 
      name:name, 
      email:email, 
      password:password,
    })
      .then(response => {
        console.log('Success:', response.data);
        Alert.alert('Success', 'Registration successful');
      })
      .catch(error => {
        console.log('Error:', error.response?.data || error.message);
        Alert.alert('Error', 'Registration failed');
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register form will go here</Text>
      <View>
        <TextInput style={styles.input} placeholder='Name' onChangeText={setName} />
        <TextInput style={styles.input} placeholder='Email' onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder='Password'onChangeText={setPassword} />
      </View>
      <Button title="Register" onPress={hadelRegister} />

    </View>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  input: {
    width: 200,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
})