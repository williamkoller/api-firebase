import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as bodyParser from 'body-parser'

//initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase)

//initialize express server
const app = express()
const main = express()

//add the path to receive request and set json as bodyParser to process the body
main.use('/v1', app)
main.use(bodyParser.json())
main.use(bodyParser.urlencoded({ extended: false }))

interface User {
	firstName: String
	lastName: String
	email: String
	areaNumber: String
	department: String
	id: String
	contactNumber: String
}

// Create new user
app.post('/users', async (req, res) => {
	try {
		const user: User = {
			firstName: req.body['firstName'],
			lastName: req.body['lastName'],
			email: req.body['email'],
			areaNumber: req.body['areaNumber'],
			department: req.body['department'],
			id: req.body['id'],
			contactNumber: req.body['contactNumber'],
		}

		const newDoc = await db.collection(userCollection).add(user)
		res.status(201).send(`Created a new user: ${newDoc.id}`)
	} catch (error) {
		res.status(400).send(
			`User should cointain firstName, lastName, email, areaNumber, department, id and contactNumber!!!`
		)
	}
})

//get a single contact
app.get('/users/:userId', (req, res) => {
	const userId = req.params.userId
	db.collection(userCollection)
		.doc(userId)
		.get()
		.then((user) => {
			if (!user.exists) throw new Error('User not found')
			res.status(200).json({ id: user.id, data: user.data() })
		})
		.catch((error) => res.status(500).send(error))
})

app.get('/users', async (req, res) => {
	try {
		const userQuerySnapshot = await db.collection(userCollection).get()
		const users: any[] = []
		userQuerySnapshot.forEach((doc) => {
			users.push({
				id: doc.id,
				data: doc.data(),
			})
		})
		res.status(200).json(users)
	} catch (error) {
		res.status(500).send(error)
	}
})

// Delete a user
app.delete('/users/:userId', (req, res) => {
	db.collection(userCollection)
		.doc(req.params.userId)
		.delete()
		.then(() => res.status(204).send('Document successfully deleted!'))
		.catch(function (error) {
			res.status(500).send(error)
		})
})

// Update user
app.put('/users/:userId', async (req, res) => {
	await db
		.collection(userCollection)
		.doc(req.params.userId)
		.set(req.body, { merge: true })
		.then(() => res.json({ id: req.params.userId }))
		.catch((error) => res.status(500).send(error))
})
//initialize the database and the collection
const db = admin.firestore()
const userCollection = 'users'

//define google cloud function name
export const api = functions.https.onRequest(main)
