/** @format */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Agenda } from 'react-native-calendars'
import * as Calendar from 'expo-calendar'
import AppHeader from '@/components/headers/AppHeader'
import AgendaItem from '@/components/items/AgendaItem'

export default function EventsScreen() {
	const [items, setItems] = useState<any>({})
	const [events, setEvents] = useState<any[]>([])
	const [calendarId, setCalendarId] = useState(null)
	const [calendars, setCalendars] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

	// Track the current month being loaded
	const [currentMonth, setCurrentMonth] = useState(new Date())

	const agendaRef: any = useRef(null)

	useEffect(() => {
		;(async () => {
			const { status } = await Calendar.requestCalendarPermissionsAsync()
			if (status === 'granted') {
				const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
				setCalendars(calendars)

				const defaultCalendar: any = calendars[0]
				if (defaultCalendar) {
					setCalendarId(defaultCalendar.id)
				} else {
					console.error('No default calendar found.')
				}

				// Load events for the current month by default
				const events = await getCalendarEvents(calendars, currentMonth)
				setEvents(events)
				mapEventsToAgenda(events)
			} else {
				console.error('Calendar permission denied.')
			}
			setLoading(false)
		})()
	}, [currentMonth]) // Re-run whenever the current month changes

	const getCalendarEvents = async (calendars: any[], monthDate: Date) => {
		try {
			let events: any[] = []
			const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
			const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
			for (let calendar of calendars) {
				const calendarEvents = await Calendar.getEventsAsync(
					[calendar.id],
					startOfMonth,
					endOfMonth
				)
				events = [...events, ...calendarEvents]
			}
			return events
		} catch (error) {
			console.error('Error fetching events:', error)
			return []
		}
	}

	const mapEventsToAgenda = (events: any) => {
		let mappedItems: any = {}

		// Create an empty array for each day of the current month
		const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 2)
		const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)

		console.log('startOfMonth :', startOfMonth)
		console.log('endOfMonth :', endOfMonth)
		for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
			const date = d.toISOString().split('T')[0]
			mappedItems[date] = []
		}

		events.forEach((event: any) => {
			const date = event.startDate.split('T')[0]
			mappedItems[date].push({
				title: event.title || 'Untitled Event',
				hour: new Date(event.startDate).toLocaleString(),
				duration: new Date(event.endDate).toLocaleString(),
			})
		})

		setItems(mappedItems)
	}

	const handleDayPress = async (day: any) => {
		setSelectedDate(day.dateString)
		const selectedMonth = new Date(day.timestamp)
		setCurrentMonth(selectedMonth)
	}

	const renderItem = useCallback(
		(item: any) => {
			return <AgendaItem item={item} />
		},
		[currentMonth, selectedDate, calendars]
	)

	console.log(selectedDate)

	return (
		<View style={styles.container}>
			<AppHeader
				onToday={() => setSelectedDate(new Date().toISOString().split('T')[0])}
				title='Events'
			/>
			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size='large' color='#0000ff' />
					<Text>Loading events...</Text>
				</View>
			) : (
				<Agenda
					items={items}
					selected={selectedDate}
					onDayPress={handleDayPress}
					showClosingKnob={true}
					ref={agendaRef}
					renderItem={renderItem}
					renderEmptyDate={() => {
						return (
							<View style={styles.emptyDate}>
								<Text>No events today.</Text>
							</View>
						)
					}}
					rowHasChanged={(r1: any, r2: any) => r1.title !== r2.title}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyDate: {
		height: 15,
		flex: 1,
		paddingTop: 30,
	},
})
