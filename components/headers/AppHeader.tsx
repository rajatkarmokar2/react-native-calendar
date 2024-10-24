/** @format */

import { useNavigation } from 'expo-router'
import { Fragment, useState } from 'react'
import { Appbar } from 'react-native-paper'

const AppHeader = ({
	title = 'Title',
	subtitle,
	calendars,
	onSelectCalendar,
	onToday,
	...props
}: any) => {
	const navigation:any = useNavigation()
	const [moreMenu, setMoreMenu] = useState(true)
	const [openMoreMenu, closeMoreMenu] = [() => setMoreMenu(true), () => setMoreMenu(false)]
	const [calendarMenu, setCalendarMenu] = useState(true)
	const [openCalendarMenu, closeCalendarMenu] = [
		() => setCalendarMenu(true),
		() => setCalendarMenu(false),
	]

	return (
		<Fragment>
			<Appbar.Header mode='small' style={{ backgroundColor: '#06f' }}>
				<Appbar.Action color='#fff' icon='menu' onPress={() => navigation?.toggleDrawer()} />
				<Appbar.Content color='#fff' title={title} />
				<Appbar.Action color='#fff' icon='calendar' onPress={onToday} />
			</Appbar.Header>
		</Fragment>
	)
}

export default AppHeader
