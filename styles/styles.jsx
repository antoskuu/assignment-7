

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homePage: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingTop: 10,
  },
  buttonContainer : {
    flexDirection:'row',
    padding : 10,
    margin : 10
  },
  ScrollView : {
    flex: 1,
  },
  mainButton : {
    margin : 10,
    paddingTop : 15,
    paddingBottom : 15,
    paddingLeft : 25,
    paddingRight : 25,
    borderRadius : 50,
    backgroundColor : '#c52a59ff',
    color : 'white'
  },
  secondaryButton : {
    margin : 10,
    paddingTop : 15,
    paddingBottom : 15,
    paddingLeft : 25,
    paddingRight : 25,
    borderRadius : 50,
    borderColor : 'white',
    borderWidth : 2,
    backgroundColor : 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 800,
    paddingVertical: 50,
    position: 'relative',
  },
  gradientOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    zIndex: 1,
  },
  gradientOverlayBottom: {
    position: 'absolute',
    top: '75%',
    left: 0,
    right: 0,
    height: '40%', 
    zIndex: 1,
  },
  contentOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginTop: -250,
    marginBottom: 100,
  },

});

export default styles;