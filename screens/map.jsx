import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Mapbox from '@rnmapbox/maps';
import { useFocusEffect } from "@react-navigation/native";
import { getMemories } from "../services/memoriesAPI.js";
import marker from '../assets/app/marker.png';
import PopUpMap from '../components/pop_up_map.jsx';
import GroupPopUpMap from '../components/group_popup.jsx';
import Geolocation from '@react-native-community/geolocation';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

const MapScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [selectedGroupedMarker, setSelectedGroupedMarker] = useState(null);
    const [globeStyleURL, setGlobeStyleURL] = useState(Mapbox.StyleURL.Street);
    const cameraRef = useRef();
    const [location, setLocation] = useState({coords: [-122.4324, 37.78825]});
    const [layerExpanded, setLayerExpanded] = useState(false);
    const layerAnim = useSharedValue(0); 


    const animatedLayerStyle = useAnimatedStyle(() => {
        const progress = layerAnim.value;
        const width = 45 + (100 - 45) * progress;
        const height = 45 + (250 - 45) * progress;
        const borderRadius = 5 + (10 - 5) * progress;
        return {
            width,
            height,
            position: 'absolute',
            top: 90,
            right: 20,
            zIndex: 10,
            backgroundColor: colors.card,
            borderRadius: borderRadius,
        };
    });

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        opacity: 1 - layerAnim.value,
        transform: [{ scale: 0.9 + 0.1 * (1 - layerAnim.value) }],
    }));

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        opacity: layerAnim.value**10,
        transform: [{ scale: 0.9 + 0.1 * layerAnim.value }],
    }));
    useFocusEffect(
        React.useCallback(() => {
        const requestLocationPermission = async () => {
            getLocation();
        };
        const getLocation = () => {
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log('Position:', position);
                    setLocation(position.coords);
                },
                (error) => {
                    console.error('Location error:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000
                }
            );
        };

        requestLocationPermission();
    }, []));

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
                    title: String(group.length), 
                },
            };
        }),
    };

    const onMarkerPress = (e) => {
        if (e.features.length > 0) {
            const feature = e.features[0];
            console.log('Marker selected:', feature.properties);
            setSelectedMarker(feature.properties.id);
            setSelectedGroupedMarker(null);
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
    const onLayerPress = () => {
        const newExpanded = !layerExpanded;
        setLayerExpanded(newExpanded);
        layerAnim.value = withSpring(newExpanded ? 1 : 0);
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
            
<TouchableOpacity onPress={() => cameraRef.current?.moveTo([location.longitude, location.latitude], 1000)}
        
    style={{
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
        backgroundColor: colors.card,
        padding: 10,
        borderRadius: 5,
    }}>
        <Image source={require('../assets/app/precise-positioning.png')} style={{ width: 24, height: 24, tintColor: colors.text }} />
    </TouchableOpacity>

<Animated.View style={animatedLayerStyle}>

            <TouchableOpacity
                onPress={() => {
                    onLayerPress()
                }}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    width: "100%",
                    height: "100%",
                }}
            >
                <Animated.View style={[iconAnimatedStyle]}>
                    <Image
                        source={require('../assets/app/layer.png')}
                        style={{ width: 24, height: 24, tintColor: colors.text }}
                    />
                </Animated.View>

                <Animated.View
                    pointerEvents={layerExpanded ? 'auto' : 'none'}
                    style={[
                        contentAnimatedStyle,
                        {
                            position: 'absolute',
                            alignItems: 'center',
                        },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            onLayerPress();
                            setGlobeStyleURL(Mapbox.StyleURL.Street);
                        }}
                        style={{
                            marginBottom: 6,
                            borderWidth: globeStyleURL === Mapbox.StyleURL.Street ? 3 : 0,
                            borderRadius: 8,
                            borderColor: globeStyleURL === Mapbox.StyleURL.Street ? colors.text : null,
                            opacity: globeStyleURL === Mapbox.StyleURL.Street ? 1 : 0.25,

                        }}
                    >
 <Image source={require('../assets/app/street.png')}
                            style={{ width: 64, height: 64, borderRadius: 5}}
                        />                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            onLayerPress();
                            setGlobeStyleURL(Mapbox.StyleURL.Dark);
                        }}
                        style={{
                            marginBottom: 6,
                            opacity: globeStyleURL === Mapbox.StyleURL.Dark ? 1 : 0.25,
                            borderWidth: globeStyleURL === Mapbox.StyleURL.Dark ? 3 : 0,
                            borderRadius: 8,
                            borderColor: globeStyleURL === Mapbox.StyleURL.Dark ? colors.text : null

                        }}
                    >
<Image source={require('../assets/app/dark.png')}
                            style={{ width: 64, height: 64, borderRadius: 5}}
                        />                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            onLayerPress();
                            setGlobeStyleURL(Mapbox.StyleURL.Satellite);
                        }}
                        style={{
                            borderWidth: globeStyleURL === Mapbox.StyleURL.Satellite ? 3 : 0,
                                                        opacity: globeStyleURL === Mapbox.StyleURL.Satellite ? 1 : 0.25,
                            
                            borderRadius: 8,
                            borderColor: globeStyleURL === Mapbox.StyleURL.Satellite ? colors.text : null
                        }}
                    >
                        <Image
                            source={require('../assets/app/satellite.png')}
                            style={{ width: 64, height: 64, borderRadius: 5}}
                        />
                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
    </Animated.View>
            <View style={{ flex: 1, position: 'relative' }}>
    <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL={globeStyleURL}
        projection="globe"
        onPress={() => {
            setSelectedMarker(null);
            setSelectedGroupedMarker(null);
            setLayerExpanded(false);
            layerAnim.value = withSpring(0);
        }}
    >
        <Mapbox.Camera
        ref={cameraRef}

            zoomLevel={2}
            centerCoordinate={location.coords}
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
        circleRadius: 20,
        circleColor: "red", // Different color for groups
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
                    const allGroups = overlayedMarkers(markers, 50).groupedMarkers;
                    const group = allGroups.find(g => g.map(m => m.id).join('-') === selectedGroupedMarker);
                    if (!group) return null;
                    return (
                        <GroupPopUpMap markers={group} selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} setSelectedGroupedMarker={setSelectedGroupedMarker} />
                    );
                })()}
            </View>
        </View>
    )
}

export default MapScreen;