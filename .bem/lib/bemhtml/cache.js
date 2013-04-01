var cache = exports;

//
// ### function Cache ()
// Naive-cache constructor
//
function Cache() {
  this.map = {};
};

//
// ### function create()
// Constructor wrapper
//
cache.create = function create() {
  return new Cache();
};

//
// ### function set (key, value)
// #### @key {String} cache key
// #### @value {Any} value
// Put key into cache
//
Cache.prototype.set = function set(key, value) {
  this.map[key] = value;
};

//
// ### function get (key)
// #### @key {String} cache key
// Get value from the cache
//
Cache.prototype.get = function get(key) {
  if (this.map.hasOwnProperty(key)) return this.map[key];
  return undefined;
};
