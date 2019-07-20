'use strict';

const VoteStore = {
  dispatchToken: undefined,
  _votes: {},
  _vote_value: 0,

  _timeout: 1000,

  _listeners: [],

  register_listener(callback) {
    VoteStore._listeners.push(callback);
  },

  has_changed() {
    VoteStore._listeners.forEach(l => l());
  },

  get_value(id) {
    if (id === undefined) {
      return VoteStore._vote_value;
    }
    if (VoteStore._votes[id] === undefined) {
      return 0;
    }
    return VoteStore._votes[id].value;
  },

  _recalc() {
    let now = Date.now();
    let value = 0;
    for (let id in VoteStore._votes) {
      if ((now - VoteStore._votes[id].time) > VoteStore._timeout) {
	delete VoteStore._votes[id];
      } else {
	value += VoteStore._votes[id].value;
      }
    }
    let has_changed = VoteStore._vote_value != value;
    VoteStore._vote_value = value;
    if (has_changed) {
      console.log('Has changed');
      VoteStore.has_changed();
    }
  },

  dispatch_callback(action) {
    let now = Date.now();
    switch(action.action_type) {
      case ActionTypes.UP_VOTE:
	VoteStore._votes[action.id] = { value: 1, time: action.time };
	VoteStore._recalc();
	break;
      case ActionTypes.DOWN_VOTE:
	VoteStore._votes[action.id] = { value: -1, time: action.time };
	VoteStore._recalc();
	break;
      case ActionTypes.RESET_VOTE:
	delete VoteStore._votes[action.id];
	VoteStore._recalc();
	break;
      case ActionTypes.TICK:
	VoteStore._recalc();
	break;
    }
  },

}
