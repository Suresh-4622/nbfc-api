import mongoose from "mongoose";
const { Schema, model } = mongoose;

const loanSchema = new Schema({
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
  loanCode: {
    type: String,
    required: [true, "Loan Code is required"],
  },
  loanName: {
    type: String,
    required: [true, "Loan Name is required"],
  },
  loanInterest: {
    type: String,
    required: [true, "Loan Interest is required"],
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

loanSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

loanSchema.set("autoIndex", true);

const loan = model("Loan", loanSchema);

export default loan;
