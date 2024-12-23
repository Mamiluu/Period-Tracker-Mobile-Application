import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Existing screens
import ProfileScreen from './components/src/screens/ProfileScreen';
import EncyclopediaScreen from './components/src/screens/EncyclopediaScreen';
import CalendarScreen from './components/src/screens/CalendarScreen';
import SettingsScreen from './components/src/screens/SettingsScreen';
import AboutScreen from './components/src/screens/Settings/aboutScreen';
import AccessSettings from './components/src/screens/Settings/accessSettings';
import PrivacyPolicy from './components/src/screens/Settings/privacyPolicy';
import TermsConditions from './components/src/screens/Settings/TermsConditions';

// New auth screens
import WelcomeScreen from './components/src/screens/Auth/WelcomeScreen';
import LoginScreen from './components/src/screens/Auth/LoginScreen';
import RegisterTypeScreen from './components/src/screens/Auth/RegisterTypeScreen';
import TeenRegisterScreen from './components/src/screens/Auth/TeenRegisterScreen';
import AdultRegisterScreen from './components/src/screens/Auth/AdultRegisterScreen';
import CoupleRegisterScreen from './components/src/screens/Auth/CoupleRegisterScreen';
import VerificationScreen from './components/src/screens/Auth/VerificationScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="RegisterType" component={RegisterTypeScreen} />
      <AuthStack.Screen name="TeenRegister" component={TeenRegisterScreen} />
      <AuthStack.Screen name="AdultRegister" component={AdultRegisterScreen} />
      <AuthStack.Screen name="CoupleRegister" component={CoupleRegisterScreen} />
      <AuthStack.Screen name="Verification" component={VerificationScreen} />
    </AuthStack.Navigator>
  );
}

function SettingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="AccessSettings" component={AccessSettings} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar';
          } else if (route.name === 'Profile') {
            iconName = 'account-outline';
          } else if (route.name === 'Encyclopedia') {
            iconName = 'book-outline';
          } else if (route.name === 'Settings') {
            iconName = 'cog-outline';
          }
          return <Icon name={iconName} color={color} size={size} />;
        },
      })}>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Encyclopedia" component={EncyclopediaScreen} />
      <Tab.Screen name="Settings" options={{ headerShown: false }} component={SettingStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStackScreen} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
      </Stack.Navigator>
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
