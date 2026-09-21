import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList, ScrollView, Alert } from 'react-native';
import { useAuth } from '../_layout';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { AVAILABLE_LANGUAGES } from '../i18n';

const DUMMY_ORDERS = [
  { id: 'ORD1293', date: 'Oct 12, 2024', totalAmount: 4500, status: 'delivered', items: [{ name: 'Handwoven Silk Saree', quantity: 1 }, { name: 'Terracotta Vase', quantity: 5 }] },
  { id: 'ORD1294', date: 'Oct 24, 2024', totalAmount: 12000, status: 'processing', items: [{ name: 'Bulk Bamboo Baskets (Cluster)', quantity: 50 }] }
];

export default function Settings() {
  const { logout, user, login, token } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [editModal, setEditModal] = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/SigninPage');
  };

  const changeLanguage = async (langCode) => {
    await i18n.changeLanguage(langCode);
    await AsyncStorage.setItem('appLanguage', langCode);
    setLangModalVisible(false);
  };

  const handleUpdateProfile = async () => {
    const updatedUser = { ...user, name: formData.name, email: formData.email, phone: formData.phone };
    await login(updatedUser, token);
    setEditModal(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const currentLang = AVAILABLE_LANGUAGES.find(l => l.code === i18n.language) || AVAILABLE_LANGUAGES[0];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('settings')}</Text>
      
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.phone}>{user?.phone}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => setEditModal(true)}>
          <Ionicons name="person-circle-outline" size={24} color="#10b981" />
          <Text style={styles.menuText}>{t('editProfile')}</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" style={styles.menuArrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setOrderModal(true)}>
          <Ionicons name="cube-outline" size={24} color="#10b981" />
          <Text style={styles.menuText}>{t('orderHistory')}</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" style={styles.menuArrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setLangModalVisible(true)}>
          <Ionicons name="language-outline" size={24} color="#10b981" />
          <Text style={styles.menuText}>{t('language')} ({currentLang.native})</Text>
          <Ionicons name="chevron-down" size={20} color="#9ca3af" style={styles.menuArrow} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>{t('signOut')}</Text>
      </TouchableOpacity>

      {/* LANGUAGE MODAL */}
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

      {/* EDIT PROFILE MODAL (Same as Before) */}
      <Modal visible={editModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('editProfile')}</Text>
            <TextInput style={styles.input} value={formData.name} onChangeText={t => setFormData({...formData, name: t})} placeholder="Full Name" />
            <TextInput style={styles.input} value={formData.email} onChangeText={t => setFormData({...formData, email: t})} placeholder="Email" keyboardType="email-address" />
            <TextInput style={styles.input} value={formData.phone} onChangeText={t => setFormData({...formData, phone: t})} placeholder="Phone" keyboardType="phone-pad" />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModal(false)}>
                <Text style={styles.cancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateProfile}>
                <Text style={styles.saveText}>{t('saveChanges')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ORDER HISTORY MODAL (Same as Before) */}
      <Modal visible={orderModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentFull}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('orderHistory')}</Text>
              <TouchableOpacity onPress={() => setOrderModal(false)}>
                <Ionicons name="close-circle" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={DUMMY_ORDERS}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>{item.id}</Text>
                    <Text style={[styles.orderStatus, item.status === 'delivered' ? styles.statusGreen : styles.statusOrange]}>
                      {item.status === 'delivered' ? t('delivered') : t('processing')}
                    </Text>
                  </View>
                  <Text style={styles.orderDate}>{item.date}</Text>
                  <View style={styles.orderItems}>
                    {item.items.map((prod, idx) => (
                      <Text key={idx} style={styles.itemText}>• {prod.name} (x{prod.quantity})</Text>
                    ))}
                  </View>
                  <Text style={styles.orderTotal}>Total: ₹{item.totalAmount}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f3f4f6' },
  title: { fontSize: 28, fontWeight: '900', color: '#1f2937', marginBottom: 20 },
  
  profileCard: { flexDirection: 'row', backgroundColor: 'white', padding: 20, borderRadius: 16, alignItems: 'center', elevation: 2, marginBottom: 25 },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  email: { color: '#6b7280', fontSize: 14, marginTop: 2 },
  phone: { color: '#6b7280', fontSize: 14, marginTop: 2 },

  menuContainer: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', elevation: 2, marginBottom: 25 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f3f4f6' },
  menuText: { fontSize: 16, color: '#1f2937', fontWeight: 'bold', marginLeft: 15, flex: 1 },
  menuArrow: { marginLeft: 'auto' },

  logoutBtn: { flexDirection: 'row', backgroundColor: '#fee2e2', padding: 18, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  logoutText: { fontWeight: 'bold', color: '#ef4444', fontSize: 16, marginLeft: 10 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', padding: 25, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '60%' },
  modalContentFull: { backgroundColor: '#f9fafb', flex: 0.9, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1f2937' },
  
  langOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, backgroundColor: '#f9fafb', marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  langOptionActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  langOptionText: { fontSize: 16, color: '#1f2937', fontWeight: '500' },
  langOptionTextActive: { color: 'white', fontWeight: 'bold' },

  input: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { flex: 1, padding: 15, alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, marginRight: 10 },
  cancelText: { color: '#6b7280', fontWeight: 'bold' },
  saveBtn: { flex: 1, padding: 15, alignItems: 'center', backgroundColor: '#10b981', borderRadius: 12 },
  saveText: { color: 'white', fontWeight: 'bold' },

  // Order Cards
  orderCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 1 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontWeight: 'bold', color: '#1f2937', fontSize: 16 },
  orderStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  statusGreen: { backgroundColor: '#d1fae5', color: '#065f46' },
  statusOrange: { backgroundColor: '#fef3c7', color: '#92400e' },
  orderDate: { color: '#6b7280', fontSize: 12, marginTop: 4, marginBottom: 10 },
  orderItems: { backgroundColor: '#f9fafb', padding: 10, borderRadius: 8, marginBottom: 10 },
  itemText: { color: '#4b5563', fontSize: 13, marginBottom: 2 },
  orderTotal: { fontWeight: 'bold', color: '#10b981', fontSize: 16, textAlign: 'right' }
});