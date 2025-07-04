import express from 'express'
import { createOrder, getOrder, getOrderById, getOrderByOrderId, getOrderByStatus, getOrderByStatusAndDate, placeOrder, updateOrderStatus } from '../controller/order.js';

const router = express.Router();

router.post('/createOrder',createOrder)
router.post('/placeOrder',placeOrder)
router.get('/getOrder',getOrder)
router.get('/getOrderByStatus/:status',getOrderByStatus)
router.get('/getOrderByStatusAndDate',getOrderByStatusAndDate)
router.get('/getOrderById/:id',getOrderById)
router.get('/getOrderByOrderId/:oid',getOrderByOrderId)
router.put('/updateOrderStatus/:id',updateOrderStatus)

export default router