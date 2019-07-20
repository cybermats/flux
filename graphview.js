'use strict';


function GraphView(canvasId) {
  this.canvas = document.getElementById(canvasId);
  this.context = this.canvas.getContext('2d');
  this.data = Array(this.canvas.width).fill(0);
  this.offset = 0;
  this.max_value = 1;
  this.current = 0;
  this.goal = 0;
  this.last_update = Date.now();

  this.half_life = 1000;

  for (let i = 0; i < this.canvas.width; i++) {
    this.data.push(0);
  }
}

GraphView.prototype.update = function() {
  let now = Date.now();
  let delta = this.goal - this.current;
  let t = now - this.last_update;
  this.last_update = now;
  let delta_prim = delta * Math.pow(0.5, (t / this.half_life));
  this.current = this.goal - delta_prim;

  this.data[this.offset++] = this.current;
  if (this.offset >= this.canvas.width) {
    this.offset = 0;
  }
  this.draw();
}

GraphView.prototype.on_change = function(value) {
  this.goal = value;
}


GraphView.prototype.draw = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  let mid = this.canvas.height / 2;
  let scale = 0.9 * mid / this.max_value;
  let data = this.data[this.offset];
  let value = scale * data;

  let x = 0;
  let y = mid - value;


  this.context.beginPath();

  this.context.strokeStyle = 'red';
  this.context.moveTo(0, mid);
  this.context.lineTo(this.canvas.width, mid);
  this.context.stroke();

  this.context.beginPath();
  this.context.strokeStyle = 'black';

  this.context.moveTo(x, y);

  this.max_value = 1;
  for (let i = this.offset + 1; i < this.canvas.width; i++) {
    data = this.data[i];
    value = scale * data;
    if (Math.abs(data) > this.max_value) {
      this.max_value = Math.abs(data);
    }
    y = mid - value;
    this.context.lineTo(x++, y);
  }
  for (let i = 0; i < this.offset; i++) {
    data = this.data[i];
    value = scale * data;
    y = mid - value;
    if (Math.abs(data) > this.max_value) {
      this.max_value = Math.abs(data);
    }
    this.context.lineTo(x++, y);
  }
  this.context.stroke();

}
