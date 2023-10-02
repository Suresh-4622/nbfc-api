import User from "../models/userModel.js";
import { TOKEN_KEY } from "../config.js";
import moment from "moment-timezone";
import jwt from "jsonwebtoken";

export async function userRegistration(req, res, next) {
  try {
    const data = req.body;

    const missingFields = [];

    const requiredFields = ["userName", "email", "password"];
    for (const field of requiredFields) {
      if (!data[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }


    const checkUserExist = await User.find({ email: data.email });

    const date = Date.now();
    const createdAt = moment(date).format("lll");

    if (checkUserExist.length === 0) {
      const userData = await User.create({
        userName: data.userName,
        email: data.email,
        password: data.password,
        isFirst: true,
        createdAt: createdAt,
      });

      res.status(200).json({
        message: "User Singed Successfully",
        page: "wizard",
        userData,
      });
    } else {
      //update user register
      const editData = {
        isFirst: false,
      }
      const existData = await User.findByIdAndUpdate(checkUserExist[0].id, editData ,{
        new: true,
        runValidators: true
      })
      res.status(208).json({
        message: "User Already Exist",
        existData,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const data = req.body;

    const missingFields = [];

    const requiredFields = ["email", "password"];
    for (const field of requiredFields) {
      if (!data[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }

    const user = await User.findOne({
      email: data.email,
      password: data.password,
    });

    const date = Date.now();

    if (user) {
      const tokenId = jwt.sign(
        { email: data.email, password: data.password },
        TOKEN_KEY,
        {
          expiresIn: "10m",
        }
      );
     const userData= await User.findByIdAndUpdate(
        { _id: user._id },
        {
          lastLogin: date,
          token: tokenId,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        status: "Created",
        message: "Login Successfully",
        userData,
      });
    } else {
      res.status(400).json({
        status: "Bad Request",
        message: "Invalid Credential",
      });
    }
  } catch (error) {
    next(error);
  }
}
