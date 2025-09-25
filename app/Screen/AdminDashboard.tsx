import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Animated,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { ref, onValue, remove } from "firebase/database";
import { auth, database } from "../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminDashboard = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const userEmail = auth.currentUser?.email ;

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("loggedInUserEmail");
      if (email) setUserEmail(email);
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: averageRating / 5,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [averageRating]);

  const fetchData = () => {
    fetchBookings();
    fetchRatings();
  };

  const fetchBookings = () => {
    const bookingsRef = ref(database, "bookings");
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setBookings(bookingArray);
      } else {
        setBookings([]);
      }
      setLoading(false);
    });
  };

  const fetchRatings = () => {
    const ratingsRef = ref(database, "ratings");
    onValue(ratingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ratingArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setRatings(ratingArray);
        const totalRatings = ratingArray.reduce((sum, item) => sum + item.rating, 0);
        const avg = totalRatings / ratingArray.length;
        setAverageRating(avg);
      } else {
        setRatings([]);
        setAverageRating(0);
      }
    });
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await auth.signOut();
      await AsyncStorage.removeItem("loggedInUserEmail");
            router.replace("/Screen/Login"); // Ensures navigation stack is cleared
          } catch (error) {
            console.error("Logout Error:", error);
            Alert.alert("Error", "Failed to log out. Please try again.");
          }
        },
      },
    ]);
  };
  

 

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logout Icon */}
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={35} color="#FF3B30" />
      </TouchableOpacity>
      <Text style={styles.Dashboardname}>Admin Dashboard</Text>

      {/* Logo */}
      <Image source={require("../../assets/images/Agent.png")} style={styles.logo} />

      {/* Application Rating */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Application Rating</Text>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
                backgroundColor: progress.interpolate({
                  inputRange: [0, 0.35, 0.5, 0.75, 1],
                  outputRange: ["#FF4C4C", "#FF4C4C", "#FFD369", "#34C759", "#2E7D32"],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.ratingText}>
          {(averageRating * 20).toFixed(2)}% ({ratings.length} ratings)
        </Text>
      </View>

      {/* Total Bookings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Bookings</Text>
        <Text style={styles.largeText}>{bookings.length}</Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/Screen/AddServicePage")}>
          <Text style={styles.buttonText}>Manage Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/Screen/AdminChatPage")}>
          <Text style={styles.buttonText}>Respond to Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/Screen/AllBookingDetails")}>
          <Text style={styles.buttonText}>View New Bookings</Text>
        </TouchableOpacity>
      </View>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    padding: 20,
    paddingTop: 35,
  },
  logoutIcon: {
    marginTop: 25,
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  Dashboardname: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFDF00",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 45,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#393E46",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD369",
    marginBottom: 10,
  },
  progressBar: {
    width: "100%",
    height: 10,
    borderRadius: 6,
    backgroundColor: "#EEEEEE",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 14,
    color: "#34C759",
    marginTop: 5,
  },
  largeText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#34C759",
    textAlign: "center",
  },
  buttonGroup: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ffec4c",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#222831",
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingItem: {
    backgroundColor: "#393E46",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingEmail: {
    fontSize: 14,
    color: "#FFD369",
  },
  ratingValue: {
    fontSize: 16,
    color: "#EEEEEE",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222831",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#EEEEEE",
  },
});

export default AdminDashboard;
