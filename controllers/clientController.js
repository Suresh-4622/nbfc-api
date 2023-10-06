import Client from "../models/clientModel.js";
import User from "../models/userModel.js";
import moment from "moment-timezone";

export async function createClient(req, res, next) {
  try {
    const data = req.body;
    const checkExistClient = await Client.find({
      clientEmail: data.clientEmail,
    });

    if (checkExistClient.length === 0) {
      const date = Date.now();
      const createAt = moment(date).format("lll");

      const clientData = await Client.create({
        userId: data.userId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        language: data.language,
        desc: data.desc,
        address: data.address,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
        createdBy: data.userId,
        createdAt: createAt,
      });
      // update client status 
      const editData = {
         userType : 2,
      }
      const userUpdateData = await User.findByIdAndUpdate(data.userId ,editData,
        {
          new: true,
          runValidators: true,
        }
        );
      res.status(200).json({
        status: true,
        message: "Client Created Successfully"
      });
    } else {
      res.status(422).json({
        status: false,
        message: "Client Already Exist",
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

export async function updateClient(req, res, next) {
  try {
    const data = req.body;

    const date = Date.now();
    const updateAt = moment(date).format("lll");

    const missingFields = [];

    const requiredFields = ["clientId"];

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



    const editData = {
      userId: data.userId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      language: data.language,
      desc: data.desc,
      address: data.address,
      state: data.state,
      city: data.city,
      pincode: data.pincode,
      updatedBy: data.userId,
      updatedAt: updateAt,
    };

    const updatedData = await Client.findByIdAndUpdate(data.clientId, editData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: true,
      message: "Client Updated Successfully",
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


export async function getAllClient(req, res, next) {
  try {
    const data = await Client.find().populate("userId");

    res.status(200).json({
      status: "Success",
      message: "Get All Client Details Successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOneClient(req, res, next) {
  try {
    const clientId = req.query.clientId;
    const data = await Client.findOne({ _id: clientId }).populate("userId");

    if(data){
      res.status(200).json({
        status: true,
        data,
      });
    }else{
      res.status(422).json({
        status: false,
        message: "No Record Found This ClientId"
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function deleteOneClient(req, res, next){
  try{
    const clientId = req.query.clientId;

    const findData = await Client.findOne({_id: clientId});

    if(findData){
      const deleteData = await Client.findByIdAndDelete(clientId);

      res.status(200).json({
        status: true,
        message: "Client Deleted Successfully"
      });
    }else{
      res.status(422).json({
        status: false,
        message: "No Record Found This Id"
      });
    }
  }catch(err){
    next(err);
  }
}
