const Order = require("../../../models/order");
const moment = require("moment");

function menusController() {
  return {
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

module.exports = menusController;
