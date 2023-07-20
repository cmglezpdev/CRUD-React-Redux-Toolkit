/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		// path tremor node modules
		"./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			gridTemplateColumns: {
				main: "min-content minmax(0, 1fr)",
			},
		},
	},
	plugins: [],
};
