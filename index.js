import { $ } from "./utils/$.js";
import Vector from "./utils/Vector.js";

const position = new Vector(10, 10);
const direction = new Vector(1, 1.6);
const speed = 2;

const canvas = $("main");
const dvd = $("#dvd");
const lightswitch = $("#lightswitch");

const dvdWidth = dvd.clientWidth;
const dvdHeight = dvd.clientHeight;

const nearHue = (hue1, hue2) => {
  const diff = Math.abs(hue1 - hue2);
  return diff < 30 || diff > 330;
};

const getNewHue = () => {
  const hue = parseInt(getComputedStyle(dvd).getPropertyValue("--hue"));
  const newHue = Math.floor(Math.random() * 360);
  if (nearHue(hue, newHue)) {
    return getNewHue();
  }
  return newHue;
};

const changeColor = (e) => {
  document.documentElement.style.setProperty("--hue", getNewHue());
};

const hasCollisionX = () =>
  position.x + dvdWidth >= canvas.clientWidth || position.x < 0;

const hasCollisionY = () =>
  position.y + dvdHeight >= canvas.clientHeight || position.y < 0;

const offset = 10; // Offset for corner collision detection

const hasCornerCollision = () => {
  const hittingRight = position.x + dvdWidth >= canvas.clientWidth - offset;
  const hittingLeft = position.x <= 0 + offset;
  const hittingBottom = position.y + dvdHeight >= canvas.clientHeight - offset;
  const hittingTop = position.y <= 0 + offset;

  return (
    (hittingRight && hittingBottom) ||
    (hittingRight && hittingTop) ||
    (hittingLeft && hittingBottom) ||
    (hittingLeft && hittingTop)
  );
};

const draw = () => {
  dvd.style.left = position.x + "px";
  dvd.style.top = position.y + "px";
};

function animate() {
  position.add(direction.multiply(speed));

  if (hasCollisionX()) {
    direction.x *= -1;
    changeColor();
  }

  if (hasCollisionY()) {
    direction.y *= -1;
    changeColor();
  }

  if (hasCornerCollision()) {
    confetti({
      particleCount: 100,
      spread: 130,

      origin: {
        x: position.x / (canvas.clientWidth - dvdWidth),
        y: position.y / (canvas.clientHeight - dvdHeight),
      },

      angle: (() => {
        const hittingRight =
          position.x + dvdWidth >= canvas.clientWidth - offset;
        const hittingLeft = position.x <= 0 + offset;
        const hittingBottom =
          position.y + dvdHeight >= canvas.clientHeight - offset;
        const hittingTop = position.y <= 0 + offset;

        if (hittingLeft && hittingTop) return -45;
        if (hittingLeft && hittingBottom) return 45;
        if (hittingRight && hittingTop) return -135;
        if (hittingRight && hittingBottom) return 135;

        return 0; // Default angle if no corner collision
      })(),
    });
  }
  draw();

  window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);

canvas.addEventListener(
  "click",
  () => {
    changeColor();
  },
  false
);

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    changeColor();
  }
});

lightswitch.addEventListener("change", (event) => {
  event.stopPropagation();
  dvd.classList.toggle("on");
});

$("#controls > label").addEventListener("click", (event) => {
  event.stopPropagation();
});
