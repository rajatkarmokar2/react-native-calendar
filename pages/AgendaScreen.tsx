/** @format */

import AppHeader from '@/components/headers/AppHeader'
import * as Calendar from 'expo-calendar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { AgendaList, CalendarProvider, ExpandableCalendar } from 'react-native-calendars'
import { MarkedDates } from 'react-native-calendars/src/types'

const generateDaysArray = (
	year: any = new Date().getFullYear(),
	month: any = new Date().getMonth()
) => {
	let daysArray: any = {}
	try {
		let totalDays = new Date(year, month + 1, 0).getDate()
		console.log('totalDays :', year, month, totalDays)
		for (let day = 0; day < totalDays; ++day) {
			daysArray[new Date(year, month, day + 2).toISOString().split('T')[0]] = []
		}
		return daysArray
	} catch (error: any) {
		console.log('generateDaysArray :', error?.message)
		return daysArray
	}
}

const mapEventsToAgenda: any = (events: any, agenda: any, prevAgendas: any) => {
	// console.log('events length 2', events.length)
	let mappedItems: any = agenda
	try {
		prevAgendas?.map((item: any) => {
			mappedItems[item?.title] = item.data
		})
		if (events.length > 0) {
			events.map((event: any) => {
				const date = event?.startDate.split('T')[0]
				mappedItems[date] = [
					{
						title: event?.title,
						hour: new Date(event?.startDate).toLocaleString(),
						duration: new Date(event?.endDate).toLocaleString(),
					},
				]
			})
		}

		mappedItems = Object.entries(mappedItems)?.map(([key, value]: any) => ({
			title: key,
			data: value,
		}))

		mappedItems.sort((a: any, b: any) => new Date(a.title) > new Date(b.title))
		return mappedItems
	} catch (error: any) {
		console.log('mapEventsToAgenda :', error?.message)
		return mappedItems
	}
}

const fetchCalendars = async () => {
	const { status } = await Calendar.requestCalendarPermissionsAsync()
	if (status === 'granted') {
		const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
		return calendars
	} else {
		console.error('Calendar permission denied.')
		return []
	}
}

const fetchCalendarEvents = async (calendar: any, startDate: any, endDate: any) => {
	if (!calendar) return []
	try {
		const today = new Date()
		const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 12)) // Set the start date to 1 month ago
		const calendarEvents = await Calendar.getEventsAsync(
			[calendar?.id],
			oneMonthAgo, // Start date (1 month ago)
			new Date() // End date (current date)
		)
		return calendarEvents
	} catch (error: any) {
		console.error('fetchCalendarEvents :', error?.message)
		return []
	}
}

const getMarkedDates = (agendas: any) => {
	const marked: MarkedDates = {}
	agendas.forEach((item: any) => {
		if (item.data && item.data.length > 0 && !item?.data[0]) {
			marked[item.title] = { marked: true, selectedColor: 'blue', dotColor: 'blue' }
		} else {
			marked[item.title] = { marked: false }
		}
	})
	return marked
}

console.log(' ######################################')
const AgendaInfiniteListScreen = () => {
	const [calendars, setCalendars] = useState<any>([])
	const [selectedCalendars, setSelectedCalendars] = useState<any>(null)
	const [agendas, setAgendas] = useState<any>(mapEventsToAgenda([], generateDaysArray()))
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
	const marked = useRef(getMarkedDates(agendas))

	console.log('agenda :', agendas.length)
	console.log('selectedDate :', selectedDate)

	useEffect(() => {
		getCalendars()
	}, [])

	useEffect(() => {
		getCalendarEvents()
	}, [selectedCalendars, selectedDate])

	const renderItem = useCallback(
		({ item }: any) => {
			const isLongItem = item?.itemCustomHeightType === 'LongEvent'
			return (
				<View
				// style={{ paddingTop: isLongItem ? 40 : 0 }}
				>
					{/* <AgendaItem item={item} /> */}
				</View>
			)
		},
		[selectedDate, selectedCalendars]
	)

	const getCalendars = async () => {
		const calendars = await fetchCalendars()
		console.log('calendars :', calendars.length)
		setCalendars(calendars)
		if (calendars.length > 0) {
			setSelectedCalendars(calendars[0])
		}
	}

	const getCalendarEvents = async () => {
		try {
			let year = new Date(selectedDate).getFullYear()
			let month = new Date(selectedDate).getMonth()
			const startDate = new Date(year, month, 2)
			const endDate = new Date(year, month + 1, 0)
			console.log('startDate :', startDate.toISOString().split('T')[0])
			console.log('endDate :', endDate.toISOString().split('T')[0])
			let events = await fetchCalendarEvents(selectedCalendars, startDate, endDate)
			console.log('events :', events.length)
			let data = generateDaysArray(year, month)
			console.log('agenda :', data)
			data = mapEventsToAgenda(events, data, agendas)
			console.log('data :', JSON.stringify(data, null, 3))
			setAgendas(data)
		} catch (error: any) {
			console.log('getCalendarEvents :', error?.message)
		}
	}

	const onSelectCalendar = (calendar: any) => {
		setSelectedCalendars(calendar)
	}
	const onSelectDay = (date: any) => {
		setSelectedDate(date)
	}

	return (
		<View style={styles.container}>
			<AppHeader
				onToday={() => setSelectedDate(new Date().toISOString().split('T')[0])}
				title='Calendar'
				calendars={calendars}
				onSelectCalendar={onSelectCalendar}
			/>
			<CalendarProvider
				onDateChanged={onSelectDay}
				// onMonthChange={onMonthChange}
				date={selectedDate}
				showTodayButton
			>
				<ExpandableCalendar
					testID={'expandableCalendar'}
					date={selectedDate}
					firstDay={1}
					markedDates={marked.current}
				/>
				<AgendaList
					sections={agendas}
					renderItem={renderItem}
					infiniteListProps={{
						itemHeight: 80,
						titleHeight: 50,
						itemHeightByType: {
							LongEvent: 120,
						},
					}}
				/>
			</CalendarProvider>
		</View>
	)
}

export default AgendaInfiniteListScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: 'black',
		// color: 'white',
	},
})
