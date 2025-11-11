import React, {useState} from "react";
import styles from '../styles/styles.jsx';
import CardGrid from '../components/cardGrid.jsx'
import { StatusBar, StyleSheet, useColorScheme, View, Text, Button, ScrollView, TouchableOpacity, ImageBackground, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MemoryDetailScreen = ({route}) => {
    const { memory } = route.params;
    const navigation = useNavigation();

    return (
    <ScrollView>
    <View style={{backgroundColor: '#fff7c8ff'}}>
    <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{
                padding: 10,
                margin: 10,
                alignSelf: 'flex-start'
            }}
        >
            <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>        
        <Text style={styles.text}>{memory.title}</Text>
        <Text style={styles.text}>Location: {memory.location}</Text>
        {memory.image && (
            <Image 
                source={{uri: memory.image}} 
                style={{width: '100%', height: 300, resizeMode: 'cover'}} 
            />
        )}
    </View>

</ScrollView>
    )


}


export default MemoryDetailScreen;
