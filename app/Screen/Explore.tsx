import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to check if a user is logged in
const getUserState = async () => {
  try {
    const user = await AsyncStorage.getItem('loggedInUser');
    return !!user; // Returns true if a valid user exists
  } catch (error) {
    console.error('Error checking user state:', error);
    return false;
  }
};

const Explore = () => {
  const router = useRouter();

  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const loggedInEmail = await AsyncStorage.getItem("loggedInUserEmail");
        if (loggedInEmail) {
          // If there's a logged-in user email, navigate to Main screen
          router.replace("/Screen/Main");
        } else {
          console.log("No user logged in or user email is missing");
        }
      } catch (error) {
        console.error("Error verifying login state:", error);
      }
    };
    checkLoginState();
  }, [router]);
  

  return (
    <ImageBackground
      source={require('@/assets/images/splash-bg.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Lexel Production</Text>
        <Text style={styles.description}>
          Lexel Production is the top provider of professional video and photo shoot services. We
          specialize in weddings, events, and other occasions at very competitive prices.
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.demoButton]}
          onPress={() => router.push('/Screen/Demo')}
        >
          <Text style={styles.buttonText}>Portfolio</Text>
        </TouchableOpacity>
        <View style={styles.authContainer}>
          <TouchableOpacity
            style={[styles.authButton, styles.signInButton]}
            onPress={() => router.push('/Screen/Login')}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.authButton, styles.signUpButton]}
            onPress={() => router.push('/Screen/Signup')}
          >
            <Text style={styles.authButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for better readability
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffec4c',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    width: '50%',
    backgroundColor: '#ffec4c',
    marginBottom: 20,
  },
  demoButton: {
    backgroundColor: '#ffec4c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  authButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  signInButton: {
    backgroundColor: '#34c759',
  },
  signUpButton: {
    backgroundColor: '#68b663',
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Explore;
