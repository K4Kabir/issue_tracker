const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: "dtyehxt51",
  api_key: "115621867251468",
  api_secret: "hpvzH8vI3DFSwMItiUQ6v5kOcDQ",
});

module.exports = {
  uploadOnCloudinary: async function (localFilePath) {
    console.log(localFilePath, "path");
    try {
      if (!localFilePath) return null;

      const response = await cloudinary.v2.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
      console.log(response.url);
      return response;
    } catch (error) {
      console.log(error, "KABIR");
      fs.unlinkSync(localFilePath);
    }
  },
};
