const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const { decrypt } = require("../../services/encryptAndDecrypt.service");

function init(passport) {
    console.log("testing passport ", passport)
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        console.log("passport log", email, password);
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
              return done(null, false, { message: "No user with this email" });
            }
          const isMatch = await decrypt(password, user.password);
          console.log("planText match", isMatch);
          if (isMatch) {
            return done(null, user, { message: "Login successfully" });
          }
          return done(null, false, { message: "Wrong Username or password" });
        } catch (error) {
          return done(null, false, { message: "Something want wrong" });
        }
      }
    )
  );

  // store user in session 
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
      User.findById(id, (err, user)=>{
          done(err, user);
      })
  });
}

module.exports = init;
