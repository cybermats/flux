'use strict';

function Dispatcher() {
  this._callbacks = {};
  this._topID = 0;
  this._prefix = "ID_";
};

Dispatcher.prototype.register = function(callback)  {
  let id = this._prefix + this._topID++;
  this._callbacks[id] = callback;
  return id;
};

Dispatcher.prototype.dispatch = function(action) {
  try {
    for (let id in this._callbacks) {
      this._callbacks[id](action);
    }
  } finally {
  }
};


let CountDispatcher = new Dispatcher();
