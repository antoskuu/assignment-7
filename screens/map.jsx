import React, {useState} from "react";
import { useEffect } from "react";
import styles from '../styles/styles.jsx';
import CardGrid from '../components/cardGrid.jsx'
import { StatusBar, StyleSheet, useColorScheme, View, Text, Button, ScrollView, TouchableOpacity, ImageBackground, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {getCategories} from '../services/productsApi.js';
import { useTheme } from '@react-navigation/native';
import MapView from 'react-native-maps';

const MapScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
    const fetchCategories = async () => {
        const data = await getCategories();
        setCategories(data);
    };
    fetchCategories();
}, []);

    const handleCategoryPress = (category) => {
        console.log("clicked")
        navigation.navigate('CategoryDetail', {
            categoryTitle: category.title,
            categoryItems: category.items,
        });
    };
    
    return (
        <ScrollView>
            <View style={{backgroundColor: colors.background}}>
                
                <Text style={{...styles.title, color: colors.text}}>Map</Text>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 8 }}>
                </View>
                <CardGrid cart_bool={false} items={categories} onItemPress={handleCategoryPress}/>
            </View>
            
            <MapView
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
/>
        </ScrollView>
    )
}
export default MapScreen;