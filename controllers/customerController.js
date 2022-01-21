import asyncHandler from "express-async-handler";
import Customer from "../models/Customer.js";
import User from "../models/User.js";

// @desc    Get Customer
// @route   GET /api/customers/
// @access  Public
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({}).populate("user", "name");

  res.json(customers);
});

// @desc    Get Customer
// @route   GET /api/customers/
// @access  Public
const getCustomer = asyncHandler(async (req, res) => {
  const customers = await Customer.findById(req.params.id).populate(
    "user",
    "name"
  );

  res.json(customers);
});

// @desc    Create Customer
// @route   POST /api/customers/
// @access  Public
const createCustomer = asyncHandler(async (req, res) => {
  const {
    name,
    username,
    password,
    phoneNumber,
    address,
    gstNumber,
    city,
    state,
  } = req.body;

  const customer = await Customer.createCustomer({
    name,
    username,
    password,
    phoneNumber,
    address,
    gstNumber,
    city,
    state,
  });

  res.json(customer);
});

// @desc    Create Customer
// @route   POST /api/customers/
// @access  Public
const editCustomer = asyncHandler(async (req, res) => {
  const { name, password, phoneNumber, address, gstNumber, city, state } =
    req.body;
  const { id: customerId } = req.params;

  const customer = await Customer.findById(customerId);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  const user = await User.findById(customer.user);
  if (password) {
    if (!(await user.matchPassword(password.currentPassword))) {
      res.status(401);
      throw new Error("Current Password is incorrect");
    }

    await user.changePassword(password.newPassword);
  }

  user.name = name;
  await user.save();

  customer.phoneNumber = phoneNumber;
  customer.address = address;
  customer.gstNumber = gstNumber;
  customer.city = city;
  customer.state = state;

  await customer.save();

  res.json(customer);
});

export { getCustomers, getCustomer, createCustomer, editCustomer };
