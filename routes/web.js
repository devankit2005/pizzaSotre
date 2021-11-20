const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const adminOrderController = require("../app/http/controllers/admin/orderController");
const homeController = require("../app/http/controllers/homeController");
const auth = require("../app/http/middlewares/auth");
const guest = require("../app/http/middlewares/guest");
const isAdmin = require("../app/http/middlewares/admin");
const statusController = require("../app/http/controllers/admin/statusController");

function initRoutes(app) {
  app.get("/", homeController().index);

  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);
  app.post("/logout", authController().logout);

  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);

  // cart routes
  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);

  // customer routes
  app.get("/customer/orders", auth, orderController().index);
  app.post("/orders", auth, orderController().store);
  app.get("/customer/orders/:id", auth, orderController().getSingleOrder);

  // Admin routes
  app.get("/admin/orders", isAdmin, auth, adminOrderController().index);
  app.post("/admin/order/status", isAdmin, auth, statusController().update);
}

module.exports = initRoutes;
