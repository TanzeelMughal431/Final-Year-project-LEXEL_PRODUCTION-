import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { auth } from "../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getApp } from "firebase/app"; // Import getApp
import { useRouter } from "expo-router";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const router = useRouter();
  const app = getApp(); // Get the initialized Firebase app
  const db = getFirestore(app); // Initialize Firestore using the app

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkUserExists = async (email) => {
    try {
      const usersRef = collection(db, "users"); // Replace "users" with your Firestore collection name
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty; // True if user exists
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setModalMessage("Please enter your email address.");
      setModalVisible(true);
      return;
    }

    if (!isValidEmail(email)) {
      setModalMessage("The email address you entered is not in a valid format.");
      setModalVisible(true);
      return;
    }

    try {
      const userExists = await checkUserExists(email);
      if (!userExists) {
        setModalMessage("The email address you entered does not exist in our records.");
        setModalVisible(true);
        return;
      }

      await sendPasswordResetEmail(auth, email.trim());
      setModalMessage(
        "A password reset link has been sent to your email. Please check your inbox and follow the instructions."
      );
      setModalVisible(true);
    } catch (error) {
      setModalMessage(`Error: ${error.message}`);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Reset Your Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered email address to receive a password reset link.
        </Text>
      </View>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.resetButton} onPress={handleForgotPassword}>
        <Text style={styles.resetButtonText}>Send Reset Link</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace("/Screen/Login")}
      >
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notification</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => {
                setModalVisible(false);
                if (modalMessage.startsWith("A password reset link")) {
                  router.replace("/Screen/Login");
                }
              }}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffd700",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    backgroundColor: "#2c2c2c",
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#fff",
  },
  resetButton: {
    backgroundColor: "#ff6347",
    width: "90%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: "#0A84FF",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#2c2c2c",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffd700",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: "#34c759",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotPasswordPage;
