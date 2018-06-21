var canvas, width = 100, height = 100, ctx, box_width = 35;

window.onload = function() {
  canvas = document.getElementById("scene");
  width = canvas.width = canvas.clientWidth;
  height = canvas.height = canvas.clientHeight;
  ctx = canvas.getContext("2d");

  init();

  window.onresize = function() {
    width = canvas.width = canvas.clientWidth;
    height = canvas.height = canvas.clientHeight;
    draw(false); // temporary
  }
}



const box_template = `\
╒═╤╕
| ││
├─┼┤
*─┴┘`;

function init() {
  //box.template = box_template;
  draw();
}

function draw(requestAnimationFrame = true) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
  ctx.font = "48px ATIFont, monospace";
  ctx.textBaseline = "top";
  let text = insert(box(18, 0, "ASCII boxes!", 0), "", 1, 0);

  let elem = document.getElementById("input");
  let input = elem.value;
  if (document.activeElement === elem) {
    if (performance.now() % 1000 < 500) input += "|";
    else input += "\u00a0";
    elem.selectionStart = elem.value.length;
    elem.selectionEnd = elem.value.length;
  }

  box_width = Math.max(5, box_width);

  let input_box = box(box_width, 0, input);
  let box_height = input_box.split("\n").length;

  text = insert(input_box, text, 1, 3);

  elem.style.width = (box_width - 2) / 2 + "em";
  elem.style.height = (box_height - 2) + "em";

  text = insert("width: [-] [+]", text, 21, 1);
  text = insert("Copy!", text, box_width - 6, box_height + 4);

  let copy_box = document.getElementById("copy");

  copy_box.style.left = (box_width - 6) / 2 + "em";
  copy_box.style.top = (box_height + 4) + "em";

  let output_box = document.getElementById("output");

  output_box.value = input_box;

  ctx.fillStyle = "#ffffff";

  print(text, 0, 0, 48);

  ctx.fillStyle = "#111111";

  print(insert("ATI 8x8-2y Font from int10h.org", "", 2, box_height + 7), 0, 0, 48);

  if (requestAnimationFrame) {
    window.requestAnimationFrame(() => {
      draw();
    });
  }
}

function print(text, x, y, fontsize) {
  text.split("\n").forEach((line, i) => {
    ctx.fillText(line, x * fontsize, y * fontsize + i * fontsize);
  });
}
