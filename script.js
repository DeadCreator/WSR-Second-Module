const username = document.getElementById('name')
const timer = document.getElementById('timer')
const score = document.getElementById('score')

const startGame = document.getElementById('start-game')
const restartGame = document.getElementById('restart-game')

const startWindow = document.getElementById('start')
const endWindow = document.getElementById('end')

const attempts = document.getElementById('attempts')
const gameField = document.getElementById('game-field')

const userField = document.getElementById('user')

const bestUser = document.getElementById('best-user')
const bestScore = document.getElementById('best-score')

let seconds = 60
let gameOver = true
let timerId, timeLeft, generateBalloons, highUser
let points = 0
let highScore = 0

let games = []

const colors = ['red', 'orange', 'green' , 'brown']

const red = {
    size: 50,
    score: 10,
    life: 1
}

const orange = {
    size: 50,
    life: 1
}

const green = {
    size: 75,
    score: 5,
    life: 1.5
}

const brown = {
    size: 10,
    score: 15,
    life: 1
}

gameField.innerWidth = window.innerWidth - 75
gameField.innerHeight = window.innerHeight - (window.innerHeight / 100 * 16) - 50

document.addEventListener("resize", () => {
    gameField.innerWidth = window.innerWidth - 75
    gameField.innerHeight = window.innerHeight - (window.innerHeight / 100 * 16) - 50
})

startGame.addEventListener("click", () => {
    if (username.value) {
        startWindow.classList.add('hide-window')
        gameOver = false
        timer.innerHTML = '01:00'
        game()
        generateBalloons = setInterval(balloonHandler, 2000)

        timerId = setInterval(() => {
            seconds--
            timeLeft = '0' + Math.floor(seconds / 60) + ':'
            if (seconds > 9) {
                timeLeft += seconds
            }
            else {
                timeLeft += `0${seconds}`
            }
            timer.innerHTML = 'Time left: ' + timeLeft
        }, 1000)
    }

    else {
        username.placeholder = "Enter name, please!"
    }
})

restartGame.addEventListener("click", () => {
    if (!gameOver) {
        endWindow.classList.add('hide-window')
        startWindow.classList.remove('hide-window')
        seconds = 60
        attempts.innerHTML = ''
    }
})

function game() {

    if (!gameOver && seconds !== 0) {
        window.requestAnimationFrame(game)
    }

    else {
        clearInterval(timerId)
        clearInterval(generateBalloons)
        gameOver = true
        end()
        return
    }

    userField.innerHTML = username.value
    score.innerHTML = `Current score: ${points}`

    games.forEach(game => {
        if (game.score > highScore) {
            highScore = game.score
            highUser = game.user
        }
    })

    if (highScore === 0) {
        highUser = "Empty"
    }

    bestUser.innerHTML = `Best User: ${highUser}`
    bestScore.innerHTML = `Score: ${highScore}`
}

function balloonHandler () {
    for (let j = 1; j <= 5; j++) {
        const balloon = document.createElement('div')

        balloon.classList.add('balloon',
            colors[Math.floor(Math.random() * 4)])

        balloon.style.left = Math.random() * gameField.innerWidth + 'px'
        balloon.style.bottom = Math.random() * gameField.innerHeight + 'px'

        balloon.addEventListener("click", () => {
            if (balloon.classList[1] === 'orange') {
                gameOver = true
                return
            }

            points += eval(balloon.classList[1] + '.score')
            balloon.remove()
        })

        gameField.append(balloon)
        let lifeTimer = eval(balloon.classList[1] + '.life') * 1000
        let balloonSize = eval(balloon.classList[1] + '.size')
        let balloonLife = setInterval(() => {
            if (lifeTimer === 0) {
                clearInterval(balloonLife)
                balloon.remove()
            }


            balloonSize -= eval(balloon.classList[1] + '.size') / (eval(balloon.classList[1] + '.life') * 100)
            balloon.style.width = balloonSize + 'px'
            balloon.style.height = balloonSize + 'px'
            lifeTimer -= eval(balloon.classList[1] + '.life') * 10

        }, eval(balloon.classList[1] + '.life') * 10)
    }
}


function end() {
    endWindow.classList.remove('hide-window')

    let result = {
        user: username.value,
        score: points
    }

    games.push(result)

    for (let j = 0; j < 9; j++) {
        attempts.innerHTML += `User: ${games[j].user} - Score: ${games[j].score}<br>`
    }

    gameOver = false
    points = 0
}


