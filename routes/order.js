const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Product = require("../models/products");
const multer = require("multer");
const upload = multer();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "Access denied, no token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
};

const checkAdminRole = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied, admin role required" });
    }
    next();
};

router.post("/orders" ,authenticateToken , async (req, res) => {
    const { items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: "يجب اختيار منتج واحد على الأقل" });
    }

    try {
        const order = await Order.create({
            userId: req.user.id,
            status: 'pending',
            name: req.body.name,
            phone: req.body.phone,
            location: req.body.location,
        });
        
        const orderItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                throw new Error(`المنتج بمعرف ${item.productId} غير موجود`);
            }

            return await OrderItem.create({
                orderId: order.id,
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            });
        }));

        const orderWithProducts = await Order.findByPk(order.id, {
            include: {
                model: OrderItem,
                include: {
                    model: Product
                }
            }
        });

        res.status(201).json({
            message: "Order created successfully",
            order: orderWithProducts
        });

    } catch (err) {
        console.error("❌ خطأ أثناء إنشاء الطلب:", err);
        res.status(500).json({ error: "حدث خطأ أثناء إنشاء الطلب" });
    }
});

router.put("/orders/:orderId", authenticateToken , async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status || !['completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: "Invalid status, must be 'completed' or 'cancelled'" });
    }

    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.userId !== req.user.id) {
            return res.status(403).json({ error: "Access denied, you are not the owner of this order" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            message: `Order status updated to ${status}`,
            order
        });

    } catch (err) {
        console.error("❌ Error updating order status:", err);
        res.status(500).json({ error: "An error occurred while updating the order status" });
    }
});

// جلب جميع الاوردرات لمستخدم معين حسب الحالة
router.get("/orders/:status", authenticateToken, async (req, res) => {
    const { status } = req.params;

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: "Invalid status, must be 'pending', 'completed' or 'cancelled'" });
    }

    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id, status },
            include: {
                model: OrderItem,
                include: {
                    model: Product
                }
            }
        });

        res.status(200).json(orders);
    } catch (err) {
        console.error("❌ Error fetching orders:", err);
        res.status(500).json({ error: "An error occurred while fetching the orders" });
    }
});

router.get("/orders", authenticateToken, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id }, 
            include: {
                model: OrderItem,
                include: {
                    model: Product
                }
            }
        });

        res.status(200).json(orders);
    } catch (err) {
        console.error("❌ Error fetching orders:", err);
        res.status(500).json({ error: "An error occurred while fetching the orders" });
    }
});

router.get("/admin/orders", authenticateToken, checkAdminRole, async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: {
                model: OrderItem,
                include: {
                    model: Product
                }
            }
        });

        res.status(200).json(orders);
    } catch (err) {
        console.error("❌ Error fetching all orders:", err);
        res.status(500).json({ error: "An error occurred while fetching all orders" });
    }
});


module.exports = router;
