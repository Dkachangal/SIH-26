import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SAVED_ITEMS = [
  { id: '1', title: 'Handwoven Bamboo Basket', price: '₹1,200', image: 'https://picsum.photos/id/106/300/300', artisan: 'Kala SHG' },
  { id: '2', title: 'Blue Pottery Vase', price: '₹850', image: 'https://picsum.photos/id/445/300/300', artisan: 'Jaipur Crafts' },
  { id: '3', title: 'Rosewood Elephant', price: '₹2,500', image: 'https://picsum.photos/id/175/300/300', artisan: 'Ramesh Woodworks' },
  { id: '4', title: 'Kanchipuram Silk Saree', price: '₹8,900', image: 'https://picsum.photos/id/435/300/300', artisan: 'Saraswati Weavers' },
];

export default function FavScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Items</Text>
        <Ionicons name="heart" size={24} color="#EF4444" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {SAVED_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.9}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <TouchableOpacity style={styles.heartIcon}>
                  <Ionicons name="heart" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.artisan} numberOfLines={1}>By {item.artisan}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  scrollContent: { padding: 16, backgroundColor: '#F8FAFC', paddingBottom: 40, flexGrow: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  imageContainer: { position: 'relative', width: '100%', height: 160 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  heartIcon: { position: 'absolute', top: 12, right: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 6, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  cardBody: { padding: 12 },
  title: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  artisan: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  price: { fontSize: 16, fontWeight: '700', color: '#2563EB' },
});