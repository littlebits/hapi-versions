
var pat_v = 'v(\\d[\\d|\\.]*)';
var pat_v_ah = '.*\\/vnd.littlebits.'+ pat_v +'\\+json';
var pat_v_uri = '\\/'+ pat_v +'(?:\\/.*)*';

var v_re = RegExp(pat_v);
var v_re_uri = RegExp(pat_v_uri);
var v_re_ah = RegExp(pat_v_ah);


function v_replace(v, path){
  return '/v' + v + v_strip(path);
}

function v_extact(path){
  var v;
  return (v = path.match(v_re_uri)) && v[1];
}

function v_strip(path){
  return path.replace(RegExp('/'+ pat_v), '');
}



exports.replace = v_replace;
exports.extract = v_extact;
exports.strip = v_strip;
exports.re = v_re;
exports.re_uri = v_re_uri;
exports.re_ah = v_re_ah;
