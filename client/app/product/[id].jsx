import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const API_URL = "http://10.232.211.114:5000/api";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching all products and filtering by ID since the backend doesn't have a specific /:id route yet
    axios.get(`${API_URL}/business/products`)
      .then(response => {
        const found = response.data.products.find(p => p._id === id);
        setProduct(found);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#4f46e5" style={{ flex: 1 }} />;
  if (!product) return <Text style={{ marginTop: 50, textAlign: 'center' }}>Product not found.</Text>;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Image 
        source={{ uri: product.images[0]?.originalUrl || "https://dummyimage.com/600x600" }} 
        style={styles.image} 
      />
      
      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.category}>{product.category || "Authentic Craft"}</Text>
          <Text style={styles.stock}>Stock: {product.stock}</Text>
        </View>
        
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.artisan}>Crafted by: <Text style={styles.artisanBold}>{product.artisan?.name}</Text></Text>
        
        <Text style={styles.price}>₹{product.price}</Text>

        <Text style={styles.sectionTitle}>Product Description (English)</Text>
        <Text style={styles.description}>
          {product.descriptionEnglish || "This is a beautifully handcrafted item made with traditional techniques, ensuring high quality and cultural authenticity. Perfect for personal use or bulk business orders."}
        </Text>

        <Text style={styles.sectionTitle}>Material / Details</Text>
        <Text style={styles.description}>{product.material || "Premium locally sourced materials."}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.chatBtn} onPress={() => router.push('/chat')}>
            <Ionicons name="chatbubbles" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.chatBtnText}>Chat with Artisan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buyBtn} onPress={() => Alert.alert("Initiated", "Buying process started (Demo)")}>
            <Text style={styles.buyBtnText}>Buy / Cluster Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  backBtn: { position: 'absolute', top: 40, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
  image: { width: '100%', height: 350, backgroundColor: '#e5e7eb' },
  detailsContainer: { padding: 20, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  category: { color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12 },
  stock: { color: '#6b7280', fontSize: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginTop: 8 },
  artisan: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  artisanBold: { fontWeight: 'bold', color: '#374151' },
  price: { fontSize: 26, fontWeight: 'bold', color: '#4f46e5', marginTop: 15, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginTop: 15, marginBottom: 5 },
  description: { fontSize: 14, color: '#4b5563', lineHeight: 22 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 20 },
  chatBtn: { flex: 1, backgroundColor: '#111827', padding: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  chatBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  buyBtn: { flex: 1, backgroundColor: '#10b981', padding: 15, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buyBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 }
});