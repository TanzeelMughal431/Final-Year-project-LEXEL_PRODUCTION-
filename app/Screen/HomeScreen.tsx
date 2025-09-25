import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { routeToScreen } from "expo-router/build/useScreens";

import { useRouter } from "expo-router";

  

export default function HomeScreen() {
  const router = useRouter();
  return (
    
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/Agent.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Book now Wedding</Text>
        <Text style={styles.bannerSubtitle}>
          Unlock unlimited access to stream movies online in premium mode.
        </Text>
        <Image
          source={{
            uri: "https://plus.unsplash.com/premium_photo-1675851210850-de5525809dd9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjF8fHdlZGRpbmd8ZW58MHx8MHx8fDA%3D",
          }}
          style={styles.bannerImage}
        />
      </View>
      <View style={styles.filters}>
  <TouchableOpacity
    style={styles.searchButton}
    onPress={() => router.replace("/Screen/searchpage")}
  >
    <Ionicons name="search-outline" size={20} color="black" />
    <Text style={styles.searchText}>Search by Mode</Text>
  </TouchableOpacity>
</View>


      <Text style={styles.sectionTitle}>Recommended For You</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.recommendedScroll}
      >
        <TouchableOpacity style={styles.recommendedItem}>
          <Image
            source={{
              uri: "https://plus.unsplash.com/premium_photo-1711132859676-d695799e0119?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={styles.recommendedImage}
          />
          <Text style={styles.recommendedText}>Portate shoot</Text>
          <Text style={styles.price}>Rs 33k</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recommendedItem}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1727510247756-0378e4a2829e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MTB8fHxlbnwwfHx8fHw%3D",
            }}
            style={styles.recommendedImage}
          />
          <Text style={styles.recommendedText}>Birthday</Text>
          <Text style={styles.price}>Rs 3000</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recommendedItem}>
          <Image
            source={{
              uri: "https://images.unsplash.com/flagged/photo-1620830102229-9db5c00d4afc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHdlZGRpbmd8ZW58MHx8MHx8fDA%3D",
            }}
            style={styles.recommendedImage}
          />
          <Text style={styles.recommendedText}>Birthday</Text>
          <Text style={styles.price}>Rs 3000</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recommendedItem}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1637870996864-65dc1c00f4dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvdmV8ZW58MHx8MHx8fDA%3D",
            }}
            style={styles.recommendedImage}
          />
          <Text style={styles.recommendedText}>Barger</Text>
          <Text style={styles.price}>Rs 3000</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recommendedItem}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1634729108619-3576b0db8090?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
            }}
            style={styles.recommendedImage}
          />
          <Text style={styles.recommendedText}>Birthday</Text>
          <Text style={styles.price}>Rs 3000</Text>
        </TouchableOpacity>
        {/* Add more items as needed */}
      </ScrollView>

      <Text style={styles.sectionTitle}>This Week Most Like</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.recommendedScroll}
      >
        <TouchableOpacity style={styles.recommendedItem}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvc2V8ZW58MHx8MHx8fDA%3D",
            }}
            style={styles.recommendedImage}
          />
          <Text style={styles.recommendedText}>Portate shoot</Text>
          <Text style={styles.price}>Rs 33k</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recommendedItem}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1520024146169-3240400354ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvc2V8ZW58MHx8MHx8fDA%3D",
            }}
            style={styles.recommendedImage}
          />
          <Text style={styles.recommendedText}>Birthday</Text>
          <Text style={styles.price}>Rs 3000</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recommendedItem}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fHBvc2V8ZW58MHx8MHx8fDA%3D",
            }}
            style={styles.recommendedImage}
          />
          <Text style={styles.recommendedText}>Birthday</Text>
          <Text style={styles.price}>Rs 3000</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recommendedItem}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1530107973768-581951e62d34?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTV8fHBvc2V8ZW58MHx8MHx8fDA%3D",
            }}
            style={styles.recommendedImage}
          />
          <Text style={styles.recommendedText}>Birthday</Text>
          <Text style={styles.price}>Rs 3000</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recommendedItem}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1526411803240-adf6120a86e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBvc2V8ZW58MHx8MHx8fDA%3D",
            }}
            style={styles.recommendedImage}
          />
          <Text style={styles.recommendedText}>Birthday</Text>
          <Text style={styles.price}>Rs 3000</Text>
        </TouchableOpacity>
        {/* Add more items as needed */}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 All rights reserved by Lexel Production
        </Text>
        <Text style={styles.footerText}>Designer: Tanzeel ur
          Rehman Mughal
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  headerText: { color: "white", fontSize: 18, fontWeight: "bold" },
  logo: { width: 50, height: 50, marginLeft: 10 },
  banner: {
    padding: 20,
    backgroundColor: "#222",
    borderRadius: 10,
    margin: 10,
  },
  bannerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  bannerSubtitle: { color: "#ccc", marginVertical: 10 },
  bannerImage: { width: "100%", height: 200, borderRadius: 10 },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    margin: 10,
    fontWeight: "bold",
  },
  recommendedScroll: { paddingHorizontal: 10 },
  recommendedItem: { marginRight: 15 },
  recommendedImage: { width: 120, height: 100, borderRadius: 10 },
  recommendedText: { color: "white", marginTop: 5 },
  price: { color: "yellow", fontWeight: "bold" },
  filters: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEC4C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
  },
  searchText: {
    marginLeft: 10,
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer:{
    marginTop:10,
    padding:5,
    backgroundColor:'white',

  },
  footerText: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
});
