import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { database } from "../../firebaseConfig";
import { ref, push, onValue, update, remove } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router"; // Import router for navigation

const AddServicePage = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([]);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const router = useRouter(); // Initialize router for back navigation
  const navigation = useNavigation(); 

  useEffect(() => {
    const servicesRef = ref(database, "services");
    onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const servicesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setServices(servicesArray);
      } else {
        setServices([]);
      }
    });
  }, []);

  const handleAddOrUpdateService = async () => {
    if (!name || !price || !description) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
  
    try {
      const servicesRef = ref(database, "services");
      if (editingServiceId) {
        // Update existing service
        const serviceToUpdateRef = ref(database, `services/${editingServiceId}`);
        await update(serviceToUpdateRef, {
          name,
          price: parseInt(price, 10),
          description,
        });
        Alert.alert("Success", "Service updated successfully");
      } else {
        // Add new service
        await push(servicesRef, {
          name,
          price: parseInt(price, 10),
          description,
        });
        Alert.alert("Success", "Service added successfully");
      }
      resetForm();
    } catch (error) {
      console.error("Error adding/updating service:", error);
      Alert.alert("Error", "Failed to add/update service");
    }
  };
  

  const handleDeleteService = async (id) => {
    try {
      const serviceToDeleteRef = ref(database, `services/${id}`);
      await remove(serviceToDeleteRef);
      Alert.alert("Success", "Service deleted successfully");
    } catch (error) {
      console.error("Error deleting service:", error);
      Alert.alert("Error", "Failed to delete service");
    }
  };

  const handleEditService = (service) => {
    setName(service.name);
    setPrice(service.price.toString());
    setDescription(service.description);
    setEditingServiceId(service.id);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setEditingServiceId(null);
  };

  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.servicePrice}>Price: ${item.price}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditService(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteService(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.headerContainer}>
      <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()} // Navigate back to Admin Dashboard
    >
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>
        <Text style={styles.header}>Manage Your Services</Text>
      </View>

      {/* Form */}
      <TextInput
        style={styles.input}
        placeholder="Service Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Service Price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Service Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdateService}>
        <Text style={styles.buttonText}>
          {editingServiceId ? "Update Service" : "Add Service"}
        </Text>
      </TouchableOpacity>

      {/* Service List */}
      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        style={styles.serviceList}
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: "#FFD369",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#FFDF00",
    textAlign: "center",
    flex: 1,
    marginRight: 40, // To offset the space taken by the back button
  },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#333",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    padding: 10,
    height: 100,
    backgroundColor: "#fff",
    color: "#333",
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#34c759",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  serviceList: {
    marginTop: 20,
  },
  serviceCard: {
    backgroundColor: "#2c2c2c",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFDF00",
  },
  servicePrice: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 5,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#0A84FF",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default AddServicePage;
