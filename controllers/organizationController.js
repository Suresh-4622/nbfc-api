import Organization from "../models/orgModel.js";
import { getAll, getOne, deleteOne } from "./baseController.js";
import moment from "moment-timezone";

export async function createOrganization(req, res, next) {
  try {
    const data = req.body;

    const existUser = await Organization.find({
      orgEmail: data.orgEmail,
    });

    if (existUser.length === 0) {
      const date = Date.now();
      const createAt = moment(date).format("lll");

      const orgData = await Organization.create({
        clientId: data.userId,
        orgName: data.orgName,
        orgCode: data.orgCode,
        phone: data.phone,
        orgEmail: data.orgEmail,
        address: data.address,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
        createdBy: data.userId,
        createdAt: createAt,
      });
      res.status(201).json({
        status: "Created",
        message: "Organization Created Successfully",
        orgData,
      });
    } else {
      res.status(208).json({
        message: "Organization Already Exist",
        existUser,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateOrganization(req, res, next) {
  try {
    const data = req.params.id;

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

    const updatedData = await Organization.findByIdAndUpdate(id, editData, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "Updated",
      message: "Organization Updated Successfully",
      updatedData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrganization(req, res, next) {
  try {
    const data = await Organization.find().populate("clientId");

    res.status(200).json({
      message: "Get All Organization Details Successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrganization(req, res, next) {
  try {
    const orgId = req.params.id;
    const data = await Organization.findOne({ _id: orgId }).populate(
      "clientId"
    );

    res.status(200).json({
      message: "Get Organization Details Successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export const deleteOrganization = deleteOne(Organization);
