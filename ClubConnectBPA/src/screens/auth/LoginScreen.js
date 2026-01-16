import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView, 
  Platform,
} from 'react-native'; 
import LinearGradient from '../../components/LinearGradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../context/AuthContext';
import {COLORS, SIZES} from '../../utils/constants';
import {Button} from '../../components/Button';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="school" size={48} color={COLORS.white} />
          </View>
          <Text style={styles.title}>Club Connect</Text>
          <Text style={styles.subtitle}>Student Organization Hub</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding.xl,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: SIZES.text.display,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.text.lg,
    color: COLORS.white,
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius.xl * 2,
    borderTopRightRadius: SIZES.radius.xl * 2,
    paddingHorizontal: SIZES.padding.xl,
    paddingTop: SIZES.padding.xl * 2,
    paddingBottom: SIZES.padding.xl,
    ...SIZES.shadow.large,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.lg,
    paddingHorizontal: SIZES.padding.md,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    marginRight: SIZES.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SIZES.padding.md,
    fontSize: SIZES.text.base,
    color: COLORS.textPrimary,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.lg,
  },
  forgotText: {
    fontSize: SIZES.text.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding.md + 2,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    ...SIZES.shadow.medium,
  },
  loginButtonText: {
    fontSize: SIZES.text.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SIZES.md,
    fontSize: SIZES.text.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: COLORS.transparent,
    paddingVertical: SIZES.padding.md,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  registerButtonText: {
    fontSize: SIZES.text.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default LoginScreen;
