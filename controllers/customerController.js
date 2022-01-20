import asyncHandler from "express-async-handler";
import Customer from "../models/Customer.js";

// @desc    Auth user & get token
// @route   GET /api/customers/
// @access  Public
const getCustomer = asyncHandler(async (req, res) => {
  const customers = await Customer.find({}).populate("user", "name");

  res.json(customers);
});

// @desc    Auth user & get token
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

export { getCustomer, createCustomer };
