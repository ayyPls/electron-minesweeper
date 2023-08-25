
const { JSDOM } = require('jsdom');


const dom = new JSDOM(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Minesweeper</title>
    </head>
    
    <body>
        <div id="game">
            <div id="timer"></div>
            <div id="mines-marked"></div>
            <div id="mines-left"></div>
            <div id="timer"></div>
            <h1>Minesweeper</h1>
            <div id="game-controls">
                <button id="restart">😁</button>
            </div>
            <div id="game-field"></div>
        </div>
    </body>    
    </html>`
)
global.document = dom.window.document;

const Timer = require('./Timer');
const Game = require('./Game');
const FieldCell = require('./FieldCell');
const { expect } = require('chai');


describe('test cell', () => {
    let cell = new FieldCell(1, 2, false)
    it('cell is created with some parameters', () => {
        expect(cell.rowNumber).to.equal(1);
        expect(cell.columnNumber).to.equal(2);
        expect(cell.isMine).to.be.false;
    })
    it('cell parameter "isMine" is changed', () => {
        cell.setMine()
        expect(cell.isMine).to.be.true
    })
    it('cell parameter "isVisible" is changed', () => {
        cell.revealCell()
        expect(cell.isVisible).to.be.true
    })
    it('cell parameter "isMarked" is changed', () => {
        cell.markCell(true)
        expect(cell.isMarked).to.be.true
    })
})

describe('test timer start work', () => {
    let timer = new Timer()
    it('timer is started', () => {
        expect(timer.startTime).to.be.null
        timer.startTimer()
        expect(timer.startTime).to.be.not.null
        expect(timer.timerElement).to.be.not.null
    })

    it('timer is stopped', () => {
        timer.stopTimer()
        expect(timer.interval._destroyed).to.be.true
    })
})


describe('test create game', () => {
    const game = new Game(9, 9)
    it('game is created', () => {
        expect(game).to.be.not.undefined
        expect(game.cells.length).equal(9)
    })

    it('game generates game field with mines on first click', () => {
        game.generateCells(0, 0)
        expect(game.cells.flat().some(mine=>mine.isMine)).to.be.true
    })

    it('reveal cells', ()=>{
        game.revealCells(1, 1)
        expect(game.cells[1][1].isVisible).to.be.true
    })

    it('game over', ()=>{
        game.endGame()
        expect(game.isEnded).to.be.true
    })
    it('restart game', ()=>{
        expect(game.isEnded).to.be.true
        game.restartGame()
        expect(game.isEnded).to.be.false
    })

})