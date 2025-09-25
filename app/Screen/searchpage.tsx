import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";

const UNSPLASH_ACCESS_KEY = "OurjAMAJfJa84d7nc1ch8yPDNFZCM9yr0Lb5sYlB8vg";

export default function SearchScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);
  const [defaultImages, setDefaultImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchDefaultImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      setImages(response.data.results);
    } catch (error) {
      console.error("Error fetching images from Unsplash:", error);
    }
  };

  const fetchDefaultImages = async () => {
    try {
      const queries = ["happy", "sad", "fashion", "wedding"];
      const allImages = [];
      for (const query of queries) {
        const response = await axios.get(
          `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        allImages.push(...response.data.results.slice(0, 6));
      }
      setDefaultImages(allImages);
    } catch (error) {
      console.error("Error fetching default images:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace('/Screen/Main')}>
          <Ionicons name="arrow-back" size={24} color="#FFD369" />
        </TouchableOpacity>
        <Text style={styles.header}>Search Mode</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for images..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchImages}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Display Images */}
      <FlatList
        data={images.length > 0 ? images : defaultImages}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.imageCard}
            onPress={() => {
              setSelectedImage(item);
              setModalVisible(true);
            }}
          >
            <Image source={{ uri: item.urls.small }} style={styles.image} />
            <Text style={styles.imageTitle}>
              {item.alt_description
                ? item.alt_description.split(" ").slice(0, 2).join(" ") + "..."
                : "Untitled"}
            </Text>
            <Text style={styles.imagePrice}>
              Rs {Math.floor(Math.random() * 5000 + 1000)}
            </Text>
          </TouchableOpacity>
        )}
        columnWrapperStyle={styles.row}
      />

      {/* Modal for Image Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: selectedImage?.urls.regular }}
            style={styles.fullImage}
          />
          <Text style={styles.modalTitle}>
            {selectedImage?.alt_description || "Untitled"}
          </Text>
          <Text style={styles.modalDescription}>
            Description:{" "}
            {selectedImage?.description || "No description available."}
          </Text>
          <Text style={styles.modalPrice}>
            Price: Rs {Math.floor(Math.random() * 5000 + 1000)}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A1D", padding: 10 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222831",
    padding: 15,
    elevation: 2,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EEEEEE",
    textAlign: "center",
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#34c759",
    padding: 10,
    borderRadius: 8,
  },
  imageCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#222",
    borderRadius: 8,
    alignItems: "center",
    overflow: "hidden",
    paddingBottom: 10,
  },
  image: { width: 100, height: 100, borderRadius: 8, marginTop: 5 },
  imageTitle: { color: "#fff", marginTop: 5, fontSize: 12 },
  imagePrice: { color: "#ffec4d", fontSize: 12, fontWeight: "bold" },
  row: {
    justifyContent: "space-between",
  },
  placeholderText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  fullImage: { width: "90%", height: "50%", marginBottom: 20 },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  modalDescription: { color: "#ccc", fontSize: 14, marginVertical: 10 },
  modalPrice: { color: "#ffec4d", fontSize: 16, fontWeight: "bold" },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#34c759",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});
