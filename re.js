'use strict';

var pat_v = 'v(\\d[\\d|\\.]*)';
var pat_v_ah = '.*\\/vnd.littlebits.'+ pat_v +'\\+json';
var pat_v_uri = '\\/'+ pat_v +'(?:\\/.*)*';

exports.v = RegExp(pat_v);
exports.v_uri = RegExp(pat_v_uri);
exports.v_ah = RegExp(pat_v_ah);