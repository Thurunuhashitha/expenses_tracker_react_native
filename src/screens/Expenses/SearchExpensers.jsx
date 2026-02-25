import React, { useState } from 'react'
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const SearchExpenses = () => {
  const [date, setDate] = useState('')
    const [id, setId] = useState('')
    const [reason, setReason] = useState('')
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (searchDate, searchId, searchReason) => {
    if (!searchDate && !searchId && !searchReason) {
      alert('Please enter at least one search parameter')
      return
    }

    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('authToken')
      if (!token) {
        alert('Login required')
        return
      }

      // Fetch all expenses
      const response = await axios.get(
        'https://api.thurunu.me/api/expenses/all',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Filter expenses by date
      const filtered = response.data.filter(exp => 
        exp.date.startsWith(searchDate) && 
        (searchId ? exp.expense_id === parseInt(searchId) : true)&&
        (searchReason ? exp.reason.includes(searchReason) : true)
      )


      setFilteredExpenses(filtered)
      if (filtered.length === 0) alert('No expenses found for this date')

    } catch (error) {
      console.log('SEARCH ERROR:', error.response?.data || error.message)
      alert('Failed to search expenses')
    } finally {
      setLoading(false)
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Reason: {item.reason}</Text>
      <Text>Amount: {item.amount}</Text>
      <Text>Date: {item.date.split('T')[0]}</Text>
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
      <Text style={styles.title}>Search Expenses</Text>

      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="ID"
        value={id}
        onChangeText={setId}
      />
      <TextInput
        style={styles.input}
        placeholder="reason"
        value={reason}
        onChangeText={setReason}
      />

      <Button title="Search" onPress={() => handleSearch(date, id, reason)} />

      {filteredExpenses.length > 0 && (
        <FlatList
          data={filteredExpenses}
          keyExtractor={item => item.expense_id.toString()}
          renderItem={renderItem}
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  )
}

export default SearchExpenses

const styles = StyleSheet.create({
  container: {padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 },
  item: { marginBottom: 15, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  image: { width: 200, height: 200, marginTop: 10, borderRadius: 8 }
})