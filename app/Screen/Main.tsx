import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons, Entypo, MaterialIcons } from "@expo/vector-icons";
import { auth, database } from "@/firebaseConfig"; // Firebase config
import { ref, set, get } from "firebase/database";
import HomeScreen from "./HomeScreen";
import ServicesScreen from "./ServicesScreen";
import Gallery from "./Gallery";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }) {
  const router = useRouter();
  const userEmail = auth.currentUser?.email ;
  const [rating, setRating] = useState(0);
  // const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("loggedInUserEmail");
      if (email) setUserEmail(email);
    };
    fetchUserEmail();
  }, []);
  

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem("loggedInUserEmail");
      router.replace("/Screen/Login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleRating = async (rate) => {
    setRating(rate);

    try {
      const ratingsRef = ref(database, `ratings/${auth.currentUser?.uid}`);
      const snapshot = await get(ratingsRef);

      await set(ratingsRef, {
        user: userEmail,
        rating: rate,
        timestamp: Date.now(),
      });

      console.log(snapshot.exists() ? "Rating updated successfully!" : "Rating added successfully!");
    } catch (error) {
      console.error("Error storing or updating rating:", error);
    }
  };

  return (
    <ScrollView style={styles.drawerContainer}>
      <View style={styles.userInfo}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={24} color="#FFD369" />
          <Text style={styles.userEmail}>{userEmail}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.replace("/Screen/UserChatPage")} style={styles.iconButton}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#34C759" />
        <Text style={styles.iconText}>Customer Care</Text>
      </TouchableOpacity>

      <View style={styles.socialMedia}>
        <Text style={styles.sectionTitle}>Follow Us</Text>
        <View style={styles.socialIconsColumn}>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.facebook.com/people/LeXel_Producation/100094274142745/")} style={styles.iconButton}>
            <Entypo name="facebook" size={24} color="#3b5998" />
            <Text style={styles.iconText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.instagram.com/i.m_tanzeel/?next=%2F")} style={styles.iconButton}>
            <Entypo name="instagram" size={24} color="#E1306C" />
            <Text style={styles.iconText}>Instagram</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://medium.com/@tanzeelmughal431")} style={styles.iconButton}>
            <Entypo name="medium" size={24} color="#000000" />
            <Text style={styles.iconText}>Medium</Text>
          </TouchableOpacity>
        </View>
      </View>


      <TouchableOpacity onPress={() => router.replace("/Screen/Terms")} style={styles.iconButton}>
        <Ionicons name="document-text-outline" size={24} color="#34C759" />
        <Text style={styles.iconText}>Terms and Policies</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="#FF4C4C" />
        <Text style={styles.iconText}>Logout</Text>
      </TouchableOpacity>
      <View style={styles.rating}>
        <Text style={styles.sectionTitle}>Rate Our Services</Text>
        <View style={styles.starRating}>
          {[...Array(5)].map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleRating(index + 1)}>
              <Ionicons name="star" size={24} color={index < rating ? "#FFD700" : "#CCCCCC"} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: "70%",
          backgroundColor: "#222831",
        },
        overlayColor: "transparent",
        swipeEdgeWidth: 50,
      }}
    >
      <Drawer.Screen name="Tabs" component={AppTabs} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}
function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#f7f7f7", paddingBottom: 8, height: 60 },
        tabBarActiveTintColor: "#ffec4c",
        tabBarInactiveTintColor: "#666666",
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return (
              <View style={styles.centerTab}>
                <View style={styles.circle}>
                  <Ionicons name="home" size={30} color="#333333" />
                </View>
              </View>
            );
          } else if (route.name === "Services") {
            return <MaterialIcons name="video-library" size={size} color={color} />;
          } else if (route.name === "Gallery") {
            return <MaterialIcons name="photo-library" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen
        name="Gallery"
        component={Gallery}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "", // Remove the "Home" text
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
      />
    </Tab.Navigator>
  );
}


export default function App() {
  return <AppDrawer />;
}

const styles = StyleSheet.create({
  drawerContainer: {
    padding: 10,
    backgroundColor: "#222831",
  },
  userInfo: {
    marginTop: 10,
    paddingTop: 10,
    marginBottom: 20,
    borderTopWidth: 3,
    borderColor: "#ffec4c",
  },
  userEmail: {
    fontSize: 12,
    color: "#EEEEEE",
    marginLeft: 10,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#393E46",
  },
  iconText: {
    fontSize: 16,
    color: "#EEEEEE",
    marginLeft: 10,
  },
  rating: {
    marginBottom: 20,
    alignItems: "center",
  },
  starRating: {
    flexDirection: "row",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#393E46",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EEEEEE",
    marginBottom: 10,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffec4c",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

