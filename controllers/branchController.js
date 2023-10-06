import Branch from "../models/branchModel.js";
import moment from "moment-timezone";
import User from "../models/userModel.js";

export async function createBranch(req, res, next) {
  try {
    const data = req.body;

    const checkExistBranch = await Branch.find({
      orgId: data.orgId,
      branchCode: data.branchCode,
    });

    if (checkExistBranch.length === 0) {
      const date = Date.now();
      const createAt = moment(date).format("lll");

      const branchData = await Branch.create({
        userId: data.userId,
        clientId: data.clientId,
        orgId: data.orgId,
        branchName: data.branchName,
        branchCode: data.branchCode,
        branchPhone: data.branchPhone,
        branchEmail: data.branchEmail,
        address: data.address,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
        createdBy: data.userId,
        createdAt: createAt,
      });

      const editData = {
        isFirst : false,
      }
      const userUpdateData = await User.findByIdAndUpdate(data.userId ,editData,
        {
          new: true,
          runValidators: true,
        }
        );
      res.status(200).json({
        status: true,
        message: "Branch Created Successfully",
      });
    } else {
      res.status(422).json({
        status: false,
        message: "Branch Already Exist",
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

export async function updateBranch(req, res, next) {
  try {
    const data = req.body;
    const missingFields = [];

    const requiredFields = ["branchId"];

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

    const date = Date.now();
    const updateAt = moment(date).format("lll");

    const editData = {
      userId: data.userId,
      clientId: data.clientId,
      orgId: data.orgId,
      branchName: data.branchName,
      branchCode: data.branchCode,
      branchPhone: data.branchPhone,
      branchEmail: data.branchEmail,
      address: data.address,
      state: data.state,
      city: data.city,
      pincode: data.pincode,
      updatedBy: data.userId,
      updatedAt: updateAt,
    };

    const updatedData = await Branch.findByIdAndUpdate(
      data.branchId,
      editData,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: true,
      message: "Branch Updated Successfully",
    });
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
export async function getAllBranch(req, res, next) {
  try {
    const datas = req.body;
    const data = await Branch.find({ orgId: datas.orgId }).populate({
      path: "orgId",
      populate: {
        path: "clientId",
        model: "Client",
        populate: {
          path: "userId",
          model: "User",
        },
      },
    });

    const missingFields = [];
    const requiredFields = ["orgId"];

    for (const field of requiredFields) {
      if (!datas[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(422).json({
        status: false,
        message: `${missingFields} is required fields`,
      });
    }

    res.status(200).json({
      status: true,
      message: "Get All Branch Successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOneBranch(req, res, next) {
  try {
    const branchId = req.query.branchId;
    const data = await Branch.findOne({ _id: branchId }).populate({
      path: "orgId",
      populate: {
        path: "clientId",
        model: "Client",
        populate: {
          path: "userId",
          model: "User",
        },
      },
    });

    if (data) {
      res.status(200).json({
        status: true,
        data,
      });
    } else {
      res.status(422).json({
        status: false,
        message: "No Record Found Id",
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function deleteBranch(req, res, next) {
  try {
    const branchId = req.query.branchId;

    const findData = await Branch.findOne({ _id: branchId });

    if (findData) {
      const deleteData = await Branch.findByIdAndDelete(branchId);

      res.status(200).json({
        status: true,
        message: "Branch Deleted Successfully",
      });
    } else {
      res.status(422).json({
        status: false,
        message: "No Record Found This Id",
      });
    }
  } catch (err) {
    next(err);
  }
}
