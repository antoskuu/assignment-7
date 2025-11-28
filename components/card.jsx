import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, Button, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { LanguageContext } from '../App';
import { translations } from '../utils/translations';


function AddToCartButton({cart_bool, cart_text, cart_function, itemId, title}) {
    if (cart_bool) {
        return (
            <TouchableOpacity onPress={() => {cart_function(itemId, title)}} style={{ backgroundColor: '#ffcc00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>{cart_text}</Text>
            </TouchableOpacity>
        );
    }
}

const Card = ({ cart_bool, title, image, id, cart_function, cart_text, location, tags, date }) => {
    const { colors } = useTheme();
    const imageSource = typeof image === 'string' ? { uri: image } : image;
    const { translate, language } = React.useContext(LanguageContext);
    
    
    return(
    <View style={{width : 300, aspectRatio: 1, backgroundColor: colors.card, borderRadius: 10, alignItems: "center", justifyContent:"center"}}   >
        
        <ImageBackground source={imageSource} style={{ width:"100%", height:'100%', borderRadius: 5, alignItems: 'center', borderRadius: 10, justifyContent: 'center', }} imageStyle={{ borderRadius: 10 }}>
          <View style={{backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 20, padding: 3}} >
            <Text style={{
                fontSize:10,
            color: 'white', 
                            }}>
            {new Date(date).toLocaleDateString(translations[language].date, { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
        </View>
        <Text style={{fontSize:15, color: 'white', fontWeight: 'bold',
            textShadowColor: 'black',
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 1}}>{title}</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginTop: 5}}>
        {tags.map((t) => (
                              <View
                                key={t[0]}
                                
                                style={{
                                  backgroundColor: t[1],
                                  borderRadius: 16,
                                  paddingHorizontal: 8,
                                  paddingVertical: 5,
                                  marginRight: 3,
                                  marginBottom: 1,
                                  borderColor: '#fff',
                                }}
                              >
                                <Text style={{color: colors.text, fontSize: 12}}>{t[0]}</Text>
                                
                              </View>
                            ))}
                            
        </View>
        </ImageBackground>

        
        <AddToCartButton cart_bool={cart_bool} id={id} title={title} cart_function={cart_function} cart_text={cart_text} />
    </View>
)
};


export default Card;