import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MOCK_CHATS = [
  {
    id: '1',
    sender: 'Anita Desai (Customer)',
    avatar: 'https://picsum.photos/id/1011/200/200',
    lastMessage: 'I loved the bamboo baskets! Can I order 10 more for a wedding?',
    time: '10:42 AM',
    unread: 2,
    hasAction: true,
    actionLabel: 'New Order',
    actionColor: '#10B981', 
  },
  {
    id: '2',
    sender: 'Kala SHG Group (Local)',
    avatar: 'https://picsum.photos/id/1033/200/200',
    lastMessage: '▶ Voice Note (0:15)',
    time: 'Yesterday',
    unread: 1,
    hasAction: false,
  },
  {
    id: '3',
    sender: 'GeM Bot (Gov Portal)',
    avatar: 'https://picsum.photos/id/0/200/200', 
    lastMessage: 'Your bulk order label is ready. Tap to print.',
    time: 'Monday',
    unread: 0,
    hasAction: true,
    actionLabel: 'Print Label',
    actionColor: '#2563EB', 
  },
  {
    id: '4',
    sender: 'Rajesh (B2B Buyer)',
    avatar: 'https://picsum.photos/id/1005/200/200',
    lastMessage: 'The shipment arrived perfectly. Thank you!',
    time: 'Oct 12',
    unread: 0,
    hasAction: false,
  },
];

export default function ArtistChat() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.senderName} numberOfLines={1}>{item.sender}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <Text 
          style={[styles.lastMessage, item.unread > 0 && styles.lastMessageUnread]} 
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>

        {item.hasAction && (
          <View style={[styles.actionBadge, { backgroundColor: item.actionColor + '15' }]}>
            <Ionicons 
              name={item.actionLabel === 'New Order' ? 'cart' : 'document-text'} 
              size={14} 
              color={item.actionColor} 
            />
            <Text style={[styles.actionText, { color: item.actionColor }]}>
              {item.actionLabel}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      {/* Top Header with Back Button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        
        <TouchableOpacity style={styles.voiceButton}>
          <Ionicons name="mic" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContent: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  lastMessage: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 6,
  },
  lastMessageUnread: {
    color: '#111827',
    fontWeight: '600',
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginTop: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 96, 
  },
});