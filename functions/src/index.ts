import * as functions from 'firebase-functions'

export const statusServer = functions.https.onRequest((request, response) => {
	response.send('Server online on port 5000')
})
