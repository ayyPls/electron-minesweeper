class FieldCell {
    isVisible = false
    isMine = false
    rowNumber = 0
    columnNumber = 0
    amountOfMinesAround = 0

    isMarked = false

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

    markCell(newState = false) {
        this.isMarked = newState
    }
}

module.exports = FieldCell