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
import { emailRegex } from "../utils/validator";
import { showMessage } from "react-native-flash-message";
import client from "../api/client";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { string } from "yup";

type ForgetPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ForgetPassword"
>;

interface Props {}

const ForgetPassword: FC<Props> = () => {
  const navigation = useNavigation<ForgetPasswordScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  // const handleSubmit = async () => {
  //   if (!emailRegex.test(email)) {
  //     return showMessage({ message: "Invalid email id", type: "danger" });
  //   }

  //   const res = (await runAxiosAsync)<{ message: string }>(
  //     client.post("/auth/forget-password", { email })
  //   );
  //   if (res) {
  //     showMessage({ message: res.message, type: "success" });
  //   }
  // };

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      return showMessage({ message: "Invalid email id", type: "danger" });
    }

    setBusy(true);

    try {
      // Await the API request and assert its type
      const response = await runAxiosAsync<{ message: string }>(
        client.post("/auth/forget-password", { email })
      );

      // Handle the response
      if (response && response.message) {
        showMessage({ message: response.message, type: "success" });
      } else {
        showMessage({ message: "Unexpected response format", type: "danger" });
      }
    } catch (error) {
      // Handle errors
      console.error("Error during password reset request:", error);
      showMessage({
        message: "An error occurred, please try again later.",
        type: "danger",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <AppButton
            active={!busy}
            title={busy ? "Please wait..." : "Request Link"}
            onPress={handleSubmit}
          />
          <FormDivider />
          <FormNavigator
            leftTitle="Sign Up"
            rightTitle="Sign In"
            onLeftPress={() => navigation.navigate("SignUp")}
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
    marginTop: -85,
    flex: 1,
    justifyContent: "center",
  },
});

export default ForgetPassword;
