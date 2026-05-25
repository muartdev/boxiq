import { Image, StyleSheet, View } from "react-native";

const LOGO_ASSET = require("../../assets/logo.png");

export function BoxiqLogo({
  width = 124,
  height = 34
}: {
  width?: number;
  height?: number;
}) {
  return (
    <View style={[styles.frame, { width, height }]}>
      <Image
        source={LOGO_ASSET}
        resizeMode="contain"
        style={[
          styles.image,
          {
            width: width * 2.2,
            height: height * 2.2,
            marginLeft: -width * 0.6,
            marginTop: -height * 0.58
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: "hidden"
  },
  image: {
    flexShrink: 0
  }
});
