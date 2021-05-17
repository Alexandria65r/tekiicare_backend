const mongoose = require("mongoose");
let readyState = 0;
const connection = () => {
  console.log("called=> connection");

  mongoose.connect(
   "mongodb+srv://robert:Alex@8265@cluster0.ugkn4.mongodb.net/tekiicare?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) throw err;
      console.log("connected to mongodb");
    }
  );
};

module.exports = {
  connection,
};
