import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileCard}>
          <Image source={{ uri: 'https://picsum.photos/id/1005/200/200' }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Divyansh Kachangal</Text>
            <Text style={styles.email}>divyansh@example.com</Text>
            <View style={styles.b2bBadge}>
              <Ionicons name="briefcase" size={12} color="#2563EB" />
              <Text style={styles.b2bText}>B2B Wholesale Buyer</Text>
            </View>
          </View>
        </View>

        {/* Action Menu */}
        <View style={styles.menuContainer}>
          <MenuRow icon="cube-outline" title="My Orders" subtitle="Track and view past orders" />
          <MenuRow icon="location-outline" title="Shipping Addresses" subtitle="Manage delivery locations" />
          <MenuRow icon="card-outline" title="Payment Methods" subtitle="Saved cards and UPI details" />
          <MenuRow icon="document-text-outline" title="GST Details" subtitle="For B2B tax invoicing" />
          <MenuRow icon="language-outline" title="Language Preferences" subtitle="English" />
        </View>

        {/* Log Out */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          activeOpacity={0.8}
          onPress={() => router.replace('/(auth)/SigninPage')}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuRow({ icon, title, subtitle }) {
  return (
    <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
      <View style={styles.menuIconBox}>
        <Ionicons name={icon} size={22} color="#1F2937" />
      </View>
      <View style={styles.menuTextContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  scrollContent: { padding: 16, backgroundColor: '#F8FAFC', flexGrow: 1, paddingBottom: 40 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  avatar: { width: 72, height: 72, borderRadius: 36, marginRight: 16, backgroundColor: '#F3F4F6' },
  profileInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  email: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  b2bBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  b2bText: { fontSize: 12, fontWeight: '600', color: '#1D4ED8' },
  menuContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuTextContent: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  menuSubtitle: { fontSize: 13, color: '#6B7280' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16, gap: 8 },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#EF4444' },
});