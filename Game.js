const FieldCell = require("./FieldCell")
const Timer = require("./Timer")

class Game {
    timer = null

    isEnded = false
    gameFieldElement = null
    FIELD_HEIGHT = 0
    FIELD_WIDTH = 0
    cells = []
    constructor(fieldHeight = 4, fieldWidth = 6) {
        this.timer = new Timer()

        document.getElementById('help').addEventListener('click', ()=>{
            alert("Добро пожаловать в игру Сапёр. \nЛевый клик мыши - открыть поле. \nПравый клик мыши - поставить метку на поле. \nНажатие на '😁' - старт игры")
        })
        document.getElementById('about_dev').addEventListener('click', ()=>{
            alert("Разработано студентом Саиспаевым Егором Сергеевичем в рамках курсового проекта по предмету 'Объектно-ориентированное программирование'")
        })
        document.getElementById('restart').addEventListener('click', event => {
            this.restartGame()
        })
        this.FIELD_HEIGHT = fieldHeight
        this.FIELD_WIDTH = fieldWidth
        this.gameFieldElement = document.getElementById('game-field')

        this.gameFieldElement.addEventListener('click', (event) => {

            // handle first click to render cells   
            const row = event.target.dataset.row
            const column = event.target.dataset.column
            const isVisible = event.target.dataset.isVisible
            if (this.cells.flat().some(cell => cell.isVisible)) {
                if (isVisible == 'false') {
                    this.revealCells(+row, +column)
                }
            }
            else {
                this.timer.startTimer()
                this.generateCells(+row, +column);
                this.revealCells(+row, +column, true)
            }
        })

        this.gameFieldElement.addEventListener('contextmenu', event => {
            if (!this.isEnded) {
                const row = event.target.dataset.row
                const column = event.target.dataset.column
                const mark = event.target.dataset.isMarked == 'true'
                this.cells[row][column].markCell(!mark)
                event.preventDefault()
                this.renderGameField()
            }
        })

        this.renderGameField(true)

        return this

    }

    restartGame() {
        this.isEnded = false
        this.timer.stopTimer()
        this.generateCells().renderGameField()
    }

    endGame() {
        for (let i = 0; i < this.FIELD_HEIGHT; i++) {
            for (let j = 0; j < this.FIELD_WIDTH; j++) {
                if (this.cells[i][j].isMine)
                    this.cells[i][j].revealCell()
            }
        }
        this.isEnded = true
        this.timer.stopTimer();
        return this
    }

    revealCells(row, column, revealNeighbors = false) {
        if (
            row < 0 ||
            row >= this.FIELD_HEIGHT ||
            column < 0 ||
            column >= this.FIELD_WIDTH ||
            this.cells[row][column].isVisible
            || this.isEnded
        ) {
            return;
        }


        if (this.cells[row][column].isMine && !revealNeighbors) {
            return this.endGame().renderGameField()

        }
        else this.cells[row][column].revealCell()

        if (this.cells[row][column].amountOfMinesAround === 0 || revealNeighbors) {
            for (let xOffset = -1; xOffset <= 1; xOffset++) {
                for (let yOffset = -1; yOffset <= 1; yOffset++) {
                    const neighborRow = row + xOffset;
                    const neighborCol = column + yOffset;

                    if (
                        neighborRow >= 0 &&
                        neighborRow < this.FIELD_HEIGHT &&
                        neighborCol >= 0 &&
                        neighborCol < this.FIELD_WIDTH &&
                        this.cells[neighborRow][neighborCol].isMine == false
                    ) {
                        this.revealCells(neighborRow, neighborCol, false);
                    }
                }
            }
        }
        this.renderGameField();
    }
    // func to render game field
    renderGameField(firstRender = false) {
        let counterOfMines = 0

        this.gameFieldElement.innerHTML = ''
        if (this.gameFieldElement) {
            for (let i = 0; i < this.FIELD_HEIGHT; i++) {

                if (firstRender)
                    this.cells.push([])
                for (let j = 0; j < this.FIELD_WIDTH; j++) {
                    if (firstRender)
                        this.cells[i].push(new FieldCell(i, j, false))
                    else if (this.cells[i][j].isMine) counterOfMines++
                    let cell = this.gameFieldElement.appendChild(document.createElement('div'))
                    cell.dataset.row = this.cells[i][j].rowNumber
                    cell.dataset.column = this.cells[i][j].columnNumber
                    cell.dataset.isMine = this.cells[i][j].isMine
                    cell.dataset.minesAround = this.cells[i][j].amountOfMinesAround
                    cell.dataset.isVisible = this.cells[i][j].isVisible
                    cell.dataset.isMarked = this.cells[i][j].isMarked
                    cell.textContent = this.cells[i][j].isMine && this.cells[i][j].isVisible ? "💣" : this.cells[i][j].isVisible && this.cells[i][j].amountOfMinesAround
                        ? this.cells[i][j].amountOfMinesAround
                        : this.cells[i][j].isMarked ? 'M' : "."
                }
                this.gameFieldElement.appendChild(document.createElement("br"))
            }
        }

        const markedMinesAmount = this.cells.flat().filter(cell => cell.isMarked && !cell.isVisible).length
        const currentMinesAmount = Math.floor(this.FIELD_HEIGHT * this.FIELD_WIDTH / 8 + 1) - markedMinesAmount
        document.getElementById('mines-marked').textContent = "Mines marked: " + markedMinesAmount
        document.getElementById('mines-left').textContent = "Mines left: " + currentMinesAmount

        if (this.FIELD_HEIGHT * this.FIELD_WIDTH - this.cells.flat().filter(cell => cell.isMine == false && cell.isVisible).length - Math.floor(this.FIELD_HEIGHT * this.FIELD_WIDTH / 8 + 1) == 0) {
            alert('win')
            this.endGame()
        }
    }

    // generate tygggggg array of mines && set mines
    generateCells(firstRenderRow, firstRenderedCol) {
        this.cells = []
        let trueCount = this.FIELD_HEIGHT * this.FIELD_WIDTH / 8
        for (let i = 0; i < this.FIELD_HEIGHT; i++) {
            this.cells.push([])
            for (let j = 0; j < this.FIELD_WIDTH; j++) {
                this.cells[i].push(new FieldCell(i, j, false));
            }
        }

        while (trueCount > 0) {
            const randomRow = Math.floor(Math.random() * this.FIELD_HEIGHT);
            const randomCol = Math.floor(Math.random() * this.FIELD_WIDTH);

            if (this.cells[randomRow][randomCol].isMine === false &&
                (randomRow !== firstRenderRow && randomCol !== firstRenderedCol)
            ) {
                this.cells[randomRow][randomCol].setMine();
                trueCount--;
            }
        }

        for (let i = 0; i < this.FIELD_HEIGHT; i++) {
            for (let j = 0; j < this.FIELD_WIDTH; j++) {
                let counter = 0;
                for (let xOffset = -1; xOffset <= 1; xOffset++) {
                    for (let yOffset = -1; yOffset <= 1; yOffset++) {
                        const neighborRow = i + xOffset;
                        const neighborCol = j + yOffset;

                        if (
                            neighborRow >= 0 &&
                            neighborRow < this.FIELD_HEIGHT &&
                            neighborCol >= 0 &&
                            neighborCol < this.FIELD_WIDTH &&
                            !(xOffset === 0 && yOffset === 0)
                        ) {
                            if (this.cells[neighborRow][neighborCol].isMine) {
                                counter++;
                            }
                        }
                    }
                }
                this.cells[i][j].setAmountOfMinesAround(counter)
            }
        }
        return this
    }
}

new Game(9, 9).renderGameField()

module.exports = Game