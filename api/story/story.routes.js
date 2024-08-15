import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

import { getStories, getStoryById, addStory, updateStory, removeStory } from './story.controller.js'

export const storyRoutes = express.Router()

storyRoutes.get('/', getStories)
storyRoutes.get('/:id', getStoryById)
storyRoutes.post('/', requireAuth, addStory)
storyRoutes.put('/:id', requireAuth, updateStory)
storyRoutes.delete('/:id', requireAuth, removeStory)