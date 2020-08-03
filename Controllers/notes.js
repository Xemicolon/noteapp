const fs = require("fs");
const {
  createNote,
  errorResponse,
  successResponse,
} = require("../Utils/noteFn");
const path = require("path");
const url = require("url");

exports.homePage = async (req, res) => {
  req.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(
    `<h1 style="text-align: center; margin-top: 150px;">Welcome to my Notes App!</h1>
    <h3 style="text-align: center; margin: 50px 0;">CREATE A NEW NOTE USING THE FORM BELOW</h3>
    <div style="width: 300px; margin: auto">
    <form style="display: grid;" action="/note" method="POST">
    <label style="margin-bottom: 10px;">File (Name of your note file)</label>
    <input type="text" name="title" placeholder="Name of your note file" style="padding: 12px; margin-bottom: 20px" />
    <label style="margin-bottom: 10px;">Directory (Where you want your note saved to)</label>
    <input type="text" name="directory" placeholder="Enter the name of directory" style="padding: 12px; margin-bottom: 20px" />
    <label style="margin-bottom: 10px;">Description (Content of your note)</label>
    <textarea name="description" rows="4" style="padding: 12px; margin-bottom: 20px" placeholder="Enter your note here"></textarea>
    <button style="background-color: #7ac47a; padding: 10px; color: #fff; cursor: pointer; font-size: 20px; font-weight: 600;" type="submit">Create Note</button>
    </form>
    </div>
    `
  );
};

// create notes
exports.createNotes = async (req, res) => {
  createNote(req, (data) => {
    try {
      if (
        data.title === undefined ||
        data.description === undefined ||
        data.directory === undefined
      ) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        const response = errorResponse();
        return res.end(JSON.stringify(response));
      }
      if (
        data.title.length === 0 ||
        data.description.length === 0 ||
        data.directory.length === 0
      ) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "text/html");
        res.end(`
      <h1 style="text-align: center; margin-top: 120px;">Oh No! Something happened</h1>
      <h3 style="text-align: center; margin-top: 60px;">Title, Directory and Description fields cannot be empty!</h3>
      <h3 style="margin-top: 60px; text-align: center;"><a href="/" >Take me back</a></h3>
      `);
      }

      if (!fs.existsSync(data.title)) {
        fs.mkdirSync(`Database/${data.directory}`, {
          recursive: true,
          mode: 0o77,
        });
      }
      res.statusCode = 201;
      const response = {
        success: true,
        title: data.title,
        directory: data.directory,
        description: data.description,
      };
      res.end(JSON.stringify(response));
      let directory = data.directory;
      if (data.title.length !== 0) {
        fs.appendFileSync(
          `Database/${directory}/${data.title}.txt`,
          `${data.description}\n`,
          "utf8"
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
};

// get and read note in a directory
exports.getNote = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const reqUrl = url.parse(req.url, true);
  const filePath = path.join(__dirname, "../Database");

  try {
    if (!reqUrl.query.directory || !reqUrl.query.title) {
      res.statusCode = 400;
      let response = errorResponse();
      res.end(JSON.stringify(response));
    }
    const data = fs.readFileSync(
      filePath + `/${reqUrl.query.directory}/${reqUrl.query.title}.txt`
    );

    let folderName =
      filePath + `/${reqUrl.query.directory}/${reqUrl.query.title}.txt`;
    let fileName = `${reqUrl.query.title}.txt`;
    const response = successResponse(folderName, fileName, data.toString());
    res.end(JSON.stringify(response));
  } catch (err) {
    res.statusCode = 404;
    const response = {
      error: `No such file or directory exists`,
      folderName:
        filePath + `/${reqUrl.query.directory}/${reqUrl.query.title}.txt`,
    };
    res.end(JSON.stringify(response));
  }
};

exports.errorPage = async (req, res) => {
  req.statusCode = 404;
  res.setHeader("Content-Type", "text/html");
  res.end(`<h1 style="text-align: center; margin-top: 250px;">HOW DID YOU GET HERE?</h1>
      <h1 style="text-align: center;"><a href="/" style="font-size: 24px;">Take me back</a></h1>
      `);
};
