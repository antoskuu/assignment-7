import { StatusBar, StyleSheet, useColorScheme, View, Text, Button, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';



function AddToCartButton({cart_bool, cart_text, cart_function, itemId, title}) {
    if (cart_bool) {
        return (
            <TouchableOpacity onPress={() => {cart_function(itemId, title)}} style={{ backgroundColor: '#ffcc00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>{cart_text}</Text>
            </TouchableOpacity>
        );
    }
}

const Card = ({ cart_bool, title, image, id, cart_function, cart_text, location }) => {
    const { colors } = useTheme();
    const imageSource = typeof image === 'string' ? { uri: image } : image;
    
    return(
    <View style={{width : 300, aspectRatio: 1, backgroundColor: colors.card, borderRadius: 10, alignItems: "center", justifyContent:"center"}}   >
        <Image source={imageSource} style={{ width:"70%", height:'70%', borderRadius: 5 }}/>
        <Text style={{fontSize:15, color: colors.text}}>{title}</Text>
        <AddToCartButton cart_bool={cart_bool} id={id} title={title} cart_function={cart_function} cart_text={cart_text} />
    </View>
)
};


export default Card;