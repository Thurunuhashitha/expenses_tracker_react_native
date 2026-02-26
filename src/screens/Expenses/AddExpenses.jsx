import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { launchImageLibrary } from 'react-native-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import NavBar from '../../components/NavBar'

const AddExpenses = () => {
  const [reason, setReason] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [image, setImage] = useState(null)

  const [loading, setLoading] = useState(false)

  ////////////////////////////////////////// Pick image
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false
      },
      response => {
        if (response.didCancel) return

        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage)
          return
        }

        const asset = response.assets?.[0]
        if (!asset) return

        // 🔥 FORCE REQUIRED FIELDS FOR MULTER
        const fixedImage = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg', // MUST exist
          fileName: asset.fileName || `image_${Date.now()}.jpg` // MUST exist
        }

        setImage(fixedImage)
      }
    )
  }

  ///////////////////////////////////////////////// Date picker
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) setDate(selectedDate)
  }


  const handleAddExpense = async () => {
    if (!reason || !amount ) {
      Alert.alert('Error', 'Fill all fields')
      return
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Error', 'Invalid amount')
      return
    }

    try {
      setLoading(true)

      const token = await AsyncStorage.getItem('authToken')
      if (!token) {
        Alert.alert('Error', 'Login required')
        return
      }

      /////////////////////////////////////////////// Prepare form data
      const formData = new FormData()
      formData.append('reason', reason)
      formData.append('amount', amount)
      formData.append('date', date.toISOString().split('T')[0])

      formData.append('bill_img', {     
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || `image_${Date.now()}.jpg`
      })

      await axios.post(
        'https://api.thurunu.me/api/expenses/add',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          transformRequest: data => data
        }
      )

      Alert.alert('Success', 'Expense added successfully')
      setReason('')
      setAmount('')
      setDate(new Date())
      setImage(null)

    } catch (error) {
      console.log('UPLOAD ERROR:', error.response?.data || error.message)
      Alert.alert('Error', 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NavBar />
      <Text style={styles.title}>Add Expense</Text>

      <TextInput
        style={styles.input}
        placeholder="Reason"
        value={reason}
        onChangeText={setReason}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Button
        title={`Date: ${date.toDateString()}`}
        onPress={() => setShowDatePicker(true)}
      />

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <View style={{ marginVertical: 10 }}>
        <Button title="Pick Image" onPress={pickImage} />
      </View>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.preview} />
      )}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Add Expense" onPress={handleAddExpense} />
      )}
    </ScrollView>
  )
}

export default AddExpenses

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10
  },
  preview: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 8
  }
})