import Loan from "../models/loanModel.js";
import moment from "moment-timezone";

export async function createLoan(req, res, next) {
  try {
    const data = req.body;

    const missingFields = [];

    const requiredFields = ["loanCode", "loanName", "loanInterest"];
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

    const checkExistLoan = await Loan.find({
      loanCode: data.loanCode,
      orgId: data.orgId,
    });

    if (checkExistLoan.length === 0) {
      const date = Date.now();
      const createAt = moment(date).format("lll");

      const createLoan = await Loan.create({
        userId: data.userId,
        clientId: data.clientId,
        orgId: data.orgId,
        branchId: data.branchId,
        loanCode: data.loanCode,
        loanName: data.loanName,
        loanInterest: data.loanInterest,
        createdBy: data.userId,
        createdAt: createAt,
      });

      res.status(200).json({
        status: true,
        message: "Loan Created Successfully",
      });
    } else {
      res.status(422).json({
        status: false,
        message: "Loan Already Exist",
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

export async function updateLoan(req, res, next) {
  try {
    const data = req.body;
    const missingFields = [];

    const requiredFields = ["loanCode", "loanName", "loanInterest"];

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
      branchId: data.branchId,
      loanCode: data.loanCode,
      loanName: data.loanName,
      loanInterest: data.loanInterest,
      updatedBy: data.userId,
      updatedAt: updateAt,
    };

    const updatedData = await Loan.findByIdAndUpdate(data.loanId, editData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: true,
      message: "Loan Updated Successfully",
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
export async function getAllLoan(req, res, next) {
  try {
    const datas = req.body;
    const data = await Loan.find({ orgId: datas.orgId }).populate({
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
      message: "Get All Loan Successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOneLoan(req, res, next) {
  try {
    const loanId = req.query.loanId;
    const data = await Loan.findOne({ _id: loanId }).populate({
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

export async function deleteLoan(req, res, next) {
  try {
    const loanId = req.query.loanId;

    const findData = await Loan.findOne({ _id: loanId });

    if (findData) {
      const deleteData = await Loan.findByIdAndDelete(loanId);

      res.status(200).json({
        status: true,
        message: "Loan Deleted Successfully",
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
