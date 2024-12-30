// import { expressions } from "./expressions.js";
// import { data } from "./data.js";
const expressions = require('./expressions.js')
const data = require('./data.js');
let MAX_LENGTH = 2048,
  MIN_LENGTH = 10,
  MAX_DIFFERENCE = 300,
  own = {}.hasOwnProperty,
  script,
  numericData = {};
for (script in data)
  if (own.call(data, script)) {
    let r = data[script],
      l;
    for (l in ((numericData[script] = {}), r))
      if (own.call(r, l)) {
        let n = r[l].split("|"),
          t = {},
          e = n.length;
        for (; e--; ) t[n[e]] = e;
        numericData[script][l] = t;
      }
  }
function franc(n, t) {
  return francAll(n, t)[0][0];
}
function francAll(n, t = {}) {
  var e = [...(t.whitelist || []), ...(t.only || [])],
    r = [...(t.blacklist || []), ...(t.ignore || [])],
    t = null != t.minLength ? t.minLength : MIN_LENGTH;
  return !n || n.length < t
    ? und()
    : (t = getTopScript((n = n.slice(0, MAX_LENGTH)), expressions))[0] &&
      t[0] in numericData
    ? normalize(n, getDistances(asTuples(n), numericData[t[0]], e, r))
    : t[0] && 0 !== t[1] && allow(t[0], e, r)
    ? singleLanguageTuples(t[0])
    : und();
}
function normalize(n, t) {
  var e = t[0][1],
    r = n.length * MAX_DIFFERENCE - e;
  let l = -1;
  for (; ++l < t.length; ) t[l][1] = 1 - (t[l][1] - e) / r || 0;
  return t;
}
function getTopScript(n, t) {
  let e = -1,
    r,
    l;
  for (l in t) {
    var i;
    own.call(t, l) && (i = getOccurrence(n, t[l])) > e && ((e = i), (r = l));
  }
  return [r, e];
}
function getOccurrence(n, t) {
  t = n.match(t);
  return (t ? t.length : 0) / n.length || 0;
}
function getDistances(n, t, e, r) {
  var l = [];
  let i;
  if ((t = filterLanguages(t, e, r)))
    for (i in t) own.call(t, i) && l.push([i, getDistance(n, t[i])]);
  return 0 === l.length ? und() : l.sort(sort);
}
function getDistance(t, e) {
  let r = 0,
    l = -1;
  for (; ++l < t.length; ) {
    var i = t[l];
    let n = MAX_DIFFERENCE;
    i[0] in e && (n = i[1] - e[i[0]] - 1) < 0 && (n = -n), (r += n);
  }
  return r;
}
function filterLanguages(n, t, e) {
  if (0 === t.length && 0 === e.length) return n;
  var r = {};
  let l;
  for (l in n) allow(l, t, e) && (r[l] = n[l]);
  return r;
}
function allow(n, t, e) {
  return (
    (0 === t.length && 0 === e.length) ||
    ((0 === t.length || t.includes(n)) && !e.includes(n))
  );
}
function und() {
  return singleLanguageTuples("und");
}
function singleLanguageTuples(n) {
  return [[n, 1]];
}
function sort(n, t) {
  return n[1] - t[1];
}
// export { franc, francAll };
