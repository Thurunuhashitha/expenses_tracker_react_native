import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const NavBar = () => {

  const navigation = useNavigation()

  return (
    <View style={styles.navbar}>
      
      <TouchableOpacity style={styles.navItem}
        onPress={() => navigation.navigate('GetAllExpenses')}>
        <Text style={styles.text}>All</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}
        onPress={() => navigation.navigate('AddExpenses')}>
        <Text style={styles.text}>Add</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}
        onPress={() => navigation.navigate('SearchExpenses')}>
        <Text style={styles.text}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}
        onPress={() => navigation.navigate('CalculationExpenses')}>
        <Text style={styles.text}>Calc</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}
        onPress={() => navigation.navigate('DeleteExpenses')}>
        <Text style={styles.text}>Delete</Text>
      </TouchableOpacity>

    </View>
  )
}

export default NavBar

const styles = StyleSheet.create({
  navbar: { 
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60, 
    position: 'relative', 
    width: '100%', 
  },
  navItem: {
    padding: 8, 
    backgroundColor: '#81d7d7',
    borderRadius: 10,
        minWidth: 73,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  }
})