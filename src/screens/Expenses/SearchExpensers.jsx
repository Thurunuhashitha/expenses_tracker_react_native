import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NavBar from '../../components/NavBar';

const SearchExpenses = () => {
  const [date, setDate] = useState('');
  const [id, setId] = useState('');
  const [reason, setReason] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSearch = async (searchDate, searchId, searchReason) => {
    if (!searchDate && !searchId && !searchReason) {
      alert('Please enter at least one search parameter');
      return;
    }

    try {
      setLoading(true);
      setSearched(false);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        alert('Login required');
        return;
      }

      const response = await axios.get(
        'https://api.thurunu.me/api/expenses/all',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const filtered = response.data.filter(
        exp =>
          (searchDate ? exp.date.startsWith(searchDate) : true) &&
          (searchId ? exp.expense_id === parseInt(searchId) : true) &&
          (searchReason ? exp.reason.toLowerCase().includes(searchReason.toLowerCase()) : true)
      );

      setFilteredExpenses(filtered);
      setSearched(true);
      if (filtered.length === 0) alert('No expenses found for this search');
    } catch (error) {
      console.log('SEARCH ERROR:', error.response?.data || error.message);
      alert('Failed to search expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDate('');
    setId('');
    setReason('');
    setFilteredExpenses([]);
    setSearched(false);
  };

  const getCategoryColor = reason => {
    const colors = ['#00E5A0', '#7C3AED', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];
    if (!reason) return colors[0];
    return colors[reason.charCodeAt(0) % colors.length];
  };

  const activeFilters = [date, id, reason].filter(Boolean).length;

  const renderItem = ({ item }) => {
    const accentColor = getCategoryColor(item.reason);
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
            <Text style={styles.cardDate}>
              {item.date.split('T')[0]} · ID #{item.expense_id}
            </Text>
          </View>
          <Text style={[styles.cardAmount, { color: accentColor }]}>
            ${parseFloat(item.amount).toFixed(2)}
          </Text>
        </View>
        {item.bill_img && (
          <Image
            source={{ uri: `https://api.thurunu.me/uploads/${item.bill_img}` }}
            style={styles.billImage}
          />
        )}
      </View>
    );
  };

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
              <View>
                <Text style={styles.pageLabel}>FIND</Text>
                <Text style={styles.pageTitle}>Search Expenses</Text>
              </View>
              {(date || id || reason) && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>✕ Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Search Card */}
            <View style={styles.searchCard}>
              {/* Date Field */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>Date</Text>
                <View
                  style={[
                    styles.inputRow,
                    focusedField === 'date' && styles.inputRowFocused,
                  ]}>
                  <Text style={styles.inputIcon}>📅</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#4A4A5A"
                    value={date}
                    onChangeText={setDate}
                    onFocus={() => setFocusedField('date')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* ID Field */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>Expense ID</Text>
                <View
                  style={[
                    styles.inputRow,
                    focusedField === 'id' && styles.inputRowFocused,
                  ]}>
                  <Text style={styles.inputIcon}>#️⃣</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 42"
                    placeholderTextColor="#4A4A5A"
                    value={id}
                    onChangeText={setId}
                    keyboardType="numeric"
                    onFocus={() => setFocusedField('id')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Reason Field */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>Reason / Keyword</Text>
                <View
                  style={[
                    styles.inputRow,
                    focusedField === 'reason' && styles.inputRowFocused,
                  ]}>
                  <Text style={styles.inputIcon}>🔍</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. groceries"
                    placeholderTextColor="#4A4A5A"
                    value={reason}
                    onChangeText={setReason}
                    onFocus={() => setFocusedField('reason')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Active filters badge */}
              {activeFilters > 0 && (
                <View style={styles.filterBadgeRow}>
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>
                      {activeFilters} filter{activeFilters > 1 ? 's' : ''} active
                    </Text>
                  </View>
                </View>
              )}

              {/* Search Button */}
              <TouchableOpacity
                style={[styles.searchButton, loading && styles.searchButtonDisabled]}
                onPress={() => handleSearch(date, id, reason)}
                disabled={loading}
                activeOpacity={0.85}>
                {loading ? (
                  <ActivityIndicator color="#0A0A0F" size="small" />
                ) : (
                  <Text style={styles.searchButtonText}>🔍  Search</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Results header */}
            {searched && filteredExpenses.length > 0 && (
              <View style={styles.resultsHeader}>
                <Text style={styles.sectionLabel}>RESULTS</Text>
                <View style={styles.resultCountBadge}>
                  <Text style={styles.resultCountText}>{filteredExpenses.length} found</Text>
                </View>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          searched && !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔎</Text>
              <Text style={styles.emptyTitle}>No Results Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your filters or using a broader search term.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default SearchExpenses;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  bgCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#00E5A010',
    top: -50,
    right: -70,
  },
  bgCircle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#7C3AED0D',
    bottom: 100,
    left: -50,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Header
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },

  // Search Card
  searchCard: {
    backgroundColor: '#13131A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B6B80',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E0E16',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E1E2E',
    paddingHorizontal: 12,
    height: 48,
  },
  inputRowFocused: {
    borderColor: '#00E5A0', 
  },
  inputIcon: {
    fontSize: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#F0F0F8',
  },

  // Filter badge
  filterBadgeRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  filterBadge: {
    backgroundColor: '#00E5A015',
    borderWidth: 1,
    borderColor: '#00E5A030',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  filterBadgeText: {
    color: '#00E5A0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Search Button
  searchButton: {
    backgroundColor: '#00E5A0',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E5A0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#0A0A0F',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
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
  resultCountBadge: {
    backgroundColor: '#00E5A015',
    borderWidth: 1,
    borderColor: '#00E5A030',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  resultCountText: {
    color: '#00E5A0',
    fontSize: 11,
    fontWeight: '700',
  },

  // Expense Card
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
    fontSize: 17,
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
});