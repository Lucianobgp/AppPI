import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importação corrigida
import Home from './app/Home';
import Login from './app/Login';
import Lancamento from './app/Lancamento';
import Sair from './app/Sair';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Login"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#c6cbef',
            width: 240,
          },
        }}>
        <Drawer.Screen 
          name="Login" 
          component={Login}
          options={{
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen 
          name="Home" 
          component={Home}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Lançamento" 
          component={Lancamento}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="add-circle" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Sair" 
          component={Sair}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="exit" color={color} size={size} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});