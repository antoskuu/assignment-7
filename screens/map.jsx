import React, { useState, useEffect, useCallback, memo } from "react";
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Mapbox from '@rnmapbox/maps';
import styles from '../styles/styles.jsx';
import CardGrid from '../components/cardGrid.jsx';
import { getCategories } from '../services/productsApi.js';
import { useFocusEffect } from "@react-navigation/native";
import { getMemories } from "../services/memoriesAPI.js";

const MapScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    const [markers, setMarkers] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                fetchMarkers();
            };
            load();
        }, [])
    );
    
    const fetchMarkers = async () => {
                const data = await getMemories();
                const memoriesArray = Array.isArray(data) ? data : (data?.memories || []);
                console.log(memoriesArray);
                const markersWithParsedLocation = memoriesArray.map(marker => ({
            ...marker,
            location: JSON.parse(marker.location)
        }));
                setMarkers(markersWithParsedLocation);
                
                    
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
                    zoomLevel={15}
                    centerCoordinate={[-122.4324, 37.78825]}
                    animationMode="flyTo"
                />
                {markers.map((marker) => ( console.log('marker rendu', marker.location),
                    <Mapbox.PointAnnotation
                        key={marker.id}
                        id={`marker-${marker.id}`}
                        coordinate={marker.location}
                    >
                        <View style={{
                            width: 30,
                            height: 30,
                            backgroundColor: colors.primary || 'red',
                            borderRadius: 15,
                            borderWidth: 2,
                            borderColor: 'white',
                        }} />
                        <Mapbox.Callout title={marker.title} />
                    </Mapbox.PointAnnotation>
                ))}
            </Mapbox.MapView>
            
        </View>
    )
}

export default MapScreen;