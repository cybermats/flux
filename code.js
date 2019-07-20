'use strict';

const label_view = {
  label: undefined,
  callback: function() {
    let count = VoteStore.get_value();
    label.innerText = count;
  }
};

const graph = new GraphView("graph");
const userid = 'user1';
const timerid = 'timer1';


function on_inc_button_click() {
  Actions.upvote(userid, Date.now());
}

function on_dec_button_click() {
  Actions.downvote(userid, Date.now());
}

function on_reset_button_click() {
  Actions.reset(userid, Date.now());
}

function timer_callback() {
  Actions.upvote(timerid, Date.now());
//  Actions.tick();
  window.setTimeout(timer_callback, 10000);
}

function on_draw() {
  Actions.tick(Date.now());
  graph.update();
  window.requestAnimationFrame(on_draw);
}

function on_load() {
  let label = document.getElementById('label');
  label_view.label = label;


  VoteStore.register_listener(label_view.callback);
  VoteStore.register_listener(function() {
    graph.on_change(VoteStore.get_value());
  });

  VoteStore.dispatchToken = CountDispatcher.register(VoteStore.dispatch_callback);
  window.setTimeout(timer_callback, 1000);
  window.requestAnimationFrame(on_draw);
}
