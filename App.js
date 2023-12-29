import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, TextInput, Keyboard, Text } from "react-native";
import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";
import CircleButton from "./components/CircleButton";
import IconButton from "./components/IconButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useState, useRef, useEffect } from "react";
import MlkitOcr from "react-native-mlkit-ocr";
import CameraComponent from "./components/CameraComponent";
import * as Location from "expo-location";
import { Camera } from "expo-camera";
import { postUser } from "./api/api";
let camera = new Camera();

const PlaceholderImage = require("./assets/images/background-image.png");

export default function App() {
  const imageRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [showPhotoButtonsStuff, setShowPhotoStuff] = useState(true);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [ocr, setOCR] = useState("");
  const [startCamera, setStartCamera] = useState(false);
  const [location, setLocation] = useState(null);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation((cur) => (cur ? cur++ : 1));
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation([location.coords.latitude, location.coords.longitude]);
    })();
  }, [selectedImage]);

  if (status === null) {
    requestPermission();
  }

  useEffect(() => {
    console.log("triggered");
    getText();
  }, [location]);

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };

  async function getText() {
    console.log("image>>>>", selectedImage);
    // console.log(location);
    if (selectedImage !== null) {
      console.log('am i null', selectedImage);
      const resultFromUri = await MlkitOcr.detectFromUri(selectedImage);
      if (resultFromUri?.length > 0) {
        const _ = resultFromUri.map((line) => line.text);
        setOCR(JSON.stringify(_.join(" ").replaceAll("\n", " ")));
      }
    }
  }
  const onReset = () => {
    setShowAppOptions(false);
    setPickedEmoji(null);
    setOCR("");
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });
      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {}
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You have not selected an image!");
    }
  };

  const editText = () => {
    setShowAppOptions(false);
    setShowPhotoStuff(false);
  };

  const showPhoto = () => {
    setShowAppOptions(true);
    setShowPhotoStuff(true);
    Keyboard.dismiss();
  };

  const addNewUser = async () => {
    const userInfo = {
      username: "fromAndroid",
      firstname: "anne",
      lastname: "droid",
      email: "anne@droid.com",
    };
    const newUser = await postUser(userInfo);
    setActiveUser(newUser.username);
  };

  if (startCamera) {
    return (
      <CameraComponent
        startCamera={__startCamera}
        setStartCamera={setStartCamera}
        setSelectedImage={setSelectedImage}
        setShowAppOptions={setShowAppOptions}
      />
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <Text style={{ color: "white" }}>{activeUser ? `Welcome ${activeUser}` : null}</Text>
        <View ref={imageRef} collapsable={false} style={styles.imageAndText}>
          {ocr === "" ? (
            <View />
          ) : (
            <TextInput
              multiline={true}
              style={{ color: "white", width: 320, paddingBottom: 10 }}
              value={ocr || ""}
              onTouchStart={editText}
              onChangeText={(text) => setOCR(text)}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === "Enter") {
                  e.preventDefault();
                  showPhoto();
                }
              }}
              blurOnSubmit={true}
              onSubmitEditing={showPhoto}
            />
          )}
          <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji !== null ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> : null}
        </View>
      </View>

      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : showPhotoButtonsStuff ? (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Add new user" onPress={addNewUser} />
          <Button label="Take a photo" onPress={__startCamera} />
        </View>
      ) : (
        <View />
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 0,
    alignContent: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
