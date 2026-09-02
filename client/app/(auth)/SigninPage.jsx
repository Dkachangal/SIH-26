// app/(auth)/SigninPage.jsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const LANGUAGES = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'hi', label: 'Hindi', native: 'हिंदी' },
  { id: 'bn', label: 'Bengali', native: 'বাংলা' },
  { id: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { id: 'te', label: 'Telugu', native: 'తెలుగు' },
];

export default function SigninPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isLangModalVisible, setLangModalVisible] = useState(false);

  // Future-proofing: Here you would update your global i18n state
  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setLangModalVisible(false);
  };

  const handleRoleSelection = (role) => {
    if (role === 'buyer') {
      router.replace('/(tabs)/Home');
    } else if (role === 'artist') {
      router.replace('/(artist)/Home');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      {/* Top Bar: Language Selector */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.langButton}
          onPress={() => setLangModalVisible(true)}
        >
          <Ionicons name="globe-outline" size={20} color="#374151" />
          <Text style={styles.langButtonText}>{selectedLanguage.native}</Text>
          <Ionicons name="chevron-down" size={16} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Welcome to ArtisanHub</Text>
          <Text style={styles.subtitle}>How would you like to use the app today?</Text>
        </View>

        {/* Role Selection Cards */}
        <View style={styles.cardsContainer}>
          
          {/* Artist / Seller Card */}
          <TouchableOpacity 
            style={[styles.roleCard, styles.artistCard]}
            onPress={() => handleRoleSelection('artist')}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircleArtist}>
              <Ionicons name="color-palette-outline" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.roleTitle}>I want to Sell</Text>
            <Text style={styles.roleDescription}>Artist / Seller</Text>
          </TouchableOpacity>

          {/* Buyer / Customer Card */}
          <TouchableOpacity 
            style={[styles.roleCard, styles.buyerCard]}
            onPress={() => handleRoleSelection('buyer')}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircleBuyer}>
              <Ionicons name="cart-outline" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.roleTitle}>I want to Buy</Text>
            <Text style={styles.roleDescription}>Customer / B2B Buyer</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={isLangModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setLangModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.langOptionItem}
                  onPress={() => handleLanguageSelect(item)}
                >
                  <Text style={[
                    styles.langOptionText,
                    selectedLanguage.id === item.id && styles.langOptionTextSelected
                  ]}>
                    {item.native} ({item.label})
                  </Text>
                  {selectedLanguage.id === item.id && (
                    <Ionicons name="checkmark" size={24} color="#2563EB" />
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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  langButtonText: {
    marginHorizontal: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  headerTextContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 20,
  },
  roleCard: {
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  artistCard: {
    backgroundColor: '#FFEDD5', // Light orange/peach to match original wireframe concept
    borderWidth: 2,
    borderColor: '#F97316',
  },
  buyerCard: {
    backgroundColor: '#DCFCE7', // Light green to match original wireframe concept
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  iconCircleArtist: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircleBuyer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    borderRadius: 20,
    padding: 24,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  langOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  langOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  langOptionTextSelected: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
});