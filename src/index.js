import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.checkSquare = this.checkSquare.bind(this);
  }

  checkSquare() {
    const { tooglePlayer, i, j } = this.props;
    tooglePlayer(i, j);
  }

  render() {
    return (
      <button className="square" onClick={this.checkSquare}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square />;
  }

  render() {
    const { currentPlayer, history, tooglePlayer } = this.props;

    return (
      <div>
        {history.map((v, k) => (
          <div className="board-row" key={k}>
            {v.map((value, j) => (
              <Square
                key={j}
                i={k}
                j={j}
                value={value}
                tooglePlayer={tooglePlayer}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)],
      index: 1,
      logs: [[Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)]],
      win: false,
      current: {
        player: "O",
        x: null,
        y: null,
      },
      player_logs: [
        {
          player: "O",
          x: null,
          y: null,
          win: false,
        },
      ],
      k: 0,
    };
    this.tooglePlayer = this.tooglePlayer.bind(this);
  }

  tooglePlayer(i, j) {
    if (!this.state.history[i][j] && !this.state.win) {
      this.setState(({ history, current, logs, player_logs,k }) => {
        const history_ = JSON.parse(JSON.stringify([...history]))
        history_[i][j] = current.player;
        let logs_ = [...logs, history_]
        let player = [
          ...player_logs,
          JSON.parse(
            JSON.stringify({
              x: i,
              y: j,
              player: current.player === "O" ? "X" : "O",
              win: this.checkWin(history_, j),
            })
          ),
        ]
        if(!(current.player===player_logs[player_logs.length-1].player && current.x===player_logs[player_logs.length-1].x && current.y===player_logs[player_logs.length-1].y)){
          logs_ = [...logs.filter((v,index)=>index<=k),history_]
          player = [...player.filter((v,index)=>index<=k),history_]
        }
        return {
          current: {
            ...current,
            player: current.player === "O" ? "X" : "O",
            x: i,
            y: j,
          },
          history: [...history_],
          logs: logs_,
          win: this.checkWin(history_, j),
          player_logs: player,
        };
      });
    }
  }

  checkWin(history, j) {
    const diago_1 = history.map(
      (value, k) => value.filter((v, l) => l + k === 2)[0]
    );
    const diago_2 = history.map(
      (value, k) => value.filter((v, l) => l === k)[0]
    );
    const verty = history.map((value, k) => value.filter((v, l) => l === j)[0]);
    const identity = history.map((v) =>
      v.filter((h) => h === this.state.current.player)
    );
    identity.push(diago_1.filter((h) => h === this.state.current.player));
    identity.push(diago_2.filter((h) => h === this.state.current.player));
    identity.push(verty.filter((h) => h === this.state.current.player));
    console.log(identity);

    return !!identity.filter((v) => v.length === 3).length;
  }

  jumpTo(k) {
    this.setState(({ logs, player_logs, history }) => {
      const current_log = [...logs[k]];
      const current_p_log = { ...player_logs[k] };
      return {
        history: current_log,
        win: current_p_log.win,
        current: current_p_log,
        k,
      };
    });
  }

  render() {
    const { current } = this.state;
    return (
      <div className="game">
        <div className="game-board">
          <Board {...this.state} tooglePlayer={this.tooglePlayer} />
        </div>{" "}
        <div className="game-info">
          {this.state.win ? (
            `Winner: ${current.player === "O" ? "X" : "O"}`
          ) : (
            <div> Next player: {current.player} </div>
          )}
          <ol>
            {this.state.logs.map((v, k) => (
              <li key={k}>
                <button onClick={() => this.jumpTo(k)}>
                  {k === 0 ? "Go to game start" : "Go to move #" + k}
                </button>
              </li>
            ))}
          </ol>
        </div>{" "}
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
