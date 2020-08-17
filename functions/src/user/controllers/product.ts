import * as express from 'express'
import { Product } from '../models/product'
import { database, productCollection } from '../../index'

const product = express()
product.post(
  '/products',
  async (request: express.Request, response: express.Response) => {
    try {
      const product: Product = {
        id: request.body.id,
        productName: request.body.productName,
        title: request.body.title,
        description: request.body.description,
        price: request.body.price
      }
      const result = await database.collection(productCollection).add(product)
      response.status(201).send(`Created a new product: ${result.id}`)
    } catch (error) {
      response.status(400).send(error)
    }
  }
)

export default product
