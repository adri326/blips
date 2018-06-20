var canvas, width = 100, height = 100, ctx;

window.onload = function() {
  canvas = document.getElementById("scene");
  width = canvas.width = canvas.clientWidth;
  height = canvas.height = canvas.clientHeight;
  ctx = canvas.getContext("2d");

  init();

  window.onresize = function() {
    width = canvas.width = canvas.clientWidth;
    height = canvas.height = canvas.clientHeight;
    draw(); // temporary
  }
}



const box_template = `\
╒═╤╕
| ││
├─┼┤
*─┴┘`;

function init() {
  box.template = box_template;
  draw();
}

function draw() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = ctx.strokeStyle = "#ffffff";
  ctx.font = "64px ATIFont, monospace";
  ctx.textBaseline = "top";
  let text = insert(box(12, 6, "Hai there!"));
  text = insert(box(16, 5, "I like moos"), text, 10, 2);
  print(text, 0, 0, 64);
}

function print(text, x, y, fontsize) {
  text.split("\n").forEach((line, i) => {
    ctx.fillText(line, x * fontsize, y * fontsize + i * fontsize);
  });
}
