import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const FOLLOWING = [
  { id: '1', name: 'Women Weavers of Assam', category: 'Textiles & Silk', followers: '12.4k', image: 'https://picsum.photos/id/349/200/200' },
  { id: '2', name: 'Jaipur Blue Pottery Cluster', category: 'Ceramics', followers: '8.2k', image: 'https://picsum.photos/id/445/200/200' },
  { id: '3', name: 'Ramesh Kumar', category: 'Bamboo & Woodwork', followers: '1.1k', image: 'https://picsum.photos/id/1027/200/200' },
];

export default function FollowingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Following</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {FOLLOWING.map((artisan) => (
          <TouchableOpacity key={artisan.id} style={styles.card} activeOpacity={0.8}>
            <Image source={{ uri: artisan.image }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{artisan.name}</Text>
              <Text style={styles.category}>{artisan.category}</Text>
              <Text style={styles.followers}>{artisan.followers} Followers</Text>
            </View>
            <TouchableOpacity style={styles.followingBtn}>
              <Text style={styles.followingText}>Following</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  scrollContent: { padding: 16, backgroundColor: '#F8FAFC', flexGrow: 1 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 16, backgroundColor: '#F3F4F6' },
  info: { flex: 1, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  category: { fontSize: 13, color: '#4B5563', marginBottom: 4 },
  followers: { fontSize: 12, color: '#9CA3AF' },
  followingBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
  followingText: { fontSize: 13, fontWeight: '600', color: '#374151' },
});