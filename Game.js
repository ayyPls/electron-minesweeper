

class FieldCell {
    isVisible = false
    isMine = false
    rowNumber = 0
    columnNumber = 0
    amountOfMinesAround = 0

    constructor(row = 0, column = 0, mine = false) {
        this.rowNumber = row
        this.columnNumber = column
        this.isMine = mine
        return this
    }

    setMine() {
        this.isMine = true
        return this
    }

    setAmountOfMinesAround(count = 0) {
        this.amountOfMinesAround = count
        return this
    }

    revealCell() {
        this.isVisible = true
        return this
    }
}


class Game {
    isStarted = false
    gameFieldElement = null
    FIELD_HEIGHT = 0
    FIELD_WIDTH = 0
    cells = []
    constructor(fieldHeight = 4, fieldWidth = 6) {
        this.FIELD_HEIGHT = fieldHeight
        this.FIELD_WIDTH = fieldWidth
        this.gameFieldElement = document.getElementById('game-field')



        this.gameFieldElement.addEventListener('click', (event) => {
            console.log(event.target.dataset);

            // handle first click to render cells   
            const row = event.target.dataset.row
            const column = event.target.dataset.column
            // const isMine = event.target.dataset.isMine
            const isVisible = event.target.dataset.isVisible
            if (this.cells.flat().some(cell => cell.isVisible)) {
                if (isVisible == 'false') {
                    this.revealCells(+row, +column)
                }
            }
            else {
                this.generateCells(+row, +column);
                this.revealCells(+row, +column)
            }


            // if (isVisible == 'false') {
            //     this.revealCells(+row, +column)
            // }
        })
        this.renderGameField(true)
        return this
    }



    revealCells(row, column) {
        // set cell to visible
        // this.cells[row][column].revealCell();

        // if cell is not a mine and hasn't been revealed yet
        if (!this.cells[row][column].isMine && !this.cells[row][column].isVisible) {
            this.cells[row][column].revealCell(); // Mark the cell as revealed

            // map by neighbors
            for (let xOffset = -1; xOffset <= 1; xOffset++) {
                for (let yOffset = -1; yOffset <= 1; yOffset++) {
                    const neighborRow = row + xOffset;
                    const neighborCol = column + yOffset;

                    if (
                        neighborCol >= 0 &&
                        neighborCol < this.FIELD_WIDTH &&
                        neighborRow >= 0 &&
                        neighborRow < this.FIELD_HEIGHT
                    ) {
                        if (this.cells[neighborRow][neighborCol].amountOfMinesAround === 0) {
                            // Recursive call only for unrevealed neighbors
                            if (!this.cells[neighborRow][neighborCol].isVisible) {
                                this.revealCells(neighborRow, neighborCol);
                            }
                        } else {
                            // If a neighbor has mines around, reveal it
                            if (this.cells[neighborRow][neighborCol].isMine == false)
                                this.cells[neighborRow][neighborCol].revealCell();
                        }
                    }
                }
            }
        }
        return this.renderGameField()
    }

    // fillWithCells() {
    //     for (let i = 0; i < this.FIELD_HEIGHT; i++) {
    //         this.cells.push([])
    //         for (let j = 0; j < this.FIELD_WIDTH; j++) {
    //             this.cells[i].push(new FieldCell(i, j, false))
    //         }
    //     }

    //     console.log(this.cells);
    //     return this
    // }

    // placeMines(minesAmount) {
    //     console.log(minesAmount);
    //     let minesLeft = minesAmount
    //     if (minesLeft < 0)
    //         return

    //     for (let i = 0; i < this.FIELD_HEIGHT; i++) {
    //         for (let j = 0; j < this.FIELD_WIDTH.length; j++) {
    //             const isMine = Math.random() < 0.5 && this.cells[i][j].isMine == false && minesLeft > 0
    //             if (isMine) {
    //                 minesLeft = minesLeft - 1
    //                 this.cells[i][j].setMine(isMine)
    //             }

    //             console.log(this.cells[i][j]);
    //         }
    //     }
    //     return this.placeMines(minesLeft)
    // }
    // func to render game field
    renderGameField(firstRender = false) {
        this.gameFieldElement.innerHTML = ''
        // let minesArray = Array.of(minesAmount)
        // let minesLeft = minesAmount
        if (this.gameFieldElement) {
            for (let i = 0; i < this.FIELD_HEIGHT; i++) {
                if (firstRender)
                    this.cells.push([])
                for (let j = 0; j < this.FIELD_WIDTH; j++) {
                    if (firstRender)
                        this.cells[i].push(new FieldCell(i, j, false))
                    // const isMine = Math.random() < 0.5;
                    // if (isMine) {
                    //     minesLeft -= 1
                    // }
                    // this.cells[i].push(new FieldCell(i, j))
                    // move in function
                    let cell = this.gameFieldElement.appendChild(document.createElement('div'))
                    cell.dataset.row = this.cells[i][j].rowNumber
                    cell.dataset.column = this.cells[i][j].columnNumber
                    cell.dataset.isMine = this.cells[i][j].isMine
                    cell.dataset.minesAround = this.cells[i][j].amountOfMinesAround
                    cell.textContent = this.cells[i][j].amountOfMinesAround
                    cell.dataset.isVisible = this.cells[i][j].isVisible
                }
                this.gameFieldElement.appendChild(document.createElement("br"))
            }
        }
        // this.setMines(minesAmount)
    }


    // generate double array of mines && set mines
    generateCells(firstRenderRow, firstRendereCol) {
        this.cells = []
        let trueCount = this.FIELD_HEIGHT * this.FIELD_WIDTH / 6
        for (let i = 0; i < this.FIELD_HEIGHT; i++) {
            this.cells.push([])
            for (let j = 0; j < this.FIELD_WIDTH; j++) {
                this.cells[i].push(new FieldCell(i, j, false));
            }
        }

        while (trueCount > 0) {
            const randomRow = Math.floor(Math.random() * this.FIELD_HEIGHT);
            const randomCol = Math.floor(Math.random() * this.FIELD_WIDTH);

            if (this.cells[randomRow][randomCol].isMine === false && (randomRow !== firstRenderRow && randomCol !== firstRendereCol)) {
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
                            !(xOffset === 0 && yOffset === 0) // Исключаем текущую ячейку
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

new Game(10, 10).renderGameField()