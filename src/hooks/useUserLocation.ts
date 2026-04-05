import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { useAppStore } from '../utils/store';

interface UserLocationState {
  latitude: number;
  longitude: number;
  heading: number | null;
  accuracy: number | null;
}

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocationState | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const setUserLocation = useAppStore((s) => s.setUserLocation);
  const watcherRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let mounted = true;

    async function startTracking() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!mounted) return;

      if (status !== 'granted') {
        setPermissionStatus('denied');
        return;
      }
      setPermissionStatus('granted');

      watcherRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (pos) => {
          if (!mounted) return;
          const loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            heading: pos.coords.heading,
            accuracy: pos.coords.accuracy,
          };
          setLocation(loc);
          setUserLocation({ latitude: loc.latitude, longitude: loc.longitude });
        },
      );
    }

    startTracking();

    return () => {
      mounted = false;
      watcherRef.current?.remove();
      setUserLocation(null);
    };
  }, [setUserLocation]);

  return { location, permissionStatus };
}
