import * as functions from 'firebase-functions'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
	response.send('Hello William')
})

export const statusServer = functions.https.onRequest((request, response) => {
	response.send('Server online on port 5000')
})
