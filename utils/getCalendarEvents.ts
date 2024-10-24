import * as Calendar from 'expo-calendar';

export const getCalendarEvents = async () => {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const calendarId = calendars[0]?.id;  // Select a calendar
  
    const events = await Calendar.getEventsAsync(
      [calendarId], 
      new Date(), 
      new Date(new Date().setDate(new Date().getDate() + 7))  // Next 7 days
    );
    return events;
  };
  