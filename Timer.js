
class Timer {
    startTime = null
    timerElement = null
    interval = null
    constructor() {
        this.timerElement = document.getElementById('timer')
        return this
    }
    startTimer() {
        this.startTime = new Date().getTime()
        this.interval = setInterval(() => {
            this.updateTimer()
        }, 1000)
    }
    updateTimer() {
        if (this.startTime) {
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - this.startTime;
            const minutes = Math.floor(elapsedTime / 60000);
            const seconds = Math.floor((elapsedTime % 60000) / 1000);
            this.timerElement.textContent = `TIME: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }
    stopTimer() {
        clearInterval(this.interval)
        this.startTime = new Date().getTime()
    }
}


module.exports = Timer