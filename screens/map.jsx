import React, { useState, useEffect, useCallback, memo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
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
    const [selectedMarker, setSelectedMarker] = useState(null);

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
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
            
            <View style={{ flex: 1, position: 'relative' }}>
                <Mapbox.MapView
                    style={{ flex: 1 }}
                    styleURL={Mapbox.StyleURL.Street}
                    projection="globe"
                    onPress={() => setSelectedMarker(null)}
                >
                    <Mapbox.Camera
                        zoomLevel={15}
                        centerCoordinate={[-122.4324, 37.78825]}
                        animationMode="flyTo"
                    />
                    {markers.map((marker) => (
                        <Mapbox.PointAnnotation
                            key={marker.id}
                            id={`marker-${marker.id}`}
                            coordinate={marker.location}
                            onSelected={() => {
                                console.log('Marker selected:', marker.title);
                                setSelectedMarker(marker.id);
                            }}
                        >
                            {/* Pin personnalisé */}
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                
                            </View>
                        </Mapbox.PointAnnotation>
                    ))}
                </Mapbox.MapView>

                {selectedMarker && (() => {
                    const marker = markers.find(m => m.id === selectedMarker);
                    if (!marker) return null;
                    
                    return (
                        <View style={{
                            position: 'absolute',
                            bottom: 20,
                            left: 20,
                            right: 20,
                            backgroundColor: colors.card || 'white',
                            borderRadius: 15,
                            padding: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 10,
                        }}>
                            <TouchableOpacity
                                onPress={() => setSelectedMarker(null)}
                                style={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    width: 28,
                                    height: 28,
                                    borderRadius: 14,
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 10,
                                }}
                            >
                                <Text style={{ fontSize: 20, color: colors.text, fontWeight: 'bold' }}>×</Text>
                            </TouchableOpacity>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                            {marker.image && (
                                <Image 
                                    source={{uri: marker.image}} 
                                    style={{
                                        width: '50%', 
                                        height: 150, 
                                        resizeMode: 'cover', 
                                        borderRadius: 10, 
                                        marginBottom: 12
                                    }} 
                                />
                            )}
                            <View style={{ flex: 1, marginLeft: marker.image ? 12 : 0 }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: colors.text || '#000',
                                marginBottom: 8,
                                paddingRight: 30,
                            }}>
                                {marker.title}
                            </Text>

                            {marker.tags && marker.tags.length > 0 && (
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                                    {marker.tags.slice(0, 3).map((tag, idx) => (
                                        <View
                                            key={idx}
                                            style={{
                                                backgroundColor: tag[1],
                                                paddingHorizontal: 8,
                                                paddingVertical: 4,
                                                borderRadius: 10,
                                                marginRight: 6,
                                                marginBottom: 4,
                                            }}
                                        >
                                            <Text style={{ fontSize: 11, color: 'white', fontWeight: '500' }}>
                                                {tag[0]}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                           
                            </View>

                            
                            
                        </View>
                    </View>
                    );
                })()}
            </View>
        </View>
    )
}

export default MapScreen;