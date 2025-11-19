import React, {useState} from "react";
import styles from '../styles/styles.jsx';
import CardGrid from '../components/cardGrid.jsx'
import { StatusBar, StyleSheet, useColorScheme, View, Text, Button, ScrollView, TouchableOpacity, ImageBackground, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import Mapbox from '@rnmapbox/maps';
import {useEffect} from "react";
import { LanguageContext } from '../App';
import { deleteMemory } from "../services/memoriesAPI.js";


const MemoryDetailScreen = ({route}) => {
    const { t } = React.useContext(LanguageContext);
const { memory: memoryFromRoute } = route.params;
    const memory = {
        ...memoryFromRoute,
        location: typeof memoryFromRoute.location === 'string' 
            ? JSON.parse(memoryFromRoute.location) 
            : memoryFromRoute.location
    };
    const { colors } = useTheme();
    const navigation = useNavigation();
    


    return (
    <ScrollView>
    <View style={{backgroundColor: colors.background,flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
    <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{
                padding: 10,
                margin: 10,
                alignSelf: 'flex-start'
            }}
        >
            <Text style={{ fontSize: 24, color: colors.text }}>←</Text>

        </TouchableOpacity>        
        
        </View>

    <View style={{width: '100%', backgroundColor: colors.card, padding: 20, borderRadius: 10}}>

    <View style={{width: '100%', marginTop: 10}}>
        {memory.image && (
            <Image 
                source={{uri: memory.image}} 
                style={{width: '100%', aspectRatio: 1, resizeMode: 'cover', borderRadius: 10}} 
            />
        )}
    </View>
    <Text style={{...styles.text, fontSize: 24, color: colors.text, padding: 10, margin:10, textAlign: 'center'
}}>{memory.title}</Text>
    <Text style={{...styles.text, fontSize: 16, color: colors.text, paddingHorizontal: 10, marginBottom: 10, textAlign: 'center'
}}>{memory.description}</Text>
<Text style={{...styles.text, fontSize: 16, color: colors.text, paddingHorizontal: 10, marginBottom: 10, textAlign: 'center'
}}>{new Date(memory.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                    {memory.tags.map((t) => (
                      <View
                        key={t[0]}
                        style={{
                          backgroundColor: t[1],
                          borderRadius: 16,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          marginRight: 8,
                          marginBottom: 8,
                          borderWidth: 1,
                          borderColor: '#fff',
                        }}
                      >
                        <Text style={{color: colors.text}}>{t[0]}</Text>
                      </View>
                    ))}
    </View>

    <View style={{
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
        
    }}>
        
    <Mapbox.MapView
                    style={{ height: 300, width: '100%' }}
                    styleURL={Mapbox.StyleURL.Streets}
                        projection="globe"
    
                >
                    <Mapbox.Camera
                        zoomLevel={10}

                        centerCoordinate={memory.location}
                        animationMode="flyTo"
                    />
                        <Mapbox.PointAnnotation
                            key={memory.id}
                            id={`marker-${memory.id}`}
                            coordinate={memory.location}
                        >
                        </Mapbox.PointAnnotation>
                    
                </Mapbox.MapView>
    </View>
    <TouchableOpacity
            onPress={() => { deleteMemory(memory.id); navigation.goBack(); }}
            style={{
                padding: 10,
                margin: 10,
                alignSelf: 'center',
                backgroundColor: "#ff0000",
                borderRadius: 8,
            }}
        >
            <Text style={{ fontSize: 18, color: '#fff' }}> { t('delete') } </Text>

        </TouchableOpacity>
</View>
</ScrollView>
    )


}


export default MemoryDetailScreen;
