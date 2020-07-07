import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import app from './user/controllers/user'

admin.initializeApp(functions.config().firebase)

const main = express()

main.use('/v1', app)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

export const database = admin.firestore()
export const userCollection = 'users'

export const api = functions.https.onRequest(main)
