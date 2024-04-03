const http = require('http');
const url = require('url');
const { readArrayData, writeArrayData } = require('./arrayStorage');

// Load array data from file on server startup
readArrayData(data => {
  array2D = data;
  console.log('Array data loaded:', array2D);
});

// Create a server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;

  if (parsedUrl.pathname === '/write') {
    // Handle write operation
    const x = parseInt(query.x);
    const y = parseInt(query.y);
    const value = query.value;

    if (!isNaN(x) && !isNaN(y) && value !== undefined) {
      writeArrayData(value, x, y);
      console.log(`W [${x}, ${y}] => ${value}`);
      res.statusCode = 200;
      res.end("Write Success");
    } else {
      res.statusCode = 400;
      res.end('Missing parameters');
    }
  } else if (parsedUrl.pathname === '/read') {
    const x = parseInt(query.x);
    const y = parseInt(query.y);

    if (!isNaN(x) && !isNaN(y)) {
      const value = readArrayData(s, y);
      console.log(`R [${x}, ${y}] => ${value}`);
      res.statusCode = 200;
      res.end(value);
    } else {
      res.statusCode = 400;
      res.end('Missing parameters');
    }
  } else {
    res.statusCode = 404;
    res.end('Invalid path');
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
