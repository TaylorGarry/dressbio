// import Order from "../Modals/order.modals.js";
// import Product from "../Modals/product.modals.js";
// import NodeCache from "node-cache";

// const orderCache = new NodeCache({ stdTTL: 300 });

// export const placeOrder = async (req, res) => {
//   try {
//     const {
//       orderItems,
//       shippingInfo,
//       paymentMethod,
//       itemsPrice,
//       shippingPrice,
//       totalPrice,
//     } = req.body;

//     const userId = req.user.id;

//     if (!orderItems?.length) {
//       return res.status(400).json({ message: "No products in order" });
//     }

//     const productIds = orderItems.map((item) => item.product);
//     const dbProducts = await Product.find({ _id: { $in: productIds } })
//       .select("price")
//       .lean();

//     if (dbProducts.length !== productIds.length) {
//       return res.status(404).json({ message: "Some products not found" });
//     }

//     const orderProducts = orderItems.map((item) => {
//       const product = dbProducts.find((p) => p._id.toString() === item.product);
//       return {
//         product: product._id,
//         quantity: item.quantity,
//         price: product.price,
//       };
//     });

//     const order = await Order.create({
//       user: userId,
//       products: orderProducts,
//       shippingInfo,
//       paymentMethod,
//       itemsPrice,
//       shippingPrice,
//       totalPrice,
//     });

//     orderCache.flushAll();
//     res.status(201).json({ message: "Order placed successfully", order });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getMyOrders = async (req, res) => {
//   try {
//     const cacheKey = `orders_user_${req.user.id}`;
//     const cached = orderCache.get(cacheKey);
//     if (cached) return res.json(cached);

//     const orders = await Order.find({ user: req.user.id })
//       .populate("products.product", "name price images")
//       .sort({ createdAt: -1 })
//       .lean();

//     orderCache.set(cacheKey, orders);
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getAllOrders = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status, paymentMethod, sort = "desc", search } = req.query;

//     const filter = {};
//     if (status) filter.status = status;
//     if (paymentMethod) filter.paymentMethod = paymentMethod;

//     let ordersQuery = Order.find(filter)
//       .populate("user", "username accountType")
//       .populate("products.product", "name price images");

//     if (search) {
//       const searchRegex = new RegExp(search, "i");
//       ordersQuery = ordersQuery.or([
//         { paymentMethod: searchRegex },
//         { "products.product.name": searchRegex },
//       ]);
//     }

//     const skip = (Number(page) - 1) * Number(limit);
//     const sortOption = { createdAt: sort === "asc" ? 1 : -1 };

//     const [orders, total] = await Promise.all([
//       ordersQuery.sort(sortOption).skip(skip).limit(Number(limit)).lean(),
//       Order.countDocuments(filter),
//     ]);

//     const response = {
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / limit),
//       limit: Number(limit),
//       orders,
//     };

//     res.json(response);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const { id } = req.params;

//     const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
//       .populate("user", "username accountType")
//       .populate("products.product", "name price images");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     orderCache.flushAll();
//     res.json({ message: "Order status updated", order });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const cancelOrder = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { id } = req.params;

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (order.user.toString() !== userId.toString()) {
//       return res.status(403).json({ message: "Not authorized to cancel this order" });
//     }

//     if (order.status === "Delivered") {
//       return res.status(400).json({ message: "Cannot cancel an order that has already been delivered" });
//     }

//     order.status = "cancelled";
//     await order.save();

//     const populatedOrder = await Order.findById(order._id)
//       .populate("user", "username accountType")
//       .populate("products.product", "name price images");

//     orderCache.flushAll();

//     res.json({ message: "Order cancelled successfully", order: populatedOrder });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

import Order from "../Modals/order.modals.js";
import Product from "../Modals/product.modals.js";
import NodeCache from "node-cache";

const orderCache = new NodeCache({ stdTTL: 300 });

export const placeOrder = async (req, res) => {
  try {
    let { orderItems, shippingInfo, paymentMethod, itemsPrice, shippingPrice, totalPrice, transactionRef } = req.body;

    if (typeof orderItems === "string") orderItems = JSON.parse(orderItems);
    if (typeof shippingInfo === "string") shippingInfo = JSON.parse(shippingInfo);

    if (!orderItems?.length) {
      return res.status(400).json({ message: "No products in order" });
    }

    if (paymentMethod === "upi" && transactionRef) {
      const existingOrder = await Order.findOne({
        "upiPayment.transactionRef": transactionRef,
        status: { $in: ["pending", "processing", "shipped", "delivered"] },  
      });

      if (existingOrder) {
        return res.status(400).json({
          message: "This transaction ID has already been used for another order.",
        });
      }
    }

    const productIds = orderItems.map(item => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } }).select("price").lean();
    if (dbProducts.length !== productIds.length) {
      return res.status(404).json({ message: "Some products not found" });
    }

    const orderProducts = orderItems.map(item => {
      const product = dbProducts.find(p => p._id.toString() === item.product);
      return {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const orderData = {
      user: req.user.id,
      products: orderProducts,
      shippingInfo,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    };

    if (paymentMethod === "upi") {
      orderData.upiPayment = {
        fileUrl: "/QRCode1.jpg",
        status: "pending",
        transactionRef,
      };
    }

    const order = await Order.create(orderData);

    orderCache?.flushAll?.();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order creation error:", error);
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
    const { page = 1, limit = 10, status, paymentMethod, sort = "desc", search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    let ordersQuery = Order.find(filter)
      .populate("user", "username accountType")
      .populate("products.product", "name price images");

    if (search) {
      const searchRegex = new RegExp(search, "i");
      ordersQuery = ordersQuery.or([
        { paymentMethod: searchRegex },
        { "products.product.name": searchRegex },
      ]);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOption = { createdAt: sort === "asc" ? 1 : -1 };

    const [orders, total] = await Promise.all([
      ordersQuery.sort(sortOption).skip(skip).limit(Number(limit)).lean(),
      Order.countDocuments(filter),
    ]);

    const response = {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      limit: Number(limit),
      orders,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Admin verification for UPI payments
    if (order.paymentMethod === "upi" && order.upiPayment) {
      if (status === "processing") order.upiPayment.status = "verified";
      else if (status === "cancelled") order.upiPayment.status = "rejected";
    }

    order.status = status;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "username accountType")
      .populate("products.product", "name price images");

    orderCache.flushAll();

    res.json({ message: "Order status updated", order: populatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== userId.toString())
      return res.status(403).json({ message: "Not authorized to cancel this order" });

    if (order.status === "Delivered")
      return res.status(400).json({ message: "Cannot cancel delivered order" });

    order.status = "cancelled";
    if (order.paymentMethod === "upi" && order.upiPayment) order.upiPayment.status = "rejected";
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "username accountType")
      .populate("products.product", "name price images");

    orderCache.flushAll();

    res.json({ message: "Order cancelled successfully", order: populatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyUPIPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // "verify" or "reject"

    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.paymentMethod !== "upi" || !order.upiPayment)
      return res.status(400).json({ message: "No UPI payment to verify" });

    if (action === "verify") {
      order.upiPayment.status = "verified";
      order.status = "processing"; // move order to processing
    } else if (action === "reject") {
      order.upiPayment.status = "rejected";
      order.status = "cancelled";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "username accountType")
      .populate("products.product", "name price images");

    orderCache.flushAll();

    res.json({ message: "UPI payment updated successfully", order: populatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
