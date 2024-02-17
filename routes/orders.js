const {Order} = require('../models/order')
const express = require('express')
const {OrderItem} = require('../models/order-item')
const router = express.Router()
// 
const {Product} = require('../models/product')

router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if (!orderList) {
        res.status(500).json({success: false})
    }
    res.send(orderList)
    })

    router.get(`/:id`, async (req, res) => {
        const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'}
            })
    
        if (!order) {
            res.status(500).json({success: false})
        }
        res.send(order)
        })

    // router.post('/', async (req,res)=>{
    //     const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
    //         let newOrderItem = new OrderItem({
    //             quantity: orderItem.quantity,
    //             product: orderItem.product
    //         })

    //         newOrderItem = await newOrderItem.save();

    //         return newOrderItem._id
    //     }))

    //     const orderItemsIdsResolved = await orderItemsIds
        
    //     const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
    //         const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
    //         const totalPrice = orderItem.product.price * orderItem.quantity;
    //         return totalPrice
    //     }))

    //     console.log(totalPrices)

    //     let order = new Order({
    //         orderItems: orderItemsIdsResolved,
    //         shippingAddress1: req.body.shippingAddress1,
    //         shippingAddress2: req.body.shippingAddress2,
    //         city: req.body.city,
    //         zip: req.body.zip,
    //         country: req.body.country,
    //         phone: req.body.phone,
    //         status: req.body.status,
    //         totalPrice: totalPrice,
    //         user: req.body.user
    //     })
    //     order = await order.save();
    
    //     if(!order)
    //     return res.status(400).send('the order cannot be created!')
    
    //     res.send(order);
    // })

    router.post('/', async (req, res) => {
        try {
            const orderItemsIds = await Promise.all(req.body.orderItems.map(async orderItem => {
                let newOrderItem = new OrderItem({
                    quantity: orderItem.quantity,
                    product: orderItem.product
                });
                newOrderItem = await newOrderItem.save();
                return newOrderItem._id;
            }));
    
            let totalPrice = 0;
            await Promise.all(req.body.orderItems.map(async orderItem => {
                const product = await Product.findById(orderItem.product);
                if (product && product.price) {
                    totalPrice += product.price * orderItem.quantity;
                }
            }));
    
            let order = new Order({
                orderItems: orderItemsIds,
                shippingAddress1: req.body.shippingAddress1,
                shippingAddress2: req.body.shippingAddress2,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
                phone: req.body.phone,
                status: req.body.status,
                totalPrice: totalPrice,
                user: req.body.user
            });
            order = await order.save();
    
            if (!order) {
                return res.status(400).send('The order cannot be created!');
            }
    
            res.status(201).send(order);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const order = await Order.findOneAndUpdate(
                { _id: req.params.id },
                { status: req.body.status },
                { new: true }
            );
            
            if (!order)
                return res.status(400).send('The order cannot be updated!');
            
            res.send(order);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    

    // router.put('/:id',async (req, res)=> {
    //     const order = await Order.findByIdAndUpdate(
    //         req.params.id,
    //         {
    //             status: req.body.status
    //         },
    //         { new: true}
    //     )
    
    //     if(!order)
    //     return res.status(400).send('the order cannot be update!')
    
    //     res.send(order);
    // })

    router.delete('/:id', (req, res)=>{
        Order.findByIdAndDelete(req.params.id).then(async order =>{
            if(order) {
                await order.orderItems.map(async orderItem => {
                    await OrderItem.findByIdAndDelete(orderItem)
                })
                return res.status(200).json({success: true, message: 'the order is deleted!'})
            } else {
                return res.status(404).json({success: false , message: "order not found!"})
            }
        }).catch(err=>{
           return res.status(500).json({success: false, error: err}) 
        })
    })

    router.get('/get/totalsales', async (req, res)=> {
        const totalSales= await Order.aggregate([
            { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
        ])
    
        if(!totalSales) {
            return res.status(400).send('The order sales cannot be generated')
        }
    
        res.send({totalsales: totalSales.pop().totalsales})
    })

    router.get(`/get/count`, async (req, res) => {
        try {
            const orderCount = await Order.countDocuments();
            
            res.send({
                orderCount: orderCount
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    router.get(`/get/userorders/:userid`, async (req, res) =>{
        const userOrderList = await Order.find({user: req.params.userid}).populate({ 
            path: 'orderItems', populate: {
                path : 'product', populate: 'category'} 
            }).sort({'dateOrdered': -1});
    
        if(!userOrderList) {
            res.status(500).json({success: false})
        } 
        res.send(userOrderList);
    })
    
module.exports = router

