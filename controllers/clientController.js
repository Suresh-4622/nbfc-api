import Client from "../models/clientModel.js";
import User from "../models/userModel.js";
import { getAll, getOne, deleteOne } from "./baseController.js";
import moment from "moment-timezone";

export async function createClient(req, res, next) {
  try {
    const data = req.body;

    const existUser = await Client.find({
      clientEmail: data.clientEmail
    });

    if (existUser.length === 0) {
      const date = Date.now();
      const createAt = moment(date).format("lll");

      const clientData = await Client.create({
        userId: data.userId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        language: data.language,
        desc: data.desc,
        createdBy: data.userId,
        createdAt: createAt,
      });
      res.status(201).json({
        status: "Created",
        message: "Client Created Successfully",
        clientData,
      });
    } else {
      res.status(208).json({
        message: "Client Already Exist",
        existUser,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateClient(req, res, next) {
  try {
    const data = req.params.id;

    const date = Date.now();
    const updateAt = moment(date).format("lll");

    const editData = {
      userId: data.userId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      language: data.language,
      desc: data.desc,
      updatedBy: data.userId,
      updatedAt: updateAt,
    };

    const updatedData = await Client.findByIdAndUpdate(id, editData, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "Updated",
      message: "Client Updated Successfully",
      updatedData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllClientDetails(req, res, next){
  try{
    const data = await Client.find().populate("userId");

    res.status(200).json({
      message: "Get All Client Details Successfully",
      data,
    });

  }catch(err){
    next(err);
  }
}

export async function getClientDetail(req, res, next){
  try{

    const clientId = req.params.id;
     const data = await Client.findOne({_id: clientId }).populate("userId");

    res.status(200).json({
      message: "Get Client Details Successfully",
      data,
    });

  }catch(err){
    next(err);
  }
}
export const deleteClientDetails = deleteOne(Client);
