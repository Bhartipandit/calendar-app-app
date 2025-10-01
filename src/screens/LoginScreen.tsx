import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../config/firebase";

export default function LoginScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "905775695185-4rf2cilm0n4c4vlaukm2loau76qmnd8n.apps.googleusercontent.com",
    iosClientId: "905775695185-167ja5aooup4luukq7sa4oo4ve59aj19.apps.googleusercontent.com",
    androidClientId: "905775695185-9oero57ujg8ms4nj8kao9slpib1f51mu.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.idToken) {
        const credential = GoogleAuthProvider.credential(authentication.idToken);
        signInWithCredential(auth, credential);
      }
    }
  }, [response]);

  // 🚀 Auto-trigger login on mount
  useEffect(() => {
    if (request) {
      promptAsync();
    }
  }, [request]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
