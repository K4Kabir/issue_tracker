const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: String,
  assign: {
    type: Array,
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("Project", ProjectSchema);
