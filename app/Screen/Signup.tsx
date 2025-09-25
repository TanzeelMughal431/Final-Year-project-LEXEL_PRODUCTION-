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
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { useRouter } from "expo-router";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const router = useRouter();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSignup = async () => {
    setLoading(true);
    setEmailError("");
  
    const trimmedEmail = email.trim(); // Trim spaces from the email input
  
    if (!trimmedEmail || !password || !confirmPassword) {
      showErrorMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }
  
    if (!isValidEmail(trimmedEmail)) {
      setEmailError("Invalid email format.");
      setLoading(false);
      return;
    }
  
    if (password !== confirmPassword) {
      showErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }
  
    try {
      const methods = await fetchSignInMethodsForEmail(auth, trimmedEmail);
      if (methods.length > 0) {
        showErrorMessage("Signup failed: Email already exists.");
        resetFields();
        setLoading(false);
        return;
      }
  
      await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      showSuccessMessage(
        "Signup successful! Please ensure your email is correct. If it's invalid, you won't be able to reset your password in the future."
      );
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showErrorMessage("Signup failed: Email already exists.");
      } else {
        showErrorMessage("Signup failed. Please try again.");
      }
    } finally {
      resetFields();
      setLoading(false);
    }
  };
  
  const showErrorMessage = (message) => {
    setModalMessage(message);
    setIsErrorMessage(true);
    setModalVisible(true);
  };

  const showSuccessMessage = (message) => {
    setModalMessage(message);
    setIsErrorMessage(false);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>

      <TextInput
        value={email}
        placeholder="Email"
        placeholderTextColor="#888"
        style={[
          styles.input,
          emailError ? { borderColor: "red", borderWidth: 2 } : null,
        ]}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError("");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        value={password}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />

      <TextInput
        value={confirmPassword}
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        secureTextEntry
        style={styles.input}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace("/Screen/Login")}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => setModalVisible(false)}
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
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: "#0A84FF",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#45474B",
    borderRadius: 8,
    backgroundColor: "white",
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#34c759",
    width: "90%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
  errorColor: {
    color: "red",
  },
  successColor: {
    color: "#34c759",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
});

export default Signup;
