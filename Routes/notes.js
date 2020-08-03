const http = require("http");
const url = require("url");
const { warning, info, success } = require("../Utils/logger");
const {
  homePage,
  createNotes,
  getNote,
  errorPage,
} = require("../Controllers/notes");

exports.notes = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  if (reqUrl.pathname === "/" && req.method === "GET") {
    homePage(req, res);
    info(200, req.method + " " + req.url);
  } else if (reqUrl.pathname === "/note" && req.method === "GET") {
    getNote(req, res);
    info(200, req.method + " " + req.url);
  } else if (reqUrl.pathname === "/note" && req.method === "POST") {
    createNotes(req, res);
    info(201, req.method + " " + req.url);
  } else {
    errorPage(req, res);
    warning(404, req.method + " " + req.url);
  }
});
