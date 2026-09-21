import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_URL = "http://10.232.211.114:5000/api";

export default function ArtisanFeed() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const allText = i18n.language === 'hi' ? 'सभी' : i18n.language === 'gu' ? 'બધા' : i18n.language === 'mr' ? 'सर्व' : i18n.language === 'ta' ? 'எல்லாம்' : 'Explore';

  // Enhanced categories with specific icons for visual discovery
  const categories = [
    { id: 'All', label: allText, icon: 'compass-outline' },
    { id: 'Textiles', label: t('catTextiles'), icon: 'shirt-outline' },
    { id: 'Pottery', label: t('catPottery'), icon: 'color-palette-outline' },
    { id: 'Jewelry', label: t('catJewelry'), icon: 'diamond-outline' },
    { id: 'Woodwork', label: t('catWoodwork'), icon: 'hammer-outline' },
    { id: 'Other', label: t('catOther'), icon: 'grid-outline' },
  ];

  const displayedProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(item => item.craftType === selectedCategory || item.category === selectedCategory);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => router.push(`/product/${item._id}`)}>
      <Image source={{ uri: item.images[0]?.originalUrl || "https://dummyimage.com/400x400" }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.category}>{item.craftType || item.category || "Handcrafted"}</Text>
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
      <View style={styles.header}>
        <Text style={styles.title}>{t('marketplace')}</Text>
        <Text style={styles.sub}>{t('discover')}</Text>
      </View>

      {/* Upgraded Airbnb-style Icon Filter Bar */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.filterItem, isActive && styles.filterItemActive]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Ionicons 
                  name={cat.icon} 
                  size={26} 
                  color={isActive ? '#4f46e5' : '#9ca3af'} 
                  style={styles.filterIcon}
                />
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={styles.loader} />
      ) : (
        <FlatList
          data={displayedProducts}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={50} color="#d1d5db" />
              <Text style={styles.emptyText}>No crafts found in this category.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.floatingChatBtn} onPress={() => router.push('/chat')}>
        <Text style={styles.floatingChatIcon}>💬</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { padding: 20, paddingTop: 60, backgroundColor: 'white' },
  title: { fontSize: 28, fontWeight: '900', color: '#1f2937' },
  sub: { color: '#6b7280', marginTop: 4, fontSize: 15 },
  
  // Upgraded Filter Styles
  filterContainer: { backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  filterScroll: { paddingHorizontal: 15, paddingVertical: 10, alignItems: 'center' },
  filterItem: { alignItems: 'center', justifyContent: 'center', marginRight: 30, paddingBottom: 10, borderBottomWidth: 3, borderColor: 'transparent' },
  filterItemActive: { borderColor: '#4f46e5' }, // Active indicator line
  filterIcon: { marginBottom: 6 },
  filterText: { color: '#6b7280', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#4f46e5', fontWeight: '900' },

  card: { backgroundColor: 'white', marginHorizontal: 15, marginBottom: 20, borderRadius: 16, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  image: { width: '100%', height: 250, backgroundColor: '#e5e7eb' },
  content: { padding: 18 },
  category: { color: '#4f46e5', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 6, color: '#111827' },
  artisan: { color: '#6b7280', fontSize: 14, marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  price: { fontSize: 22, fontWeight: '900', color: '#111827' },
  clusterBtn: { backgroundColor: '#f3f4f6', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  clusterText: { color: '#374151', fontSize: 13, fontWeight: 'bold' },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { textAlign: 'center', marginTop: 15, color: '#6b7280', fontSize: 16 },

  floatingChatBtn: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#10b981', width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4 },
  floatingChatIcon: { fontSize: 28 }
});