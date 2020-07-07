import * as express from 'express'
import { User } from '../models/user'
import { database, userCollection } from '../../index'

const app = express()
app.post(
	'/users',
	async (request: express.Request, response: express.Response) => {
		try {
			const user: User = {
				id: request.body.id,
				firstName: request.body.firstName,
				lastName: request.body.lastName,
				email: request.body.email,
				areaNumber: request.body.areaNumber,
				department: request.body.department,
				contactNumber: request.body.contactNumber,
			}
			const result = await database.collection(userCollection).add(user)
			response.status(201).send(`Created a new user: ${result.id}`)
		} catch (error) {
			response.status(400).json(error)
		}
	}
)
	.get(
		'/users',
		async (request: express.Request, response: express.Response) => {
			try {
				const userQuery = await database
					.collection(userCollection)
					.get()
				const users: any[] = []
				userQuery.forEach((result) => {
					users.push({
						id: result.id,
						data: result.data(),
					})
				})
				response.status(200).json(users)
			} catch (error) {
				response.status(500).send(error)
			}
		}
	)
	.get(
		'/users/:userId',
		async (request: express.Request, response: express.Response) => {
			const userId = request.params.id
			database
				.collection(userCollection)
				.doc(userId)
				.get()
				.then((user) => {
					if (!user.exists) throw new Error('User not found')
					response.status(200).json({ id: user.id, data: user.data })
				})
				.catch((error) => response.status(500).send(error))
		}
	)
	.delete(
		'/users/:userId',
		async (request: express.Request, response: express.Response) => {
			database
				.collection(userCollection)
				.doc(request.params.id)
				.delete()
				.then(() =>
					response
						.status(204)
						.send(`Doc successfully deleted: ${request.params.id}`)
				)
				.catch((error) => response.status(500).send(error))
		}
	)
	.put(
		'/users/:userId',
		async (request: express.Request, response: express.Response) => {
			await database
				.collection(userCollection)
				.doc(request.params.userId)
				.set(request.body, { merge: true })
				.then(() => response.json({ id: request.params.userId }))
				.catch((error) => response.status(500).send(error))
		}
	)

export default app
