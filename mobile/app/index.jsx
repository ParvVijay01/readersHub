import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.title}>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/(auth)">Login Page</Link>
      <Link href="/(auth)/signup">Signup Page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      title: {
        color: "green"
      }
})
