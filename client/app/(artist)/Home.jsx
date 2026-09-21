import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuth } from '../_layout';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const API_URL = "http://10.232.211.114:5000/api";

export default function ArtistUploadHome() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const router = useRouter();
  
  const [images, setImages] = useState([]); // Array of base64 image strings
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [imagesEnhanced, setImagesEnhanced] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for publishing
  
  const [formData, setFormData] = useState({ 
    name: '', category: 'Textiles', price: '', stock: 1, descriptionRegional: '' 
  });

  const CRAFT_CATEGORIES = [
    { id: 'Textiles', icon: 'shirt-outline', label: t('catTextiles') },
    { id: 'Pottery', icon: 'color-palette-outline', label: t('catPottery') },
    { id: 'Jewelry', icon: 'diamond-outline', label: t('catJewelry') },
    { id: 'Woodwork', icon: 'hammer-outline', label: t('catWoodwork') },
    { id: 'Other', icon: 'apps-outline', label: t('catOther') },
  ];

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permission Denied");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsMultipleSelection: true, 
      quality: 0.3, 
      base64: true
    });

    if (!result.canceled && result.assets) {
      const newBase64Images = result.assets.map(asset => `data:image/jpeg;base64,${asset.base64}`);
      setImages(prev => [...prev, ...newBase64Images]);
      
      setIsEnhancing(true);
      setTimeout(() => { 
        setIsEnhancing(false); 
        setImagesEnhanced(true); 
      }, 2000); 
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const adjustStock = (amount) => {
    setFormData(prev => ({ ...prev, stock: Math.max(1, prev.stock + amount) }));
  };

  const handleUpload = async () => {
    if (!formData.name || !formData.price || images.length === 0) {
      return Alert.alert("Missing Details", "Please add at least one photo, name, and price.");
    }

    setLoading(true); // Turn on loading spinner while AI and DB process
    try {
      const formattedImages = images.map(imgUrl => ({
        originalUrl: imgUrl,
        isEnhanced: true
      }));

      const payload = { 
        ...formData, 
        price: Number(formData.price), 
        craftType: formData.category, 
        material: "Auto-detected by AI", 
        descriptionEnglish: "Auto-translated professional description.", 
        images: formattedImages 
      };
      
      const response = await axios.post(`${API_URL}/artist/products`, payload, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (response.status === 201) {
        Alert.alert("Success! 🎉", "Your product has been published with AI enhancement.");
        setImages([]); 
        setImagesEnhanced(false);
        setFormData({ name: '', category: 'Textiles', price: '', stock: 1, descriptionRegional: '' });
        router.push('/(artist)/Profile');
      }
    } catch (error) { 
      console.log("UPLOAD ERROR:", error.response?.data || error.message);
      Alert.alert("Upload Failed", error.response?.data?.message || "Check your server connection."); 
    } finally {
      setLoading(false); // Turn off loading spinner
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <Text style={styles.title}>{t('listNewItem')}</Text>
        <Text style={styles.subtitle}>{t('showcaseCraft')}</Text>
      </View>

      {/* STEP 1: MULTI-IMAGE PICKER & AI PREVIEW */}
      <View style={styles.section}>
        <View style={styles.stepHeader}>
          <View style={styles.stepBadge}><Text style={styles.stepText}>1</Text></View>
          <Text style={styles.sectionTitle}>{t('step1')} (Multiple Allowed)</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.imageUploader} 
          onPress={pickImages} 
          disabled={isEnhancing}
          activeOpacity={0.8}
        >
          {isEnhancing ? (
            <ActivityIndicator size="large" color="#4f46e5" />
          ) : (
            <>
              <View style={styles.magicIconContainer}>
                <Ionicons name="images" size={40} color="#4f46e5" />
                <Ionicons name="sparkles" size={20} color="#f59e0b" style={styles.sparkle} />
              </View>
              <Text style={styles.uploadText}>Tap to select multiple photos</Text>
              <Text style={styles.aiHint}>{t('aiHintClean')}</Text>
            </>
          )}
        </TouchableOpacity>

        {images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewReel}>
            {images.map((imgUri, index) => (
              <View key={index} style={styles.previewWrapper}>
                <Image source={{ uri: imgUri }} style={styles.thumbnail} />
                <TouchableOpacity style={styles.deleteThumbnail} onPress={() => removeImage(index)}>
                  <Ionicons name="close-circle" size={22} color="#ef4444" />
                </TouchableOpacity>
                {imagesEnhanced && (
                  <View style={styles.thumbBadge}>
                    <Ionicons name="sparkles" size={10} color="white" />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* STEP 2: CATEGORY SELECTOR */}
      <View style={styles.section}>
        <View style={styles.stepHeader}>
          <View style={styles.stepBadge}><Text style={styles.stepText}>2</Text></View>
          <Text style={styles.sectionTitle}>{t('step2')}</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CRAFT_CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.categoryCard, formData.category === cat.id && styles.categoryCardActive]}
              onPress={() => setFormData({...formData, category: cat.id})}
            >
              <Ionicons name={cat.icon} size={28} color={formData.category === cat.id ? 'white' : '#6b7280'} />
              <Text style={[styles.categoryLabel, formData.category === cat.id && styles.textWhite]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* STEP 3: DETAILS */}
      <View style={styles.section}>
        <View style={styles.stepHeader}>
          <View style={styles.stepBadge}><Text style={styles.stepText}>3</Text></View>
          <Text style={styles.sectionTitle}>{t('step3')}</Text>
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="pricetag-outline" size={20} color="#6b7280" />
          <TextInput style={styles.input} placeholder={t('itemName')} value={formData.name} onChangeText={t => setFormData({...formData, name: t})} />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputBox, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput style={styles.input} placeholder={t('pricePerUnit')} keyboardType="numeric" value={formData.price} onChangeText={t => setFormData({...formData, price: t})} />
          </View>
          
          <View style={styles.stepperContainer}>
            <Text style={styles.stepperLabel}>{t('howMany')}</Text>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustStock(-1)}>
                <Ionicons name="remove" size={20} color="#1f2937" />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{formData.stock}</Text>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustStock(1)}>
                <Ionicons name="add" size={20} color="#1f2937" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.voiceContainer}>
          <View style={styles.voiceInputBox}>
            <TextInput 
              style={styles.voiceTextInput} 
              placeholder={t('typeDescription')} 
              multiline 
              value={formData.descriptionRegional} 
              onChangeText={t => setFormData({...formData, descriptionRegional: t})} 
            />
          </View>
          <TouchableOpacity style={styles.micButton} onPress={() => Alert.alert("Mic Active", "Speak description...")}>
            <Ionicons name="mic" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.voiceHint}>{t('voiceHint')}</Text>
      </View>

      {/* SUBMIT BUTTON WITH LOADING SPINNER */}
      <TouchableOpacity style={styles.submitButton} onPress={handleUpload} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={24} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.submitText}>{t('publishToMarket')}</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingHorizontal: 20 },
  header: { marginTop: 60, marginBottom: 25 },
  title: { fontSize: 28, fontWeight: '900', color: '#1f2937' },
  subtitle: { fontSize: 15, color: '#6b7280', marginTop: 5 },
  
  section: { marginBottom: 30 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  stepBadge: { backgroundColor: '#4f46e5', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  stepText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },

  imageUploader: { backgroundColor: 'white', height: 160, borderRadius: 16, borderWidth: 2, borderColor: '#e5e7eb', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  magicIconContainer: { position: 'relative', marginBottom: 10 },
  sparkle: { position: 'absolute', top: -5, right: -10 },
  uploadText: { fontSize: 16, fontWeight: 'bold', color: '#4f46e5' },
  aiHint: { fontSize: 12, color: '#9ca3af', marginTop: 5 },
  
  previewReel: { flexDirection: 'row', marginTop: 15 },
  previewWrapper: { position: 'relative', marginRight: 12 },
  thumbnail: { width: 90, height: 90, borderRadius: 12, backgroundColor: '#e5e7eb' },
  deleteThumbnail: { position: 'absolute', top: -6, right: -6, backgroundColor: 'white', borderRadius: 12 },
  thumbBadge: { position: 'absolute', bottom: 6, left: 6, backgroundColor: '#10b981', padding: 4, borderRadius: 8 },

  categoryScroll: { overflow: 'visible' },
  categoryCard: { backgroundColor: 'white', padding: 15, borderRadius: 16, alignItems: 'center', marginRight: 15, width: 100, elevation: 2 },
  categoryCardActive: { backgroundColor: '#4f46e5', elevation: 4 },
  categoryLabel: { fontSize: 12, fontWeight: 'bold', color: '#4b5563', marginTop: 10, textAlign: 'center' },
  textWhite: { color: 'white' },

  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#1f2937', marginLeft: 10 },
  currencySymbol: { fontSize: 18, fontWeight: 'bold', color: '#6b7280' },
  
  stepperContainer: { flex: 1, backgroundColor: 'white', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 10, alignItems: 'center' },
  stepperLabel: { fontSize: 12, color: '#6b7280', marginBottom: 5 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  stepperBtn: { backgroundColor: '#f3f4f6', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  stepperValue: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },

  voiceContainer: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 },
  voiceInputBox: { flex: 1, backgroundColor: 'white', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, minHeight: 50 },
  voiceTextInput: { flex: 1, fontSize: 15, color: '#1f2937' },
  micButton: { backgroundColor: '#10b981', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  voiceHint: { fontSize: 12, color: '#9ca3af', marginTop: 10, marginLeft: 10 },

  submitButton: { backgroundColor: '#111827', flexDirection: 'row', padding: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});