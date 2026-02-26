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
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const navigation = useNavigation();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);

  function hadelRegister() {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    axios
      .post('https://api.thurunu.me/api/auth/register', {
        name: name,
        email: email,
        password: password,
      })
      .then(response => {
        console.log('Success:', response.data);
        Alert.alert('Success', 'Registration successful');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.log('Error:', error.response?.data || error.message);
        Alert.alert('Error', 'Registration failed');
      })
      .finally(() => setLoading(false));
  }

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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start tracking your finances today</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Name Field */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Full Name</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === 'name' && styles.inputContainerFocused,
                ]}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#4A4A5A"
                  onChangeText={setName}
                  value={name}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="words"
                />
              </View>
            </View>

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
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === 'password' && styles.inputContainerFocused,
                ]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Min. 8 characters"
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

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={hadelRegister}
              activeOpacity={0.85}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#0A0A0F" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginLinkButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}>
              <Text style={styles.loginLinkText}>
                Already have an account?{' '}
                <Text style={styles.loginLinkHighlight}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer note */}
          <Text style={styles.footerNote}>
            By creating an account, you agree to our{'\n'}
            <Text style={styles.footerLink}>Terms of Service</Text> &{' '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

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
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#00E5A020',
    top: -80,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#7C3AED15',
    bottom: 100,
    left: -60,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // Header
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8888A0',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
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

  // Register Button
  registerButton: {
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
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
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

  // Login Link
  loginLinkButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#6B6B80',
  },
  loginLinkHighlight: {
    color: '#00E5A0',
    fontWeight: '700',
  },

  // Footer
  footerNote: {
    marginTop: 24,
    fontSize: 12,
    color: '#4A4A5A',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#6B6B80',
    textDecorationLine: 'underline',
  },
});