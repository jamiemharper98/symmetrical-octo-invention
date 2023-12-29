import React from "react";
import { View, ImageBackground, Text, Pressable, StyleSheet } from "react-native";

export const CameraPreview = ({ photo, savePhoto, retakePicture }) => {
  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <Pressable style={styles.button} onPress={savePhoto}>
        <Text style={styles.text}>Save Photo</Text>
      </Pressable>
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      />
      <Pressable style={styles.button} onPress={retakePicture}>
        <Text style={styles.text}>Retake Photo</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    backgroundColor: "grey",
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});
