const fs = require("fs");
const { Note, errorResponse, successResponse } = require("../Utils/noteFn");
const path = require("path");
const url = require("url");

exports.homePage = async (req, res) => {
  const filePath = path.join(__dirname, "../Views");
  fs.readFile(filePath + `/index.htm`, "UTF-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.end(data);
    }
  });
};

exports.addPage = async (req, res) => {
  const filePath = path.join(__dirname, "../Views");
  fs.readFile(filePath + `/add.htm`, "UTF-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.end(data);
    }
  });
};

exports.updatePage = async (req, res) => {
  const filePath = path.join(__dirname, "../Views");
  fs.readFile(filePath + `/update.htm`, "UTF-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.end(data);
    }
  });
};

exports.getNotePage = async (req, res) => {
  const filePath = path.join(__dirname, "../Views");
  fs.readFile(filePath + `/note.htm`, "UTF-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.end(data);
    }
  });
};

exports.getNotesPage = async (req, res) => {
  const filePath = path.join(__dirname, "../Views");
  fs.readFile(filePath + `/notes.htm`, "UTF-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.end(data);
    }
  });
};

exports.getDeletePage = async (req, res) => {
  const filePath = path.join(__dirname, "../Views");
  fs.readFile(filePath + `/delete.htm`, "UTF-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.end(data);
    }
  });
};

exports.errorPage = async (req, res) => {
  req.statusCode = 404;
  const filePath = path.join(__dirname, "../Views");
  try {
    fs.readFile(filePath + "/error.htm", "UTF-8", (err, page) => {
      if (err) {
        console.log(err);
      }
      res.end(page);
    });
  } catch (err) {
    console.log(err);
  }
};

// create notes
exports.createNotes = async (req, res) => {
  Note(req, (data) => {
    try {
      if (
        data.title.length === 0 ||
        data.description.length === 0 ||
        data.directory.length === 0
      ) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "text/html");
        res.end(`
      <h1 style="text-align: center; margin-top: 120px; color: red;">Oh No! Something happened</h1>
      <h3 style="text-align: center; margin-top: 60px; color: red;">You need to fill in all the fields!</h3>
      <h3 style="margin-top: 60px; text-align: center;"><a href="/add" >Take me back</a></h3>
      `);
      }

      if (!fs.existsSync(data.directory)) {
        fs.mkdirSync(`Database/${data.directory}`, {
          recursive: true,
          mode: 0o77,
        });
      }

      let directory = data.directory;
      const title = path.join(
        __dirname,
        `../Database/${directory}/${data.title}.txt`
      );

      if (data.title.length !== 0 && !fs.existsSync(title)) {
        fs.writeFileSync(
          `Database/${directory}/${data.title}.txt`,
          `${data.description}\n`,
          "UTF-8"
        );
        res.statusCode = 201;
        res.setHeader("Content-Type", "text/html");
        res.end(`<h1>Note successfully created!</h1>
        <h3>Saved Directory: Database/${data.directory}/${data.title}</h3> 
        <h3>Name of Note: ${data.title}</h3>
        <h3>Content: ${data.description}</h3>     
        <a href="/add">Go back</a> or <a href="/">Go home</a>`);
      } else {
        res.end(
          `<h1>Name ${data.title} already exists in ${data.directory} folder!</h1> <br /> <a href="/add">Go back</a> or <a href="/">Go home</a>`
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
};

// update note
exports.updateNote = async (req, res) => {
  Note(req, (data) => {
    try {
      if (
        data.title.length === 0 ||
        data.description.length === 0 ||
        data.directory.length === 0
      ) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "text/html");
        res.end(`
        <h1 style="text-align: center; margin-top: 120px; color: red;">Oh No! Something happened</h1>
        <h3 style="text-align: center; margin-top: 60px; color: red;">You need to fill in all the fields!</h3>
      <h3 style="margin-top: 60px; text-align: center;"><a href="/update" >Take me back</a></h3>
      `);
      }

      const title = path.join(
        __dirname,
        `../Database/${data.directory}/${data.title}.txt`
      );

      if (fs.existsSync(title)) {
        fs.appendFileSync(
          `Database/${data.directory}/${data.title}.txt`,
          `${data.description}\n`,
          "UTF-8"
        );
        res.statusCode = 201;
        res.setHeader("Content-Type", "text/html");
        res.end(`<h1>Note succesffully updated!</h1>
        <p>Directory: ${data.directory}</p>
        <p>Name of Note: ${data.title}</p>
        <p>Content: ${data.description}</p> 
        <a href="/add">Go back</a> or <a href="/">Go home</a>`);
      } else {
        res.end(
          `<div style="margin: auto; text-align: center;"><h1>Note or folder doesn't exist!</h1> <br /> <a href="/update">Go back</a> or <a href="/">Go home</a></div>`
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
};

// get and read note in a directory
exports.getNote = async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const reqUrl = url.parse(req.url, true);
  const filePath = path.join(__dirname, "../Database");

  try {
    if (!reqUrl.query.directory || !reqUrl.query.title) {
      res.statusCode = 400;
      let response = errorResponse();
      res.end(
        `<h1>Fields cannot be empty</h1>  <br /> <a href="/view">Go back</a>`
      );
    }
    const data = fs.readFileSync(
      filePath + `/${reqUrl.query.directory}/${reqUrl.query.title}.txt`
    );
    res.end(`<h1>Note details:</h1> 
    <br /> 
    <h3>FolderName: /Database/${reqUrl.query.directory}</h3>
    <h3>FileName: /Database/${reqUrl.query.title}.txt</h3>
    <h3>Content: ${data.toString()}</h3>
    <a href="/view">Go back</a>`);
  } catch (err) {
    res.statusCode = 404;
    res.end(`<div style="margin: auto; text-align: center;"><h1>No such file or directory exists!</h1>
    <a href="/view">Go back</a> or <a href="/">Go home</a></div>`);
  }
};

// get all notes 
exports.getNotes = async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const reqUrl = url.parse(req.url, true);
  const filePath = path.join(__dirname, "../Database");

  try {
    if (!reqUrl.query.directory) {
      res.statusCode = 400;
      res.end(
        `<div style="margin: auto; text-align: center;"><h1>Field cannot be empty</h1>  <br /> <a href="/view/all">Go back</a></div>`
      );
    }
    const data = fs.readdirSync(filePath + `/${reqUrl.query.directory}`);
    res.end(`
    <h3>Folder: /${reqUrl.query.directory}</h3>
    <h3>Number of Notes: ${data.length}</h3>
    <h3>Notes: </h3><p>${data.toString()}</p>
    <a href="/view/all">Go back</a> or <a href="/">Go home</a>
    `);
  } catch (err) {
    res.statusCode = 404;
    res.end(`<div style="margin: auto; text-align: center;"><h1>Directory doesn't exist!</h1>
    <a href="/view/all">Go back</a> or <a href="/">Go home</a></div>`);
  }
};

// delete note
exports.deleteNote = async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const reqUrl = url.parse(req.url, true);
  const filePath = path.join(__dirname, "../Database");

  try {
    if (!reqUrl.query.directory || !reqUrl.query.title) {
      res.statusCode = 400;
      res.end(
        `<h1>Fields cannot be empty</h1>  <br /> <a href="/delete">Go back</a>`
      );
    }
    fs.unlinkSync(
      filePath + `/${reqUrl.query.directory}/${reqUrl.query.title}.txt`
    );
    const data = fs.readdirSync(filePath + `/${reqUrl.query.directory}`);
    res.write(`<h1>File successfully deleted!</h1>
    <h3>Folder: /${reqUrl.query.directory}</h3>
    <h3>Number of Notes: ${data.length}</h3>
    <h3>Notes: </h3><p>${data.toString()}</p>
    `);
    if(data.length === 0){
      fs.rmdirSync(filePath + `/${reqUrl.query.directory}`)
      res.write(`<p>Folder has been succesffully deleted because it is empty.</p>`)
    }
    res.write(`<a href="/delete">Go back</a> or <a href="/">Go home</a>`)
    res.end()
  } catch (err) {
    console.log(err);
    res.statusCode = 404;
    res.end(`<div style="margin: auto; text-align: center;"><h1>Directory or file doesn't exist!</h1>
    <a href="/delete">Go back</a> or <a href="/">Go home</a></div>`);
  }
};
