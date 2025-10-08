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
      .populate("products.product", "name price images")
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
    const { page = 1, limit = 10, status, paymentMethod, sort = "desc" } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    const cacheKey = `orders_all_${status || "all"}_${paymentMethod || "all"}_${page}_${limit}_${sort}`;
    const cached = orderCache.get(cacheKey);
    if (cached) return res.json(cached);

    const skip = (Number(page) - 1) * Number(limit);
    const sortOption = { createdAt: sort === "asc" ? 1 : -1 };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "username accountType")
        .populate("products.product", "name price")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .lean(),

      Order.countDocuments(filter),
    ]);

    const response = {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      limit: Number(limit),
      orders,
    };

    orderCache.set(cacheKey, response);
    res.json(response);
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
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;  

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    if (order.status !== "Pending" && order.status !== "Processing") {
      return res
        .status(400)
        .json({ message: `Cannot cancel order in '${order.status}' status` });
    }

    order.status = "Cancelled";
    await order.save();

    orderCache.del(`orders_user_${userId}`);
    orderCache.del("orders_all");

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
