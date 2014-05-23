'use strict';

var o = require('lodash');
// var boom = require('hapi').boom; TODO, see below



module.exports = create_parser;

function create_parser(versions){

  // Parse the API version from a request
  //
  return function request_versioner(request, next){
    var v;

    if ((v = from_headers(request))) {
      set_uri(v, request);
      return next();
    }

    if (from_uri(request)) return next();

    // else
    // TODO assume bleeding edge is being requested
    set_uri(o.max(versions), request);
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

function set_uri(v, req){
  req.setUrl('/v'+ v + req.url.path);
  return req;
}


var re = require('./re');

// Parse the API version from the URI
//
function parse_uri_api_version(uri){
  var results = uri.match(re.v_uri);
  if (results){
    return parseInt(results[1], 10);
  } else {
    return null;
  }
}



// Parse the API verison from the Accept header
//
function parse_header_api_version(header){
  var results = header.match(re.v_ah);
  if (header && results) {
    return parseInt(results[1], 10);
  } else {
    return null;
  }
}