export const delay = (ms: number) => {
	return new Promise((resolve) => {
		const timeoutId = setTimeout(() => {
			clearTimeout(timeoutId)
			resolve(true)
		}, ms)
	})
}
