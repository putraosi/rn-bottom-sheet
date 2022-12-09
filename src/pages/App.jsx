import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import BottomSheet from '../components/BottomSheet';

const App = () => {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Text>{'Show'}</Text>
      </TouchableOpacity>

      <BottomSheet visible={show} onDismiss={() => setShow(false)} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
