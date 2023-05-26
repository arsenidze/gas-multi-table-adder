const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/data') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const jsonData = JSON.parse(body);
        fs.writeFile('mock.json', JSON.stringify(jsonData), (err) => {
          if (err) {
            console.error(err);
            res.statusCode = 500;
            res.end('Internal Server Error');
          } else {
            res.statusCode = 200;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end('Data stored successfully');
          }
        });
      } catch (err) {
        console.error(err);
        res.statusCode = 400;
        res.end('Invalid JSON data');
      }
    });
  } else if (req.method === 'GET' && req.url === '/data') {
    fs.readFile('mock.json', (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
