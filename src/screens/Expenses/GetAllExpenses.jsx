import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NavBar from '../../components/NavBar';

const GetAllExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const handleGetAll = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        alert('Login required');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        'https://api.thurunu.me/api/expenses/all',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExpenses(response.data);
      setFetched(true);
      console.log('Fetched Data:', response.data);
    } catch (error) {
      console.log('FETCH ERROR:', error.response?.data || error.message);
      alert('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  // Compute total
  const total = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const getCategoryColor = (reason) => {
    const colors = ['#00E5A0', '#7C3AED', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];
    if (!reason) return colors[0];
    const idx = reason.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  const renderItem = ({ item, index }) => {
    const accentColor = getCategoryColor(item.reason);
    return (
      <View style={[styles.card, { borderLeftColor: accentColor }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.categoryDot, { backgroundColor: accentColor + '25' }]}>
            <Text style={[styles.categoryIcon, { color: accentColor }]}>💳</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardReason} numberOfLines={1}>
              {item.reason || 'Unnamed Expense'}
            </Text>
            <Text style={styles.cardDate}>
              {new Date(item.date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.amountBadge}>
            <Text style={[styles.cardAmount, { color: accentColor }]}>
              ${parseFloat(item.amount).toFixed(2)}
            </Text>
          </View>
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

      {/* Background circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <NavBar />

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.expense_id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Page title */}
            <View style={styles.pageHeader}>
              <View>
                <Text style={styles.pageLabel}>OVERVIEW</Text>
                <Text style={styles.pageTitle}>All Expenses</Text>
              </View>
              <TouchableOpacity
                style={[styles.refreshButton, loading && styles.refreshButtonDisabled]}
                onPress={handleGetAll}
                disabled={loading}
                activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#0A0A0F" size="small" />
                ) : (
                  <Text style={styles.refreshButtonText}>
                    {fetched ? '↻  Refresh' : '↓  Load'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Summary card */}
            {fetched && expenses.length > 0 && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
                  <Text style={styles.summaryLabel}>Total Spent</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{expenses.length}</Text>
                  <Text style={styles.summaryLabel}>Transactions</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    ${(total / expenses.length).toFixed(2)}
                  </Text>
                  <Text style={styles.summaryLabel}>Avg / Entry</Text>
                </View>
              </View>
            )}

            {/* Section label */}
            {fetched && expenses.length > 0 && (
              <Text style={styles.sectionLabel}>RECENT TRANSACTIONS</Text>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading && fetched ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🗂</Text>
              <Text style={styles.emptyTitle}>No Expenses Found</Text>
              <Text style={styles.emptySubtitle}>
                Your expense list is empty. Add your first expense to get started.
              </Text>
            </View>
          ) : !fetched && !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>Ready to Load</Text>
              <Text style={styles.emptySubtitle}>
                Tap the Load button above to fetch your expenses.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default GetAllExpenses;

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
    backgroundColor: '#00E5A010',
    top: -60,
    right: -70,
  },
  bgCircle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#7C3AED0D',
    bottom: 120,
    left: -50,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Page Header
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
  refreshButton: {
    backgroundColor: '#00E5A0',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 90,
    alignItems: 'center',
    shadowColor: '#00E5A0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshButtonText: {
    color: '#0A0A0F',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.3,
  },

  // Summary Card
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#13131A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00E5A0',
    letterSpacing: -0.3,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#4A4A5A',
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#1E1E2E',
    alignSelf: 'center',
  },

  // Section Label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A4A5A',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
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
  categoryDot: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 18,
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
  amountBadge: {
    marginLeft: 8,
  },
  cardAmount: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  billImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 14,
    backgroundColor: '#0E0E16',
  },

  // Empty states
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
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