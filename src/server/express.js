const express = require('express');
const server = express();

const staticMiddleware = express.static('src');
server.use(staticMiddleware);
server.listen(8080, () => {
    console.log('server is running');
})