import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground, Modal, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const API_URL = "http://10.232.211.114:5000/api";

export default function SmartClusters() {
  const { t } = useTranslation();
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);

  useEffect(() => {
    fetchAndGroupProducts();
  }, []);

  const fetchAndGroupProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/business/products`);
      const products = response.data.products;

      // 🧠 STRICT CLUSTERING ALGORITHM (Excludes items with frequency < 2)
      const grouped = products.reduce((acc, product) => {
        const rawName = product.name || 'Unknown Item';
        const normalizedName = rawName.trim().toLowerCase();

        if (!acc[normalizedName]) {
          acc[normalizedName] = {
            id: normalizedName,
            displayName: rawName,
            category: product.category || 'General',
            totalStock: 0,
            priceSum: 0,
            products: [],
            artisans: [],
            images: []
          };
        }

        const cluster = acc[normalizedName];
        cluster.products.push(product);
        cluster.totalStock += (product.stock || 1);
        cluster.priceSum += product.price;

        if (product.artisan) {
          const existingArtisan = cluster.artisans.find(a => a.id === product.artisan._id);
          if (existingArtisan) {
            existingArtisan.stock += (product.stock || 1);
          } else {
            cluster.artisans.push({
              id: product.artisan._id,
              name: product.artisan.name || 'Unknown Artisan',
              phone: product.artisan.phone || 'N/A',
              stock: product.stock || 1,
              price: product.price
            });
          }
        }

        if (product.images?.[0]?.originalUrl) cluster.images.push(product.images[0].originalUrl);

        return acc;
      }, {});

      // Filter: Keep ONLY clusters where products appear 2 or more times across the app
      const clusterArray = Object.values(grouped)
        .map(cluster => ({
          ...cluster,
          listingCount: cluster.products.length, // Total listings found for this item name
          artisanCount: cluster.artisans.length,
          avgPrice: Math.round(cluster.priceSum / cluster.products.length),
          displayImages: [...new Set(cluster.images)].slice(0, 3) 
        }))
        .filter(cluster => cluster.listingCount >= 2) // <--- STRICT RULE: Must be listed at least 2 times
        .sort((a, b) => b.totalStock - a.totalStock);

      setClusters(clusterArray);
    } catch (error) {
      console.log("CLUSTER FETCH ERROR:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const openClusterModal = (cluster) => {
    setSelectedCluster(cluster);
    setOrderQuantity(1);
  };

  const adjustQuantity = (amount) => {
    if (!selectedCluster) return;
    setOrderQuantity(prev => {
      const newQty = prev + amount;
      return Math.max(1, Math.min(newQty, selectedCluster.totalStock));
    });
  };

  const handleBulkPurchase = () => {
    Alert.alert(
      "Bulk Order Initiated",
      `You are purchasing ${orderQuantity} units of "${selectedCluster.displayName}" for ₹${orderQuantity * selectedCluster.avgPrice}.\n\nOur system will automatically split this order across the contributing artisans to fulfill the quantity.`,
      [{ text: "Confirm", onPress: () => setSelectedCluster(null) }, { text: "Cancel", style: 'cancel' }]
    );
  };

  const renderClusterCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.clusterCard}
      activeOpacity={0.9}
      onPress={() => openClusterModal(item)}
    >
      <ImageBackground 
        source={{ uri: item.displayImages[0] || "https://dummyimage.com/600x400" }} 
        style={styles.cardImage}
        imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      >
        <View style={styles.imageOverlay}>
          <View style={styles.stockBadge}>
            <Ionicons name="cube" size={16} color="#065f46" style={{ marginRight: 4 }} />
            <Text style={styles.stockBadgeText}>{item.totalStock} Available</Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.cardContent}>
        <Text style={styles.categoryTag}>{item.category}</Text>
        <Text style={styles.clusterName}>{item.displayName}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="layers" size={18} color="#6b7280" />
            <Text style={styles.statText}>{item.listingCount} Listings ({item.artisanCount} Artisans)</Text>
          </View>
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Avg. Unit Price</Text>
            <Text style={styles.priceValue}>₹{item.avgPrice}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={styles.loader} />
      ) : (
        <FlatList
          data={clusters}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.title}>B2B Smart Clusters</Text>
              <Text style={styles.sub}>
                Only items listed 2 or more times across the platform are grouped here for bulk business orders.
              </Text>
            </View>
          }
          renderItem={renderClusterCard}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No matching clusters found (Items must be listed at least twice to form a cluster).</Text>
            </View>
          }
        />
      )}

      {/* CLUSTER DETAIL MODAL */}
      <Modal visible={!!selectedCluster} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <View style={{flex: 1}}>
                <Text style={styles.modalCategory}>{selectedCluster?.category}</Text>
                <Text style={styles.modalTitle} numberOfLines={2}>{selectedCluster?.displayName}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedCluster(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Fulfilling Artisans ({selectedCluster?.artisanCount})</Text>
            <ScrollView style={styles.artisanList} showsVerticalScrollIndicator={false}>
              {selectedCluster?.artisans.map((artisan, index) => (
                <View key={index} style={styles.artisanRow}>
                  <View style={styles.artisanInfo}>
                    <Ionicons name="person-circle" size={32} color="#10b981" />
                    <View style={styles.artisanTextGroup}>
                      <Text style={styles.artisanName}>{artisan.name}</Text>
                      <Text style={styles.artisanPrice}>Listing Price: ₹{artisan.price}</Text>
                    </View>
                  </View>
                  <View style={styles.artisanStockBadge}>
                    <Text style={styles.artisanStockText}>Hold: {artisan.stock}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.bottomActions}>
              <View style={styles.actionRow}>
                <Text style={styles.actionLabel}>Select Bulk Quantity:</Text>
                <View style={styles.stepper}>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustQuantity(-1)}>
                    <Ionicons name="remove" size={20} color="#1f2937" />
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{orderQuantity}</Text>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustQuantity(1)}>
                    <Ionicons name="add" size={20} color="#1f2937" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.buyBtn} onPress={handleBulkPurchase}>
                <Text style={styles.buyBtnText}>
                  Place B2B Order • ₹{(orderQuantity * (selectedCluster?.avgPrice || 0)).toLocaleString('en-IN')}
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
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { padding: 20, paddingTop: 60, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#1f2937' },
  sub: { color: '#6b7280', marginTop: 8, fontSize: 14, lineHeight: 20 },
  
  clusterCard: { backgroundColor: 'white', marginHorizontal: 20, marginBottom: 25, borderRadius: 16, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  cardImage: { width: '100%', height: 180, justifyContent: 'flex-start', alignItems: 'flex-end', backgroundColor: '#e5e7eb' },
  imageOverlay: { padding: 15, width: '100%', flexDirection: 'row', justifyContent: 'flex-end' },
  stockBadge: { backgroundColor: '#d1fae5', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, elevation: 4 },
  stockBadgeText: { color: '#065f46', fontWeight: 'bold', fontSize: 13 },
  
  cardContent: { padding: 20 },
  categoryTag: { color: '#10b981', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  clusterName: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', padding: 15, borderRadius: 12 },
  statBox: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statText: { color: '#4b5563', fontSize: 13, fontWeight: '600', marginLeft: 8 },
  
  priceBox: { alignItems: 'flex-end', borderLeftWidth: 1, borderColor: '#e5e7eb', paddingLeft: 15 },
  priceLabel: { fontSize: 11, color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase' },
  priceValue: { fontSize: 18, fontWeight: '900', color: '#111827', marginTop: 2 },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyText: { textAlign: 'center', marginTop: 15, color: '#6b7280', fontSize: 15, lineHeight: 22 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#f9fafb', height: '85%', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 25 },
  
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  modalCategory: { color: '#10b981', fontSize: 13, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#1f2937', marginTop: 4, marginRight: 10 },
  closeBtn: { backgroundColor: '#e5e7eb', padding: 8, borderRadius: 20 },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 15 },
  
  artisanList: { flex: 1, marginBottom: 20 },
  artisanRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 1 },
  artisanInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  artisanTextGroup: { marginLeft: 12, flex: 1 },
  artisanName: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  artisanPrice: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  artisanStockBadge: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  artisanStockText: { color: '#374151', fontWeight: 'bold', fontSize: 13 },

  bottomActions: { backgroundColor: 'white', padding: 20, borderRadius: 20, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  actionLabel: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, padding: 4 },
  stepperBtn: { backgroundColor: 'white', width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', elevation: 1 },
  stepperValue: { fontSize: 18, fontWeight: '900', color: '#1f2937', marginHorizontal: 20 },
  
  buyBtn: { backgroundColor: '#10b981', paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
  buyBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});