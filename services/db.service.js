import { MongoClient } from 'mongodb'
import { logger } from './logger.service.js'

export const dbService = { getCollection }

var dbConn = null

async function getCollection(collectionName) {
	try {
		const db = await _connect()
		const collection = await db.collection(collectionName)
		return collection
	} catch (err) {
		logger.error('Failed to get Mongo collection', err)
		throw err
	}
}

async function _connect() {
	if (dbConn) return dbConn
	try {
		const client = await MongoClient.connect(process.env.MONGO_URL)
		return dbConn = client.db(process.env.DB_NAME)
	} catch (err) {
		logger.error('Cannot Connect to DB', err)
		throw err
	}
}