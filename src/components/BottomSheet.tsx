import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const {height} = Dimensions.get('screen');
const BOTTOM_SHEET_MAX_HEIGHT = height * 0.6;
const BOTTOM_SHEET_MIN_HEIGHT = 0;
const MAX_UPWARD_TRNASLATE_Y =
  BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT;
const MAX_DOWNWARD_TRNASLATE_Y = 0;
const DRAG_THRESHOLD = 50;

const BottomSheet = ({visible, onDismiss}) => {
  if (!visible) return null;

  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        animatedValue.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (e, gesture) => {
        animatedValue.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        animatedValue.flattenOffset();
        lastGestureDy.current += gesture.dy;

        // if (lastGestureDy.current < MAX_UPWARD_TRNASLATE_Y)
        //   lastGestureDy.current = MAX_UPWARD_TRNASLATE_Y;
        // else if (lastGestureDy.current > MAX_DOWNWARD_TRNASLATE_Y)
        //   lastGestureDy.current = MAX_DOWNWARD_TRNASLATE_Y;

        if (gesture.dy > 0) {
          if (gesture.dy <= DRAG_THRESHOLD) springAnimation('up');
          else springAnimation('down');
        } else {
          if (gesture.dy >= -DRAG_THRESHOLD) springAnimation('down');
          else springAnimation('up');
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) springAnimation('up');
  }, [visible]);

  const springAnimation = (direction: 'up' | 'down') => {
    lastGestureDy.current =
      direction == 'down' ? MAX_DOWNWARD_TRNASLATE_Y : MAX_UPWARD_TRNASLATE_Y;

    Animated.spring(animatedValue, {
      toValue: lastGestureDy.current,
      useNativeDriver: true,
    }).start(() => {
      if (direction === 'down') onDismiss();
    });
  };

  const bottomSheetAnimation = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [MAX_UPWARD_TRNASLATE_Y, MAX_DOWNWARD_TRNASLATE_Y],
          outputRange: [MAX_UPWARD_TRNASLATE_Y, MAX_DOWNWARD_TRNASLATE_Y],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={() => springAnimation('down')}>
      <Animated.View style={[styles.content, bottomSheetAnimation]}>
        <TouchableOpacity
          style={styles.wrapper}
          activeOpacity={1}
          onPress={() => {}}>
          <View style={styles.dragableArea} {...panResponder.panHandlers}>
            <View style={styles.dragHandle}></View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },

  content: {
    position: 'absolute',
    width: '100%',
    height: BOTTOM_SHEET_MAX_HEIGHT,
    bottom: BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT,
    ...Platform.select({
      android: {elevation: 3},
      ios: {
        shadowColor: '#a8bed2',
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 6,
      },
    }),
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  wrapper: {
    height: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  dragableArea: {
    width: 132,
    height: 32,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dragHandle: {
    width: 100,
    height: 6,
    backgroundColor: '#d3d3d3',
    borderRadius: 6 / 2,
  },
});
