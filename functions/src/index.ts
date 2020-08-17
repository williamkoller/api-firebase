import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import app from './user/controllers/user'
import product from './user/controllers/product'

admin.initializeApp(functions.config().firebase)

const main = express()

main.use('/v1', app)
main.use('/v1', product)
main.use(bodyParser.json())
main.use(bodyParser.urlencoded({ extended: true }))

export const database = admin.firestore()
export const userCollection = 'users'
export const productCollection = 'products'

export const api = functions.https.onRequest(main)
