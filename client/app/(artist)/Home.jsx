import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ArtistHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      {/* Top Header */}
      <View style={styles.header}>
        {/* ADDED: onPress navigation to Profile */}
        <TouchableOpacity 
          style={styles.profileIcon} 
          onPress={() => router.push('/(artist)/Profile')}
        >
          <Ionicons name="person" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Voice-First Daily Briefing */}
        <View style={styles.audioCard}>
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={40} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.audioTitle}>Daily Summary (Audio Briefing)</Text>
          <Text style={styles.audioText} numberOfLines={3}>
            Namaste, you have 3 new orders. Demand for your Bamboo Baskets is high in your region today. Tap to hear more details.
          </Text>
        </View>
        {/* Primary Action Button */}
        <TouchableOpacity 
          style={styles.addBtn} 
          activeOpacity={0.8}
          onPress={() => router.push('/(artist)/AddProduct')}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add New Product</Text>
        </TouchableOpacity>

        {/* Primary Action Button */}
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add New Product</Text>
        </TouchableOpacity>

        {/* Secondary Actions Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.gridItem} activeOpacity={0.8}>
            <Ionicons name="storefront" size={32} color="#FFFFFF" />
            <Text style={styles.gridText}>My Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} activeOpacity={0.8}>
            <Ionicons name="people" size={32} color="#FFFFFF" />
            <Text style={styles.gridText}>Community</Text>
          </TouchableOpacity>
        </View>

        {/* Gamified Nudge */}
        <TouchableOpacity style={styles.nudgeCard} activeOpacity={0.8}>
          <View style={styles.nudgeIconContainer}>
            <Ionicons name="trending-up" size={24} color="#9333EA" />
          </View>
          <View style={styles.nudgeTextContainer}>
            <Text style={styles.nudgeTitle}>Gamified Nudge</Text>
            <Text style={styles.nudgeDesc}>Artisans who added video sold 40% more!</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#1F2937" />
        </TouchableOpacity>

        {/* ADDED: onPress navigation to Chat */}
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(artist)/Chat')}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(artist)/Profile')}
        >
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
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
    paddingVertical: 12,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  audioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 4, 
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  audioText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  gridText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  nudgeCard: {
    flexDirection: 'row',
    backgroundColor: '#F3E8FF', 
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 16,
  },
  nudgeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nudgeTextContainer: {
    flex: 1,
  },
  nudgeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginBottom: 4,
  },
  nudgeDesc: {
    fontSize: 13,
    color: '#7E22CE',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navItem: {
    padding: 8,
  },
});