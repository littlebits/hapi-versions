'use strict';

var o = require('lodash');
var ext_parse_api_version = require('./lib/uri-rewriter');
var process_table = require('./lib/process-table');



module.exports = plugin;

function plugin(server, versions){
  o.each(process_table(server.table(), versions), server.route.bind(server));
  server.ext('onRequest', ext_parse_api_version(versions));
}