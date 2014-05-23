'use strict';

var ext_parse_api_version = require('./uri-rewriter');
var process_table = require('./process-table');
var o = require('lodash');



module.exports = plugin;

function plugin(server, versions){
  o.each(process_table(server.table(), versions), server.route.bind(server));
  server.ext('onRequest', ext_parse_api_version(versions));
}