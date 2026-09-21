import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

const API_URL = "http://10.232.211.114:5000/api";

export default function ArtisanFeed() {
  const { t } = useTranslation();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    try {
      const response = await axios.get(`${API_URL}/business/products`);
      setProducts(response.data.products);
    } catch (error) {
      console.log("MARKETPLACE FETCH ERROR:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9} 
      onPress={() => router.push(`/product/${item._id}`)}
    >
      <Image 
        source={{ uri: item.images[0]?.originalUrl || "https://dummyimage.com/400x400" }} 
        style={styles.image} 
      />
      <View style={styles.content}>
        <Text style={styles.category}>{item.category || "Handcrafted"}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.artisan}>By: {item.artisan?.name || "Verified Artisan"}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>₹{item.price}</Text>
          <View style={styles.clusterBtn}>
            <Text style={styles.clusterText}>{t('clusterBtn') || "Bulk Order"}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.title}>{t('marketplace')}</Text>
              <Text style={styles.sub}>{t('discover')}</Text>
            </View>
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products available right now.</Text>
          }
        />
      )}

      {/* Floating Chat Button */}
      <TouchableOpacity 
        style={styles.floatingChatBtn}
        onPress={() => router.push('/chat')}
      >
        <Text style={styles.floatingChatIcon}>💬</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 60, backgroundColor: 'white', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  sub: { color: '#6b7280', marginTop: 4, fontSize: 14 },
  
  card: { backgroundColor: 'white', marginHorizontal: 15, marginBottom: 15, borderRadius: 12, overflow: 'hidden', elevation: 2 },
  image: { width: '100%', height: 200, backgroundColor: '#e5e7eb' },
  content: { padding: 15 },
  category: { color: '#4f46e5', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  name: { fontSize: 18, fontWeight: 'bold', marginTop: 4, color: '#111827' },
  artisan: { color: '#6b7280', fontSize: 14, marginTop: 4 },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  
  clusterBtn: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  clusterText: { color: '#374151', fontSize: 12, fontWeight: 'bold' },
  
  emptyText: { textAlign: 'center', marginTop: 40, color: '#6b7280' },

  floatingChatBtn: { 
    position: 'absolute', 
    bottom: 20, 
    right: 20, 
    backgroundColor: '#10b981', 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3 
  },
  floatingChatIcon: { fontSize: 28 }
});