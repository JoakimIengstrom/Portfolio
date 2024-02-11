//glue-code, (UI-code, frontend-code)

import { Logic } from "./game.js";
import { GameScore } from "./game.js";

const logic = new Logic();
const gameScore = new GameScore();

const sonicMainSkin = 'url("image/sonic.png")';
const sonicWackedSkin = 'url("image/sonic3.png")';
const holes = document.querySelectorAll(".hole");
const moles = document.querySelectorAll(".mole");
const scoreBoard = document.querySelector(".score");
const highScore = document.querySelector(".highScore");
const startButton = document.querySelector(".startButton");
const countdownBoard = document.querySelector(".countdown");

function startGame() {
  logic.resetCountDown();
  gameScore.resetScore();
  scoreBoard.textContent = 0;
  scoreBoard.style.textContent = "block";
  startButton.style.visibility = "hidden";
  countdownBoard.textContent = "Time left: " + logic.countdown;
  popOut();
  timer();
}

startButton.addEventListener("click", startGame);

function pickRandomHole() {
  const randomHole = Math.floor(Math.random() * holes.length);
  const hole = holes[randomHole];
  if (hole === logic.lastHole) {
    return pickRandomHole();
  }
  logic.lastHole = hole;
  return hole;
}

function popOut() {
  const popOutTime = Math.random() * 1300 + 400;
  const hole = pickRandomHole(holes);
  popOutEvent(popOutTime, hole);
}

function popOutEvent(popOutTime, hole) {
  hole.classList.add("up");
  for (let mole of moles) {
    if (mole.id.slice(-1) === hole.id.slice(-1)) {
      mole.addEventListener("click", whackMole);

      setTimeout(() => {
        hole.classList.remove("up");
        mole.removeEventListener("click", whackMole);
        if (logic.stillTimeLeft()) popOut();
      }, popOutTime);
    }
  }
}

function whackMole(e) {
  gameScore.whackedMole(logic); //Skickar med logic för att kunna ta bort score++, så jag inte kan få score efter tiden är slut.
  //wackVisual();
  this.style.backgroundImage = sonicWackedSkin;
  this.style.pointerEvents = "none";
  setTimeout(() => {
    //startVisual();
    this.style.backgroundImage = sonicMainSkin;
    this.style.pointerEvents = "all";
  }, 800);
  scoreBoard.textContent = gameScore.score;
}

function startVisual() {
  this.style.backgroundImage = sonicMainSkin;
  this.style.pointerEvents = "all";
}

function wackVisual() {
  this.style.backgroundImage = sonicWackedSkin;
  this.style.pointerEvents = "none";
}

function timer() {
  let startCountdown = setInterval(() => {
    logic.countDown();
    countdownBoard.textContent = "Time left: " + logic.countdown;
    if (logic.countdown <= 0) {
      clearInterval(startCountdown);
      startButton.style.visibility = "visible";
      countdownBoard.textContent = "Times up!";
      gameScore.uppdateHighScore();
      scoreUppdate();
    }
  }, 1000);
}

function scoreUppdate() {
  if (gameScore.score > 0 && gameScore.score == gameScore.highscore) {
    highScore.textContent = "New HighScore: " + gameScore.score + " points";
    gameScore.saveHighScore();
  }
}

function printHighscore() {
  let printOutScore = gameScore.loadHighScore();
  highScore.textContent = "HighScore: " + printOutScore + " points";
}
printHighscore();
