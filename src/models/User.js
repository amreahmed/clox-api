const { Schema, model, models } = require("mongoose");

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    global_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatarHash: {
      type: String,
      default: null,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = models.User || model("User", userSchema);
