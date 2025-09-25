import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { database } from "@/firebaseConfig";
import { ref, onValue } from "firebase/database";

const UNSPLASH_ACCESS_KEY = "OurjAMAJfJa84d7nc1ch8yPDNFZCM9yr0Lb5sYlB8vg";

const fetchUnsplashImage = async (query) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();
    return data.results[0]?.urls?.small || "https://via.placeholder.com/200";
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
    return "https://via.placeholder.com/200";
  }
};

const ServicesScreen = () => {
  const [services, setServices] = useState([]);
  const [images, setImages] = useState({});
  const router = useRouter();

  useEffect(() => {
    const servicesRef = ref(database, "services");
    const unsubscribe = onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const servicesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setServices(servicesArray);

        // Fetch images for all services
        servicesArray.forEach(async (service) => {
          const imageUrl = await fetchUnsplashImage(service.name);
          setImages((prev) => ({ ...prev, [service.id]: imageUrl }));
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleBookService = (service) => {
    router.replace("/Screen/BookingForm");
  };

  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      <Image
        source={{ uri: images[item.id] || "https://via.placeholder.com/200" }}
        style={styles.serviceImage}
      />
      <Text style={styles.serviceTitle}>{item.name}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <Text style={styles.servicePrice}>Price: Rs {item.price}</Text>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => handleBookService(item)}
      >
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerText}>SERVICE</Text>
      </View>

      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1D",
    padding: 20,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  headerText: {
    color: "#FFDF00",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  serviceCard: {
    backgroundColor: "#2c2c2c",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  serviceImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  serviceTitle: {
    color: "#FFDF00",
    fontSize: 20,
    fontWeight: "bold",
  },
  serviceDescription: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 10,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFDF00",
    marginBottom: 15,
  },
  bookButton: {
    backgroundColor: "#34c759",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServicesScreen;
