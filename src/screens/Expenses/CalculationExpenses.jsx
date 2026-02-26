import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const CalculationExpenses = () => {
  const [month, setMonth] = useState('')
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [week, setWeek] = useState('')

  const handleCalculationMonth = async () => {
    if (!month) {
      alert('Please enter a month (YYYY-MM)')
      return
    }

    try {
      setLoading(true)

      const token = await AsyncStorage.getItem('authToken')
      if (!token) {
        alert('Login required')
        return
      }

      const response = await axios.get(
        'https://api.thurunu.me/api/expenses/all',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const filtered = response.data.filter(exp =>
        exp.date.startsWith(month)
      )

      setFilteredExpenses(filtered)

      const totalAmount = filtered.reduce(
        (sum, exp) => sum + parseFloat(exp.amount),
        0
      )

      setTotal(totalAmount)

      if (filtered.length === 0) {
        alert(`No expenses found for ${month}`)
      }

    } catch (error) {
      console.log('CALCULATION ERROR:', error.response?.data || error.message)
      alert('Failed to calculate expenses')
    } finally {
      setLoading(false)
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>Reason: {item.reason}</Text>
      <Text style={styles.text}>Amount: Rs. {item.amount}</Text>
      <Text style={styles.text}>Date: {item.date.split('T')[0]}</Text>

      {item.bill_img && (
        <Image
          source={{ uri: `https://api.thurunu.me/uploads/${item.bill_img}` }}
          style={styles.image}
        />
      )}
    </View>
  )

  const handleCalculationRange = async (week) => {
    if (!week) {
      alert('Please enter a week (YYYY-MM-DD to YYYY-MM-DD)')
      return
    }
    const [startDate, endDate] = week.split(' to ')
    if (!startDate || !endDate) {
      alert('Invalid week format. Use YYYY-MM-DD to YYYY-MM-DD')
      return
    }
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('authToken')
      if (!token) {
        alert('Login required')
        return
      }
      const response = await axios.get(
        'https://api.thurunu.me/api/expenses/all',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const filtered = response.data.filter(exp =>
        exp.date >= startDate && exp.date <= endDate
      )

      setFilteredExpenses(filtered)

      const totalAmount = filtered.reduce(
        (sum, exp) => sum + parseFloat(exp.amount),
        0
      )

      setTotal(totalAmount)

      if (filtered.length === 0) {
        alert(`No expenses found for the range ${startDate} to ${endDate}`)
      }

    } catch (error) {
      console.log('CALCULATION ERROR:', error.response?.data || error.message)
      alert('Failed to calculate expenses')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Calculation</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter month (YYYY-MM)"
        value={month}
        onChangeText={setMonth}
      />

      <Button title="Calculate" onPress={() => handleCalculationMonth(month)} />

        <TextInput
        style={styles.input}
        placeholder="Enter week (YYYY-MM-DD to YYYY-MM-DD)"
        value={week}
        onChangeText={setWeek}
      />

      <Button title="Calculate" onPress={() => handleCalculationRange(week)} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {!loading && filteredExpenses.length > 0 && (
        <>
          <Text style={styles.total}>
            Total Expense: Rs. {total.toFixed(2)}
          </Text>

          <FlatList
            data={filteredExpenses}
            keyExtractor={item => item.expense_id.toString()}
            renderItem={renderItem}
            style={{ marginTop: 10 }}
          />
        </>
      )}
    </View>
  )
}

export default CalculationExpenses

const styles = StyleSheet.create({
  container: { 
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center'
  },
  item: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8
  },
  text: {
    fontSize: 16
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 8
  }
})