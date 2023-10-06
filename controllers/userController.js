import User from "../models/userModel.js";
import { TOKEN_KEY } from "../config.js";
import moment from "moment-timezone";
import jwt from "jsonwebtoken";
import Client from "../models/clientModel.js";
import Organization from "../models/orgModel.js";
import Branch from "../models/branchModel.js";

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
      res.status(422).json({
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
    const clientData = await Client.findOne({ userId: user.id });
    const orgData = await Organization.findOne({ userId: user.id });
    const branchData = await Branch.findOne({ userId: user.id });
    const date = Date.now();

    if (user) {
      if (user.isFirst && !clientData) {
        const tokenId = jwt.sign(
          { userId: user._id, userType: user.userType },
          TOKEN_KEY,
          {
            expiresIn: "20m",
          }
        );
        const userData = await User.findByIdAndUpdate(
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
          status: true,
          message: "Login Successfully",
          wizard: 0,
          token: userData.token,
        });
      } else if (clientData && !orgData) {
        const tokenId = jwt.sign(
          {
            userId: user._id,
            clientId: clientData._id,
            userType: user.userType,
          },
          TOKEN_KEY,
          {
            expiresIn: "20m",
          }
        );
        const userData = await User.findByIdAndUpdate(
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
          status: true,
          message: "Login Successfully",
          wizard: 1,
          token: userData.token,
        });
      } else if (orgData && !branchData) {
        const tokenId = jwt.sign(
          {
            userId: user._id,
            clientId: clientData._id,
            orgId: orgData._id,
            userType: user.userType,
          },
          TOKEN_KEY,
          {
            expiresIn: "20m",
          }
        );
        const userData = await User.findByIdAndUpdate(
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
          status: true,
          message: "Login Successfully",
          wizard: 2,
          token: userData.token,
        });
      } else if (!user.isFirst) {
        const checkUserOrg = await Organization.find({ userId: user._id });
        if (checkUserOrg.length === 1) {
          const tokenId = jwt.sign(
            {
              userId: user._id,
              clientId: clientData._id,
              orgId: checkUserOrg[0]._id,
              userType: user.userType,
            },
            TOKEN_KEY,
            {
              expiresIn: "20m",
            }
          );
          const userData = await User.findByIdAndUpdate(
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
            status: true,
            message: "Logind Successfully",
            token: userData.token,
          });
          //get branch details

          const checkUserBranch = await Branch.find({ userId: user._id });
          if (checkUserBranch.length === 1) {
            const tokenId = jwt.sign(
              {
                userId: user._id,
                clientId: clientData._id,
                orgId: orgData._id,
                branchId: checkUserBranch[0]._id,
                userType: user.userType,
              },
              TOKEN_KEY,
              {
                expiresIn: "20m",
              }
            );
            const userData = await User.findByIdAndUpdate(
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
              status: true,
              message: "Logind Successfully",
              token: userData.token,
            });
          } else {
            const tokenId = jwt.sign(
              {
                userId: user._id,
                clientId: clientData._id,
                orgId: orgData._id,
                userType: user.userType,
              },
              TOKEN_KEY,
              {
                expiresIn: "20m",
              }
            );
            const userData = await User.findByIdAndUpdate(
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
              status: true,
              message: "Logind Successfully",
              userType: user.userType,
            });
          }
        } else {
          const tokenId = jwt.sign(
            {
              userId: user._id,
              clientId: clientData._id,
              userType: user.userType,
            },
            TOKEN_KEY,
            {
              expiresIn: "20m",
            }
          );
          const userData = await User.findByIdAndUpdate(
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
            status: true,
            message: "Logind Successfully",
            token: userData.token,
          });
        }
      }
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
