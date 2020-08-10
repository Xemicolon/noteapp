const http = require("http");
const url = require("url");
const { warning, info, success } = require("../Utils/logger");
const {
  homePage,
  createNotes,
  updateNote,
  getNote,
  getNotes,
  deleteNote,
  errorPage,
  addPage,
  updatePage,
  getNotePage,
  getNotesPage,
  getDeletePage
} = require("../Controllers/notes");

exports.server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  if (reqUrl.pathname === "/" && req.method === "GET") {
    homePage(req, res);
    info(200, req.method + " " + req.url);
  } else if (reqUrl.pathname === "/view" && req.method === "GET") {
    getNotePage(req, res);
    info(200, req.method + " " + req.url);
  } else if (reqUrl.pathname === "/view/all" && req.method === "GET") {
    getNotesPage(req, res);
    info(200, req.method + " " + req.url);
  } else if (reqUrl.pathname === "/delete" && req.method === "GET") {
    getDeletePage(req, res);
    info(200, req.method + " " + req.url);
  } else if (reqUrl.pathname === "/add" && req.method === "GET") {
    addPage(req, res);
    info(201, req.method + " " + req.url);
  } else if (reqUrl.pathname === "/update" && req.method === "GET") {
    updatePage(req, res)
    info(201, req.method + " " + req.url)
  } else if (reqUrl.pathname === "/note/add" && req.method === "POST") {
    createNotes(req, res);
    info(201, req.method + " " + req.url);
  } else if (reqUrl.pathname === "/note/update" && req.method === "POST"){
    updateNote(req, res)
    info(201, req.method + " " + req.url)
  } else if (reqUrl.pathname === "/note" && req.method === "GET") {
    getNote(req, res);
    info(201, req.method + " " + req.url);
  } else if (reqUrl.pathname === "/notes" && req.method === "GET") {
    getNotes(req, res);
    info(201, req.method + " " + req.url);
  } else if (reqUrl.pathname === "/note/delete" && req.method === "GET") {
    deleteNote(req, res);
    info(201, req.method + " " + req.url);
  } else {
    errorPage(req, res);
    warning(404, req.method + " " + req.url);
  }
});
