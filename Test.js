const FieldCell = require('./FieldCell');
const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const Timer = require('./Timer');

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="game"><div id="timer"></div><div id="mines-marked"></div><div id="mines-left"></div><div id="timer"></div><h1>Minesweeper</h1><div id="game-controls"><button id="restart">😁</button></div><div id="game-field"></div></div></body></html>')
global.document = dom.window.document;

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