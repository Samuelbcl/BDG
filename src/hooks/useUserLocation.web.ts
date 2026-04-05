export function useUserLocation() {
  return { location: null, permissionStatus: 'denied' as const };
}
