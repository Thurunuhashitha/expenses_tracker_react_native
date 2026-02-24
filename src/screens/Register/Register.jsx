import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Register = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
    </View>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
})