import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (currentScreen === "splash") {
      Animated.timing(animation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => setCurrentScreen("start"), 2000);
      });
    } else if (currentScreen === "loading") {
      setTimeout(() => {
        router.replace("/Screen/Explore");
      }, 3000);
    }
  }, [currentScreen]);

  if (currentScreen === "splash") {
    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });

    return (
      <View style={styles.splashContainer}>
        <Animated.Text style={[styles.splashText, { transform: [{ scale }] }]}>X</Animated.Text>
        <Animated.View
          style={{
            height: 4,
            width: "100%",
            backgroundColor: "yellow",
            marginTop: 10,
            opacity: animation,
          }}
        />
      </View>
    );
  }

  if (currentScreen === "start") {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("@/assets/images/splash-bg.png")}
          style={styles.backgroundImage}
          imageStyle={{ opacity: 0.5 }}
        >
          <View style={styles.content}>
            <Image
              source={require("@/assets/images/Agent.png")}
              style={styles.logo}
            />
            <Text style={styles.subtitle}>Trust & Quality</Text>
            <Text style={styles.description}>500+ clients in Neelum Valley</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurrentScreen("loading")}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }

  if (currentScreen === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a202c",
  },
  splashText: {
    fontSize: 64,
    color: "white",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#1a202c",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  subtitle: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: -2,
  },
  description: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 36,
  },
  button: {
    backgroundColor: "#fbbf24",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 9999,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
});

export default Index;
