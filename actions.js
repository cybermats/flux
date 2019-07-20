'use strict';

const Actions = {
  upvote(id, time) {
    CountDispatcher.dispatch({
      action_type: ActionTypes.UP_VOTE,
      id,
      time
    });
  },
  downvote(id, time) {
    CountDispatcher.dispatch({
      action_type: ActionTypes.DOWN_VOTE,
      id,
      time
    });
  },
  reset(id, time) {
    CountDispatcher.dispatch({
      action_type: ActionTypes.RESET_VOTE,
      id,
      time
    });
  },
  tick() {
    CountDispatcher.dispatch({
      action_type: ActionTypes.TICK
    });
  }
};
