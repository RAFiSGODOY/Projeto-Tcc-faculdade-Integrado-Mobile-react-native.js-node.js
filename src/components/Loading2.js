import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingDots from 'react-native-loading-dots';

function LoadingScreen({
  dots = 4,
  colors = ["#005C58", "rgba(0, 141, 134, 1)", "#005C58", "rgba(0, 141, 134, 1)"],
  size = 10,
  borderRadius = size / 2,
  bounceHeight = 10,
  paddingTop = 10,
  paddingBottom = 10,
  components = null
}) {
  return (
    <View style={styles.loadingScreen}>
      <View style={[styles.dotsWrapper, { paddingTop, paddingBottom }]}>
        <LoadingDots
          dots={dots}
          colors={colors}
          size={size}
          borderRadius={borderRadius}
          bounceHeight={bounceHeight}
          components={components}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsWrapper: {
    width: 100,
  },
});

export default LoadingScreen;
