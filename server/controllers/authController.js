import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const registerUser = async (req, res) => {
  const userName = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role || "viewer";
  const existingUser = await User.find({ email: email });
  if (!existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: userName,
      email: email,
      password: hashedPassword,
      role: role,
      createdAt: Date.now(),
    });
    const result = await user.save();
    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (error) {
    return res.status(401).json({ message: error });
  }
};

export const loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found");
      error.status = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Passwords do not match");
      error.status = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (error) {
    console.error(error);
  }
};

