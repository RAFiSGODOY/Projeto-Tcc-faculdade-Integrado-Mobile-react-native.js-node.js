import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingDots from 'react-native-loading-dots';

function LoadingScreen({
  dots = 4,
  colors = ["#ffff", "#ffff", "#ffff", "#ffff"],
  size = 10,
  borderRadius = size / 2,
  bounceHeight = 10,
  components = null
}) {
  return (
    <View style={styles.loadingScreen}>
      <View style={styles.dotsWrapper}>
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
    width: 60,
  },
});

export default LoadingScreen;
