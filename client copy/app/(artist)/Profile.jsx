import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ArtistProfile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Identity Card */}
        <View style={styles.profileCard}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://picsum.photos/id/1027/200/200' }} 
              style={styles.profileImage} 
            />
          </View>
          <Text style={styles.artisanName}>Ramesh Kumar</Text>
          <Text style={styles.artisanCraft}>Bamboo & Woodwork</Text>
          
          <View style={styles.badgeContainer}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.badgeText}>GI-Tag Verified Artisan</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>142</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>₹12.5k</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <View style={styles.ratingRow}>
              <Text style={styles.statNumber}>4.8</Text>
              <Ionicons name="star" size={16} color="#F59E0B" style={{ marginLeft: 2, marginTop: 4 }} />
            </View>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Action Menu List */}
        <View style={styles.menuContainer}>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}>
              <Ionicons name="business" size={24} color="#111827" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>My SHG Cluster</Text>
              <Text style={styles.menuSubtitle}>Manage community bulk orders</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}>
              <Ionicons name="wallet" size={24} color="#111827" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Bank & Payments</Text>
              <Text style={styles.menuSubtitle}>UPI and GST Details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}>
              <Ionicons name="language" size={24} color="#111827" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Language Settings</Text>
              <Text style={styles.menuSubtitle}>Change app language</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}>
              <Ionicons name="headset" size={24} color="#111827" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Help & Voice Support</Text>
              <Text style={styles.menuSubtitle}>Speak to an assistant</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/(auth)/SigninPage')}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
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
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#F3F4F6',
    marginBottom: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  artisanName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  artisanCraft: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    color: '#047857',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#111827', 
    borderRadius: 20,
    paddingVertical: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#374151',
    marginVertical: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },
});