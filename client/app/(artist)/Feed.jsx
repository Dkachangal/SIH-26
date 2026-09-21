import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Modal, Dimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_URL = "http://10.232.211.114:5000/api";
const { width, height } = Dimensions.get('window');

export default function ArtisanFeed() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [fullscreenImages, setFullscreenImages] = useState(null);

  // Automatically fetches data every time the user taps/switches to this tab
  useFocusEffect(
    useCallback(() => {
      fetchMarketplace();
    }, [])
  );

  const fetchMarketplace = async () => {
    try {
      const response = await axios.get(`${API_URL}/business/products`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.log("MARKETPLACE FETCH ERROR:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const allText = i18n.language === 'hi' ? 'सभी' : i18n.language === 'gu' ? 'બધા' : i18n.language === 'mr' ? 'सर्व' : i18n.language === 'ta' ? 'எல்லாம்' : 'Explore';

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

  const getProductImages = (item) => {
    const slides = [];
    if (item.images && item.images.length > 0) {
      item.images.forEach((img, index) => {
        if (img.originalUrl) {
          slides.push({ url: img.originalUrl, label: `Photo ${index + 1} • Original` });
        }
        if (img.enhancedUrl) {
          slides.push({ url: img.enhancedUrl, label: `Photo ${index + 1} • AI Studio Shot ✨` });
        }
      });
    } else {
      slides.push({ url: "https://dummyimage.com/400x400", label: 'Default' });
    }
    return slides;
  };

  const renderItem = ({ item }) => {
    const slides = getProductImages(item);

    return (
      <View style={styles.card}>
        <TouchableOpacity activeOpacity={0.95} onPress={() => setFullscreenImages(slides)}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {slides.map((slide, idx) => (
              <View key={idx} style={{ width: width - 30 }}>
                <Image source={{ uri: slide.url }} style={styles.image} />
                <View style={styles.imageBadge}>
                  <Text style={styles.imageBadgeText}>{slide.label}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.content} activeOpacity={0.9} onPress={() => router.push(`/product/${item._id}`)}>
          <Text style={styles.category}>{item.craftType || item.category || "Handcrafted"}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.artisan}>By: {item.artisan?.name || "Verified Artisan"}</Text>
          <View style={styles.footer}>
            <Text style={styles.price}>₹{item.price}</Text>
            <View style={styles.clusterBtn}>
              <Text style={styles.clusterText}>{t('clusterBtn') || "Bulk Order"}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('marketplace')}</Text>
        <Text style={styles.sub}>{t('discover')}</Text>
      </View>

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
                <Ionicons name={cat.icon} size={26} color={isActive ? '#4f46e5' : '#9ca3af'} style={styles.filterIcon} />
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{cat.label}</Text>
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
        />
      )}

      <Modal visible={!!fullscreenImages} transparent={true} animationType="fade">
        <View style={styles.lightboxOverlay}>
          <TouchableOpacity style={styles.lightboxCloseBtn} onPress={() => setFullscreenImages(null)}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
            {fullscreenImages?.map((slide, idx) => (
              <View key={idx} style={{ width: width, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: slide.url }} style={styles.lightboxImage} />
                <View style={styles.lightboxBadge}>
                  <Text style={styles.lightboxBadgeText}>{slide.label}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

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
  filterContainer: { backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#f3f4f6' },
  filterScroll: { paddingHorizontal: 15, paddingVertical: 10, alignItems: 'center' },
  filterItem: { alignItems: 'center', justifyContent: 'center', marginRight: 30, paddingBottom: 10, borderBottomWidth: 3, borderColor: 'transparent' },
  filterItemActive: { borderColor: '#4f46e5' },
  filterIcon: { marginBottom: 6 },
  filterText: { color: '#6b7280', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#4f46e5', fontWeight: '900' },
  card: { backgroundColor: 'white', marginHorizontal: 15, marginBottom: 20, borderRadius: 16, overflow: 'hidden', elevation: 4 },
  imageScroll: { width: '100%', height: 250, backgroundColor: '#e5e7eb' },
  image: { width: width - 30, height: 250, resizeMode: 'cover' },
  imageBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.75)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  imageBadgeText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  content: { padding: 18 },
  category: { color: '#4f46e5', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 6, color: '#111827' },
  artisan: { color: '#6b7280', fontSize: 14, marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  price: { fontSize: 22, fontWeight: '900', color: '#111827' },
  clusterBtn: { backgroundColor: '#f3f4f6', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  clusterText: { color: '#374151', fontSize: 13, fontWeight: 'bold' },
  lightboxOverlay: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
  lightboxCloseBtn: { position: 'absolute', top: 40, right: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20 },
  lightboxImage: { width: width, height: height * 0.65, resizeMode: 'contain' },
  lightboxBadge: { position: 'absolute', bottom: 60, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  lightboxBadgeText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  floatingChatBtn: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#10b981', width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  floatingChatIcon: { fontSize: 28 }
});