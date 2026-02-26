import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import NavBar from '../../components/NavBar'

const DeleteExpenses = () => {
  const [id, setId] = useState('')

  const handleDelete = async (expenseId) => {
    if (!expenseId) {
      alert('Please enter an expense ID')
      return
    }

    try {
      const token = await AsyncStorage.getItem('authToken')
      if (!token) {
        alert('Login required')
        return
      }

      const response = await axios.delete(
        `https://api.thurunu.me/api/expenses/delete/${expenseId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      Alert.alert('Success', 'Expense deleted successfully')
      setId('')
    } catch (error) {
      console.log('DELETE ERROR:', error.response?.data || error.message)
      Alert.alert('Error', 'Failed to delete expense')
    }
  }

  return (
    <View style={styles.container}>
      <NavBar />
      <Text style={styles.title}>Delete Expense</Text>

      <TextInput
        style={styles.input}
        placeholder="Expense ID"
        value={id}
        onChangeText={setId}
        keyboardType="numeric"
      />

      <Button title="Delete" onPress={() => handleDelete(id)} />
    </View>
  )
}

export default DeleteExpenses

const styles = StyleSheet.create({
  container: { padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }
})