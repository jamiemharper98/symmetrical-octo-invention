import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { CameraPreview } from "./CameraPreview";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";

let camera = new Camera();

export default function CameraComponent({ startCamera, setStartCamera, setSelectedImage, setShowAppOptions }) {
  const [capturedImage, setCapturedImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const __takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync(); ///////////////////
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const __savePhoto = async () => {
    // const manipResult = await manipulateAsync(capturedImage.uri, [], {
    //   compress: 1,
    //   format: SaveFormat.PNG,
    // });
    // console.log(manipResult);
    setPreviewVisible(false);
    setSelectedImage(capturedImage.uri);
    setShowAppOptions(true);
    setStartCamera(false);
  };

  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    startCamera();
  };

  if (previewVisible && capturedImage)
    return <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />;

  return (
    <Camera
      style={{ flex: 1, width: "100%" }}
      ref={(r) => {
        camera = r;
      }}
    >
      <View
        style={{
          position: "absolute",
          bottom: 0,
          flexDirection: "row",
          flex: 1,
          width: "100%",
          padding: 20,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            alignSelf: "center",
            flex: 1,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={__takePicture}
            style={{
              width: 70,
              height: 70,
              bottom: 0,
              borderRadius: 50,
              backgroundColor: "#fff",
            }}
          />
        </View>
      </View>
    </Camera>
  );
}
