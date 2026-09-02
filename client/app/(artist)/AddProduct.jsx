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
import axios from 'axios'; // Ensure you have installed axios

export default function AddProduct() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [images, setImages] = useState([]);
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Optional: State to hold the URLs returned by the backend if you want to display them
    const [enhancedUrls, setEnhancedUrls] = useState([]);

const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      // FIXED: Use the new array format instead of MediaTypeOptions
      mediaTypes: ['images'], 
      allowsMultipleSelection: true, 
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map(asset => asset.uri);
      setImages(selectedUris);
    }
  };

    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleSaveToDatabase = async () => {
        // Basic validation
        if (images.length === 0) {
            Alert.alert("Missing Images", "Please select at least one image.");
            return;
        }
        if (!description.trim()) {
            Alert.alert("Missing Description", "Please add a short description.");
            return;
        }

        // This triggers the ActivityIndicator spinner on your button
        setIsSaving(true);

        try {
            // 1. FORMAT THE DATA
            const formData = new FormData();

            images.forEach((uri, index) => {
                formData.append('images', {
                    uri: uri,
                    name: `product_image_${Date.now()}_${index}.jpg`,
                    type: 'image/jpeg',
                });
            });

            formData.append('description', description);
            formData.append('email', 'artisan@example.com'); // Replace with actual logged-in user email

            // 2. SEND TO BACKEND
            const response = await axios.post("https://lumen-backend-n5li.onrender.com/api/product/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // 3. RECEIVE URLS & REDIRECT
            if (response.data && response.data.enhancedImageUrls) {

                // Here is your array of enhanced URLs from the backend!
                const finalUrls = response.data.enhancedImageUrls;
                console.log("Successfully received URLs from AI:", finalUrls);

                // Show success message, then force redirect exactly to the Home screen
                Alert.alert("Success!", "Product uploaded and enhanced successfully.", [
                    {
                        text: "Great",
                        onPress: () => router.replace('/(artist)/Home')
                    }
                ]);

            } else {
                throw new Error("Invalid response format from server");
            }

        } catch (error) {
            console.error("Upload Error: ", error);
            Alert.alert("Upload Failed", "Could not connect to the AI processing server.");
        } finally {
            setIsSaving(false); // Turns off the button spinner
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Product</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Product Photos</Text>

                    {images.length === 0 ? (
                        <TouchableOpacity style={styles.uploadPlaceholder} onPress={pickImages}>
                            <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                            <Text style={styles.uploadText}>Tap to select images from gallery</Text>
                        </TouchableOpacity>
                    ) : (
                        <View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                                {images.map((uri, index) => (
                                    <View key={index} style={styles.imageCard}>
                                        <View style={styles.imageWrapper}>
                                            <Image source={{ uri }} style={styles.productImage} />
                                            <Text style={styles.imageLabel}>Original</Text>
                                            <TouchableOpacity style={styles.deleteIcon} onPress={() => removeImage(index)}>
                                                <Ionicons name="close-circle" size={24} color="#EF4444" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>

                            <TouchableOpacity style={styles.addMoreBtn} onPress={pickImages}>
                                <Ionicons name="add" size={20} color="#2563EB" />
                                <Text style={styles.addMoreText}>Change / Add More Photos</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>2. Text Description</Text>
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
                            <Text style={styles.saveButtonText}>Upload & Enhance with AI</Text>
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