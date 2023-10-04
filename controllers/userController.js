import Branch from "../models/branchModel.js";
import { getAll, getOne, deleteOne } from "./baseController.js";
import moment from "moment-timezone";

export async function createBranch(req, res, next) {
  try {
    const data = req.body;

    const missingFields = [];

    const requiredFields = ["orgId", "branchName", "branchCode", "branchPhone", 
    "branchEmail", "address", "state", "city", "pincode"];
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

    const checkExistBranch = await Branch.find({
      orgId: data.orgId,
      branchCode: data.branchCode,
    });

    if (checkExistBranch.length === 0) {
      const date = Date.now();
      const createAt = moment(date).format("lll");

      const branchData = await Branch.create({
        userId: data.userId,
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
      res.status(201).json({
        status: "Created",
        message: "Branch Created Successfully",
        branchData,
      });
    } else {
      res.status(208).json({
        message: "Branch Already Exist",
        checkExistBranch,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateBranch(req, res, next) {
  try {
    const data = req.body;

    const date = Date.now();
    const updateAt = moment(date).format("lll");

    const editData = {
      clientId: data.clientId,
      orgName: data.orgName,
      orgCode: data.orgCode,
      phone: data.phone,
      orgEmail: data.orgEmail,
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
    res.status(201).json({
      status: "Updated",
      message: "Branch Updated Successfully",
      updatedData,
    });
  } catch (error) {
    next(error);
  }
}
export async function getAllBranch(req, res, next) {
  try {
    const data = await Branch.find().populate("userId").populate("orgId");
    res.status(201).json({
      status: "Success",
      message: "Get All Branch Successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getBranch(req, res, next) {
  try {
    const branchId = req.params.id;
    const data = await Branch.findOne({ _id: branchId })
      .populate("userId")
      .populate("orgId");
    res.status(201).json({
      status: "Success",
      message: "Get All Branch Successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export const deleteBranch = deleteOne(Branch);
