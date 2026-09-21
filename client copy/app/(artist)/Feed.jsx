import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Modal, 
  ActivityIndicator,
  ScrollView,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const { width } = Dimensions.get('window');

// Fallback data so you can test the UI while the API is being built
const MOCK_FEED = [
  {
    _id: '1',
    artisanName: 'Kamala Devi',
    artisanAvatar: 'https://picsum.photos/id/1011/100/100',
    images: ['https://picsum.photos/id/106/600/600', 'https://picsum.photos/id/107/600/600'],
    description: 'Handcrafted terracotta pots baked in traditional wood-fired kilns. Perfect for indoor plants.',
  },
  {
    _id: '2',
    artisanName: 'Ramesh Woodworks',
    artisanAvatar: 'https://picsum.photos/id/1027/100/100',
    images: ['https://picsum.photos/id/175/600/600'],
    description: 'Carved rosewood elephant figurine. Polished with natural beeswax.',
  }
];

export default function Feed() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [feedData, setFeedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State to manage the popup (Modal)
  const [selectedWork, setSelectedWork] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        // Attempt to fetch from your backend API
        const response = await axios.get("https://lumen-backend-n5li.onrender.com/api/feed");
        
        if (response.data && response.data.length > 0) {
          setFeedData(response.data);
        } else {
          setFeedData(MOCK_FEED); // Use mock if DB is empty
        }
      } catch (error) {
        console.warn("API not ready yet, using mock data.");
        setFeedData(MOCK_FEED); // Fallback if API fails/404s
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  // Renders the individual cards in the grid
  const renderCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9} 
      onPress={() => setSelectedWork(item)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
      
      {/* Minimal text overlay at the bottom of the card */}
      <View style={styles.cardOverlay}>
        <Image source={{ uri: item.artisanAvatar }} style={styles.avatarSmall} />
        <Text style={styles.cardName} numberOfLines={1}>{item.artisanName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* Minimalist Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Main Feed */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#111827" />
        </View>
      ) : (
        <FlatList
          data={feedData}
          keyExtractor={(item) => item._id}
          renderItem={renderCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
        />
      )}

      {/* Full-Screen Detail Popup */}
      <Modal
        visible={!!selectedWork}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedWork(null)}
      >
        {selectedWork && (
          <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
            
            {/* Modal Header & Back Button */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setSelectedWork(null)}
              >
                <Ionicons name="close" size={28} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              
              {/* Horizontal Scroll for multiple images */}
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                {selectedWork.images.map((imgUri, index) => (
                  <Image 
                    key={index} 
                    source={{ uri: imgUri }} 
                    style={styles.modalImage} 
                  />
                ))}
              </ScrollView>

              {/* Indicator if multiple images exist */}
              {selectedWork.images.length > 1 && (
                <View style={styles.imageDots}>
                  {selectedWork.images.map((_, i) => (
                    <View key={i} style={styles.dot} />
                  ))}
                </View>
              )}

              {/* Details Section */}
              <View style={styles.modalDetails}>
                <View style={styles.artisanRow}>
                  <Image source={{ uri: selectedWork.artisanAvatar }} style={styles.avatarLarge} />
                  <Text style={styles.modalArtisanName}>{selectedWork.artisanName}</Text>
                </View>

                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionText}>{selectedWork.description}</Text>
                </View>
              </View>

            </ScrollView>
          </View>
        )}
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 20,
  },
  card: {
    width: '100%',
    height: 400,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40, // Creates a nice gradient space if needed later
    backgroundColor: 'rgba(0,0,0,0.4)', // Dark overlay for text readability
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 12,
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width,
    height: width, // Square ratio for the popup
    resizeMode: 'cover',
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -24,
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  modalDetails: {
    padding: 24,
  },
  artisanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  modalArtisanName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  descriptionBox: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  descriptionText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
});