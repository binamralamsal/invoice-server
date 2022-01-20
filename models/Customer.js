import mongoose from "mongoose";
import User from "./User.js";

const customerSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gstNumber: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

customerSchema.statics.createCustomer = async function (data) {
  const {
    name,
    username,
    password,
    phoneNumber,
    address,
    gstNumber,
    city,
    state,
  } = data;
  const user = await User.create({ name, username, password });

  const customer = await this.create({
    user: user._id,
    phoneNumber,
    address,
    gstNumber,
    city,
    state,
  });

  return customer;
};

export default mongoose.model("Customer", customerSchema);
