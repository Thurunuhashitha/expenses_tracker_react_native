import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native'
import React from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';

const Login = () => {

  const navigation = useNavigation();

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('') 

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields')
      return
    }

    try {
      const response = await axios.post(
        'https://api.thurunu.me/api/auth/login',
        { email,password},
         { headers: { 'Content-Type': 'application/json' } }
      )

      const accessToken = response.data.token 
      if (!accessToken) {
        Alert.alert('Login Error', 'Token not returned from server');
        return;
      } 
       // Save token for later use
      await AsyncStorage.setItem('authToken', accessToken);
      Alert.alert('Login Success', 'You Have Successfully Logged In');
      navigation.navigate('GetAllExpenses');

    }
    catch (error) {
      if (error.response) {
        console.log('Server error:', error.response.data);
        Alert.alert('Login Error', error.response.data.message || 'Please Try Again');
      } else if (error.request) {
        console.log('No response received:', error.request);
        Alert.alert('Network Error', 'No response from server. Check your connection.');
      } else {
        console.log('Axios error:', error.message);
        Alert.alert('Login Error', error.message);
      }
    }
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