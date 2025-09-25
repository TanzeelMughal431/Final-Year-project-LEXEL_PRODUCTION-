import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { database } from "../../firebaseConfig";
import { ref, onValue, push } from "firebase/database";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";

const UserChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  // Fetch logged-in user's email and messages
  useEffect(() => {
    const fetchUserEmail = () => {
      if (auth.currentUser) {
        setUserEmail(auth.currentUser.email || "Unknown User");
        const messagesRef = ref(
          database,
          `chats/${auth.currentUser.email.replace(".", "_")}/messages`
        );
        onValue(messagesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const messagesArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setMessages(messagesArray);
          } else {
            setMessages([]);
          }
        });
      }
    };

    fetchUserEmail();
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagesRef = ref(
      database,
      `chats/${userEmail.replace(".", "_")}/messages`
    );
    await push(messagesRef, {
      sender: userEmail,
      text: newMessage,
      timestamp: Date.now(),
    });
    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace('/Screen/Main')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Help Center</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === userEmail
                ? styles.userBubble
                : styles.adminBubble,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
        style={styles.messageList}
      />

      {/* Input Container */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write your query. We will respond as soon as possible."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1D", // Main background
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222831", // Matches the dark theme
    padding: 15,
    elevation: 2,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EEEEEE", // Light text for contrast
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    color: "#FFD369", // Accent yellow for back button
    fontSize: 16,
    fontWeight: "bold",
  },
  messageList: {
    flex: 1,
    padding: 5,
  },
  messageBubble: {
    marginVertical: 5,
    maxWidth: "80%",
    borderRadius: 12,
    padding: 10,
  },
  adminBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFEC4C", // Admin messages use primary color
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#34C759", // Green for user messages
  },
  messageText: {
    fontSize: 16,
    color: "#1A1A1D", // Dark text for readability
  },
  timestamp: {
    fontSize: 10,
    color: "#555", // Secondary text for timestamps
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White input field
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#34C759", // Green for send button
    padding: 15,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#EEEEEE", // Light text for contrast
    fontWeight: "bold",
  },
});

export default UserChatPage;
