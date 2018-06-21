function box(width, height, content = "", padding = 1) {
  const box_template = box.template || `┌─┬┐ │ ││ ├─┼┤ └─┴┘`;
  // tl: 0; t: 1; tr: 4
  // bl: 15; l: 5; br: 18
  // r: 8; b: 16
  // nothing: 6

  // text wrapping
  let line_width = width - 2 - padding * 2;
  let lines = soft_wrap(content, line_width);

  if (height == 0) {
    height = lines.length + padding * 2 + 2;
  }

  // box outline

  // top row
  let string = box_template[0];
  for (let x = 1; x < width - 1; x++) {
    string += box_template[1];
  }
  string += box_template[3];

  // body
  string += "\n";
  for (let y = 1; y < height - 1; y++) {
    string += box_template[5];
    for (let x = 1; x < width - 1; x++) {
      string += box_template[6];
    }
    string += box_template[8];
    string += "\n";
  }

  // bottom row
  string += box_template[15];
  for (let x = 1; x < width - 1; x++) {
    string += box_template[16];
  }
  string += box_template[18];

  // text replacement
  let top = Math.max(Math.round((height - lines.length) / 2), padding + 1);
  for (let line = 0; line < Math.min(lines.length, height - top - padding - 1); line++) {
    let y = top + line;
    let x = (width - lines[line].length) / 2;
    string = string.slice(0, y * (width + 1) + x) + lines[line] + string.slice(y * (width + 1) + x + lines[line].length);
  }

  return string;
}

function soft_wrap(content, line_width) {
  if (line_width <= 0) throw new Error("Null line width");
  if (!/\n/m.exec(content) && content.length <= line_width) {
    // text fits in one line ^w^
    return [content];
  }
  else {
    // text does not fit in one line D:

    let temp_lines = content.split("\n");
    let lines = [];

    for (let i = 0; i < temp_lines.length; i++) {
      let line = temp_lines[i]; // current temp_line

      let words = line.split(" "); // split current temp_line in words

      while (line.length > line_width) { // while the current temp_line does not fit
        let x = 0;
        let subline = ""; // the new line we are building

        while (
          x < words.length // if we still have words to add
          && subline.length + !!x + words[x].length <= line_width // if the next word will fit with the built line
        ) {
          subline = subline + (x ? " " : "") + words[x]; // add the word to the abuilt line
          x++;
        }

        if (subline.length == 0) { // built line is empty: first word is too long, trim it and add it as a line
          lines.push(words[0].slice(0, line_width));
          words[0] = words[0].slice(line_width);
          line = line.slice(line_width); // "eat off" the content of the new line from the current temp_line
        }

        else { // push the built line
          lines.push(subline);
          line = line.slice(subline.length); // "eat off" the content of the new line from the current temp_line
          words = words.slice(x);
          if (line.startsWith(" ")) line = line.slice(1); // "eat off" the remaining space
        }
      }
      lines.push(line);
    }
    return lines;
  }
}

function insert(child, parent = "", x = 0, y = 0) {
  let lines = parent.split("\n");
  let child_lines = child.split("\n");
  while (lines.length < y + child_lines.length) { // add empty lines
    lines.push("");
  }
  for (let ty = 0; ty < y + child_lines.length; ty++) {
    if (ty >= y) {
      let child_line = child_lines[ty - y];
      if (lines[ty].length < x) { // add trailing spaces
        lines[ty] = lines[ty] + " ".repeat(x - lines[ty].length);
      }
      lines[ty] =
        lines[ty].slice(0, x)
        + child_line
        + lines[ty].slice(x + child_line.length);
    }
  }
  return lines.join("\n");
}
