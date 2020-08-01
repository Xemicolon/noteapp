const fs = require("fs");
const { parse } = require("querystring");
const path = require("path");

exports.createNote = (req, res) => {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";
  if (req.headers["content-type"] === FORM_URLENCODED) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      res(parse(body));
    });
  } else {
    let body = "";
    res(parse(body));
  }
};

function readData(err, data) {
  console.log(data);
}
exports.getFile = (folder, file) => {
  const folderName = "../" + folder;
  const directoryPath = path.join(__dirname, folderName);
  fs.readFileSync(`${directoryPath}/${file}`, "utf-8", readData);
};

exports.errorResponse = () => {
  return {
    success: false,
    error: `Title, Directory and Description fields are required!`,
    title: "Field doesn't exist or is empty",
    directory: "Field doesn't exist or is empty",
    description: "Field doesn't exist or is empty",
  };
};

exports.successResponse = (directory, title, description) => {
  return {
    success: true,
    directory: directory,
    title: title,
    description: description,
  };
};
