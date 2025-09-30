import React from "react";
import { View, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import Home from "../components/Home"; // 👈 reuse your existing Home

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Home userEmail={auth.currentUser?.email || ""} />
      <Button title="Sign Out" onPress={() => signOut(auth)} />
    </View>
  );
}
