const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  cartegory: { type: String, required: true },
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: false },
  default_room: { type: String, required: false },
  province: { type: String, required: true },
  city: { type: String, required: true },
  township: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("users", userSchema);

const healthCareUserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
 
  province: { type: String, required: true },
  
  city: { type: String, required: true },
  township: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  
});

const HealthCareUser = mongoose.model(
  "health_care_users",
  healthCareUserSchema
);

const healthCareSchema = new mongoose.Schema({
  provider_name: { type: String, required: true },
  type: { type: String, required: true },
  cartegory: { type: String, required: true },
  consultants: { type: String, required: false },
  description: { type: String, required: true },
  authorId: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: String, required: true },
});

const HealthCareProvider = mongoose.model(
  "health_care_provider",
  healthCareSchema
);

module.exports = {
  User,
  HealthCareUser,
  HealthCareProvider,
};
