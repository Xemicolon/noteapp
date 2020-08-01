const http = require('http')
const url = require('url')
const { warning, info, success} = require('../Utils/logger')
const {homePage, createNotes, getNote} = require('../Controllers/notes')


exports.notes = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    if(reqUrl.pathname === '/' && req.method === 'GET'){
        info(200, req.method + ' ' + req.url);
        homePage(req, res)
    } else if (reqUrl.pathname === '/note' && req.method === "GET"){
        info(200, req.method + ' ' + req.url);
        getNote(req, res)
    } else if (reqUrl.pathname === '/note' && req.method === "POST"){
        info(201, req.method + ' ' + req.url);
        createNotes(req, res)
    }
})