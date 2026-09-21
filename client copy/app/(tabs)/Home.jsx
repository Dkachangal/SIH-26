import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Image, 
  TouchableOpacity 
} from 'react-native';
// Import SafeAreaView from here instead of react-native
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons';

// --- MOCK DATA (Replace with your backend API data later) ---
const CATEGORIES = [
  { id: '1', title: 'Textiles', image: 'https://picsum.photos/id/103/200/200' },
  { id: '2', title: 'Pottery', image: 'https://picsum.photos/id/106/200/200' },
  { id: '3', title: 'Woodwork', image: 'https://picsum.photos/id/175/200/200' },
  { id: '4', title: 'Furniture', image: 'https://picsum.photos/id/180/200/200' },
];

const SPOTLIGHTS = [
  { id: '1', title: 'Artisan Artisan Clusters', image: 'https://picsum.photos/id/342/400/200' },
  { id: '2', title: 'Women Weavers of Assam', image: 'https://picsum.photos/id/349/400/200' },
];

const GI_TAGGED = [
  { id: '1', title: 'Kanchipuram Silk', image: 'https://picsum.photos/id/435/300/300' },
  { id: '2', title: 'Blue Pottery of Jaipur', image: 'https://picsum.photos/id/445/300/300' },
];

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* --- CUSTOM TOP HEADER (Optional based on your _layout.jsx) --- */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={28} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ArtisanHub</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="cart-outline" size={24} color="#1F2937" />
              {/* Notification Badge for Cart */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- SEARCH BAR --- */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* --- CATEGORIES SECTION --- */}
        <View style={styles.sectionContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.categoryItem}>
                <View style={styles.categoryImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.categoryImage} />
                </View>
                <Text style={styles.categoryText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- SPOTLIGHTS SECTION --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spotlights</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SPOTLIGHTS.map((item) => (
              <TouchableOpacity key={item.id} style={styles.spotlightCard}>
                <Image source={{ uri: item.image }} style={styles.spotlightImage} />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- GI-TAGGED CRAFTS SECTION --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>GI-tagged crafts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {GI_TAGGED.map((item) => (
              <TouchableOpacity key={item.id} style={styles.giCard}>
                <View style={styles.giImageWrapper}>
                  <Image source={{ uri: item.image }} style={styles.giImage} />
                  {/* GI Tag Overlay Badge */}
                  <View style={styles.giBadgeOverlay}>
                    <Text style={styles.giBadgeText}>✔ GI-Tag</Text>
                  </View>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Slightly off-white backgorund matching the modern aesthetic
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  spotlightCard: {
    width: 280,
    marginRight: 16,
  },
  spotlightImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  giCard: {
    width: 160,
    marginRight: 16,
  },
  giImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  giImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  giBadgeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#10B981', // Green badge for GI tags
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  giBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});