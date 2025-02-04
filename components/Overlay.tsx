import { StyleSheet, View } from "react-native";

export default function Overlay({ type = "black", darkerOverlay = false }) {
  return (
    <View
      style={[
        styles.overlay,
        darkerOverlay ? styles.darkerOverlay : null,
        type === "black" ? styles.overlayBlack : styles.overlayWhite,
      ]}
    >
      {/* <View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    padding: 20,
    borderRadius: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayWhite: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // optional: adds a semi-transparent overlay
  },
  overlayBlack: {
    backgroundColor: "rgba(0, 0, 0, 0.1)", // optional: adds a semi-transparent overlay
  },
  darkerOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});
