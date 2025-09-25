import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showErrorMessage("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      showErrorMessage("The email address you entered is not in a valid format.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const loggedInUser = userCredential.user;

      // Store email in AsyncStorage for session management
      await AsyncStorage.setItem("loggedInUserEmail", email.trim());

      showSuccessMessage("Login successful!");
      setTimeout(() => {
        if (email === "tanzeelmughalengr@gmail.com") {
          router.replace("/Screen/AdminDashboard");
        } else {
          router.replace("/Screen/Main");
        }
      }, 1000);
    } catch (error) {
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseError = (error) => {
    const firebaseErrorMessages = {
      "auth/wrong-password": "The password you entered is incorrect.",
      "auth/user-not-found": "The email address you entered does not exist.",
      "auth/invalid-email": "The email format is invalid. Please check and try again.",
      "auth/too-many-requests": "Too many unsuccessful login attempts. Please try again later.",
    };

    if (firebaseErrorMessages[error.code]) {
      showErrorMessage(firebaseErrorMessages[error.code]);
    } else {
      showErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const showErrorMessage = (message) => {
    setModalMessage(message);
    setIsErrorMessage(true);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 3000);
  };

  const showSuccessMessage = (message) => {
    setModalMessage(message);
    setIsErrorMessage(false);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue</Text>
      </View>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace("/Screen/ForgotPassword")}
      >
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace("/Screen/Signup")}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={[
                styles.modalTitle,
                isErrorMessage ? styles.errorColor : styles.successColor,
              ]}
            >
              {isErrorMessage ? "Error" : "Success"}
            </Text>
            <Text
              style={[
                styles.modalMessage,
                isErrorMessage ? styles.errorColor : styles.successColor,
              ]}
            >
              {modalMessage}
            </Text>
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
    backgroundColor: "#1A1A1D",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffec4c",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 8,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#45474B",
    borderRadius: 8,
    backgroundColor: "white",
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#34c759",
    width: "90%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
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
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
  },
  errorColor: {
    color: "red",
  },
  successColor: {
    color: "#34c759",
  },
});

export default Login;
