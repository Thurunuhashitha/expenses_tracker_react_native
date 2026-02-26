import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  SafeAreaView,
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
  const [focusedField, setFocusedField] = useState(null)
  const amountRef = useRef(null)

  ////////////////////////////////////////// Pick image
  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, includeBase64: false },
      response => {
        if (response.didCancel) return
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage)
          return
        }
        const asset = response.assets?.[0]
        if (!asset) return
        const fixedImage = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          fileName: asset.fileName || `image_${Date.now()}.jpg`
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
    if (!reason || !amount) {
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

  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <NavBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageLabel}>NEW ENTRY</Text>
          <Text style={styles.pageTitle}>Add Expense</Text>
          <Text style={styles.pageSubtitle}>Record a new expense with details and receipt.</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>

          {/* Reason */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Reason</Text>
            <View style={[styles.inputRow, focusedField === 'reason' && styles.inputRowFocused]}>
              <Text style={styles.inputIcon}>📝</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Groceries, Fuel..."
                placeholderTextColor="#4A4A5A"
                value={reason}
                onChangeText={setReason}
                onFocus={() => setFocusedField('reason')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Amount */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Amount</Text>
            <TouchableWithoutFeedback onPress={() => amountRef.current?.focus()}>
              <View style={[styles.inputRow, focusedField === 'amount' && styles.inputRowFocused]}>
                <Text style={styles.inputIcon}>💰</Text>
                <Text style={styles.currencyPrefix}>Rs.</Text>
                <TextInput
                  ref={amountRef}
                  style={[styles.input, { marginLeft: 6 }]}
                  placeholder="0.00"
                  placeholderTextColor="#4A4A5A"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  onFocus={() => setFocusedField('amount')}
                  onBlur={() => setFocusedField(null)}
                />
                {amount.length > 0 && (
                  <View style={styles.amountPreviewBadge}>
                    <Text style={styles.amountPreviewText}>Rs. {parseFloat(amount || 0).toFixed(2)}</Text>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Date Picker */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}>
              <Text style={styles.dateButtonIcon}>📅</Text>
              <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
              <Text style={styles.dateChevron}>›</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          {/* Divider */}
          <View style={styles.sectionDivider} />

          {/* Image Upload */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Receipt / Bill Image</Text>

            {image ? (
              <View style={styles.imagePreviewWrapper}>
                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                <View style={styles.imageOverlayActions}>
                  <TouchableOpacity
                    style={styles.changeImageBtn}
                    onPress={pickImage}
                    activeOpacity={0.8}>
                    <Text style={styles.changeImageText}>🔄  Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeImageBtn}
                    onPress={() => setImage(null)}
                    activeOpacity={0.8}>
                    <Text style={styles.removeImageText}>✕  Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadZone}
                onPress={pickImage}
                activeOpacity={0.8}>
                <Text style={styles.uploadZoneIcon}>🖼</Text>
                <Text style={styles.uploadZoneTitle}>Tap to upload receipt</Text>
                <Text style={styles.uploadZoneSubtitle}>JPG, PNG supported</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Progress summary strip */}
        <View style={styles.summaryStrip}>
          <View style={styles.summaryStripItem}>
            <View style={[styles.summaryDot, reason ? styles.summaryDotActive : {}]} />
            <Text style={[styles.summaryStripLabel, reason && styles.summaryStripLabelActive]}>Reason</Text>
          </View>
          <View style={styles.summaryStripLine} />
          <View style={styles.summaryStripItem}>
            <View style={[styles.summaryDot, amount ? styles.summaryDotActive : {}]} />
            <Text style={[styles.summaryStripLabel, amount && styles.summaryStripLabelActive]}>Amount</Text>
          </View>
          <View style={styles.summaryStripLine} />
          <View style={styles.summaryStripItem}>
            <View style={[styles.summaryDot, styles.summaryDotActive]} />
            <Text style={[styles.summaryStripLabel, styles.summaryStripLabelActive]}>Date</Text>
          </View>
          <View style={styles.summaryStripLine} />
          <View style={styles.summaryStripItem}>
            <View style={[styles.summaryDot, image ? styles.summaryDotActive : {}]} />
            <Text style={[styles.summaryStripLabel, image && styles.summaryStripLabelActive]}>Receipt</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleAddExpense}
          disabled={loading}
          activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color="#0A0A0F" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>＋  Save Expense</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

export default AddExpenses

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  bgCircle1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#00E5A010',
    top: -70,
    left: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#7C3AED0C',
    bottom: 80,
    right: -60,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },

  // Header
  pageHeader: {
    paddingTop: 20,
    marginBottom: 20,
  },
  pageLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00E5A0',
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

  // Form Card
  card: {
    backgroundColor: '#13131A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  fieldWrapper: {
    marginBottom: 18,
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
  },
  inputRowFocused: {
    borderColor: '#00E5A0', 
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B6B80',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#F0F0F8',
  },
  amountPreviewBadge: {
    backgroundColor: '#00E5A015',
    borderWidth: 1,
    borderColor: '#00E5A030',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  amountPreviewText: {
    color: '#00E5A0',
    fontSize: 11,
    fontWeight: '700',
  },

  // Date Button
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E0E16',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E1E2E',
    paddingHorizontal: 14,
    height: 52,
  },
  dateButtonIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 15,
    color: '#F0F0F8',
    fontWeight: '500',
  },
  dateChevron: {
    fontSize: 22,
    color: '#4A4A5A',
    fontWeight: '300',
  },

  // Section divider
  sectionDivider: {
    height: 1,
    backgroundColor: '#1E1E2E',
    marginBottom: 18,
  },

  // Image Upload Zone
  uploadZone: {
    backgroundColor: '#0E0E16',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E1E2E',
    borderStyle: 'dashed',
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadZoneIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  uploadZoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8888A0',
    marginBottom: 4,
  },
  uploadZoneSubtitle: {
    fontSize: 11,
    color: '#4A4A5A',
    letterSpacing: 0.3,
  },
  imagePreviewWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E1E2E',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    backgroundColor: '#0E0E16',
  },
  imageOverlayActions: {
    flexDirection: 'row',
    backgroundColor: '#13131A',
    borderTopWidth: 1,
    borderTopColor: '#1E1E2E',
  },
  changeImageBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#1E1E2E',
  },
  changeImageText: {
    color: '#00E5A0',
    fontSize: 13,
    fontWeight: '700',
  },
  removeImageBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  removeImageText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },

  // Progress strip
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13131A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryStripItem: {
    alignItems: 'center',
    flex: 1,
    gap: 5,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2A2A3A',
    marginBottom: 4,
  },
  summaryDotActive: {
    backgroundColor: '#00E5A0',
    shadowColor: '#00E5A0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryStripLabel: {
    fontSize: 10,
    color: '#3A3A4A',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryStripLabelActive: {
    color: '#00E5A0',
  },
  summaryStripLine: {
    height: 1,
    flex: 0.5,
    backgroundColor: '#1E1E2E',
    marginBottom: 12,
  },

  // Submit Button
  submitButton: {
    backgroundColor: '#00E5A0',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E5A0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#0A0A0F',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
})