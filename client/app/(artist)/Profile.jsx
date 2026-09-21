import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import axios from 'axios';
import { useAuth } from '../_layout';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AVAILABLE_LANGUAGES } from '../i18n';

const API_URL = "http://10.232.211.114:5000/api";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [langModalVisible, setLangModalVisible] = useState(false);

  useEffect(() => {
    if (user?.id) {
      axios.get(`${API_URL}/artist/products/${user.id}`)
        .then(res => setProducts(res.data.products))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/SigninPage');
  };

  const changeLanguage = async (langCode) => {
    await i18n.changeLanguage(langCode);
    await AsyncStorage.setItem('appLanguage', langCode);
    setLangModalVisible(false);
  };

  const totalStock = products.reduce((sum, item) => sum + (item.stock || 1), 0);

  const renderProduct = ({ item }) => (
    <View style={styles.gridCard}>
      <Image source={{ uri: item.images[0]?.originalUrl }} style={styles.gridImage} />
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.gridRow}>
          <Text style={styles.gridPrice}>₹{item.price}</Text>
          <Text style={styles.gridStock}>Qty: {item.stock}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.name}>{user?.name}</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="white" />
              <Text style={styles.roleText}> Verified Artisan</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.langBtn} onPress={() => setLangModalVisible(true)}>
            <Ionicons name="language" size={20} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{products.length}</Text>
            <Text style={styles.statLabel}>{t('totalItems')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{totalStock}</Text>
            <Text style={styles.statLabel}>{t('totalStock')}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{t('myInventory')}</Text>
      
      {loading ? <ActivityIndicator size="large" color="#4f46e5" style={{marginTop: 50}} /> : (
        <FlatList
          data={products}
          keyExtractor={i => i._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No creations uploaded yet.</Text>}
          renderItem={renderProduct}
        />
      )}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingHorizontal: 20, paddingTop: 60 },
  header: { backgroundColor: 'white', padding: 20, borderRadius: 16, elevation: 3, marginBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: 24, fontWeight: '900', color: '#1f2937' },
  verifiedBadge: { flexDirection: 'row', backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignItems: 'center', marginTop: 5, alignSelf: 'flex-start' },
  roleText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  langBtn: { backgroundColor: '#e0e7ff', padding: 10, borderRadius: 20 },
  
  statsContainer: { flexDirection: 'row', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderColor: '#f3f4f6' },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#e5e7eb' },
  statNum: { fontSize: 22, fontWeight: 'bold', color: '#4f46e5' },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 15 },
  
  row: { justifyContent: 'space-between' },
  gridCard: { backgroundColor: 'white', width: '48%', borderRadius: 12, overflow: 'hidden', marginBottom: 15, elevation: 2 },
  gridImage: { width: '100%', height: 120, backgroundColor: '#e5e7eb' },
  gridInfo: { padding: 10 },
  gridName: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, alignItems: 'center' },
  gridPrice: { color: '#4f46e5', fontWeight: 'bold' },
  gridStock: { fontSize: 12, color: '#6b7280' },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 20 },
  
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fee2e2', padding: 15, borderRadius: 12, marginVertical: 20 },
  logoutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', padding: 25, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  langOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, backgroundColor: '#f9fafb', marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  langOptionActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  langOptionText: { fontSize: 16, color: '#1f2937', fontWeight: '500' },
  langOptionTextActive: { color: 'white', fontWeight: 'bold' }
});