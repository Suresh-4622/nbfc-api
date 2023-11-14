import Product from "../models/productModel.js";
import moment from "moment-timezone";

export async function createProduct(req, res, next) {
  try {
    const data = req.body;

    const missingFields = [];

    const requiredFields = ["productCode", "productName", "category"];
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

    const checkExistProduct = await Product.find({
      productCode: data.productCode,
      orgId: data.orgId,
    });

    if (checkExistProduct.length === 0) {
      const date = Date.now();
      const createAt = moment(date).format("lll");

      const createProduct = await Product.create({
        userId: data.userId,
        clientId: data.clientId,
        orgId: data.orgId,
        branchId: data.branchId,
        productCode: data.productCode,
        productName: data.productName,
        category: data.category,
        createdBy: data.userId,
        createdAt: createAt,
      });

      res.status(200).json({
        status: true,
        message: "Product Created Successfully",
      });
    } else {
      res.status(422).json({
        status: false,
        message: "Product Already Exist",
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

export async function updateProduct(req, res, next) {
  try {
    const data = req.body;
    const missingFields = [];

    const requiredFields = ["productCode", "productName", "category"];

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
      productCode: data.productCode,
      productName: data.productName,
      category: data.category,
      updatedBy: data.userId,
      updatedAt: updateAt,
    };

    const updatedData = await Product.findByIdAndUpdate(
      data.productId,
      editData,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: true,
      message: "Product Updated Successfully",
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
export async function getAllProduct(req, res, next) {
  try {
    const datas = req.body;
    const data = await Product.find({ orgId: datas.orgId }).populate({
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
      message: "Get All Product Successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOneProduct(req, res, next) {
  try {
    const productId = req.query.productId;
    const data = await Product.findOne({ _id: productId }).populate({
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

export async function deleteProduct(req, res, next) {
  try {
    const productId = req.query.productId;

    const findData = await Product.findOne({ _id: productId });

    if (findData) {
      const deleteData = await Product.findByIdAndDelete(productId);

      res.status(200).json({
        status: true,
        message: "Product Deleted Successfully",
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
