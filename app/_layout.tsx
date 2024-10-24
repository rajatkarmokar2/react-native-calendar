/** @format */

import ThemeStatusBar from '@/components/status-bars/ThemeStatusBar'
import React from 'react'
import { PaperProvider } from 'react-native-paper'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'

export default function RootLayout() {
	return (
		<PaperProvider>
			<ThemeStatusBar />
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Drawer
					screenOptions={{
						headerShown: false,
					}}
					initialRouteName='Demo'
					// drawerContent={NavDrawer}
				>
					<Drawer.Screen options={{ title: 'Events' }} name='index' />
					<Drawer.Screen options={{ title: 'Agenda' }} name='Agenda' />
				</Drawer>
			</GestureHandlerRootView>
		</PaperProvider>
	)
}
