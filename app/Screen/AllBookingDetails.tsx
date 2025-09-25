import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { database } from "@/firebaseConfig";
import { ref, onValue, remove } from "firebase/database";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation(); 

  useEffect(() => {
    const bookingRef = ref(database, "bookings");
    onValue(bookingRef, (snapshot) => {
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
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Booking",
      "Are you sure you want to delete this booking?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const bookingRef = ref(database, `bookings/${id}`);
              await remove(bookingRef);
              setBookings((prev) => prev.filter((booking) => booking.id !== id));
            } catch (error) {
              console.error("Error deleting booking:", error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
      <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()} // Navigate back to Admin Dashboard
    >
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>
        <Text style={styles.headerText}>Booking Details</Text>
      </View>

      <ScrollView>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.card}>
              <Text style={styles.title}>Name: {booking.name}</Text>
              <Text>Phone: {booking.phone}</Text>
              <Text>Service: {booking.service}</Text>
              <Text>Price: {booking.price}</Text>
              <Text>Date: {booking.date}</Text>
              <Text>Gender: {booking.gender}</Text>
              <Text>Location: {booking.location}</Text>
              <Text>Special Requests: {booking.specialRequests}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(booking.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No bookings available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#222831", // Matches the dark theme
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: "#FFD369",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EEEEEE",
    textAlign: "center",
    flex: 1, // Center aligns the text
    marginRight: 40, // Offset to align with back button spacing
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  deleteButton: {
    marginTop: 16,
    backgroundColor: "#FF4C4C",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 20,
  },
});

export default BookingList;
