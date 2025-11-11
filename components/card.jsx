import { StatusBar, StyleSheet, useColorScheme, View, Text, Button, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';



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
    const imageSource = typeof image === 'string' ? { uri: image } : image;
    
    return(
    <View style={{width : 300, aspectRatio: 1, backgroundColor: 'white', borderRadius: 10, alignItems: "center", justifyContent:"flex-end"}}   >
        <Image source={imageSource} style={{ margin : -20, width:100, height:100 }}/>
        <Text style={{fontWeight:900, fontSize:15, margin : 8}}>{title}</Text>
        <AddToCartButton cart_bool={cart_bool} id={id} title={title} cart_function={cart_function} cart_text={cart_text} />
    </View>
)
};


export default Card;