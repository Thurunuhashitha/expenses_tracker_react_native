import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.thurunu.me/api/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const accessToken = response.data.token;
      if (!accessToken) {
        Alert.alert('Login Error', 'Token not returned from server');
        return;
      }
      await AsyncStorage.setItem('authToken', accessToken);
      Alert.alert('Login Success', 'You Have Successfully Logged In');
      navigation.navigate('GetAllExpenses');
    } catch (error) {
      if (error.response) {
        console.log('Server error:', error.response.data);
        Alert.alert('Login Error', error.response.data.message || 'Please Try Again');
      } else if (error.request) {
        console.log('No response received:', error.request);
        Alert.alert('Network Error', 'No response from server. Check your connection.');
      } else {
        console.log('Axios error:', error.message);
        Alert.alert('Login Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Background decorative circles */}
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>◈</Text>
            </View>
            <Text style={styles.appName}>ExpenseIQ</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>

            {/* Email Field */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === 'email' && styles.inputContainerFocused,
                ]}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#4A4A5A"
                  onChangeText={setEmail}
                  value={email}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldWrapper}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === 'password' && styles.inputContainerFocused,
                ]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#4A4A5A"
                  onChangeText={setPassword}
                  value={password}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}>
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#0A0A0F" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Link */}
            <TouchableOpacity
              style={styles.registerLinkButton}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}>
              <Text style={styles.registerLinkText}>
                Don't have an account?{' '}
                <Text style={styles.registerLinkHighlight}>Create one</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>$2M+</Text>
              <Text style={styles.statLabel}>Tracked</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.9★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  scrollContent: {
    flexGrow: 1,
  },
  bgCircle1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#00E5A018',
    top: -60,
    left: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#7C3AED12',
    bottom: 80,
    right: -60,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // Header
  headerSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#00E5A0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#00E5A0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 26,
    color: '#0A0A0F',
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00E5A0',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F0F0F8',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B80',
    letterSpacing: 0.2,
  },

  // Card
  card: {
    width: '100%',
    backgroundColor: '#13131A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
  },

  // Fields
  fieldWrapper: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8888A0',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 12,
    color: '#00E5A0',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E0E16',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E1E2E',
    paddingHorizontal: 14,
    height: 52,
  },
  inputContainerFocused: {
    borderColor: '#00E5A0', 
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#F0F0F8',
    letterSpacing: 0.2,
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 16,
  },

  // Login Button
  loginButton: {
    backgroundColor: '#00E5A0',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#00E5A0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#0A0A0F',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E1E2E',
  },
  dividerText: {
    color: '#4A4A5A',
    fontSize: 12,
    marginHorizontal: 12,
    fontWeight: '500',
  },

  // Register Link
  registerLinkButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  registerLinkText: {
    fontSize: 14,
    color: '#6B6B80',
  },
  registerLinkHighlight: {
    color: '#00E5A0',
    fontWeight: '700',
  },

  // Stats Strip
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    backgroundColor: '#13131A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E1E2E',
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00E5A0',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11,
    color: '#4A4A5A',
    marginTop: 2,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#1E1E2E',
  },
});