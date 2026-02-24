import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Expenses = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses</Text>
    </View>
  )
}

export default Expenses

const styles = StyleSheet.create({
  container: {  
    alignItems: 'center',
    backgroundColor: '#7cc3e4', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
})