import React, {useState} from "react";
import styles from '../styles/styles.jsx';
import CardGrid from '../components/cardGrid.jsx'
import { StatusBar, StyleSheet, useColorScheme, View, Text, Button, ScrollView, TouchableOpacity, ImageBackground, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getProductsWithImageUrls } from "../services/productsApi.js";
import {addItemToCart} from '../services/memoriesAPI.js';

const CategoryDetailScreen = ({route}) => {
    const { categoryTitle, categoryItems } = route.params;
    const navigation = useNavigation();

    const itemsWithImageUrls = getProductsWithImageUrls(categoryItems);
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
        <Text style={styles.text}>{categoryTitle}</Text>

        <CardGrid cart_bool={true} items={itemsWithImageUrls} cart_function={addItemToCart} cart_text={"Add to Cart"} />
    </View>


        <ImageBackground 
        source={require('../assets/app/restaurant.jpg')}
        style={styles.backgroundImage}
        resizeMode='cover'
        ></ImageBackground>
</ScrollView>
    )


}


export default CategoryDetailScreen;
