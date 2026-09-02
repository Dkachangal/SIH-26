import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function AddProduct() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Opens gallery for multiple image selection
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Requires iOS 14+ or Android 4.3+
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map(asset => asset.uri);
      setImages(selectedUris);
      
      // Simulate AI Processing time for background removal/enhancement
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // Prepares the payload for your local MongoDB backend
  const handleSaveToDatabase = async () => {
    if (images.length === 0) {
      Alert.alert("Missing Images", "Please select at least one image.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Missing Description", "Please add a short description.");
      return;
    }

    setIsSaving(true);

    try {
      // 1. Prepare FormData for file upload
      const formData = new FormData();
      
      images.forEach((uri, index) => {
        formData.append('images', {
          uri: uri,
          name: `product_image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });
      
      formData.append('description', description);
      formData.append('artisanId', 'artisan_123'); // Mock ID

      // 2. Send to your localhost backend
      // Replace with your actual local IP (e.g., http://192.168.1.5:3000/api/products)
      // Do NOT use 'localhost' if testing on a physical device, use the local IPv4 address
      /*
      const response = await fetch('http://YOUR_LOCAL_IP:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      */

      // Simulate network request success
      setTimeout(() => {
        setIsSaving(false);
        Alert.alert("Success!", "Product saved to your catalog.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      }, 1500);

    } catch (error) {
      console.error(error);
      setIsSaving(false);
      Alert.alert("Error", "Could not save the product.");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Product</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Step 1: Image Selection & AI Processing Studio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Product Photos</Text>
          
          {images.length === 0 ? (
            <TouchableOpacity style={styles.uploadPlaceholder} onPress={pickImages}>
              <Ionicons name="image-outline" size={48} color="#9CA3AF" />
              <Text style={styles.uploadText}>Tap to select images from gallery</Text>
            </TouchableOpacity>
          ) : (
            <View>
              {isProcessing ? (
                <View style={styles.processingBox}>
                  <ActivityIndicator size="large" color="#2563EB" />
                  <Text style={styles.processingText}>AI is enhancing your images...</Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                  {images.map((uri, index) => (
                    <View key={index} style={styles.imageCard}>
                      
                      {/* Original Image */}
                      <View style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.productImage} />
                        <Text style={styles.imageLabel}>Original</Text>
                        <TouchableOpacity style={styles.deleteIcon} onPress={() => removeImage(index)}>
                          <Ionicons name="close-circle" size={24} color="#EF4444" />
                        </TouchableOpacity>
                      </View>

                      {/* Simulated AI Processed Image (Clean Background) */}
                      <View style={[styles.imageWrapper, styles.aiWrapper]}>
                        <Image source={{ uri }} style={styles.productImage} />
                        <View style={styles.aiOverlay} />
                        <Text style={styles.imageLabelAi}>✨ AI Enhanced</Text>
                      </View>

                    </View>
                  ))}
                </ScrollView>
              )}
              
              <TouchableOpacity style={styles.addMoreBtn} onPress={pickImages}>
                <Ionicons name="add" size={20} color="#2563EB" />
                <Text style={styles.addMoreText}>Change / Add More Photos</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Step 2: Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>2. Voice & Text Description</Text>
            <TouchableOpacity style={styles.micButton}>
              <Ionicons name="mic" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.textInput}
            placeholder="Describe your craft, materials used, and sizing..."
            placeholderTextColor="#9CA3AF"
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveToDatabase}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={24} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save & Upload</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  uploadPlaceholder: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  uploadText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  processingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  processingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  imageScroll: {
    flexDirection: 'row',
  },
  imageCard: {
    flexDirection: 'row',
    marginRight: 20,
    gap: 12,
  },
  imageWrapper: {
    position: 'relative',
    width: 140,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  imageLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 4,
  },
  aiWrapper: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  aiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    opacity: 0.15, // Simulates a clean white studio background visually for the mockup
  },
  imageLabelAi: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 4,
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    gap: 8,
  },
  addMoreText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  micButton: {
    backgroundColor: '#111827',
    padding: 8,
    borderRadius: 20,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 120,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});