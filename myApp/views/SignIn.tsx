import React, { FC, useState } from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import WelcomeHeader from "../ui/WelcomeHeader";
import FormInput from "../ui/FormInput";
import AppButton from "../ui/AppButton";
import FormDivider from "../ui/FormDivider";
import FormNavigator from "../ui/FormNavigator";
import CustomKeyAvoidingView from "../ui/CustomKeyAvoidingView";
import { useNavigation } from "@react-navigation/native";
// Import required types
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../ui/navigation.types";
import { newUserSchema, signInSchema, yupValidate } from "../utils/validator";
import { showMessage } from "react-native-flash-message";
import useAuth from "../hooks/useAuth";

// Define the navigation prop type
type SignInScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

interface Props {}
export interface SignInRes {
  profile: {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    avatar?: string;
  };
  token: {
    refresh: string;
    access: string;
  };
}

const SignIn: FC<Props> = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userInfo;
  const { signIn } = useAuth();

  const handleChange = (name: string) => {
    return (text: string) => {
      setUserInfo({ ...userInfo, [name]: text });
    };
  };

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(signInSchema, userInfo);
    if (error) return showMessage({ message: error, type: "danger" });
    if (values) signIn(values);
  };

  return (
    <View style={styles.megaContainer}>
      <CustomKeyAvoidingView>
        <View style={styles.innerContainer}>
          <WelcomeHeader />
          <View style={styles.formContainer}>
            <FormInput
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={handleChange("email")}
            />
            <FormInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={handleChange("password")}
            />
            <AppButton title="Sign In" onPress={handleSubmit} />
            <FormDivider />
            <FormNavigator
              onLeftPress={() => navigation.navigate("ForgetPassword")}
              leftTitle="Forget password"
              onRightPress={() => navigation.navigate("SignUp")}
              rightTitle="Sign Up"
            />
          </View>
        </View>
      </CustomKeyAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  megaContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -180,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: -165,
  },
});

export default SignIn;
