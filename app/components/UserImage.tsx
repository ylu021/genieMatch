import React from "react";
import { Image, StyleSheet } from "react-native";

const UserImage = ({ image }: { image: string | undefined }) => {
  return <Image source={{ uri: image }} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: { width: 200, height: 200, borderRadius: "100%", marginBottom: 10 },
});

export default UserImage;
