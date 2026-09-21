import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../_layout';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { AVAILABLE_LANGUAGES } from '../i18n';

const API_URL = "http://10.232.211.114:5000/api";

export default function SigninPage() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [langModalVisible, setLangModalVisible] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email: email.trim(), password });
      if (response.data.token) {
        await login(response.data.user, response.data.token);
        router.replace(response.data.user.role === 'artisan' ? '/(artist)/Feed' : '/(tabs)/Home');
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    }
  };

  const changeLanguage = async (langCode) => {
    await i18n.changeLanguage(langCode);
    await AsyncStorage.setItem('appLanguage', langCode);
    setLangModalVisible(false);
  };

  const currentLang = AVAILABLE_LANGUAGES.find(l => l.code === i18n.language) || AVAILABLE_LANGUAGES[0];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      
      {/* Absolute Language Dropdown Trigger */}
      <TouchableOpacity style={styles.langToggle} onPress={() => setLangModalVisible(true)}>
        <Ionicons name="language" size={20} color="#4f46e5" />
        <Text style={styles.langText}>{currentLang.native}</Text>
        <Ionicons name="chevron-down" size={16} color="#4f46e5" style={{marginLeft: 4}} />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="color-palette" size={40} color="#4f46e5" />
        </View>
        <Text style={styles.title}>{t('appName')}</Text>
        <Text style={styles.subtitle}>{t('welcomeBack')}</Text>
        <Text style={styles.subWelcome}>{t('subWelcome')}</Text>
      </View>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder={t('email')} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder={t('password')} secureTextEntry value={password} onChangeText={setPassword} />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{t('signIn')}</Text>
          <Ionicons name="arrow-forward" size={20} color="white" style={{marginLeft: 10}} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/(auth)/SignupPage')}>
          <Text style={styles.linkText}>{t('noAccount')} <Text style={styles.linkBold}>{t('signUp')}</Text></Text>
        </TouchableOpacity>
      </View>

      {/* LANGUAGE SELECTION MODAL */}
      <Modal visible={langModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={AVAILABLE_LANGUAGES}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.langOption, i18n.language === item.code && styles.langOptionActive]}
                  onPress={() => changeLanguage(item.code)}
                >
                  <Text style={[styles.langOptionText, i18n.language === item.code && styles.langOptionTextActive]}>
                    {item.native} ({item.label})
                  </Text>
                  {i18n.language === item.code && <Ionicons name="checkmark" size={20} color="white" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', justifyContent: 'center', padding: 20 },
  langToggle: { position: 'absolute', top: 50, right: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, elevation: 2 },
  langText: { marginLeft: 6, color: '#4f46e5', fontWeight: 'bold' },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  iconCircle: { width: 80, height: 80, backgroundColor: '#e0e7ff', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 36, fontWeight: '900', color: '#1f2937' },
  subtitle: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginTop: 10 },
  subWelcome: { fontSize: 14, color: '#6b7280', marginTop: 5 },
  form: { backgroundColor: 'white', padding: 25, borderRadius: 20, elevation: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, marginBottom: 15, paddingHorizontal: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#1f2937' },
  button: { backgroundColor: '#4f46e5', flexDirection: 'row', padding: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 20 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  linkButton: { alignItems: 'center' },
  linkText: { color: '#6b7280', fontSize: 15 },
  linkBold: { color: '#4f46e5', fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', padding: 25, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  langOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, backgroundColor: '#f9fafb', marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  langOptionActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  langOptionText: { fontSize: 16, color: '#1f2937', fontWeight: '500' },
  langOptionTextActive: { color: 'white', fontWeight: 'bold' }
});