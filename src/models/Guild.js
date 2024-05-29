const { Schema, model } = require("mongoose");

const guildSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    iconHash: {
      type: String,
      default: null,
    },
    ticketsCategoryId: {
      type: String,
      default: null,
    },
    closedTicketsCategoryId: {
      type: String,
      default: null,
    },
    transcriptLogChannelId: {
      type: String,
      default: null,
    },
    modRoleIds: {
      type: [String],
      default: [],
    },
    pingRoleIds: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = model("Guild", guildSchema);
