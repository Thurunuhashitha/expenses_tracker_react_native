import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, StatusBar, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import NavBar from '../../components/NavBar'

const DeleteExpenses = () => {
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)

  const handleDelete = async (expenseId) => {
    if (!expenseId) {
      alert('Please enter an expense ID')
      return
    }

    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to permanently delete expense #${expenseId}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true)
              const token = await AsyncStorage.getItem('authToken')
              if (!token) {
                alert('Login required')
                return
              }

              const response = await axios.delete(
                `https://api.thurunu.me/api/expenses/delete/${expenseId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              )

              Alert.alert('Success', 'Expense deleted successfully')
              setId('')
            } catch (error) {
              console.log('DELETE ERROR:', error.response?.data || error.message)
              Alert.alert('Error', 'Failed to delete expense')
            } finally {
              setLoading(false)
            }
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />

      {/* Background decorative circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <NavBar />

      <View style={styles.container}>
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageLabel}>MANAGE</Text>
          <Text style={styles.pageTitle}>Delete Expense</Text>
          <Text style={styles.pageSubtitle}>
            Enter the expense ID you wish to remove permanently.
          </Text>
        </View>

        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Deletion is permanent and cannot be reversed. Double-check the ID before proceeding.
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Expense ID</Text>
          <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
            <Text style={styles.inputIcon}>#️⃣</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 42"
              placeholderTextColor="#4A4A5A"
              value={id}
              onChangeText={setId}
              keyboardType="numeric"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {id.length > 0 && (
              <TouchableOpacity onPress={() => setId('')} style={styles.clearX}>
                <Text style={styles.clearXText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ID Preview chip */}
          {id.length > 0 && (
            <View style={styles.previewChip}>
              <Text style={styles.previewChipText}>Targeting → Expense #{id}</Text>
            </View>
          )}

          {/* Delete Button */}
          <TouchableOpacity
            style={[
              styles.deleteButton,
              (!id || loading) && styles.deleteButtonDisabled,
            ]}
            onPress={() => handleDelete(id)}
            disabled={!id || loading}
            activeOpacity={0.85}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.deleteButtonIcon}>🗑</Text>
                <Text style={styles.deleteButtonText}>Delete Expense</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Info strip */}
        <View style={styles.infoStrip}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Not sure of the ID? Use the{' '}
              <Text style={styles.infoLink}>Search screen</Text> to find it first.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default DeleteExpenses

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  bgCircle1: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#EF444410',
    top: -60,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#7C3AED0C',
    bottom: 120,
    left: -60,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Header
  pageHeader: {
    marginBottom: 20,
  },
  pageLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F0F0F8',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#5A5A70',
    lineHeight: 18,
  },

  // Warning Banner
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EF444412',
    borderWidth: 1,
    borderColor: '#EF444430',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  warningIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#EF9090',
    lineHeight: 18,
    fontWeight: '500',
  },

  // Card
  card: {
    backgroundColor: '#13131A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B6B80',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E0E16',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E1E2E',
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 14,
  },
  inputRowFocused: {
    borderColor: '#EF4444', 
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#F0F0F8',
    fontWeight: '600',
  },
  clearX: {
    padding: 4,
  },
  clearXText: {
    color: '#4A4A5A',
    fontSize: 13,
    fontWeight: '700',
  },

  // Preview chip
  previewChip: {
    backgroundColor: '#EF444415',
    borderWidth: 1,
    borderColor: '#EF444435',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  previewChipText: {
    color: '#EF9090',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Delete Button
  deleteButton: {
    backgroundColor: '#EF4444',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  deleteButtonDisabled: {
    opacity: 0.4,
  },
  deleteButtonIcon: {
    fontSize: 16,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  // Info strip
  infoStrip: {
    backgroundColor: '#13131A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    padding: 14,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoIcon: {
    fontSize: 15,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#5A5A70',
    lineHeight: 18,
  },
  infoLink: {
    color: '#00E5A0',
    fontWeight: '700',
  },
})