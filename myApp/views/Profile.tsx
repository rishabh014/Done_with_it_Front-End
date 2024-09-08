import React, { FC, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  RefreshControl,
} from "react-native";
import colors from "../utils/colors";
import AvatarView from "../ui/AvatarView";
import useAuth from "../hooks/useAuth";
import FormDivider from "../ui/FormDivider";
import ProfileComponentsListItem from "../Components/ProfileComponentsListItem";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../ui/navigation.types";
import { AntDesign } from "@expo/vector-icons";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { ProfileRes } from "../navigator";
import { useDispatch } from "react-redux";
import { updateAuthState } from "../store/auth";
import { showMessage } from "react-native-flash-message";
import { AxiosInstance } from "axios";
import { selectImages } from "../utils/helper";
import mime from "mime";
import LoadingSpinner from "../ui/loadingSpinner";

interface Props {}

const Profile: FC<Props> = () => {
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const { authState, signOut } = useAuth();
  const { profile } = authState;
  const [userName, setUserName] = useState(profile?.name || "");
  const [busy, setBusy] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isNameChanged =
    profile?.name !== userName && userName.trim().length >= 3;
  const { authClient } = useClient() as { authClient: AxiosInstance };

  const dispatch = useDispatch();

  const onMessagePress = () => {
    navigate("Chats");
  };

  const onListingPress = () => {
    navigate("Listings");
  };

  const getVerificationLink = async () => {
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.get<{ message: string }>("/auth/verify-token")
    );
    setBusy(false);
    if (res) {
      showMessage({ message: res.message, type: "success" });
    }
  };

  const fetchProfile = async () => {
    setRefreshing(true);
    const res = await runAxiosAsync<{ profile: ProfileRes }>(
      authClient.get<{ profile: ProfileRes }>("/auth/profile")
    );
    setRefreshing(false);
    if (res) {
      dispatch(
        updateAuthState({
          profile: { ...profile!, ...res.profile },
          pending: false,
        })
      );
    }
  };

  const handleProfileImageSelection = async () => {
    const [image] = await selectImages({
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (image) {
      const formData = new FormData();
      formData.append("avatar", {
        name: "avatar.jpg", // Make sure to specify the correct file name
        uri: image,
        type: mime.getType(image) || "image/jpeg", // Handle MIME type correctly
      } as any);

      setUpdatingAvatar(true);

      try {
        const res = await runAxiosAsync<{ profile: ProfileRes }>(
          authClient.patch<{ profile: ProfileRes }>(
            "/auth/update-avatar",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Important for file uploads
              },
            }
          )
        );

        if (res) {
          dispatch(
            updateAuthState({
              profile: { ...profile!, ...res.profile },
              pending: false,
            })
          );
          showMessage({
            message: "Avatar updated successfully",
            type: "success",
          });
        }
      } catch (error) {
        showMessage({ message: "Failed to update avatar", type: "danger" });
      } finally {
        setUpdatingAvatar(false);
      }
    }
  };

  const updateProfile = async () => {
    const res = await runAxiosAsync<{ profile: ProfileRes }>(
      authClient.patch<{ profile: ProfileRes }>("/auth/update-profile", {
        name: userName,
      })
    );
    if (res) {
      showMessage({ message: "Name updated successfully", type: "success" });
      dispatch(
        updateAuthState({
          pending: false,
          profile: { ...res.profile, ...profile! },
        })
      );
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchProfile} />
      }
      contentContainerStyle={styles.container}
    >
      {!profile?.verified && (
        <View style={styles.verificationLinkContainer}>
          <Text style={styles.verificationTitle}>
            It looks like your profile is not verified
          </Text>
          {busy ? (
            <Text onPress={getVerificationLink} style={styles.verificationLink}>
              Please wait...
            </Text>
          ) : (
            <Text onPress={getVerificationLink} style={styles.verificationLink}>
              Tap here to get the link.
            </Text>
          )}
        </View>
      )}
      <View style={styles.profileContainer}>
        <AvatarView
          uri={profile?.avatar}
          size={80}
          onPress={handleProfileImageSelection}
        />
        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <TextInput
              value={userName}
              onChangeText={(text) => setUserName(text)}
              style={styles.name}
            />
            {isNameChanged && (
              <Pressable onPress={updateProfile}>
                <AntDesign name="check" size={24} color={colors.primary} />
              </Pressable>
            )}
          </View>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>
      </View>
      <FormDivider />
      <ProfileComponentsListItem
        style={styles.marginBottom}
        antIconName="message1"
        title="Messages"
        onPress={onMessagePress}
      />
      <ProfileComponentsListItem
        style={styles.marginBottom}
        antIconName="appstore-o"
        title="Your Listings"
        onPress={onListingPress}
      />
      <ProfileComponentsListItem
        antIconName="logout"
        title="Log Out"
        onPress={signOut}
      />
      <LoadingSpinner visible={updatingAvatar} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  profileContainer: { flexDirection: "row", alignItems: "center" },
  name: { color: colors.primary, fontSize: 20, fontWeight: "bold" },
  email: { color: colors.primary, paddingTop: 2 },
  profileInfo: { flex: 1, paddingLeft: 15 },
  marginBottom: { marginBottom: 10 },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  verificationLinkContainer: {
    padding: 10,
    backgroundColor: colors.deActive,
    marginVertical: 10,
    borderRadius: 5,
  },
  verificationTitle: {
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
  },
  verificationLink: {
    fontWeight: "600",
    color: colors.active,
    textAlign: "center",
    paddingTop: 5,
  },
});

export default Profile;
