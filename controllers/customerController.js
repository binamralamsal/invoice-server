import asyncHandler from "express-async-handler";
import Customer from "../models/Customer.js";
import User from "../models/User.js";
import Fuse from "fuse.js";

// @desc     Get Customers
// @route    GET /api/customers/
// @access   Private/Admin
const getCustomers = asyncHandler(async (req, res) => {
  const PAGE_SIZE = 15;
  let page = parseInt(req.query.page || "1") - 1;
  let searchQuery = req.query.search || null;
  if (page < 0) page = 0;

  let customers = await Customer.find({})
    .populate("user", "name")
    .sort({ date: -1 })
    .limit(PAGE_SIZE)
    .skip(PAGE_SIZE * page);

  if (searchQuery) {
    const options = {
      keys: ["user.name", "phoneNumber", "city"],
      threshold: 0.3,
    };

    const fuse = new Fuse(customers, options);
    const result = fuse.search(searchQuery);
    customers = result.map((customer) => customer.item);
  }
  const total = await Customer.countDocuments({});

  res.json({ total: Math.ceil(total / PAGE_SIZE), customers });
});

// @desc     Get Customer
// @route    GET /api/customers/:id/
// @access   Private/Admin
const getCustomer = asyncHandler(async (req, res) => {
  const customers = await Customer.findById(req.params.id).populate(
    "user",
    "name"
  );

  res.json(customers);
});

// @desc     Create Customer
// @route    POST /api/customers/
// @access   Private/Admin
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

// @desc     Edit Customer
// @route    PUT /api/customers/:id
// @access   Private/Admin
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

// @desc    Delete Customer
// @route   DELETE /api/customers/
// @access  Private/Admin
const deleteCustoemr = asyncHandler(async (req, res) => {
  const customerIds = req.body;

  for (const customerId of customerIds) {
    const customer = await Customer.findById(customerId);

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    const user = await User.findById(customer.user);

    await customer.remove();
    await user.remove();
  }

  res.json({ message: "User Deleted Successfully" });
});

export {
  getCustomers,
  getCustomer,
  createCustomer,
  editCustomer,
  deleteCustoemr,
};
