import { Player } from './classes/player.js';

let Boxes = $('#board .row').children().get();
let WinnerBox = $('#winner');
let WinnerScores = $('#scores').get();
let Player1Score = WinnerScores[0];
let Player2Score = WinnerScores[2];

let Solutions = [
  [1,2,3],
  [4,5,6],
  [7,8,9],
  [1,4,7],
  [2,5,8],
  [3,6,9],
  [1,5,9],
  [3,5,7]
]

let WinnerElement = function(player) {
  return `
    <div class="alert alert-primary col-sm-8 col-lg-3 m-0" role="alert">
      <h3 class="text-center">${ player.Name } Has Won The Game!</h3>
    </div>
  `;
};

let DrawElement = function() {
  return `
  <div class="alert alert-primary col-sm-8 col-lg-3 m-0" role="alert">
    <h3 class="text-center">Draw!</h3>
  </div>
  `;
}

/*WinnerBox.empty();
WinnerBox.append(WinnerElement[0]);*/

class game {
  constructor() {
    this.Players = new Array(new Player($('#Player1').text(), 'O'), new Player($('#Player2').text(), 'X'));
    this.Turn = undefined;
    this.Winner = undefined;

    WinnerBox.innerHTML = '';
    

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
      this.Turn = this.Players[0];
    } else {
      if (this.Players.indexOf(this.Turn) == 0) {
        this.Turn = this.Players[1];
      } else {
        this.Turn = this.Players[0];
      }
    }
  }

  #clearBoxes() {
    Boxes.forEach(box => {
      console.log(box);
    })
  }

  #boxClicked(box) {
    let result = false;
    this.Players.forEach((player) => {
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
    $('#play').html(`<h1>Play Again</h1>`);
  };

  #findWinner() {
    this.Players.forEach((player) => {
      Solutions.forEach(solution => {
        if (this.Winner !== undefined) return;
        let MappedBoxes = player.ClickedBoxes.sort().filter((i) => solution.includes(i));
        if (MappedBoxes.length === 3) {
          this.#Win(player);
        }
      })
    });

    if (this.Winner === undefined && this.Players[0].ClickedBoxes.length + this.Players[1].ClickedBoxes.length > 8) {
      this.Winner = null;
      $('#winner').append(DrawElement());
    }
  };

  #refreshWins() {

  }

}

document.getElementById('play').addEventListener('click', () => {
  new game();
})