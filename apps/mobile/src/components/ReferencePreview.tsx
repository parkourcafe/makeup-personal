import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import type { Look } from "../types";
import { referenceTheme } from "../utils/reference";

type ReferencePreviewProps = {
  look: Look;
  compact?: boolean;
};

export function ReferencePreview({ look, compact = false }: ReferencePreviewProps) {
  const theme = referenceTheme(look.slug);
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = look.reference_image_url && !imageFailed ? look.reference_image_url : null;

  return (
    <View style={[styles.frame, { backgroundColor: theme.background }, compact ? styles.compactFrame : null]}>
      {imageUrl ? (
        <Image
          accessibilityLabel={`Референс образа ${look.title}`}
          onError={() => setImageFailed(true)}
          resizeMode="cover"
          source={{ uri: imageUrl }}
          style={styles.image}
        />
      ) : (
        <View style={styles.face}>
          <View style={[styles.eye, styles.leftEye, { backgroundColor: theme.secondary }]} />
          <View style={[styles.eye, styles.rightEye, { backgroundColor: theme.secondary }]} />
          <View style={[styles.cheek, styles.leftCheek, { backgroundColor: theme.primary }]} />
          <View style={[styles.cheek, styles.rightCheek, { backgroundColor: theme.primary }]} />
          <View style={[styles.lip, { backgroundColor: theme.lip }]} />
        </View>
      )}
      <View style={styles.swatches}>
        <View style={[styles.swatch, { backgroundColor: theme.primary }]} />
        <View style={[styles.swatch, { backgroundColor: theme.secondary }]} />
        <View style={[styles.swatch, { backgroundColor: theme.accent }]} />
        <View style={[styles.swatch, { backgroundColor: theme.lip }]} />
      </View>
      {!compact ? <Text style={styles.caption}>Референс-образ, не виртуальная примерка</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 8,
    minHeight: 210,
    overflow: "hidden",
    padding: 18
  },
  compactFrame: {
    minHeight: 128,
    padding: 12,
    width: 128
  },
  face: {
    alignSelf: "center",
    backgroundColor: "#f1c9b2",
    borderRadius: 72,
    height: 138,
    position: "relative",
    width: 116
  },
  image: {
    borderRadius: 8,
    height: 150,
    width: "100%"
  },
  eye: {
    borderRadius: 4,
    height: 8,
    position: "absolute",
    top: 54,
    width: 26
  },
  leftEye: {
    left: 22
  },
  rightEye: {
    right: 22
  },
  cheek: {
    borderRadius: 14,
    height: 26,
    opacity: 0.72,
    position: "absolute",
    top: 76,
    width: 28
  },
  leftCheek: {
    left: 17
  },
  rightCheek: {
    right: 17
  },
  lip: {
    alignSelf: "center",
    borderRadius: 10,
    bottom: 24,
    height: 12,
    position: "absolute",
    width: 34
  },
  swatches: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 14
  },
  swatch: {
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 999,
    borderWidth: 1,
    height: 18,
    width: 18
  },
  caption: {
    color: "#635c55",
    fontSize: 13,
    marginTop: 12,
    textAlign: "center"
  }
});
