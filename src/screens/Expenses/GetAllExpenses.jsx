import React, { useState } from 'react'
import { 
  View, 
  Text, 
  Button, 
  FlatList, 
  Image, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const GetAllExpenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)

  const handleGetAll = async () => {
    try {
      setLoading(true)

      const token = await AsyncStorage.getItem('authToken')
      if (!token) {
        alert('Login required')
        setLoading(false)
        return
      }

      const response = await axios.get(
        'https://api.thurunu.me/api/expenses/all',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setExpenses(response.data)
      console.log('Fetched Data:', response.data)
    } catch (error) {
      console.log('FETCH ERROR:', error.response?.data || error.message)
      alert('Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.text}>Reason: {item.reason}</Text>
      <Text style={styles.text}>Amount: {item.amount}</Text>
      <Text style={styles.text}>
        Date: {new Date(item.date).toLocaleDateString()}
      </Text>
      {item.bill_img && (
        <Image
          source={{ uri: `https://api.thurunu.me/uploads/${item.bill_img}` }}
          style={styles.image}
        />
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Expenses</Text>

      <Button title="Get All Expenses" onPress={handleGetAll} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {!loading && expenses.length > 0 && (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.expense_id.toString()}
          renderItem={renderItem}
          style={{ marginTop: 20 }}
        />
      )}

      {!loading && expenses.length === 0 && (
        <Text style={{ marginTop: 20 }}>No expenses fetched yet.</Text>
      )}
    </View>
  )
}

export default GetAllExpenses

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  itemContainer: { 
    marginBottom: 15, 
    padding: 10, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8 
  },
  text: { fontSize: 16 },
  image: { width: 200, height: 200, marginTop: 10, borderRadius: 8 }
})