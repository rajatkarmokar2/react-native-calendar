
import * as Calendar from 'expo-calendar';

export const getCalendarPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status === 'granted') {
    return true;
  } else {
    console.log('Permission denied');
    return false;
  }
};
