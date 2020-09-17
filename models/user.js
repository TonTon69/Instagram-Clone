const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/din6v2it9/image/upload/v1600175844/images_mtckej.png",
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model("User", userSchema);
