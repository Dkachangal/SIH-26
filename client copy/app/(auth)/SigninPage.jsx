import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';

export default function SigninPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentLang, currentLanguageDetails, changeLanguage, languages, t, loading } = useLanguage();

  const [isLangModalVisible, setLangModalVisible] = useState(false);

  const handleLanguageSelect = async (langCode) => {
    await changeLanguage(langCode);
    setLangModalVisible(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.langButton}
          onPress={() => setLangModalVisible(true)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#2563EB" style={{ marginRight: 8 }} />
          ) : (
            <Ionicons name="globe-outline" size={20} color="#374151" style={{ marginRight: 6 }} />
          )}
          <Text style={styles.langButtonText}>{currentLanguageDetails.native}</Text>
          <Ionicons name="chevron-down" size={16} color="#374151" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{t('welcome_title', 'Welcome to ArtisanHub')}</Text>
          <Text style={styles.subtitle}>
            {t('welcome_subtitle', 'How would you like to use the app today?')}
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={[styles.roleCard, styles.artistCard]}
            onPress={() => router.replace('/(artist)/Home')}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircleArtist}>
              <Ionicons name="color-palette-outline" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.roleTitle}>{t('role_sell', 'I want to Sell')}</Text>
            <Text style={styles.roleDescription}>{t('role_artisan', 'Artist / Seller')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.roleCard, styles.buyerCard]}
            onPress={() => router.replace('/(tabs)/Home')}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircleBuyer}>
              <Ionicons name="cart-outline" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.roleTitle}>{t('role_buy', 'I want to Buy')}</Text>
            <Text style={styles.roleDescription}>{t('role_buyer', 'Customer / B2B Buyer')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isLangModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setLangModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language / भाषा चुनें</Text>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.langOptionItem}
                  onPress={() => handleLanguageSelect(item.code)}
                >
                  <View>
                    <Text style={[
                      styles.nativeText,
                      currentLang === item.code && styles.activeLangText
                    ]}>
                      {item.native}
                    </Text>
                    <Text style={styles.labelText}>{item.label}</Text>
                  </View>
                  {currentLang === item.code && (
                    <Ionicons name="checkmark-circle" size={22} color="#2563EB" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 10 },
  langButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB', elevation: 2 },
  langButtonText: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', paddingBottom: 40 },
  headerTextContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center' },
  cardsContainer: { gap: 20 },
  roleCard: { borderRadius: 24, padding: 28, alignItems: 'center', elevation: 4 },
  artistCard: { backgroundColor: '#FFEDD5', borderWidth: 2, borderColor: '#F97316' },
  buyerCard: { backgroundColor: '#DCFCE7', borderWidth: 2, borderColor: '#22C55E' },
  iconCircleArtist: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  iconCircleBuyer: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  roleTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  roleDescription: { fontSize: 15, color: '#4B5563', fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '75%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16, textAlign: 'center' },
  langOptionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  nativeText: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  labelText: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  activeLangText: { color: '#2563EB' },
});