'use strict';

var ext_parse_api_version = require('./lib/uri-rewriter');



module.exports = plugin;

function plugin(server, versions, ignore){
  server.ext('onRequest', ext_parse_api_version(versions, ignore));
}