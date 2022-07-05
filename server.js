const http = require("http");
const colors = require("colors");
const qs = require('querystring');
const url = require('url');
const toDo = require('./src/toDo');

const port = process.env.PORT || 3000;


const server = http.createServer((req, res) => {
    if(req.method === 'GET'){
        return handleGetReq(req, res);
    }else if(req.method === 'POST'){
        return handlePostReq(req, res);
    }else if(req.method === 'DELETE'){
        return handleDeleteReq(req, res);
    }
    res.end(`{"Error": "${http.STATUS_CODES[404]}"}`.red);
});


// Handlers

const handleGetReq = (req, res) =>{
    const {pathname} = url.parse(req.url);
    console.log(pathname);
    if(pathname !== '/'){
        return handleError(res, 404);
    }
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(toDo.getToDo()));
}

const handlePostReq = (req, res) =>  {

    const size = parseInt(req.headers['content-length'], 10)
    const buffer = Buffer.allocUnsafe(size)
    var pos = 0

    const { pathname } = url.parse(req.url)
    if (pathname !== '/create') {
        return handleError(res, 404)
    }

    req 
    .on('data', (chunk) => { 
      const offset = pos + chunk.length 
      if (offset > size) { 
        reject(413, 'Too Large', res) 
        return 
      } 
      chunk.copy(buffer, pos) 
      pos = offset 
    }) 
    .on('end', () => { 
      if (pos !== size) { 
        reject(400, 'Bad Request', res) 
        return 
      } 

      const data = JSON.parse(buffer.toString())
      
      toDo.createToDo(data.tittle, data.description, data.status);
      const item = toDo.getToDo().length-1;
      res.setHeader('Content-Type', 'application/json;charset=utf-8');
      res.end('You Posted: ' + JSON.stringify(toDo.getToDo()[item]));
    })
};


const handleDeleteReq = (req, res) => {
    const { pathname, query } = url.parse(req.url);
    if (pathname !== `/task`) {
        return handleError(res, 404)
    }
    const { id } = qs.parse(query);
    const user = toDo.getToDo()[id-1];
    console.log(user);
    toDo.deleteToDo(id);
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.end(`{"userDeleted": ${JSON.stringify(user)}}`);
}

const handleError = (res, code) => { 
    res.statusCode = code 
    res.end(`{"error": "${http.STATUS_CODES[code]}"}`) 
} 



server.listen(port, () => {
    toDo.initialize();
    console.log(`Server is running on port: ${port}`.green); 
});