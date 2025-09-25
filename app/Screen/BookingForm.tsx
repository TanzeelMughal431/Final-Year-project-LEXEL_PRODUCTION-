import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { database } from "@/firebaseConfig";
import { ref, push, onValue } from "firebase/database";
import * as Linking from "expo-linking";

const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    price: "",
    date: "",
    gender: "",
    location: "",
    specialRequests: "",
  });
  const [services, setServices] = useState([]);
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
        if (!formData.service && servicesArray.length > 0) {
          setFormData({
            ...formData,
            service: servicesArray[0].name,
            price: servicesArray[0].price,
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNext = () => {
    if (!validateStep()) return;
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => Math.max(1, prev - 1));

  const handleDateChange = (event, selectedDate) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate.toISOString().split("T")[0] });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const newBookingRef = push(ref(database, "bookings"));
      await push(ref(database, "bookings"), formData);

      const message = `
LeXeL Services Booking Details:
Name: ${formData.name}
Phone: ${formData.phone}
Service: ${formData.service}
Price: Rs ${formData.price}
Date: ${formData.date}
Gender: ${formData.gender}
Location: ${formData.location}
Special Requests: ${formData.specialRequests}
      `;
      Linking.openURL(`https://wa.me/923556110431?text=${encodeURIComponent(message)}`);

      setModalMessage("Booking successful! Redirecting...");
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        router.replace("/Screen/Main");
      }, 3000);
    } catch (error) {
      setModalMessage("Failed to save booking. Please try again.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.phone.match(/^\d{10,15}$/)) {
          setError("Please provide a valid name and phone number (10-15 digits).");
          return false;
        }
        break;
      case 3:
        if (!formData.date) {
          setError("Please select a date.");
          return false;
        }
        if (formData.service.toLowerCase().includes("wedding") && !formData.gender) {
          setError("Please select your side for the event.");
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
  <TouchableOpacity onPress={() => router.replace('/Screen/Main')}>
    <Text style={styles.backButton}>← Back</Text>
  </TouchableOpacity>
  <Text style={styles.header}>Booking Form</Text>
</View>


      {loading && <ActivityIndicator size="large" color="#FFDF00" />}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Step 1: Personal Details */}
      {step === 1 && (
        <View>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />
        </View>
      )}

      {/* Step 2: Service Selection */}
      {step === 2 && (
        <View>
          <Text style={styles.label}>Select Service</Text>
          <Picker
            selectedValue={formData.service}
            onValueChange={(itemValue) => {
              const selectedService = services.find((s) => s.name === itemValue);
              setFormData({
                ...formData,
                service: itemValue,
                price: selectedService?.price || "",
              });
            }}
            style={styles.picker}
          >
            {services.map((service) => (
              <Picker.Item
                key={service.id}
                label={service.name}
                value={service.name}
              />
            ))}
          </Picker>
          {formData.price && (
            <Text style={styles.priceDisplay}>Price: Rs {formData.price}</Text>
          )}
        </View>
      )}

      {/* Step 3: Date and Gender */}
      {step === 3 && (
        <View>
          <Text style={styles.label}>Event Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setDatePickerVisible(true)}
          >
            <Text>{formData.date || "Select Date"}</Text>
          </TouchableOpacity>
          {datePickerVisible && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          {formData.service.toLowerCase().includes("wedding") && (
            <View>
              <Text style={styles.label}>Your Side</Text>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(itemValue) =>
                  setFormData({ ...formData, gender: itemValue })
                }
                style={styles.picker}
              >
                <Picker.Item label="Select your side" value="" />
                <Picker.Item label="Groom's Side" value="Groom" />
                <Picker.Item label="Bride's Side" value="Bride" />
              </Picker>
            </View>
          )}
        </View>
      )}

      {/* Step 4: Location & Special Requests */}
      {step === 4 && (
        <View>
          <Text style={styles.label}>Event Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event location"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />
          <Text style={styles.label}>Special Requests</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Enter any special requests"
            multiline
            value={formData.specialRequests}
            onChangeText={(text) =>
              setFormData({ ...formData, specialRequests: text })
            }
          />
        </View>
      )}

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Navigation Buttons */}
      <View style={styles.buttons}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.backButtonStyle]}
            onPress={handleBack}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < 4 && (
          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
        {step === 4 && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222831",
    padding: 15,
    elevation: 2,
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EEEEEE",
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    color: "#EEEEEE",
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    color: "#FFDF00",
    fontSize: 18,
    marginBottom: 5,
    marginTop: 15,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    backgroundColor: "#064663",
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "white",
  },
  priceDisplay: {
    color: "#FFDF00",
    fontSize: 18,
    marginVertical: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  backButtonStyle: {
    backgroundColor: "#FF6666",
  },
  nextButton: {
    backgroundColor: "#34C759",
  },
  submitButton: {
    backgroundColor: "#FFDF00",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#1A1A1D",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#0A84FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingForm;
