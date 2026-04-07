import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Marker, Circle } from 'react-native-maps';
import { useUserLocation } from '../hooks/useUserLocation';

export default function MapUserLocation() {
  const { location } = useUserLocation();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pulseAnim]);

  if (!location) return null;

  const coord = { latitude: location.latitude, longitude: location.longitude };

  return (
    <>
      {/* Accuracy circle */}
      {location.accuracy && location.accuracy > 10 && (
        <Circle
          center={coord}
          radius={location.accuracy}
          fillColor="rgba(37, 99, 235, 0.08)"
          strokeColor="rgba(37, 99, 235, 0.25)"
          strokeWidth={1}
        />
      )}

      {/* Blue dot marker */}
      <Marker coordinate={coord} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.pulse,
              {
                opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] }),
                transform: [
                  { scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }) },
                ],
              },
            ]}
          />
          <View style={styles.dot}>
            <View style={styles.dotInner} />
          </View>
        </View>
      </Marker>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
});
