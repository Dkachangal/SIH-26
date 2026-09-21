import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_URL = "http://10.232.211.114:5000/api";

export default function SmartClusters() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAndGroupProducts();
  }, []);

  const fetchAndGroupProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/business/products`);
      const products = response.data.products;

      // Group products by category to simulate Smart Clustering for B2B
      const grouped = products.reduce((acc, product) => {
        const cat = product.category || 'General';
        if (!acc[cat]) {
          acc[cat] = { category: cat, totalStock: 0, products: [], priceAvg: 0, activeArtisans: new Set() };
        }
        acc[cat].products.push(product);
        acc[cat].totalStock += (product.stock || 1);
        acc[cat].priceAvg += product.price;
        if (product.artisan?._id) acc[cat].activeArtisans.add(product.artisan._id);
        return acc;
      }, {});

      // Format data for FlatList
      const clusterArray = Object.keys(grouped).map(key => ({
        id: key,
        category: grouped[key].category,
        totalStock: grouped[key].totalStock,
        artisanCount: grouped[key].activeArtisans.size,
        avgPrice: Math.round(grouped[key].priceAvg / grouped[key].products.length),
        sampleImages: grouped[key].products.slice(0, 3).map(p => p.images[0]?.originalUrl)
      }));

      setClusters(clusterArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderCluster = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.categoryTitle}>{item.category} Cluster</Text>
        <Text style={styles.stockBadge}>{item.totalStock} Units Available</Text>
      </View>
      
      <Text style={styles.subText}>Sourced from {item.artisanCount} local artisan(s)</Text>
      <Text style={styles.priceText}>Avg. Price: ₹{item.avgPrice} / unit</Text>

      <TouchableOpacity 
        style={styles.actionBtn}
        onPress={() => router.push('/chat')}
      >
        <Ionicons name="business" size={18} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.actionText}>Negotiate Bulk Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="large" color="#4f46e5" style={styles.loader} /> : (
        <FlatList
          data={clusters}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.title}>B2B Smart Clusters</Text>
              <Text style={styles.sub}>High-volume orders automatically sourced from multiple local artisans.</Text>
            </View>
          }
          renderItem={renderCluster}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  loader: { flex: 1, justifyContent: 'center' },
  header: { padding: 20, paddingTop: 60, backgroundColor: 'white', marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  sub: { color: '#6b7280', marginTop: 5 },
  card: { backgroundColor: 'white', marginHorizontal: 15, marginBottom: 15, padding: 15, borderRadius: 12, elevation: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  stockBadge: { backgroundColor: '#d1fae5', color: '#065f46', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold' },
  subText: { color: '#6b7280', marginTop: 8 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#4f46e5', marginTop: 5 },
  actionBtn: { backgroundColor: '#111827', flexDirection: 'row', padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  actionText: { color: 'white', fontWeight: 'bold' }
});