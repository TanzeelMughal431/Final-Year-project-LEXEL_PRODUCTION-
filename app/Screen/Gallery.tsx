import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, FlatList, ScrollView } from 'react-native';

const GalleryScreen = () => {
  // Floating animation for images
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Looping floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  // Gallery data with added sections
  const galleryData = [
    { id: '1', uri: 'https://plus.unsplash.com/premium_photo-1711132859676-d695799e0119?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', section: 'Photography' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1727510247756-0378e4a2829e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MTB8fHxlbnwwfHx8fHw%3D', section: 'Photography' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2lybHxlbnwwfHwwfHx8MA%3D%3D', section: 'Photography' },
    { id: '4', uri: 'https://plus.unsplash.com/premium_photo-1685223896391-7ee4eded9945?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fHZpZGVvfGVufDB8fDB8fHww', section: 'Videography' },
    { id: '5', uri: 'https://images.unsplash.com/photo-1486693326701-1ea88c6e2af3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHZpZGVvfGVufDB8fDB8fHww', section: 'Videography' },
    { id: '6', uri: 'https://images.unsplash.com/photo-1459184070881-58235578f004?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dmlkZW98ZW58MHx8MHx8fDA%3D', section: 'Videography' },
    { id: '7', uri: 'https://images.unsplash.com/photo-1516383607781-913a19294fd1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D', section: 'Graphic Design' },
    { id: '8', uri: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3JhaGljJTIwZGVzaWdufGVufDB8fDB8fHww', section: 'Graphic Design' },
    { id: '9', uri: 'https://images.unsplash.com/photo-1659553761498-6a8728fbf281?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fE5lZWx1bSUyMHZhbGxleXxlbnwwfHwwfHx8MA%3D%3D', section: 'Graphic Design' },
  ];

  const renderGalleryItem = ({ item }) => (
    <Animated.View style={[styles.imageContainer, { transform: [{ translateY: floatAnim }] }]}>
      <Image source={{ uri: item.uri }} style={styles.image} />
    </Animated.View>
  );

  const renderSection = (title, sectionData) => (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.divider} />
      <FlatList
        data={sectionData}
        renderItem={renderGalleryItem}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.section}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Gallery</Text>

      {/* Render Sections */}
      {renderSection('Photography', galleryData.filter(item => item.section === 'Photography'))}
      {renderSection('Videography', galleryData.filter(item => item.section === 'Videography'))}
      {renderSection('Graphic Design', galleryData.filter(item => item.section === 'Graphic Design'))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginVertical: 10,
    textAlign: 'left',
  },
  divider: {
    height: 2,
    backgroundColor: '#ffec4d',
    width: '20%',
    marginVertical: 8,
  },
  section: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  imageContainer: {
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  image: {
    width: 120,
    height: 150,
    borderRadius: 15,
  },
});

export default GalleryScreen;
