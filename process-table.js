'use strict';
var o = require('lodash');

// TODO get from which source?
var versions = [1, 1.1, 2, 3];



module.exports = process_table;





function process_table(routes){
  var vrs2 = route_versions(routes);
  // console.log(vrs2);

  var vrs3 = o.map(vrs2, find_holes);
  // console.log(vrs3);

  var vrs4 = to_settings(vrs3);
  // console.log(vrs4);

  return vrs4;
}



function route_versions(routes){
  var vrs1 = o.groupBy(routes, function(r){
    return strip_version(r.path) +':'+ r.method;
  });

  return o.map(vrs1, function(rs){
    return o.transform(rs, function(_rs, r){
      _rs[extract_version(r) || -1] = r.settings;
    }, {});
  });
}

/* Convert a list of route-versions specific
to filling gaps in the api versioning. It returns
a flat list of routes whose .path property reflects the new
version.*/
function to_settings(vrs3){
  return o.flatten(o.map(vrs3, do_to_settings));
  function do_to_settings(vr3){
    return o.map(vr3, function(r3, v){
      return {
        path:  replace_version(v, r3.path),
        method: r3.method,
        config: o.omit(r3, 'method', 'path')
      };
    });
  }
}



function find_holes(vr2){
  var av = applicable_versions(vr2, versions);

  /* Fill route definitions for new versions
  from old versions. We iterate down from master */
  return o.foldr(av, do_fold, {});

  function do_fold(acc, v, i){
    /* If there is no route definition for
    this api version, search for a definition
    in a paste version. */
    if (!vr2[v]) {
      acc[v] = find_past_definition(vr2, av.slice(0, i));
    }
    return acc;
  }
}

function find_past_definition(vr2, av){
  for (var i=av.length-1;  i>=0;  i--) {
    // console.log('search old definition:', j, av[j], vr2[av[j]]);
    // console.log(v, i, av, av[i], vr2);
    if (vr2[av[i]]) return vr2[av[i]];
  }

  /* If there is no past definition,
  then look for the 'nothing' version
  (an un-versioned definition). */
  if (vr2[-1]) return vr2[-1];

  /* If we cannot find a suitable route
  for this version let the user know by
  throwing. */
  console.error('\nError: Cannot find definition to fill v\n', vr2, av);
  throw new Error('Cannot fill gap');
}



// Find the applicable range of versions
// of given route. Routes apply only from
// the version they were introduced and onward.

function applicable_versions(vr, all_versions){
  var fv = v_first(vr);
  if (fv === -1) return all_versions;

  var i = all_versions.indexOf(fv);
  if (~i) return all_versions.slice(i);

  throw new Error('Cannot resolve applicable version set');
}

function v_first(vr){
  return o.min(o.map(o.keys(vr), function(n){
    return parseInt(n, 10);
  }));
}



// Helpers to work with route version
var re = require('./re');

function replace_version(v, path){
  return '/v' + v + strip_version(path);
}

function extract_version(r){
  var v;
  return (v = r.path.match(re.v_uri)) && v[1];
}

function strip_version(path){
  return path.replace(RegExp('/'+ re.v_pat), '');
}