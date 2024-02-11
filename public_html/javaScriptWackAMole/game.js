export class Logic {
  constructor() {
    let lastHole;
    this.timeLimit = 20000;
    this.countdown = this.timeLimit / 1000;
  }

  resetCountDown() {
    this.countdown = this.timeLimit / 1000;
  }

  countDown() {
    this.countdown -= 1;
  }

  stillTimeLeft() {
    if (this.countdown != 0);
    return this.countdown;
  }
}

export class GameScore {
  constructor() {
    this.score = 0;
    this.highscore = 0;
    this.loadHighScore();
  }

  resetScore() {
    this.score = 0;
  }

  whackedMole(logic) {
    if (logic.stillTimeLeft() >= 0) this.score++;
  }

  saveHighScore() {
    localStorage.setItem("save", JSON.stringify(this.highscore));
  }
  loadHighScore() {
    let loadScore = +localStorage.getItem("save");
    if (loadScore > 0) {
      this.highscore = loadScore;
      return this.highscore;
    } else {
      return 0;
    }
  }
  uppdateHighScore() {
    if (this.score > this.highscore) {
      this.highscore = this.score;
    }
  }
}
