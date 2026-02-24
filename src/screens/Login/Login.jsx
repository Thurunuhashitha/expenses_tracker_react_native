import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Login = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center',
    backgroundColor: '#7ac48f',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
})