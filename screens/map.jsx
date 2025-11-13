import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Mapbox from '@rnmapbox/maps';
import styles from '../styles/styles.jsx';
import CardGrid from '../components/cardGrid.jsx';
import { getCategories } from '../services/productsApi.js';

Mapbox.setAccessToken('pk.eyJ1IjoiYW50b3NrdXUiLCJhIjoiY21oeGEwOTdoMDA3YTJsczhoZzZ0azN5YSJ9.mF703yMII86IKPr3XrvvYQ');

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
        console.log("clicked");
        navigation.navigate('CategoryDetail', {
            categoryTitle: category.title,
            categoryItems: category.items,
        });
    };
    
    return (
        <View style={{ backgroundColor: colors.background }}>
            <Text style={{ ...styles.title, color: colors.text }}>Map</Text>
            
            <Mapbox.MapView
                style={{ height: '100%', width: '100%' }}
                styleURL={Mapbox.StyleURL.Satellite}
                    projection="globe"

            >
                <Mapbox.Camera
                    zoomLevel={1}
                    centerCoordinate={[-122.4324, 37.78825]}
                    animationMode="flyTo"
                />
            </Mapbox.MapView>
            
            <CardGrid cart_bool={false} items={categories} onItemPress={handleCategoryPress}/>
        </View>
    )
}

export default MapScreen;