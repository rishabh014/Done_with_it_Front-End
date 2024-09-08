import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import AppNavigator from "./AppNavigator";
import ProfileNavigator from "./ProfileNavigator";
import AntDesign from "@expo/vector-icons/AntDesign";
import Listing from "../views/NewListing";

const Tab = createBottomTabNavigator();
const getOptions = (iconName: string): BottomTabNavigationOptions => {
  return {
    tabBarIcon({ color, focused, size }) {
      return (
        <AntDesign
          name={iconName as any}
          size={size}
          color={color}
          size={size}
        />
      );
    },
    title: "",
  };
};

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeNavigator"
        component={AppNavigator}
        options={getOptions("home")}
      />
      <Tab.Screen
        name="NewListing"
        component={Listing}
        options={getOptions("pluscircleo")}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={getOptions("user")}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
