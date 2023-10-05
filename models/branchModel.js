import mongoose from "mongoose";
const { Schema, model } = mongoose;

const branchSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  branchName: {
    type: String,
    required: [true, "Branch Name is required"],
  },
  branchCode: {
    type: String,
    required: [true, "Branch Code is required"],
  },
  branchPhone: {
    type: String,
    required: [true, "Branch phone is required"],
  },
  branchEmail: {
    type: String,
    required: [true, "Branch email is required"],
  },
  address: {
    type: String,
    required: [true, "Branch address is required"],
  },
  state: {
    type: String,
    required: [true, "Branch state is required"],
  },
  city: {
    type: String,
    required: [true, "Branch city is required"],
  },
  pincode: {
    type: Date,
    required: [true, "Branch pincode is required"],
  },
  createdAt: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

branchSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

branchSchema.set("autoIndex", true);

const branch = model("Branch", branchSchema);

export default branch;
