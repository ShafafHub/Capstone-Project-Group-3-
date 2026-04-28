import express from 'express'
import { getAll, getOne, create, remove, update } from './product.controller.js'


const router = express.Router()

router.get('/', getAll)
router.get('/:id', getOne)
router.post('/', create)
router.delete('/:id', remove)
router.put('/:id', update)

export default router