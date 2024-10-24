# React Native Calendar Agenda App

This is a **React Native Calendar Agenda App** that integrates with the device's native calendar using **Expo Calendar API**. It fetches calendar events and displays them in a scrollable, interactive agenda format. The app dynamically loads events for the current month and allows users to navigate to different months by selecting a day or scrolling.

### Video Demonstration
Check out this video to see the app in action: [Video Demo](https://drive.google.com/file/d/1zUYgT3ucmuQmJiceOvSifwOpYVCN6F64/view?usp=sharing)

## Features
- **Fetch Calendar Events:** Retrieves events from the device's calendar.
- **Monthly Navigation:** Loads the current month's events by default and allows loading events for previous/next months by scrolling.
- **Agenda View:** Displays events in an agenda-style format, with a day-by-day breakdown.
- **Day Press:** Load the selected month's events when a user selects a specific day.
- **Expo Integration:** Uses Expo's Calendar API to fetch events from the user's calendar.

## Tech Stack
- **React Native**
- **Expo Calendar API**
- **TypeScript**
- **React Native Calendars (Agenda)**

## Project Structure
- `components/headers/AppHeader.tsx`: Custom header component.
- `components/items/AgendaItem.tsx`: Custom agenda item component for rendering event details.
- `screens/DemoCalendarScreen.tsx`: Main screen for displaying the calendar and events.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/calendar-agenda-app.git
