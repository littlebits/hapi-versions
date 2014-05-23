'use strict';

var o = require('lodash');
var ver = require('./v');
var boom = require('boom');



module.exports = create_parser;

function create_parser(versions){

  // Parse the API version from a r
  //
  return function r_versioner(r, next){
    var v = from_headers(r);
    var v_ = from_uri(r);

    if (v && v_ && (v !== v_)) return next(boom.badRequest('Version mismatch between URI and Accept Header.'));

    if (v) {
      r.setUrl(ver.replace(v, r.url.path));
      return next();
    }

    if (v_) return next();

    // else
    // TODO assume bleeding edge is being red
    r.setUrl(ver.replace(o.max(versions), r.url.path));
    next();
    // TODO cases that should return an invalid version error
    // next(boom.badRequest('Missing valid Accept header with specified API version. Need help? See https://developer.littlebitscloud.cc/api-rest#version'))
  };
}



function from_headers(req){
  // Request 'Accept' header might have the version
  // specified which we should honour and read from:
  var header = req.raw.req.headers.accept;
  return header ? parse_header_api_version(header) : null ;
}

function from_uri(req){
  return parse_uri_api_version(req.url.path);
}



// Parse the API version from the URI
//
function parse_uri_api_version(uri){
  var results = uri.match(ver.re_uri);
  if (results){
    return parseInt(results[1], 10);
  } else {
    return null;
  }
}



// Parse the API verison from the Accept header
//
function parse_header_api_version(header){
  var results = header.match(ver.re_ah);
  if (header && results) {
    return parseInt(results[1], 10);
  } else {
    return null;
  }
}