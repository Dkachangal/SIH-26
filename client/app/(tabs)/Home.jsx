import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Modal, Alert } from 'react-native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_URL = "http://10.232.211.114:5000/api";

export default function BuyerHome() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal Preview States
  const [activeProduct, setActiveProduct] = useState(null);
  const [purchaseQty, setPurchaseQty] = useState(1);

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

  const openPreviewModal = (product) => {
    setActiveProduct(product);
    setPurchaseQty(1);
  };

  const adjustQty = (amount) => {
    if (!activeProduct) return;
    setPurchaseQty(prev => {
      const newQty = prev + amount;
      return Math.max(1, Math.min(newQty, activeProduct.stock || 10));
    });
  };

  const handleCompleteOrder = () => {
    Alert.alert(
      "Order Placed Successfully! 🎉",
      `You have ordered ${purchaseQty}x "${activeProduct.name}" for ₹${purchaseQty * activeProduct.price}. The artisan has been notified.`,
      [{ text: "OK", onPress: () => setActiveProduct(null) }]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9} 
      onPress={() => openPreviewModal(item)}
    >
      <Image source={{ uri: item.images[0]?.originalUrl || "https://dummyimage.com/400x400" }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.category}>{item.craftType || item.category || "Handcrafted"}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.artisan}>By: {item.artisan?.name || "Verified Artisan"}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>₹{item.price}</Text>
          <View style={styles.clusterBtn}>
            <Text style={styles.clusterText}>Quick View</Text>
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
                  color={isActive ? '#10b981' : '#9ca3af'} 
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
        <ActivityIndicator size="large" color="#10b981" style={styles.loader} />
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

      {/* FLOATING CHAT BUTTON */}
      <TouchableOpacity style={styles.floatingChatBtn} onPress={() => router.push('/chat')}>
        <Text style={styles.floatingChatIcon}>💬</Text>
      </TouchableOpacity>

      {/* QUICK PREVIEW & BUYING MODAL */}
      <Modal visible={!!activeProduct} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <Image 
              source={{ uri: activeProduct?.images[0]?.originalUrl || "https://dummyimage.com/600x400" }} 
              style={styles.modalImage} 
            />
            
            <TouchableOpacity onPress={() => setActiveProduct(null)} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#1f2937" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.modalBody}>
                <View style={styles.modalBadgeRow}>
                  <Text style={styles.modalCategory}>{activeProduct?.category || "Handcrafted"}</Text>
                  <Text style={styles.modalStock}>In Stock: {activeProduct?.stock || 1}</Text>
                </View>

                <Text style={styles.modalTitle}>{activeProduct?.name}</Text>
                
                {/* Artisan Information Box */}
                <View style={styles.artisanCard}>
                  <Ionicons name="person-circle" size={36} color="#10b981" />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.artisanLabel}>Crafted By</Text>
                    <Text style={styles.artisanName}>{activeProduct?.artisan?.name || "Verified Artisan"}</Text>
                    <Text style={styles.artisanContact}>📞 {activeProduct?.artisan?.phone || "Contact via Chat"}</Text>
                  </View>
                  <TouchableOpacity style={styles.chatIconBtn} onPress={() => { setActiveProduct(null); router.push('/chat'); }}>
                    <Ionicons name="chatbubbles" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.modalDesc}>
                  {activeProduct?.descriptionEnglish || activeProduct?.descriptionRegional || "This authentic cultural piece is meticulously crafted using traditional techniques, maintaining premium material quality."}
                </Text>

                <Text style={styles.sectionTitle}>Material</Text>
                <Text style={styles.modalDesc}>{activeProduct?.material || "Locally sourced authentic materials."}</Text>
              </View>
            </ScrollView>

            {/* Sticky Buy Actions */}
            <View style={styles.bottomActions}>
              <View style={styles.actionRow}>
                <Text style={styles.actionLabel}>Quantity:</Text>
                <View style={styles.stepper}>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustQty(-1)}>
                    <Ionicons name="remove" size={18} color="#1f2937" />
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{purchaseQty}</Text>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustQty(1)}>
                    <Ionicons name="add" size={18} color="#1f2937" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.buyBtn} onPress={handleCompleteOrder}>
                <Text style={styles.buyBtnText}>
                  Purchase • ₹{(purchaseQty * (activeProduct?.price || 0)).toLocaleString('en-IN')}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { padding: 20, paddingTop: 60, backgroundColor: 'white' },
  title: { fontSize: 28, fontWeight: '900', color: '#1f2937' },
  sub: { color: '#6b7280', marginTop: 4, fontSize: 15 },
  
  filterContainer: { backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#f3f4f6', elevation: 2 },
  filterScroll: { paddingHorizontal: 15, paddingVertical: 10, alignItems: 'center' },
  filterItem: { alignItems: 'center', justifyContent: 'center', marginRight: 30, paddingBottom: 10, borderBottomWidth: 3, borderColor: 'transparent' },
  filterItemActive: { borderColor: '#10b981' }, 
  filterIcon: { marginBottom: 6 },
  filterText: { color: '#6b7280', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#10b981', fontWeight: '900' },

  card: { backgroundColor: 'white', marginHorizontal: 15, marginBottom: 20, borderRadius: 16, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  image: { width: '100%', height: 250, backgroundColor: '#e5e7eb' },
  content: { padding: 18 },
  category: { color: '#10b981', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 6, color: '#111827' },
  artisan: { color: '#6b7280', fontSize: 14, marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  price: { fontSize: 22, fontWeight: '900', color: '#111827' },
  clusterBtn: { backgroundColor: '#e6f4ea', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  clusterText: { color: '#10b981', fontSize: 13, fontWeight: 'bold' },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { textAlign: 'center', marginTop: 15, color: '#6b7280', fontSize: 16 },

  floatingChatBtn: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#111827', width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  floatingChatIcon: { fontSize: 28 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', height: '90%', borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  modalImage: { width: '100%', height: 280, backgroundColor: '#e5e7eb' },
  closeBtn: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 20, elevation: 4 },
  
  modalBody: { padding: 20 },
  modalBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalCategory: { color: '#10b981', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  modalStock: { backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold', color: '#374151' },
  modalTitle: { fontSize: 26, fontWeight: '900', color: '#1f2937', marginBottom: 15 },
  
  artisanCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', padding: 15, borderRadius: 16, marginBottom: 20 },
  artisanLabel: { fontSize: 10, fontWeight: 'bold', color: '#166534', textTransform: 'uppercase' },
  artisanName: { fontSize: 16, fontWeight: 'bold', color: '#14532d', marginTop: 2 },
  artisanContact: { fontSize: 12, color: '#15803d', marginTop: 2 },
  chatIconBtn: { backgroundColor: '#10b981', padding: 10, borderRadius: 20 },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginTop: 10, marginBottom: 6 },
  modalDesc: { fontSize: 14, color: '#4b5563', lineHeight: 22, marginBottom: 10 },

  bottomActions: { backgroundColor: 'white', padding: 20, borderTopWidth: 1, borderColor: '#f3f4f6', elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  actionLabel: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, padding: 4 },
  stepperBtn: { backgroundColor: 'white', width: 34, height: 34, borderRadius: 8, justifyContent: 'center', alignItems: 'center', elevation: 1 },
  stepperValue: { fontSize: 18, fontWeight: '900', color: '#1f2937', marginHorizontal: 18 },
  
  buyBtn: { backgroundColor: '#10b981', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  buyBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});