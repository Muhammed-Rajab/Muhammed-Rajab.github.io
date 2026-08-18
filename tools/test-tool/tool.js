"use strict";

const generateBtn = document.querySelector("#generate-btn");

console.log("hello, world!", generateBtn);

generateBtn.addEventListener("click", (e) => {
  e.preventDefault();

  console.log("generate btn pressed");
});

function setup() {
  const canvas = createCanvas(500, 300);
  canvas.parent("canvas");
}

function draw() {
  background(240);

  ellipse(mouseX, mouseY, 20);
}
