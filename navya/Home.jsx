import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';



// For testing on your computer/browser:
const API_URL = 'http://localhost:5000';

// If you use Expo Go on your PHONE, replace the above with
// your computer's IPv4 address, for example:
// const API_URL = 'http://192.168.1.105:5000';


// ======================================================
// MOCK DATA
// ======================================================

const CATEGORIES = [
  {
    id: '1',
    title: 'Textiles',
    image: 'https://picsum.photos/id/103/200/200',
  },
  {
    id: '2',
    title: 'Pottery',
    image: 'https://picsum.photos/id/106/200/200',
  },
  {
    id: '3',
    title: 'Woodwork',
    image: 'https://picsum.photos/id/175/200/200',
  },
  {
    id: '4',
    title: 'Furniture',
    image: 'https://picsum.photos/id/180/200/200',
  },
];

const SPOTLIGHTS = [
  {
    id: '1',
    title: 'Artisan Artisan Clusters',
    image: 'https://picsum.photos/id/342/400/200',
  },
  {
    id: '2',
    title: 'Women Weavers of Assam',
    image: 'https://picsum.photos/id/349/400/200',
  },
];

const GI_TAGGED = [
  {
    id: '1',
    title: 'Kanchipuram Silk',
    image: 'https://picsum.photos/id/435/300/300',
  },
  {
    id: '2',
    title: 'Blue Pottery of Jaipur',
    image: 'https://picsum.photos/id/445/300/300',
  },
];


// ======================================================
// HOME SCREEN
// ======================================================

export default function Home() {

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // ====================================================
  // SEARCH BACKEND
  // ====================================================

  const handleSearch = (text) => {
    setSearchText(text);
  };

  useEffect(() => {
    const query = searchText.trim();

    // Don't search for less than 2 characters
    if (query.length < 2) {
      setSearchResults([]);
      setSearchError('');
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setSearchError('');

        const response = await fetch(
          `${API_URL}/api/search?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        console.log('Search results:', data);

        setSearchResults(data);

      } catch (error) {
        console.error('Search error:', error);

        setSearchError(
          'Could not connect to the server.'
        );

        setSearchResults([]);

      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);

  }, [searchText]);


  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <View style={styles.header}>

          <TouchableOpacity>
            <Ionicons
              name="menu-outline"
              size={28}
              color="#1F2937"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            ArtisanHub
          </Text>

          <View style={styles.headerIcons}>

            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="search-outline"
                size={24}
                color="#1F2937"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>

              <Ionicons
                name="cart-outline"
                size={24}
                color="#1F2937"
              />

              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  3
                </Text>
              </View>

            </TouchableOpacity>

          </View>

        </View>


        {/* ==================================================
            SEARCH BAR
        ================================================== */}

        <View style={styles.searchContainer}>

          <Ionicons
            name="search-outline"
            size={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={handleSearch}
          />

          {loading && (
            <ActivityIndicator
              size="small"
              color="#2563EB"
            />
          )}

          {searchText.length > 0 && !loading && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
                setSearchResults([]);
                setSearchError('');
              }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}

        </View>


        {/* ==================================================
            SEARCH ERROR
        ================================================== */}

        {searchError !== '' && (
          <View style={styles.errorContainer}>

            <Ionicons
              name="warning-outline"
              size={18}
              color="#DC2626"
            />

            <Text style={styles.errorText}>
              {searchError}
            </Text>

          </View>
        )}


        {/* ==================================================
            SEARCH RESULTS
        ================================================== */}

        {searchResults.length > 0 && (

          <View style={styles.searchResultsContainer}>

            <Text style={styles.resultsTitle}>
              Search Results
            </Text>

            {searchResults.map((product) => (

              <TouchableOpacity
                key={product._id}
                style={styles.searchResultItem}
              >

                {/* ==================================================
                    PRODUCT IMAGE

                    New Product schema:
                    images: [String]

                    Therefore we use images[0]
                ================================================== */}

                {product.images && product.images.length > 0 ? (

                  <Image
                    source={{ uri: product.images[0] }}
                    style={styles.searchResultImage}
                  />

                ) : (

                  <View style={styles.noImage}>

                    <Ionicons
                      name="image-outline"
                      size={25}
                      color="#9CA3AF"
                    />

                  </View>

                )}

                <View style={styles.searchResultInfo}>

                  <Text
                    style={styles.searchResultName}
                    numberOfLines={2}
                  >
                    {product.name}
                  </Text>

                  {/* CATEGORY */}

                  {product.category && (
                    <Text style={styles.searchResultCategory}>
                      {product.category}
                    </Text>
                  )}

                  {/* CRAFT TYPE
                      
                      New Product schema has craftType.
                      Old region field has been removed.
                  */}

                  {product.craftType && (
                    <Text style={styles.searchResultCraftType}>
                      {product.craftType}
                    </Text>
                  )}

                  {/* PRICE */}

                  {product.price !== undefined && (
                    <Text style={styles.searchResultPrice}>
                      ₹{product.price}
                    </Text>
                  )}

                </View>

              </TouchableOpacity>

            ))}

          </View>

        )}


        {/* ==================================================
            NO RESULTS
        ================================================== */}

        {searchText.trim().length >= 2 &&
          !loading &&
          searchResults.length === 0 &&
          searchError === '' && (

            <View style={styles.noResultsContainer}>

              <Ionicons
                name="search-outline"
                size={35}
                color="#9CA3AF"
              />

              <Text style={styles.noResultsText}>
                No products found
              </Text>

            </View>

          )}


        {/* ==================================================
            CATEGORIES
        ================================================== */}

        {searchText.trim() === '' && (

          <>

            <View style={styles.sectionContainer}>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >

                {CATEGORIES.map((item) => (

                  <TouchableOpacity
                    key={item.id}
                    style={styles.categoryItem}
                  >

                    <View style={styles.categoryImageContainer}>

                      <Image
                        source={{ uri: item.image }}
                        style={styles.categoryImage}
                      />

                    </View>

                    <Text style={styles.categoryText}>
                      {item.title}
                    </Text>

                  </TouchableOpacity>

                ))}

              </ScrollView>

            </View>


            {/* ==================================================
                SPOTLIGHTS
            ================================================== */}

            <View style={styles.sectionContainer}>

              <View style={styles.sectionHeader}>

                <Text style={styles.sectionTitle}>
                  Spotlights
                </Text>

                <TouchableOpacity>
                  <Text style={styles.seeAllText}>
                    See All
                  </Text>
                </TouchableOpacity>

              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >

                {SPOTLIGHTS.map((item) => (

                  <TouchableOpacity
                    key={item.id}
                    style={styles.spotlightCard}
                  >

                    <Image
                      source={{ uri: item.image }}
                      style={styles.spotlightImage}
                    />

                    <Text style={styles.cardTitle}>
                      {item.title}
                    </Text>

                  </TouchableOpacity>

                ))}

              </ScrollView>

            </View>


            {/* ==================================================
                GI TAGGED
            ================================================== */}

            <View style={styles.sectionContainer}>

              <View style={styles.sectionHeader}>

                <Text style={styles.sectionTitle}>
                  GI-tagged crafts
                </Text>

                <TouchableOpacity>
                  <Text style={styles.seeAllText}>
                    See All
                  </Text>
                </TouchableOpacity>

              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >

                {GI_TAGGED.map((item) => (

                  <TouchableOpacity
                    key={item.id}
                    style={styles.giCard}
                  >

                    <View style={styles.giImageWrapper}>

                      <Image
                        source={{ uri: item.image }}
                        style={styles.giImage}
                      />

                      <View style={styles.giBadgeOverlay}>

                        <Text style={styles.giBadgeText}>
                          ✔ GI-Tag
                        </Text>

                      </View>

                    </View>

                    <Text style={styles.cardTitle}>
                      {item.title}
                    </Text>

                  </TouchableOpacity>

                ))}

              </ScrollView>

            </View>

          </>

        )}

      </ScrollView>

    </SafeAreaView>
  );
}


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scrollContent: {
    paddingBottom: 20,
  },

  // ====================================================
  // HEADER
  // ====================================================

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

  // ====================================================
  // SEARCH
  // ====================================================

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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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

  // ====================================================
  // SEARCH RESULTS
  // ====================================================

  searchResultsContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
  },

  resultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    padding: 8,
  },

  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  searchResultImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 12,
  },

  noImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchResultInfo: {
    flex: 1,
  },

  searchResultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },

  searchResultCategory: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
  },

  // NEW:
  // Replaces the old `region` field.

  searchResultCraftType: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },

  searchResultPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 4,
  },

  // ====================================================
  // SEARCH ERROR
  // ====================================================

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },

  errorText: {
    marginLeft: 8,
    color: '#B91C1C',
    fontSize: 13,
  },

  // ====================================================
  // NO RESULTS
  // ====================================================

  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },

  noResultsText: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 14,
  },

  // ====================================================
  // SECTIONS
  // ====================================================

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

  // ====================================================
  // CATEGORIES
  // ====================================================

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

  // ====================================================
  // SPOTLIGHTS
  // ====================================================

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

  // ====================================================
  // GI TAGGED
  // ====================================================

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
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  giBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // ====================================================
  // GENERAL CARD
  // ====================================================

  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },

});