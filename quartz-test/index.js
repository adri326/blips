const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 160;
const HEIGHT = 80;

const ITERATIONS = 4000;
const STEPS_MIN = 3;
const STEPS_MAX = 8;
const COLORS = 4;

const SCALE = 12;
const BORDER = 2;

const DIST_1 = 30;
const DIST_2 = 15;

let groups = newGrid(WIDTH, HEIGHT, 0);
let origins = [[0, 0]];

let mouseX = 0;
let mouseY = 0;

// Generate the groups
for (let n = 1; n < ITERATIONS; ++n) {
    let x = Math.floor(Math.random() * WIDTH);
    let y = Math.floor(Math.random() * HEIGHT);
    origins.push([x, y]);
    let dir = Math.floor(Math.random() * 4);
    let steps = Math.floor(Math.random() * (STEPS_MAX - STEPS_MIN) + STEPS_MIN);
    for (let step = 0; step < steps; ++step) {
        if (groups[y][x] !== n && groups[y][x] !== 0) {
            break
        }
        groups[y][x] = n;
        if (dir === 0) {
            x = Math.min(x + 1, WIDTH - 1);
        } else if (dir === 1) {
            y = Math.max(y - 1, 0);
        } else if (dir === 2) {
            x = Math.max(x - 1, 0);
        } else {
            y = Math.min(y + 1, HEIGHT - 1);
        }

        dir = (dir + 3 + Math.floor(Math.random() * 3)) % 4;

        for (let o = 0; o < 4; o++) {
            let x2 = x;
            let y2 = y;
            if (dir === 0) {
                x2 = Math.min(x + 1, WIDTH - 1);
            } else if (dir === 1) {
                y2 = Math.max(y - 1, 0);
            } else if (dir === 2) {
                x2 = Math.max(x - 1, 0);
            } else {
                y2 = Math.min(y + 1, HEIGHT - 1);
            }

            if (groups[y][x] === n && groups[y][x] === 0) {
                break
            } else {
                dir = (dir + 1) % 4;
            }
        }
    }
}

// Calculate the adjacency/neighborhood graph
let adjacency = [...new Array(ITERATIONS)].map(() => new Set([]));
let counts = [...new Array(ITERATIONS)].fill(0);

for (let y = 0; y < HEIGHT; ++y) {
    for (let x = 0; x < WIDTH; ++x) {
        let index = groups[y][x];
        ++counts[index];
        if (y > 0) {
            adjacency[index].add(groups[y - 1][x]);
            adjacency[groups[y - 1][x]].add(index);
        }
        if (x > 0) {
            adjacency[index].add(groups[y][x - 1]);
            adjacency[groups[y][x - 1]].add(index);
        }
    }
}

// Crude attempt at coloring the graph with N colors
let groupColors = [...new Array(ITERATIONS)].fill(-1);
groupColors[0] = 0;

for (let n = 1; n < ITERATIONS; ++n) {
    if (counts[n] > 1) {
        let color = Math.floor(Math.random() * COLORS);
        let originalColor = color;
        if (color !== 0) {
            let attempt = 0;
            for (; attempt < COLORS; ++attempt) {
                let changed = false;
                for (let neighbor of adjacency[n]) {
                    if (groupColors[neighbor] === color) {
                        color = (color + 1) % COLORS;
                        changed = true;
                        break;
                    }
                }
                if (!changed) {
                    break;
                }
            }
            if (attempt == COLORS) color = 0;
        }
        groupColors[n] = color;
    } else {
        groupColors[n] = 0;
    }
}

// Take the above data and generate an illumination grid
function updateGrid() {
    let groupsOn = [...new Array(ITERATIONS)].fill(false);

    function lightUp(cx, cy) {
        for (let n = 0; n < ITERATIONS; ++n) {
            let [gx, gy] = origins[n];
            let dist = (cx - gx) * (cx - gx) + (cy - gy) * (cy - gy);
            if (groupColors[n] === 1 && dist <= DIST_1 * DIST_1) {
                groupsOn[n] = true;
            } else if (groupColors[n] === 2 && dist <= DIST_2 * DIST_2) {
                groupsOn[n] = true;
            }
        }
    }

    // lightUp(WIDTH / 2, HEIGHT / 2);
    lightUp(mouseX / SCALE, mouseY / SCALE);

    let colorMap = [];

    for (let row of groups) {
        colorMap.push(row.map((g) => groupsOn[g]));
    }

    return colorMap;
}

function resizeCanvas() {
    canvas.width = ctx.width = canvas.clientWidth;
    canvas.height = ctx.height = canvas.clientHeight;

    updateCanvas();
}
resizeCanvas();

function updateCanvas() {
    ctx.fillStyle = "#202027";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let colorMap = updateGrid();

    for (let y = 0; y < HEIGHT; ++y) {
        for (let x = 0; x < WIDTH; ++x) {
            let vx = x * SCALE + BORDER;
            let vy = y * SCALE + BORDER;
            let w = SCALE - BORDER * 2;
            let h = SCALE - BORDER * 2;
            if (colorMap[y][x]) {
                if (groupColors[groups[y][x]] === 1) {
                    ctx.fillStyle = "#a0b0f0";
                } else {
                    ctx.fillStyle = "#90e7a8";
                }
                ctx.fillRect(vx, vy, w, h);

                // Connect the squares together
                if (y > 0 && groups[y - 1][x] === groups[y][x]) {
                    ctx.fillRect(vx, vy - BORDER * 2, w, BORDER * 2);
                }
                if (x > 0 && groups[y][x - 1] === groups[y][x]) {
                    ctx.fillRect(vx - BORDER * 2, vy, BORDER * 2, h);
                }
            }
        }
    }
}

function newGrid(width, height, def = null) {
    return [...new Array(height)]
        .map(() => [...new Array(width)].fill(def));
}


window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", (evt) => {
    mouseX = evt.clientX;
    mouseY = evt.clientY;
    updateCanvas();
});
