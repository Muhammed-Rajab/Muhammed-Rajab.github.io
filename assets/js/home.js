"use strict";

// CANVAS SETUP
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

canvas.style.width = CANVAS_WIDTH + "px";
canvas.style.height = CANVAS_HEIGHT + "px";

const dpr = window.devicePixelRatio || 1;

canvas.width = CANVAS_WIDTH * dpr;
canvas.height = CANVAS_HEIGHT * dpr;

ctx.scale(dpr, dpr);

// ASSETS
const eat_sound = new Audio("/assets/files/eat.mp3");
eat_sound.preload = "auto";

const fart_sound = new Audio("/assets/files/dry-fart.mp3");
fart_sound.preload = "auto";

// UI SETUP
const gridCheckbox = document.getElementById("grid");

// GAME SETUP
function get_random_int(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Direction
const Direction = Object.freeze({
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",

  is_opposite(d1, d2) {
    let opposites = [
      [this.UP, this.DOWN],
      [this.DOWN, this.UP],
      [this.LEFT, this.RIGHT],
      [this.RIGHT, this.LEFT],
    ];

    return (
      opposites.filter((pair) => d1 == pair[0] && d2 == pair[1]).length != 0
    );
  },
});

// Point
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equal(other) {
    return this.x == other.x && this.y == other.y;
  }
}

class SnakeGame {
  constructor(grid_x, grid_y) {
    this.grid_x = grid_x;
    this.grid_y = grid_y;

    // cell
    this.cell_width = CANVAS_WIDTH / this.grid_x;
    this.cell_height = CANVAS_HEIGHT / this.grid_y;

    // snake
    this.snake = [
      new Point(Math.floor(this.grid_x / 2), Math.floor(this.grid_y / 2)),
    ];
    this.direction = Direction.RIGHT;

    // food
    this.food = null;
    this.spawn_food();

    // state
    this.can_turn = true;
    this.score = 0;
    this.alive = true;
    this.started = false;
    this.is_running = true;
    this.gameover_sound_played = false;

    this.max_delay = 300;
    this.min_delay = 50;
    this.update_delay = this.max_delay;

    // ui
    this.grid_on = false;

    // loop
    this.last_t = 0;

    // input handling
    document.addEventListener("keydown", (event) => this.handle_keys(event));
  }

  restart() {
    // snake
    this.snake = [
      new Point(Math.floor(this.grid_x / 2), Math.floor(this.grid_y / 2)),
    ];
    this.direction = Direction.RIGHT;

    // spawn food
    this.spawn_food();

    // state
    this.can_turn = true;
    this.score = 0;
    this.alive = true;
    this.started = true;
    this.gameover_sound_played = false;
    this.update_delay = this.max_delay;

    // ui
    this.is_running = true;

    // loop
    this.last_t = 0;
  }

  handle_keys(event) {
    // snake movement
    if (this.can_turn) {
      let new_direction = this.direction;

      if (event.key == "ArrowUp") new_direction = Direction.UP;
      else if (event.key == "ArrowDown") new_direction = Direction.DOWN;
      else if (event.key == "ArrowLeft") new_direction = Direction.LEFT;
      else if (event.key == "ArrowRight") new_direction = Direction.RIGHT;

      // only move if new direction isn't opposite to old direction
      if (
        this.snake.length == 1 ||
        !Direction.is_opposite(new_direction, this.direction)
      ) {
        this.direction = new_direction;
        this.can_turn = false;
      }
    }

    // ui stuff

    // toggle grid
    if (event.key == "g") {
      this.grid_on = !this.grid_on;
    }

    // pause/resume
    if (event.key == "Escape") {
      this.is_running = !this.is_running;
    }

    if (event.key == "r") {
      this.restart();
    }

    if (event.key == "s" && !this.started) {
      this.started = true;
    }
  }

  spawn_food() {
    while (true) {
      let food = new Point(
        get_random_int(0, this.grid_x - 1),
        get_random_int(0, this.grid_y - 1),
      );

      let contains = this.snake.filter((seg) => seg.equal(food)).length != 0;

      if (!contains) {
        this.food = food;
        break;
      }
    }
  }

  play_sound(sound) {
    sound.currentTime = 0;
    sound.play();
  }

  update_snake() {
    if (!this.alive || !this.started) return;

    // fuck, cause js does shit by reference
    const head = new Point(this.snake[0].x, this.snake[0].y);

    // move one cell in the direction
    switch (this.direction) {
      case Direction.UP:
        head.y -= 1;
        break;

      case Direction.DOWN:
        head.y += 1;
        break;

      case Direction.RIGHT:
        head.x += 1;
        break;

      case Direction.LEFT:
        head.x -= 1;
        break;
    }

    // check if ate food
    let ate_food = head.equal(this.food);

    // wall collision
    let hit_wall =
      head.x < 0 ||
      head.x >= this.grid_x ||
      head.y < 0 ||
      head.y >= this.grid_y;

    if (hit_wall) {
      this.alive = false;
      return;
    }

    // body collision
    let collision = false;

    // if ate food, then a new segment will be added to the tail, ie, the whole snake must be checked
    if (ate_food)
      collision = this.snake.filter((seg) => head.equal(seg)).length != 0;
    else
      collision =
        this.snake
          .slice(0, this.snake.length - 1)
          .filter((seg) => head.equal(seg)).length != 0;

    if (collision) {
      this.alive = false;
      return;
    }

    // add new head
    this.snake.splice(0, 0, head);

    // normal movement
    if (ate_food) {
      this.spawn_food();
      this.score += 1;
      console.log(this.score);

      // play eat sound
      this.play_sound(eat_sound);
    } else {
      this.snake.pop();
    }

    // increase speed of age food
    if (ate_food) {
      const progress = this.score / (this.grid_x * this.grid_y - 1);
      console.log(progress);
      this.update_delay =
        this.min_delay +
        (this.max_delay - this.min_delay) * Math.pow(1 - progress, 2);

      console.log(this.update_delay);
    }

    // now the direction can be changed
    this.can_turn = true;
  }

  update(t) {
    if (!this.is_running || !this.alive) return;

    if (t - this.last_t >= this.update_delay) {
      this.last_t = t;
      this.update_snake();
    }
  }

  render_snake() {
    this.snake.forEach((segment, index) => {
      // head
      if (index == 0) {
        ctx.fillStyle = "green";
      } else {
        ctx.fillStyle = "limegreen";
      }

      ctx.fillRect(
        segment.x * this.cell_width,
        segment.y * this.cell_height,
        this.cell_width,
        this.cell_height,
      );
    });
  }

  render_food() {
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.food.x * this.cell_width,
      this.food.y * this.cell_height,
      this.cell_width,
      this.cell_height,
    );
  }

  render_grid() {
    const { cell_height, cell_width } = this;

    for (let y = cell_height; y < CANVAS_HEIGHT; y += cell_height) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    for (let x = cell_width; x < CANVAS_WIDTH; x += cell_width) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
  }

  render_score() {
    ctx.save();

    ctx.font = "16px Arial";
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.fillText(`SCORE: ${this.score}`, 10, 20);

    ctx.restore();
  }

  render_pause() {
    ctx.save();

    ctx.font = "48px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
    ctx.fillText("PAUSED", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    ctx.restore();
  }

  render_gameover() {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = "white";
    ctx.font = "38px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

    ctx.font = "24px Arial";
    ctx.fillText(
      "Press R to Restart",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 + 30,
    );

    ctx.font = "20px Arial";
    ctx.fillText(
      `Score: ${this.score}`,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 + 80,
    );

    ctx.restore();
  }

  render_starting_screen() {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Press 'S' to start the game",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
    );

    ctx.restore();
  }

  render() {
    if (!this.started) return this.render_starting_screen();

    if (this.grid_on) this.render_grid();

    this.render_food();
    this.render_snake();

    if (this.alive) this.render_score();

    if (!this.is_running && this.alive) this.render_pause();

    if (!this.alive) {
      if (!this.gameover_sound_played) {
        this.play_sound(fart_sound);
        this.gameover_sound_played = true;
      }
      this.render_gameover();
    }
  }
}

let last_time = 0;
let game = new SnakeGame(12, 12);

function loop(t) {
  game.update(t);

  // clean canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  game.render();

  requestAnimationFrame(loop);
}

loop();
