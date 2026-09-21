import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const API_URL = "http://10.232.211.114:5000/api";

export default function SignupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'artisan' }); // Defaulting to Artisan to reduce friction for them

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      return Alert.alert("Error", "Please fill all fields");
    }
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name.trim(), email: formData.email.trim(), 
        phone: formData.phone.trim(), password: formData.password, role: formData.role
      });
      if (response.status === 201) {
        Alert.alert("Success", "Account created! Welcome to KalaaSetu.");
        router.replace('/(auth)/SigninPage');
      }
    } catch (error) {
      Alert.alert("Registration Failed", error.response?.data?.message || "Please check your network.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('signUp')}</Text>
        <Text style={styles.joinAs}>{t('joinAs')}</Text>
      </View>
      
      {/* Visual Role Selection Cards */}
      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleCard, formData.role === 'artisan' && styles.roleCardActive]} 
          onPress={() => setFormData({...formData, role: 'artisan'})}
          activeOpacity={0.8}
        >
          <Ionicons name="hammer-outline" size={32} color={formData.role === 'artisan' ? 'white' : '#4f46e5'} />
          <Text style={[styles.roleTitle, formData.role === 'artisan' && styles.textWhite]}>{t('artisanRole')}</Text>
          <Text style={[styles.roleDesc, formData.role === 'artisan' && styles.textWhite]}>{t('artisanDesc')}</Text>
          {formData.role === 'artisan' && <Ionicons name="checkmark-circle" size={24} color="white" style={styles.checkIcon} />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleCard, formData.role === 'customer' && styles.roleCardActive]} 
          onPress={() => setFormData({...formData, role: 'customer'})}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={32} color={formData.role === 'customer' ? 'white' : '#10b981'} />
          <Text style={[styles.roleTitle, formData.role === 'customer' && styles.textWhite]}>{t('buyerRole')}</Text>
          <Text style={[styles.roleDesc, formData.role === 'customer' && styles.textWhite]}>{t('buyerDesc')}</Text>
          {formData.role === 'customer' && <Ionicons name="checkmark-circle" size={24} color="white" style={styles.checkIcon} />}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder={t('fullName')} value={formData.name} onChangeText={t => setFormData({...formData, name: t})} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder={t('phone')} keyboardType="phone-pad" value={formData.phone} onChangeText={t => setFormData({...formData, phone: t})} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder={t('email')} autoCapitalize="none" keyboardType="email-address" value={formData.email} onChangeText={t => setFormData({...formData, email: t})} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder={t('password')} secureTextEntry value={formData.password} onChangeText={t => setFormData({...formData, password: t})} />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>{t('createAccount')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => router.replace('/(auth)/SigninPage')}>
          <Text style={styles.linkText}>{t('haveAccount')} <Text style={styles.linkBold}>{t('signIn')}</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f3f4f6', padding: 20, paddingTop: 60 },
  header: { marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', color: '#1f2937' },
  joinAs: { fontSize: 18, color: '#6b7280', marginTop: 5, fontWeight: 'bold' },
  
  roleContainer: { flexDirection: 'column', marginBottom: 25 },
  roleCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 15, borderWidth: 2, borderColor: 'transparent', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
  roleCardActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5', elevation: 6 },
  roleTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginTop: 10 },
  roleDesc: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  textWhite: { color: 'white' },
  checkIcon: { position: 'absolute', top: 20, right: 20 },
  
  form: { backgroundColor: 'white', padding: 25, borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, marginBottom: 15, paddingHorizontal: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#1f2937' },
  
  button: { backgroundColor: '#111827', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 5, marginBottom: 20 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  linkButton: { alignItems: 'center' },
  linkText: { color: '#6b7280', fontSize: 15 },
  linkBold: { color: '#4f46e5', fontWeight: 'bold' }
});