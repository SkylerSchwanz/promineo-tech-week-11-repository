import { Player } from './classes/player.js';

let Boxes = $('#board .row').children().get();
let WinnerBox = $('#winner');

let Players = new Array(new Player($('#Player1').text(), 'O'), new Player($('#Player2').text(), 'X'));

let Solutions = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

let WinnerElement = function (player) {
  return `
    <div class="alert alert-primary col-sm-8 col-lg-3 m-0" role="alert">
      <h3 class="text-center">${player.Name} Has Won The Game!</h3>
    </div>
  `;
};

let DrawElement = function () {
  return `
  <div class="alert alert-primary col-sm-8 col-lg-3 m-0" role="alert">
    <h3 class="text-center">Draw!</h3>
  </div>
  `;
};

class game {
  constructor() {
    this.Turn = undefined;
    this.Winner = undefined;

    WinnerBox.innerHTML = '';
    $('#play').css('display', 'none');
    this.#clearBoxes();
    $('#winner').empty();
    Players[0].ClickedBoxes = [];
    Players[1].ClickedBoxes = [];

    $('#board .row')[0].addEventListener('click', (clicked) => {
      if (!Boxes.includes(clicked.target)) return;
      if (this.Winner !== undefined) return;

      this.#possessBox(clicked.target);
      this.#findWinner();
      this.#refreshWins();
    });
  }

  #insertHeader(character, box) {
    $(box).append(`<h1 class="${character} text-center">${character}</h1>`);
  }

  #switchTurns() {
    if (this.Turn === undefined) {
      this.Turn = Players[0];
    } else {
      if (Players.indexOf(this.Turn) == 0) {
        this.Turn = Players[1];
      } else {
        this.Turn = Players[0];
      }
    }
  }

  #clearBoxes() {
    Boxes.forEach((box) => {
      box.innerHTML = '';
    });
  }

  #boxClicked(box) {
    let result = false;
    Players.forEach((player) => {
      if (player.ClickedBoxes.includes(Boxes.indexOf(box) + 1)) {
        result = true;
      }
    });
    return result;
  }

  #possessBox(box) {
    if (!this.#boxClicked(box)) {
      this.#switchTurns();
      this.Turn.ClickedBoxes.push(Boxes.indexOf(box) + 1);
      this.#insertHeader(this.Turn.Character, box);
    }
  }

  #Win(player) {
    this.Winner = player;
    player.Wins++;

    $('#winner').append(WinnerElement(player));
    $('#play').css('display', 'inline');
  }

  #findWinner() {
    Players.forEach((player) => {
      Solutions.forEach((solution) => {
        if (this.Winner !== undefined) return;
        let MappedBoxes = player.ClickedBoxes.sort().filter((i) => solution.includes(i));
        if (MappedBoxes.length === 3) {
          this.#Win(player);
        }
      });
    });

    if (this.Winner === undefined && Players[0].ClickedBoxes.length + Players[1].ClickedBoxes.length > 8) {
      this.Winner = null;
      $('#play').css('display', 'inline');
      $('#winner').append(DrawElement());
    }
  }

  #refreshWins() {
    console.log($('#Player1Score').text());
    $('#Player1Score').text(Players[0].Wins.toString());
    $('#Player2Score').text(Players[1].Wins.toString());
  }
}

document.getElementById('play').addEventListener('click', (element) => {
  new game();
  element.target.innerHTML = '<h2>Play Again</h2>';
});
