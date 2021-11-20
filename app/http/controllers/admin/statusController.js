const Order = require("../../../models/order");
const moment = require("moment");

function statusController() {
  return {
    update(req, res) {
      const { orderId, status } = req.body;
      console.log("log ", orderId, status);
      Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true },
        (err, order) => {
          if (err) {
            res.redirect("/admin/orders");
            return res.json({ success: false, message: err });
          }

          // Emit event
          const eventEmitter = req.app.get("eventEmitter");
          eventEmitter.emit("orderUpdated", { id: orderId, status: status });
          res.redirect("/admin/orders");
          //return res.json({ success: true, message: "Order status updated" });
        }
      );
    },
  };
}

module.exports = statusController;
