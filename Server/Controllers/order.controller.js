import Order from "../Modals/order.modals.js";
import Product from "../Modals/product.modals.js";

export const placeOrder = async (req, res) => {
  try {
    const { products, deliveryAddress } = req.body;
    const userId = req.user.id;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    const productIds = products.map((item) => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== productIds.length) {
      return res.status(404).json({ message: "Some products not found" });
    }

    let totalPrice = 0;
    const orderProducts = products.map((item) => {
      const product = dbProducts.find((p) => p._id.toString() === item.product);
      totalPrice += product.price * item.quantity;
      return {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const order = await Order.create({
      user: userId,
      products: orderProducts,
      totalPrice,
      deliveryAddress,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("products.product", "name price")
      .lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username accountType")
      .populate("products.product", "name price")
      .lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
