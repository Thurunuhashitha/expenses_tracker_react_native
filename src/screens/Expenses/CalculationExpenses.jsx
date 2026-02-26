import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import NavBar from '../../components/NavBar'

const CalculationExpenses = () => {
  const [month, setMonth] = useState('')
  const [week, setWeek] = useState('')
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('month') // 'month' | 'range'
  const [calculated, setCalculated] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleCalculationMonth = async () => {
    if (!month) {
      alert('Please enter a month (YYYY-MM)')
      return
    }
    try {
      setLoading(true)
      setCalculated(false)
      const token = await AsyncStorage.getItem('authToken')
      if (!token) { alert('Login required'); return }

      const response = await axios.get(
        'https://api.thurunu.me/api/expenses/all',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const filtered = response.data.filter(exp => exp.date.startsWith(month))
      setFilteredExpenses(filtered)
      const totalAmount = filtered.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
      setTotal(totalAmount)
      setCalculated(true)
      if (filtered.length === 0) alert(`No expenses found for ${month}`)
    } catch (error) {
      console.log('CALCULATION ERROR:', error.response?.data || error.message)
      alert('Failed to calculate expenses')
    } finally {
      setLoading(false)
    }
  }

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
      setCalculated(false)
      const token = await AsyncStorage.getItem('authToken')
      if (!token) { alert('Login required'); return }

      const response = await axios.get(
        'https://api.thurunu.me/api/expenses/all',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const filtered = response.data.filter(exp =>
        exp.date >= startDate && exp.date <= endDate
      )
      setFilteredExpenses(filtered)
      const totalAmount = filtered.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
      setTotal(totalAmount)
      setCalculated(true)
      if (filtered.length === 0) alert(`No expenses found for the range ${startDate} to ${endDate}`)
    } catch (error) {
      console.log('CALCULATION ERROR:', error.response?.data || error.message)
      alert('Failed to calculate expenses')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (reason) => {
    const colors = ['#00E5A0', '#7C3AED', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899']
    if (!reason) return colors[0]
    return colors[reason.charCodeAt(0) % colors.length]
  }

  const handleCalculate = () => {
    if (activeTab === 'month') handleCalculationMonth()
    else handleCalculationRange(week)
  }

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
    setFilteredExpenses([])
    setCalculated(false)
    setTotal(0)
  }

  const renderItem = ({ item }) => {
    const accentColor = getCategoryColor(item.reason)
    return (
      <View style={[styles.card, { borderLeftColor: accentColor }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBadge, { backgroundColor: accentColor + '22' }]}>
            <Text style={{ fontSize: 18 }}>💳</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardReason} numberOfLines={1}>
              {item.reason || 'Unnamed Expense'}
            </Text>
            <Text style={styles.cardDate}>{item.date.split('T')[0]}</Text>
          </View>
          <Text style={[styles.cardAmount, { color: accentColor }]}>
            Rs. {parseFloat(item.amount).toFixed(2)}
          </Text>
        </View>
        {item.bill_img && (
          <Image
            source={{ uri: `https://api.thurunu.me/uploads/${item.bill_img}` }}
            style={styles.billImage}
          />
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <NavBar />

      <FlatList
        data={filteredExpenses}
        keyExtractor={item => item.expense_id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            {/* Page Header */}
            <View style={styles.pageHeader}>
              <Text style={styles.pageLabel}>ANALYTICS</Text>
              <Text style={styles.pageTitle}>Expense Calculator</Text>
              <Text style={styles.pageSubtitle}>
                Calculate totals by month or custom date range.
              </Text>
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'month' && styles.tabActive]}
                onPress={() => handleTabSwitch('month')}
                activeOpacity={0.8}>
                <Text style={[styles.tabText, activeTab === 'month' && styles.tabTextActive]}>
                  📅  By Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'range' && styles.tabActive]}
                onPress={() => handleTabSwitch('range')}
                activeOpacity={0.8}>
                <Text style={[styles.tabText, activeTab === 'range' && styles.tabTextActive]}>
                  📆  Date Range
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Card */}
            <View style={styles.card2}>
              {activeTab === 'month' ? (
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Month</Text>
                  <View style={[styles.inputRow, focusedField === 'month' && styles.inputRowFocused]}>
                    <Text style={styles.inputIcon}>🗓</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM  e.g. 2025-03"
                      placeholderTextColor="#4A4A5A"
                      value={month}
                      onChangeText={setMonth}
                      onFocus={() => setFocusedField('month')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Date Range</Text>
                  <View style={[styles.inputRow, focusedField === 'range' && styles.inputRowFocused]}>
                    <Text style={styles.inputIcon}>↔️</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="2025-03-01 to 2025-03-07"
                      placeholderTextColor="#4A4A5A"
                      value={week}
                      onChangeText={setWeek}
                      onFocus={() => setFocusedField('range')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                  <Text style={styles.hintText}>Format: YYYY-MM-DD to YYYY-MM-DD</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.calcButton, loading && styles.calcButtonDisabled]}
                onPress={handleCalculate}
                disabled={loading}
                activeOpacity={0.85}>
                {loading ? (
                  <ActivityIndicator color="#0A0A0F" size="small" />
                ) : (
                  <Text style={styles.calcButtonText}>⚡  Calculate</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Total Summary Card */}
            {calculated && filteredExpenses.length > 0 && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryGlow} />
                <Text style={styles.summaryLabel}>TOTAL EXPENSES</Text>
                <Text style={styles.summaryTotal}>Rs. {total.toFixed(2)}</Text>
                <View style={styles.summaryMeta}>
                  <View style={styles.summaryMetaItem}>
                    <Text style={styles.summaryMetaValue}>{filteredExpenses.length}</Text>
                    <Text style={styles.summaryMetaLabel}>Transactions</Text>
                  </View>
                  <View style={styles.summaryMetaDivider} />
                  <View style={styles.summaryMetaItem}>
                    <Text style={styles.summaryMetaValue}>
                      Rs. {(total / filteredExpenses.length).toFixed(2)}
                    </Text>
                    <Text style={styles.summaryMetaLabel}>Average</Text>
                  </View>
                  <View style={styles.summaryMetaDivider} />
                  <View style={styles.summaryMetaItem}>
                    <Text style={styles.summaryMetaValue}>
                      Rs. {Math.max(...filteredExpenses.map(e => parseFloat(e.amount))).toFixed(2)}
                    </Text>
                    <Text style={styles.summaryMetaLabel}>Highest</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Results label */}
            {calculated && filteredExpenses.length > 0 && (
              <View style={styles.resultsHeader}>
                <Text style={styles.sectionLabel}>BREAKDOWN</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{filteredExpenses.length} entries</Text>
                </View>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          calculated && !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>No Expenses Found</Text>
              <Text style={styles.emptySubtitle}>
                No records match the selected period. Try a different month or range.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  )
}

export default CalculationExpenses

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  bgCircle1: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: '#F59E0B10',
    top: -70,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#00E5A00C',
    bottom: 100,
    left: -60,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Header
  pageHeader: {
    paddingTop: 20,
    marginBottom: 20,
  },
  pageLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
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

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#13131A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabActive: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5A5A70',
  },
  tabTextActive: {
    color: '#0A0A0F',
  },

  // Input Card
  card2: {
    backgroundColor: '#13131A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  fieldWrapper: {
    marginBottom: 16,
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
    borderColor: '#F59E0B', 
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#F0F0F8',
  },
  hintText: {
    fontSize: 11,
    color: '#4A4A5A',
    marginTop: 6,
    letterSpacing: 0.2,
  },

  // Calculate button
  calcButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  calcButtonDisabled: {
    opacity: 0.5,
  },
  calcButtonText: {
    color: '#0A0A0F',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#13131A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F59E0B30',
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  summaryGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#F59E0B0F',
    top: -40,
    alignSelf: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  summaryTotal: {
    fontSize: 36,
    fontWeight: '800',
    color: '#F0F0F8',
    letterSpacing: -1,
    marginBottom: 20,
  },
  summaryMeta: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E1E2E',
    paddingTop: 16,
  },
  summaryMetaItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryMetaValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F0F0F8',
    marginBottom: 3,
  },
  summaryMetaLabel: {
    fontSize: 10,
    color: '#4A4A5A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  summaryMetaDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#1E1E2E',
  },

  // Results header
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A4A5A',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  countBadge: {
    backgroundColor: '#F59E0B15',
    borderWidth: 1,
    borderColor: '#F59E0B30',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countBadgeText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },

  // Expense cards
  card: {
    backgroundColor: '#13131A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    borderLeftWidth: 3,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardReason: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 3,
  },
  cardDate: {
    fontSize: 12,
    color: '#5A5A70',
    fontWeight: '500',
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginLeft: 8,
  },
  billImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 14,
    backgroundColor: '#0E0E16',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F0F0F8',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#5A5A70',
    textAlign: 'center',
    lineHeight: 20,
  },
})