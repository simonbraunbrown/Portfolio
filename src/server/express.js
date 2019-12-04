const express = require('express');
//var sass = require('node-sass');

const server = express();

const staticMiddleware = express.static('src');
server.use(staticMiddleware);
// server.use(
//     sass.middleware({
//         src: __dirname + '/styles/scss/', //where the sass files are 
//         dest: __dirname + '/public', //where css should go
//         debug: true, // obvious
//     })
// );
server.listen(8080, () => {
    console.log('server is running on http://localhost:8080');
})