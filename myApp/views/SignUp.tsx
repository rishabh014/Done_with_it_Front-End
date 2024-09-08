import React, { FC, useState } from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import WelcomeHeader from "../ui/WelcomeHeader";
import FormInput from "../ui/FormInput";
import AppButton from "../ui/AppButton";
import FormDivider from "../ui/FormDivider";
import FormNavigator from "../ui/FormNavigator";
import CustomKeyAvoidingView from "../ui/CustomKeyAvoidingView";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../ui/navigation.types";
import { newUserSchema, yupValidate } from "../utils/validator";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";
import client from "../api/client";
import useAuth from "../hooks/useAuth";

type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignUp"
>;

interface Props {}

const SignUp: FC<Props> = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const { name, email, password } = userInfo;
  const { signIn } = useAuth();

  const handleChange = (name: string) => {
    return (text: string) => {
      setUserInfo({ ...userInfo, [name]: text });
    };
  };

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(newUserSchema, userInfo);
    if (error) return showMessage({ message: error, type: "danger" });
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/sign-up", values)
    );
    if (res?.message) {
      showMessage({ message: res.message, type: "success" });
      signIn(values!);
    }
    setBusy(false);
  };

  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Name"
            value={name}
            onChangeText={handleChange("name")}
          />
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
          <AppButton active={!busy} title="Sign Up" onPress={handleSubmit} />
          <FormDivider />
          <FormNavigator
            leftTitle="Forget password"
            rightTitle="Sign In"
            onLeftPress={() => navigation.navigate("ForgetPassword")}
            onRightPress={() => navigation.navigate("SignIn")}
          />
        </View>
      </View>
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: -15,
    flex: 1,
    justifyContent: "center",
  },
});

export default SignUp;
