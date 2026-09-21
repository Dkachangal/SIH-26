import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const initialMessages = [
  { id: '1', text: 'Hello, I am interested in a bulk order of 50 units for this craft.', sender: 'buyer', time: '10:00 AM' },
  { id: '2', text: 'Namaste! Yes, we can fulfill 50 units. When do you need them?', sender: 'artisan', time: '10:05 AM' },
  { id: '3', text: 'By next week if possible. Can we negotiate the price slightly for a cluster order?', sender: 'buyer', time: '10:06 AM' },
];

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'buyer',
      time: 'Now'
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const renderMessage = ({ item }) => {
    const isBuyer = item.sender === 'buyer';
    return (
      <View style={[styles.messageBubble, isBuyer ? styles.buyerBubble : styles.artisanBubble]}>
        <Text style={[styles.messageText, isBuyer ? styles.buyerText : styles.artisanText]}>{item.text}</Text>
        <Text style={[styles.timeText, isBuyer ? styles.buyerTime : styles.artisanTime]}>{item.time}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Negotiation Chat</Text>
          <Text style={styles.headerSub}>With Verified Artisan</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, elevation: 3 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerSub: { fontSize: 12, color: '#10b981', fontWeight: 'bold' },
  chatContainer: { padding: 15, paddingBottom: 20 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 10 },
  buyerBubble: { backgroundColor: '#4f46e5', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  artisanBubble: { backgroundColor: 'white', alignSelf: 'flex-start', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#e5e7eb' },
  messageText: { fontSize: 15, lineHeight: 20 },
  buyerText: { color: 'white' },
  artisanText: { color: '#1f2937' },
  timeText: { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
  buyerTime: { color: '#c7d2fe' },
  artisanTime: { color: '#9ca3af' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#e5e7eb' },
  input: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 15, marginRight: 10, fontSize: 15 },
  sendButton: { backgroundColor: '#4f46e5', width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }
});