import User from "../models/userModel.js";
import { TOKEN_KEY } from "../config.js";
import moment from "moment-timezone";
import jwt from "jsonwebtoken";

export async function userRegistration(req, res, next) {
  try {
    const data = req.body;

    const missingFields = [];

    const requiredFields = ["userName" ,"email", "password"];
    for (const field of requiredFields) {
      if (!data[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(422).json({
        status: false,
        message: `${missingFields} is required fields`,
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

      const responseUserData = {
        userName: userData.userName,
        email: userData.email,
        createdAt: userData.createdAt,
        id: userData.id,
      };

      res.status(200).json({
        status: true,
       message: "Register Successfully",
      });
    } else {
      res.status(208).json({
        status: false,
        message: "User Already Exist",
      });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      const firstValidationErrorField = Object.keys(validationErrors)[0];
      const errorMessage = validationErrors[firstValidationErrorField];

      return res.status(422).json({
        status: false,
        message: errorMessage,
      });
    }
    next(error);
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
      return res.status(422).json({
        status: false,
        message: `${missingFields} is required fields`,
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
          expiresIn: "20m",
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
          select: '-password -isFirst -id',
        }
      );
      const responseUserData = {
        userName: userData.userName,
        email: userData.email,
        createdAt: userData.createdAt,
        id: userData.id,
      };
      res.status(200).json({
        status: true,
        page: "wizard",
        isFirst: user.isFirst,
        token: userData.token,
        userData:responseUserData,
      });
    } else {
      res.status(422).json({
        status: false,
        message: "Invalid Credential",
      });
    }
  } catch (error) {
    next(error);
  }
}
