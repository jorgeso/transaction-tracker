"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var compression = require("compression");
var path = require("path");
var helmet = require("helmet");
// HTTP API
var app = express();
var port = process.env.PORT || 8000;
app.use(helmet());
app.use(compression());
app.use('/', express.static(path.join(__dirname, 'dist')));
app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});
var httpServer = app.listen(port, function () {
    var _a = httpServer.address(), address = _a.address, port = _a.port;
    console.log('Listening on %s %s', address, port);
});
//# sourceMappingURL=server.js.map