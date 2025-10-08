import Order from "../Modals/order.modals.js";
import Product from "../Modals/product.modals.js";
import NodeCache from "node-cache";

const orderCache = new NodeCache({ stdTTL: 300 });

export const placeOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingInfo,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const userId = req.user.id;

    if (!orderItems?.length) {
      return res.status(400).json({ message: "No products in order" });
    }

    const productIds = orderItems.map((item) => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } }).select("price").lean();

    if (dbProducts.length !== productIds.length) {
      return res.status(404).json({ message: "Some products not found" });
    }

    const orderProducts = orderItems.map((item) => {
      const product = dbProducts.find((p) => p._id.toString() === item.product);
      return {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const order = await Order.create({
      user: userId,
      products: orderProducts,
      shippingInfo,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    orderCache.del(`orders_user_${userId}`);
    orderCache.del("orders_all");

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getMyOrders = async (req, res) => {
  try {
    const cacheKey = `orders_user_${req.user.id}`;
    const cached = orderCache.get(cacheKey);
    if (cached) return res.json(cached);

    const orders = await Order.find({ user: req.user.id })
      .populate("products.product", "name price")
      .sort({ createdAt: -1 })
      .lean();

    orderCache.set(cacheKey, orders);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const cacheKey = "orders_all";
    const cached = orderCache.get(cacheKey);
    if (cached) return res.json(cached);

    const orders = await Order.find()
      .populate("user", "username accountType")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 })
      .lean();

    orderCache.set(cacheKey, orders);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    orderCache.del(`orders_user_${order.user.toString()}`);
    orderCache.del("orders_all");

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
