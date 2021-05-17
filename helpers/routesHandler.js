const { User, HealthCareUser, HealthCareProvider } = require("../schema");
const { connection } = require("../connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AddHealthCare = require("../routes/AddHealthCare");
const fetchProviders = require("../routes/fetch_providers");

module.exports = (app) => {
  connection();
  UserSignup(app);
  DecodeToken(app);
  UserLogin(app);
  AddHealthCare(app);
  fetchProviders(app);
};

//user signup
async function UserSignup(app) {
  app.post("/user_signup", (req, res) => {
    const user = req.body;
    User.findOne({ email: user.email }, (err, doc) => {
      if (err) console.log(err);
      if (doc) return res.json({ erroe: true, message: "user already exists" });
      //hash the password
      bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) console.log(err);
        console.log(hash);
        if (hash) {
          user.password = hash;
          User.create(user, (err, user_doc) => {
            if (err) console.log(err);
            if (user_doc) {
              //authenticate the user
              jwt.sign(
                { id: user_doc._id, email: user_doc.email },
                process.env.JWT_SECRET,
                (asign_err, token) => {
                  if (asign_err) console.log(asign_err);
                  res.json({ success: true, user_doc, token });
                }
              );
            }
          });
        }
      });
    });
  });
}

//decode token
async function DecodeToken(app) {
  app.get("/decode-token", (req, res) => {
    //get token
    const token = req.cookies.tekiicare_auth_token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.json({ error: true, message: "decode error" });
      console.log(decoded);
      User.findById({ _id: decoded.id }, (err, user) => {
        if (err) return res.json({ error: true, message: "An error occured" });
        res.json({ success: true, user });
      });
    });
  });
}

//user login

async function UserLogin(app) {
  app.post("/user_login", (req, res) => {
    console.log(req.body);
    const { email, cartegory, password } = req.body;
    User.findOne()
      .where({ email: email })
      .where({ cartegory: cartegory })
      .exec(async (err, user) => {
        if (err) console.log(err);
        if (!user)
          return res.json({ error: true, message: "account doesn't exist" });
        //hash the password
        if (user) {
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (!isPasswordMatch) {
            return res.json({ error: true, message: "Incorrect Password" });
          } else {
            jwt.sign(
              { id: user._id, email: user.email },
              process.env.JWT_SECRET,
              (asign_err, token) => {
                if (asign_err) console.log(asign_err);
                res.json({ success: true, user, token });
              }
            );
          }
        }
      });
  });
}
