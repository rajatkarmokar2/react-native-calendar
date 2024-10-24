/** @format */

import React, { useState } from 'react'
import type { StatusBarStyle } from 'react-native'
import { StatusBar } from 'react-native'

const STYLES = ['default', 'dark-content', 'light-content'] as const
const TRANSITIONS = ['fade', 'slide', 'none'] as const

const ThemeStatusBar = () => {
	const [hidden, setHidden] = useState(false)
	const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(STYLES[1])
	const [statusBarTransition, setStatusBarTransition] = useState<'fade' | 'slide' | 'none'>(
		TRANSITIONS[1]
	)

	return (
		<StatusBar
			animated={true}
			backgroundColor='transparent'
			barStyle={statusBarStyle}
			showHideTransition={statusBarTransition}
			hidden={hidden}
		/>
	)
}

export default ThemeStatusBar
