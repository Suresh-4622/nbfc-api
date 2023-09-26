import mongoose from "mongoose";
const { Schema, model } = mongoose;

const clientSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    clientName:{
      type: String,
      required: [true, "Client Name is required"],
    },
    clientEmail:{
      type: String,
      required: [true, "Client Email is required"],
    },
    clientPhone:{
      type: String,
      required: [true, "Client Pnone Number is required"],
    },
    language: {
      type: String,
    },
    desc:{
      type: String,
    },
    createdAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedAt:{
      type: Date,
    },
    updatedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
);

clientSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

clientSchema.set("autoIndex", true);

const client = model("Client", clientSchema);

export default client;
