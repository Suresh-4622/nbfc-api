import Organization from "../models/orgModel.js";
import moment from "moment-timezone";

export async function createOrganization(req, res, next) {
  try {
    const data = req.body;
    const mName = new RegExp(["^", data.orgName, "$"].join(""), "i");
    const checkExistOrg = await Organization.find({
      clientId: data.clientId,
      orgName: mName,
    });

    if (checkExistOrg.length === 0) {
      const date = Date.now();
      const createAt = moment(date).format("lll");

      const orgData = await Organization.create({
        clientId: data.clientId,
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
      res.status(200).json({
        status: true,
        message: "Organization Created Successfully",
      });
    } else {
      res.status(422).json({
        status: false,
        message: "Organization Already Exist",
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

export async function updateOrganization(req, res, next) {
  try {
    const data = req.body;

    const missingFields = [];

    const requiredFields = ["orgId"];

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

    const updatedData = await Organization.findByIdAndUpdate(
      data.orgId,
      editData,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: true,
      message: "Organization Updated Successfully",
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

export async function getAllOrganization(req, res, next) {
  try {
    const datas = req.body;
    const data = await Organization.find({ clientId: datas.clientId }).populate(
      {
        path: "clientId",
        populate: {
          path: "userId",
          model: "User",
        },
      }
    );

    const missingFields = [];
    const requiredFields = ["clientId"];

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
      message: "Get All Organization Successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOneOrganization(req, res, next) {
  try {
    const orgId = req.query.orgId;
    const data = await Organization.findOne({ _id: orgId }).populate({
      path: "clientId",
      populate: {
        path: "userId",
        model: "User",
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

export async function deleteOrganization(req, res, next) {
  try {
    const orgId = req.query.orgId;

    const findData = await Organization.findOne({ _id: orgId });

    if (findData) {
      const deleteData = await Organization.findByIdAndDelete(orgId);

      res.status(200).json({
        status: true,
        message: "Organization Deleted Successfully",
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
