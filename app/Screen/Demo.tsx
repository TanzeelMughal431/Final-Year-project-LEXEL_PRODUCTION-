import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";

const UNSPLASH_ACCESS_KEY = "OurjAMAJfJa84d7nc1ch8yPDNFZCM9yr0Lb5sYlB8vg";

const Demo = () => {
  const router = useRouter();
  const [weddingImages, setWeddingImages] = useState([]);
  const [portraitImages, setPortraitImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [futureFeatureMessage, setFutureFeatureMessage] = useState(false);

  const fetchImages = async (query, setImages) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=9&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setImages(data.results.map((img) => img.urls.small));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    const fetchAllImages = async () => {
      await Promise.all([
        fetchImages("wedding", setWeddingImages),
        fetchImages("portrait", setPortraitImages),
      ]);
      setLoading(false);
    };
    fetchAllImages();
  }, []);

  const renderGallerySection = (title, images) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
          </View>
        )}
        keyExtractor={(item, index) => `${title}-${index}`}
        numColumns={3}
        scrollEnabled={false}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34c759" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>LeXeL Portfolio</Text>
      </View>

      {renderGallerySection("Wedding Photos", weddingImages)}
      {renderGallerySection("Portrait Photos", portraitImages)}

      {/* Modal for AI Features */}
      <Modal
        visible={futureFeatureMessage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFutureFeatureMessage(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              Thank you for your interest! This feature will be available in
              future updates. Stay tuned for exciting advancements.
            </Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => setFutureFeatureMessage(false)}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.bookingButton}
        onPress={() => router.replace("/Screen/Login")}
      >
        <Text style={styles.bookingButtonText}>Login Now</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.AutoButton}
        onPress={() => setFutureFeatureMessage(true)}
      >
        <Text style={styles.AutoButtonText}>AI Features</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1D",
  },
  header: {
    paddingVertical: 20,
    backgroundColor: "#34c759",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#ffec4c",
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 5,
  },
  bookingButton: {
    backgroundColor: "#ffec4c",
    padding: 15,
    margin: 20,
    borderRadius: 100,
    alignItems: "center",
  },
  bookingButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  AutoButton: {
    backgroundColor: "#00BFFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: -10,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  AutoButtonText: {
    color: "#222831",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    backgroundColor: "#393E46",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00BFFF",
  },
  messageText: {
    color: "#EEEEEE",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  okButton: {
    backgroundColor: "#34c759",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1D",
  },
});

export default Demo;
