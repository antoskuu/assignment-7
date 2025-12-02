import {
  DefaultTheme as NavLightTheme,
  DarkTheme as NavDarkTheme,
} from '@react-navigation/native';

export const MyLightTheme = {
  ...NavLightTheme,
  colors: {
    ...NavLightTheme.colors,
    primary: '#FF6B35',        
    background: '#FFF8DC',     
    card: '#FFFFFF',           
    text: '#2C2C2C',          
    border: '#E0E0E0',        
    notification: '#FF6B35',  
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
  },
};

export const MyDarkTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: '#FF8C61',
    background: '#121212', 
    card: '#1E1E1E', 
    text: '#FFFFFF',  
    border: '#2C2C2C',  
    notification: '#FF8C61', 
    error: '#EF5350',
    warning: '#FFA726',
  },
};
