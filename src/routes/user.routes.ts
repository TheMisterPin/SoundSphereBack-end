import {Router, Request, Response} from 'express'
import { createUser, getAllUsers } from '../controllers/user.controllers'

const userRoutes = Router()

userRoutes.get('/', getAllUsers)
userRoutes.post('/', createUser)

export default userRoutes