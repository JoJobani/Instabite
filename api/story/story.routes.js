import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

import { getStories, getStoryById, addStory, updateStory, removeStory, addStoryComment, removeStoryComment } from './story.controller.js'

export const storyRoutes = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

storyRoutes.get('/', getStories)
storyRoutes.get('/:id', getStoryById)
storyRoutes.post('/', requireAuth, addStory)
storyRoutes.put('/:id', requireAuth, updateStory)
storyRoutes.delete('/:id', requireAuth, removeStory)

storyRoutes.post('/:id/msg', requireAuth, addStoryComment)
storyRoutes.delete('/:id/msg/:msgId', requireAuth, removeStoryComment)