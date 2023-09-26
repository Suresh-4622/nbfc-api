import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: [true, "User Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isFirst: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
  },
  token: {
    type: String,
  },
  lastLogin:{
    type: Date,
  },
});

userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

userSchema.set("autoIndex", true);

const user = model("User", userSchema);

export default user;
