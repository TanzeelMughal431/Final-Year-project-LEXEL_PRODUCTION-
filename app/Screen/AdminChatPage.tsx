import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { database } from "../../firebaseConfig";
import { ref, onValue, push, remove } from "firebase/database";

const AdminChatPage = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Fetch user list
  useEffect(() => {
    const usersRef = ref(database, "chats");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.keys(data).map((key) => ({ id: key }));
        setUsers(userList);
      } else {
        setUsers([]);
      }
      setIsLoadingUsers(false);
    });
  }, []);

  // Fetch messages for selected user
  const fetchMessages = (userId) => {
    setSelectedUser(userId);
    setIsLoadingMessages(true);
    const messagesRef = ref(database, `chats/${userId}/messages`);
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
      setIsLoadingMessages(false);
    });
  };

  // Send message to the selected user
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagesRef = ref(database, `chats/${selectedUser}/messages`);
    await push(messagesRef, {
      sender: "Lexel Production",
      text: sanitizeInput(newMessage),
      timestamp: Date.now(),
    });
    setNewMessage("");
  };

  // Broadcast message to all users
  const broadcastMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      for (const user of users) {
        const messagesRef = ref(database, `chats/${user.id}/messages`);
        await push(messagesRef, {
          sender: "Lexel Production",
          text: sanitizeInput(newMessage),
          timestamp: Date.now(),
        });
      }
      setNewMessage("");
      alert("Broadcast message sent to all users!");
    } catch (error) {
      console.error("Error broadcasting message:", error);
      alert("Failed to send the broadcast message. Please try again.");
    }
  };

  // Delete the entire chat history for a user
  const deleteChatHistory = async (userId) => {
    Alert.alert(
      "Delete Chat History",
      "Are you sure you want to delete the entire chat history for this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const chatRef = ref(database, `chats/${userId}`);
            await remove(chatRef);
            setMessages([]);
            setSelectedUser(null);
            alert("Chat history deleted successfully!");
          },
        },
      ]
    );
  };

  // Exit user-specific chat
  const exitChat = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  // Sanitize input to prevent security risks
  const sanitizeInput = (input) => {
    return input.replace(/[<>]/g, ""); // Remove special characters
  };

  const getUserName = (userId) => {
    return userId.split("@")[0]; // Extract username from email
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => (selectedUser ? exitChat() : navigation.goBack())}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        {selectedUser ? (
          <View style={styles.headerUser}>
            <Image
              source={{
                uri: `https://api.dicebear.com/6.x/avataaars/svg?seed=${getUserName(selectedUser)}`,
              }}
              style={styles.userIcon}
            />
            <Text style={styles.header}>{getUserName(selectedUser)}</Text>
          </View>
        ) : (
          <Text style={styles.header}>Chat Management</Text>
        )}
      </View>

      {!selectedUser && (
        <>
          {isLoadingUsers ? (
            <ActivityIndicator size="large" color="#ffec4c" />
          ) : (
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              initialNumToRender={10}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => fetchMessages(item.id)}
                  onLongPress={() => deleteChatHistory(item.id)}
                >
                  <Image
                    source={{
                      uri: `https://api.dicebear.com/6.x/avataaars/svg?seed=${getUserName(item.id)}`,
                    }}
                    style={styles.userIcon}
                  />
                  <Text style={styles.userText}>{getUserName(item.id)}</Text>
                </TouchableOpacity>
              )}
              style={styles.userList}
            />
          )}
          {/* Broadcast Section */}
          <View style={styles.broadcastContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your broadcast message"
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity style={styles.broadcastButton} onPress={broadcastMessage}>
              <Text style={styles.broadcastButtonText}>Broadcast</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {selectedUser && (
        <>
          {isLoadingMessages ? (
            <ActivityIndicator size="large" color="#ffec4c" />
          ) : (
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              initialNumToRender={10}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "Lexel Production"
                      ? styles.adminBubble
                      : styles.userBubble,
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
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message"
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1D",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222831",
    padding: 15,
    elevation: 2,
    marginBottom: 10,
  },
  headerUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EEEEEE",
    marginLeft: 10,
  },
  backButton: {
    color: "#FFD369",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 20,
  },
  userList: {
    padding: 10,
    marginBottom: 20,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#EEEEEE",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  userText: {
    color: "#1A1A1D",
    fontSize: 16,
    marginLeft: 10,
  },
  userIcon: {
    borderWidth: 1,
    borderColor: "#ffec4c",
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  broadcastContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  broadcastButton: {
    backgroundColor: "#FFEC4C",
    padding: 15,
    borderRadius: 8,
  },
  broadcastButtonText: {
    color: "#1A1A1D",
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
    alignSelf: "flex-end",
    backgroundColor: "#FFEC4C",
  },
  userBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  messageText: {
    fontSize: 16,
    color: "#1A1A1D",
  },
  timestamp: {
    fontSize: 10,
    color: "#555",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#34c759",
    padding: 15,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#EEEEEE",
    fontWeight: "bold",
  },
});

export default AdminChatPage;
