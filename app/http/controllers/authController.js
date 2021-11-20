const passport = require("passport");
const { encrypt } = require("../../../services/encryptAndDecrypt.service");
const User = require("../../models/user");

const authController = () => {
  const _getRedirectUrl = (req) => {
    return req.user.role === "admin" ? "/admin/orders" : "/customer/orders";
  };

  return {
    login(req, res) {
      res.render("auth/login");
    },
    postLogin(req, res, next) {
      const { email, password } = req.body;

      // Validate request
      if (!email || !password) {
        req.flash("error", "All field are required ");
        req.flash("email", email);
        return res.redirect("/login");
      }

      passport.authenticate("local", (err, user, info) => {
        console.log("login data ", user);

        if (err) {
          req.flash("error", info.message);
          req.flash("email", user.email);
          return next(err);
        }

        if (!user) {
          req.flash("error", info.message);
          req.flash("email", user.email);
          return res.redirect("/login");
        }

        req.logIn(user, (error) => {
          if (error) {
            req.flash("error", info.message);
          }

          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);
    },
    register(req, res) {
      res.render("auth/register");
    },
    async postRegister(req, res) {
      const { name, email, password } = req.body;

      // Validate request
      if (!name || !email || !password) {
        req.flash("error", "All field are required ");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      // check if email exists
      const isExists = await User.exists({ email: email });

      if (isExists) {
        req.flash("isExists", "Email is already exists ");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }
      const hashPassword = await encrypt(password, 10);
      console.log("hashPassword", hashPassword);
      try {
        const user = await new User({
          name,
          email,
          password: hashPassword,
        });
        user.save();
        if (user) {
          res.redirect("/");
        }
      } catch (error) {
        req.flash("error", "Something want wrong ! ");
      }
    },
    logout(req, res) {
      req.logout();
      return res.redirect("/login");
    },
  };
};

module.exports = authController;
