const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://monochromatic:Monochromatic1!@cluster0.eayarzt.mongodb.net/"
    );
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
  }
}
