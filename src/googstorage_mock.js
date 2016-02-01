function store () {
  this.storage = {};
  if (!store.isPrepared) {
    throw new Error('store not yet prepared');
  }
}

store.prototype.set = function(key, val) {
  if (val === undefined) {
    delete this.storage[key];
    return val;
  }
  this.storage[key] = val;
  return val;
};

store.prototype.get = function(key) { return this.storage[key]; };

store.prototype.remove = function(key) { delete this.storage[key];};

store.prototype.clear = function() { this.storage = {}; };

store.prototype.transact = function(key, defaultVal, transactionFn) {
  var val = this.store.get(key);
  if (transactionFn === null) {
    transactionFn = defaultVal;
    defaultVal = null;
  }
  if (typeof val == 'undefined') {
    val = defaultVal || {};
  }
  transactionFn(val);
  this.set(key, val);
};

store.prototype.getAll = function() {
  return this.storage;
};

store.prototype.forEach = function(callback) {
  for (var i in this.storage) {
    callback(i);
  }
};

store.prototype.serialize = function(value) {
  return JSON.stringify(value);
};

store.prototype.deserialize = function(value) {
  if (typeof value != 'string') { return undefined; }
  try { return JSON.parse(value); }
  catch(e) { return value || undefined; }
};

store.isPrepared = false;

store.prepareFreedom = function() {
  // mock doesn't actually use freedom localStorage
  store.isPrepared = true;
  return Promise.resolve();
};

goog.storage.mechanism.HTML5LocalStorage = store;
