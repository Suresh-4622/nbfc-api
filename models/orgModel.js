import mongoose from "mongoose";
const { Schema, model } = mongoose;

const orgSchema = new Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orgName:{
      type: String,
      required: [true, "Organization Name is required"],
    },
    orgCode:{
      type: String,
      required: [true, "Organization Code is required"],
    },
    phone:{
        type: String,
        required: [true, "Organization phone is required"],
    },
    orgEmail: {
        type: String,
        required: [true, "Organization email is required"],
    },
    address:{
      type: String,
      required: [true, "Organization address is required"],
    },
    state: {
      type: String,
      required: [true, "Organization state is required"],
    },
    city:{
      type: String,
      required: [true, "Organization city is required"],
    },
    pincode: {
      type: Date,
      required: [true, "Organization pincode is required"],
    },
   
    createdAt:{
        type: Date,
    },
    createdBy: {
      type: Date,
    },
    updatedAt:{
      type: Date,
    },
    updatedBy:{
      type: Date,
    },
  },
);

orgSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

orgSchema.set("autoIndex", true);

const organization = model("Organization", orgSchema);

export default organization;
