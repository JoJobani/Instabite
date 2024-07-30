import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

export const storyService = {
	remove,
	query,
	getById,
	add,
	update,
	addStoryComment,
	removeStoryComment,
}

async function query(filterBy) {
	try {
		const criteria = {}
		if (filterBy.identifier && filterBy.field) {
			criteria[filterBy.field] = { $in: [filterBy.identifier] }
		}
		const collection = await dbService.getCollection('story')
		var filteredStories = await collection.find(criteria).toArray()
		return filteredStories.reverse()
	} catch (err) {
		logger.error('cannot find stories', err)
		throw err
	}
}

async function getById(storyId) {
	try {
		const collection = await dbService.getCollection('story')
		const criteria = { _id: ObjectId.createFromHexString(storyId) }
		const story = await collection.findOne(criteria)
		// story.createdAt = story._id.getTimestamp()
		return story
	} catch (err) {
		logger.error(`while finding story ${storyId}`, err)
		throw err
	}
}

async function remove(storyId) {
	const { loggedinUser } = asyncLocalStorage.getStore()
	const { _id: userId, isAdmin } = loggedinUser
	try {
		const criteria = { _id: ObjectId.createFromHexString(storyId) }
		if (!isAdmin) criteria['by._id'] = userId
		const collection = await dbService.getCollection('story')
		const res = await collection.deleteOne(criteria)
		if (res.deletedCount === 0) throw ('Not your story')
		return storyId
	} catch (err) {
		logger.error(`cannot remove story ${storyId}`, err)
		throw err
	}
}

async function add(story) {
	try {
		const collection = await dbService.getCollection('story')
		await collection.insertOne(story)
		return story
	} catch (err) {
		logger.error('cannot insert story', err)
		throw err
	}
}

async function update(story) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(story._id) }
		const collection = await dbService.getCollection('story')
		const storyToSave = {
			txt: story.txt,
			likedBy: story.likedBy,
			comments: story.comments,
			savedBy: story.savedBy,
			taggedUsers: story.taggedUsers
		}
		await collection.updateOne(criteria, { $set: storyToSave })
		return story
	} catch (err) {
		logger.error(`cannot update story ${story._id}`, err)
		throw err
	}
}

async function addStoryComment(storyId, comment) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(storyId) }
		comment.id = makeId()
		const collection = await dbService.getCollection('story')
		await collection.updateOne(criteria, { $push: { comments: comment } })
		return comment
	} catch (err) {
		logger.error(`cannot add story comment ${storyId}`, err)
		throw err
	}
}

async function removeStoryComment(storyId, commentId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(storyId) }
		const collection = await dbService.getCollection('story')
		await collection.updateOne(criteria, { $pull: { comments: { id: commentId } } })
		return commentId
	} catch (err) {
		logger.error(`cannot add story comment ${storyId}`, err)
		throw err
	}
}