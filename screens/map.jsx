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
import marker from '../assets/app/marker.png';
import PopUpMap from '../components/pop_up_map.jsx';
import GroupPopUpMap from '../components/group_popup.jsx';

const MapScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [selectedGroupedMarker, setSelectedGroupedMarker] = useState(null);

    function overlayedMarkers(markers, minDistance = 50) {
        function haversine(coord1, coord2) {
            const toRad = deg => deg * Math.PI / 180;
            const [lon1, lat1] = coord1;
            const [lon2, lat2] = coord2;
            const R = 6371000;
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }

        const soloMarkers = [];
        const groupedMarkers = [];
        const visited = new Set();

        for (let i = 0; i < markers.length; i++) {
            if (visited.has(i)) continue;
            const group = [markers[i]];
            visited.add(i);
            for (let j = i + 1; j < markers.length; j++) {
                if (visited.has(j)) continue;
                const dist = haversine(markers[i].location, markers[j].location);
                if (dist < minDistance) {
                    group.push(markers[j]);
                    visited.add(j);
                }
            }
            if (group.length === 1) {
                soloMarkers.push(group[0]);
            } else {
                groupedMarkers.push(group);
            }
        }
        return { soloMarkers, groupedMarkers };
    }

    const markersFeatureCollection = {
        type: 'FeatureCollection',
        features: overlayedMarkers(markers, 50).soloMarkers.map(marker => ({
            type: 'Feature',
            id: String(marker.id),
            geometry: {
                type: 'Point',
                coordinates: marker.location,
            },
            properties: {
                id: marker.id,
            },
        })),
    };

    const markersGroupedFeatureCollection = {
        type: 'FeatureCollection',
        features: overlayedMarkers(markers, 50).groupedMarkers.map(group => {
            // Calculer la position moyenne du groupe
            const avgLon = group.reduce((sum, m) => sum + m.location[0], 0) / group.length;
            const avgLat = group.reduce((sum, m) => sum + m.location[1], 0) / group.length;
            return {
                type: 'Feature',
                id: group.map(m => m.id).join('-'),
                geometry: {
                    type: 'Point',
                    coordinates: [avgLon, avgLat],
                },
                properties: {
                    id: group.map(m => m.id).join('-'),
                    title: String(group.length), // Affiche le nombre de markers dans le groupe
                },
            };
        }),
    };

    const onMarkerPress = (e) => {
        if (e.features.length > 0) {
            const feature = e.features[0];
            console.log('Marker selected:', feature.properties);
            setSelectedMarker(feature.properties.id);
        }
    };

    const onGroupedMarkerPress = (e) => {
        if (e.features.length > 0) {
            const feature = e.features[0];
            console.log('Grouped Marker selected:', feature.properties);
            setSelectedMarker(null);
            setSelectedGroupedMarker(feature.properties.id);
        }
    }

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                await fetchMarkers();
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
                    onPress={() => {
                        setSelectedMarker(null);
                        setSelectedGroupedMarker(null);
                    }}
                >
                    <Mapbox.Camera
                        zoomLevel={6}
                        centerCoordinate={[-122.4324, 37.78825]}
                        animationMode="flyTo"
                    />

 
    <Mapbox.Images images={{ markerIcon: marker }} />

    <Mapbox.ShapeSource
        id="markers-source"
        shape={markersFeatureCollection}
        onPress={onMarkerPress}
    >
        <Mapbox.SymbolLayer
            id="markers-squircle"
            style={{
                iconImage: 'markerIcon',
                iconSize: 0.05,
                iconAllowOverlap: true,
            }}
        />
    </Mapbox.ShapeSource>

  <Mapbox.ShapeSource
    id="grouped-markers-source"
    shape={markersGroupedFeatureCollection}
    onPress={onGroupedMarkerPress}
  >
    <Mapbox.CircleLayer
      id="grouped-markers-circle"
      style={{
        circleRadius: 24,
        circleColor: "#FF9800", // Different color for groups
        circleStrokeWidth: 2,
        circleStrokeColor: "#FFF",
      }}
    />
    <Mapbox.SymbolLayer
      id="grouped-markers-text"
      style={{
        textField: ["get", "title"],
        textSize: 18,
        textColor: "#FFF",
        textFont: ["Open Sans Bold", "Arial Unicode MS Bold"],
        textAllowOverlap: true,
        textIgnorePlacement: true,
      }}
    />
  </Mapbox.ShapeSource>
                </Mapbox.MapView>

                {selectedMarker && (() => {
                    const marker = markers.find(m => m.id === selectedMarker);
                    if (!marker) return null;
                    
                    return (
                        <PopUpMap marker={marker} setSelectedMarker={setSelectedMarker} />
                    )
                })()}
                {selectedGroupedMarker && (() => {
                    // Find the correct group of markers for the selectedGroupedMarker
                    const allGroups = overlayedMarkers(markers, 50).groupedMarkers;
                    const group = allGroups.find(g => g.map(m => m.id).join('-') === selectedGroupedMarker);
                    if (!group) return null;
                    return (
                        <GroupPopUpMap markers={group} setSelectedMarker={setSelectedMarker} setSelectedGroupedMarker={setSelectedGroupedMarker} />
                    );
                })()}
            </View>
        </View>
    )
}

export default MapScreen;