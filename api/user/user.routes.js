import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

import { getUser, getUsers, deleteUser, updateUser } from './user.controller.js'

export const userRoutes = express.Router()

userRoutes.get('/', getUsers)
userRoutes.get('/:id', getUser)
userRoutes.put('/:id', requireAuth, updateUser)
userRoutes.delete('/:id', requireAuth, deleteUser)