import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema({
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
  branchId: {
    type: String,
    ref: "Branch",
  },
  productCode: {
    type: String,
    required: [true, "Product Code is required"],
  },
  productName: {
    type: String,
    required: [true, "Product Name is required"],
  },
  category: {
    type: String,
    required: [true, "Product Category is required"],
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

productSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

productSchema.set("autoIndex", true);

const product = model("Product", productSchema);

export default product;
