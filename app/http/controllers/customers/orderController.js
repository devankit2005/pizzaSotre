const Order = require("../../../models/order");
const moment = require("moment");

function orderController() {
  return {
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0"
      ); // use this line clear cache in back button
      res.render("customers/order", { orders, moment });
    },
    async getSingleOrder(req, res) {
      try {
        const order = await Order.findById(req.params.id);
        if (req.user._id.toString() === order.customerId.toString()) {
          return res.render("customers/singleOrder", { order, moment });
        }
        return res.redirect("/");
      } catch (error) {
        res.redirect("/");
      }
    },
    async store(req, res, next) {
      const { phone, address, paymentType } = req.body;
      // Validate request
      if (!phone || !address) {
        req.flash("error", "All field are required ");
        return res.redirect("/cart");
      }

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart,
        phone: phone,
        address: address,
        paymentType: paymentType,
      });

      try {
        const orderSave = await order.save();
        Order.populate(
          orderSave,
          { path: "customerId" },
          (err, placedOrder) => {
            console.log("orderSave", placedOrder);
            // Emit
            const eventEmitter = req.app.get("eventEmitter");
            eventEmitter.emit("orderPlaced", placedOrder);

            req.flash("success", "Order placed successfully ");
            delete req.session.cart;
            return res.redirect("/customer/orders");
          }
        );
      } catch (error) {
        req.flash("error", "Something want wrong ");
        return res.redirect("/cart");
      }
    },
  };
}

// items: { type: Object, required: true },
// phone: { type: String, required: true },
// address: { type: String, required: true },
// paymentType: { type: String, required: true },
// status: { type: String, default: "order_placed" },

module.exports = orderController;
