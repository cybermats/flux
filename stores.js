'use strict';

const CountStore = {
  dispatchToken: undefined,
  _value: 0,
  _last_update: 0,
  _half_life: 1000,
  _votes: [],

  _listeners: [],

  register_listener(callback) {
    CountStore._listeners.push(callback);
  },

  has_changed() {
    CountStore._listeners.forEach(function(l) { l(); });
  },

  _calculate_decay(value, time, now) {
    let t = now - time;
    return value * Math.pow(0.5, (t / CountStore._half_life));
  },

  _calculate_gauss(value, time, now) {
    const a = value;
    const b = 0;
    const c = 1000;
    const t = now - time;
    const exp = -(t - b)*(t-b)/(2*c*c);
    return a*Math.exp(exp);
  },

  _adjust_value(vote, time, now) {
    let change = CountStore._calculate_decay(vote, time, now);
    let value = CountStore._calculate_decay(CountStore._value, CountStore._last_update, now);
    CountStore._value = value + change;
    CountStore._last_update = now;
  },

  _sum_gauss(now) {
    const value = CountStore._votes.map(v => CountStore._calculate_gauss(v.vote, v.time, now))
	  .reduce((a, c) => a + c, 0);
    CountStore._value = value;
  },

  _add_vote(vote, time, now) {
    CountStore._votes.push({vote, time});
    CountStore._sum_gauss(now);
  },

  dispatch_callback(action) {
    let now = Date.now();
    switch(action.action_type) {
      case ActionTypes.UP_VOTE:
	let old = CountStore._value;
	CountStore._add_vote(1, action.time, now);
	console.log('Update from: ', old, ', to: ', CountStore._value);
	CountStore.has_changed();
	break;
      case ActionTypes.DOWN_VOTE:
	CountStore._add_vote(-1, action.time, now);
	CountStore.has_changed();
	break;
      case ActionTypes.RESET_VOTE:
	CountStore._value = 0;
	CountStore.has_changed();
	break;
      case ActionTypes.TICK:
	CountStore._sum_gauss(now);
	CountStore.has_changed();
	break;
    }
  },

  get_value() {
    return CountStore._value;
  }
};
