import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TermsAndPolicies = ({ navigation }) => {
  
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      title: "Introduction",
      icon: "information-circle-outline",
      content:
        "Welcome to Lexel Production! Our application is designed to revolutionize videography and storytelling by providing seamless project management and service booking for users. By using our app, you agree to abide by our terms and policies outlined below.",
    },
    {
      title: "User Responsibilities",
      icon: "person-outline",
      content:
        "Users must provide accurate and up-to-date information during sign-up and booking processes. All interactions on the app, including messages and bookings, must be respectful and comply with applicable laws and regulations. Any unauthorized or malicious use of the app, such as spamming or hacking, is strictly prohibited.",
    },
    {
      title: "Service Usage",
      icon: "construct-outline",
      content:
        "Lexel Production offers services like project management, booking scheduling, payment processing, and client communication. The app integrates features like notifications, real-time updates, and easy feedback sharing to enhance user experience. Users can upload and manage their media files, provided the content adheres to ethical standards.",
    },
    {
      title: "Data Privacy",
      icon: "lock-closed-outline",
      content:
        "User data, including personal and booking details, is securely stored and processed in compliance with data protection laws. Lexel Production does not share user data with third parties without explicit consent, except as required by law. Users can request data deletion or account removal at any time.",
    },
    {
      title: "Payments and Refunds",
      icon: "cash-outline",
      content:
        "All payments made through the app are processed via secure gateways. Refund policies are subject to service-specific terms, and disputes will be handled on a case-by-case basis. Users are encouraged to review payment details carefully before confirming transactions.",
    },
    {
      title: "Liability",
      icon: "alert-circle-outline",
      content:
        "Lexel Production is not liable for any direct or indirect damages resulting from the misuse of the app or its services. The app may occasionally experience downtime for updates or maintenance, and we will notify users in advance wherever possible.",
    },
    {
      title: "Content Rights",
      icon: "cloud-upload-outline",
      content:
        "Users retain ownership of the content they upload but grant Lexel Production a license to display, edit, and process this content for app functionalities. Any misuse of content, including copyright violations, will result in account suspension or termination.",
    },
    {
      title: "Modifications to Terms",
      icon: "create-outline",
      content:
        "Lexel Production reserves the right to update these terms and policies. Users will be notified of significant changes and are advised to review updates regularly. Continued use of the app constitutes acceptance of the revised terms.",
    },
    {
      title: "Contact Us",
      icon: "mail-outline",
      content:
        "For questions, concerns, or support, users can reach out to:\n\nEmail: tanzeelmughal431@gmail.com\nWebsite: www.lexelproduction.com",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/Screen/Main")}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#393E46" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <ScrollView>
        <Text style={styles.header}>Terms and Policies</Text>
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(index)}
            >
              <Ionicons
                name={section.icon}
                size={20}
                color="#FFD369"
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </TouchableOpacity>
            {expandedSection === index && (
              <Text style={styles.sectionContent}>{section.content}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#393E46",
    marginLeft: 10,
    fontWeight: "bold",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222831",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#A6AEBF",
    paddingBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#393E46",
  },
  sectionContent: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
    lineHeight: 22,
  },
});

export default TermsAndPolicies;
