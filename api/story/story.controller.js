import { logger } from '../../services/logger.service.js'
import { storyService } from './story.service.js'

export async function getStories(req, res) {
	try {
		const filterBy = req.query
		const stories = await storyService.query(filterBy)
		res.json(stories)
	} catch (err) {
		logger.error('Failed to get stories', err)
		res.status(400).send({ err: 'Failed to get stories' })
	}
}

export async function getStoryById(req, res) {
	try {
		const storyId = req.params._id
		const story = await storyService.getById(storyId)
		res.json(story)
	} catch (err) {
		logger.error('Failed to get story', err)
		res.status(400).send({ err: 'Failed to get story' })
	}
}

export async function addStory(req, res) {
	const { loggedinUser, body: story } = req
	try {
		story.createdAt = Date.now()
		story.by = loggedinUser
		const addedStory = await storyService.add(story)
		res.json(addedStory)
	} catch (err) {
		logger.error('Failed to add story', err)
		res.status(400).send({ err: 'Failed to add story' })
	}
}

export async function updateStory(req, res) {
	const { body: story } = req
	try {
		const updatedStory = await storyService.update(story)
		res.json(updatedStory)
	} catch (err) {
		logger.error('Failed to update story', err)
		res.status(400).send({ err: 'Failed to update story' })
	}
}

export async function removeStory(req, res) {
	try {
		const storyId = req.params.id
		const removedId = await storyService.remove(storyId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove story', err)
		res.status(400).send({ err: 'Failed to remove story' })
	}
}