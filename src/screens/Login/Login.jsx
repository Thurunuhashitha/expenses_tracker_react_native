import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native'
import React from 'react'
import axios from 'axios';

const Login = () => {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('') 
  const [token, setToken] = React.useState('')

  function handleLogin() {
    if(!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    axios.post('https://api.thurunu.me/api/auth/login', {
      email: email,
      password: password,
  })
  .then(response => {
    console.log('Login successful:', response.data); 
    setToken(response.data.token);
    Alert.alert('Success', 'Login successful');
  })
  .catch(error => {
    Alert.alert('Error', 'Login failed. Please check your credentials.');
    console.error('Login error:', error);
  });
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View>
        <TextInput style={styles.input} placeholder='Email' onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder='Password' secureTextEntry={true} onChangeText={setPassword} />
      </View>
      <View>
        <Button title='Login' onPress={handleLogin} />
      </View> 
      <Text style={{color:'white', marginTop: 20}}>Token: {token}</Text>
    </View>
  )
}

export default Login

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