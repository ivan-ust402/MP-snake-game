    // Главный объект, где будет происходить все движение

class Game {
    constructor() {
        this.tickIdentifier = null;
        this.messageEl = document.getElementById('message');
        this.moveControlsEl = document.querySelector('.move-controls')
    }

    /**
     * Метод получает другие игровые объекты, которые нужны ему
     * для работы.
     * @param {Settings} settings 
     * @param {Status} status 
     * @param {Board} board 
     * @param {Snake} snake 
     * @param {Menu} menu 
     * @param {Food} food 
     * @param {Score} score
     */
    init(settings, status, board, snake, menu, food, score) {
        this.settings = settings;
        this.status = status;
        this.board = board;
        this.snake = snake;
        this.menu = menu;
        this.food = food;
        this.score = score;
        console.log(this.moveControlsEl)

    }

    /**
     * Метод назначает обработчики на события клика на кнопки "Старт",
     * "Пауза", а также на стрелки на клавиатуре.
     */
    run() {
        this.score.setToWin(this.settings.winLength);
        this.menu.addButtonsClickListeners(this.start.bind(this), this.pause.bind(this));
        document.addEventListener('keydown', this.pressKeyHandler.bind(this));
        this.moveControlsEl.addEventListener('click', this.clickControlHandler.bind(this))
    }

    /**
     * Метод запускает игру.
     */
    start() {
        if (this.status.isPaused()) {
            this.status.setPlaying();
            this.tickIdentifier = setInterval(this.doTick.bind(this), 1000 / this.settings.speed)
        }
    }

    /**
     * Метод ставит игру на паузу.
     */
    pause() {
        if (this.status.isPlaying()) {
            this.status.setPaused();
            clearInterval(this.tickIdentifier);
        }
    }

    /**
     * Этот метод запускается каждую секунду и осуществляет:
     * 1. перемещение змейки
     * 2. проверяет проиграна/выиграна ли игра
     * 3. увеличивает размер змейки, если она ест еду
     * 4. заново отрисовывает положение змейки и еды
     */
    doTick() {
        this.snake.performStep();
        this.score.setCurrent(this.snake.body.length);
        // if (this.isGameLost()) {
        //     return;
        // }
        if (this.isSnakeSteppedOntoItself()) {
            return;
        }
        if (this.isGameWon()) {
            return;
        }
        if (this.board.isHeadOnFood()) {
            this.snake.increaseBody();
            this.food.setNewFood();
        }
        this.board.clearBoard();
        this.food.setFood();
        this.board.renderSnake();
    }

    /**
     * В зависимости от нажатой кнопки (вверх, вниз влево, вправо)
     * будет вызываться соответствующий метод.
     * @param {KeyboardEvent} event
     */
    pressKeyHandler(event) {
        switch (event.key) {
            case "ArrowUp":
                this.snake.changeDirection('up');
                break;
            case "ArrowDown":
                this.snake.changeDirection('down');
                break;
            case "ArrowLeft":
                this.snake.changeDirection('left');                       
                break;
            case "ArrowRight":
                this.snake.changeDirection('right');
                break;
        }
    }

    /**
     * В зависимости от клика на экранные кнопки (вверх, вниз влево, вправо)
     * будет вызываться соответствующий метод.
     * @param {KeyboardEvent} event
     */
    clickControlHandler(event) {
        switch (event.target.id) {
            case "up":
                this.snake.changeDirection('up');
                break;
            case "down":
                this.snake.changeDirection('down');
                break;
            case "left":
                this.snake.changeDirection('left');                       
                break;
            case "right":
                this.snake.changeDirection('right');
                break;
        }
    }

    /** 
     * @deprecated МЕТОД УСТАРЕЛ, т.к. змейка теперь может проходить сквозь стены
     * Метод проверяет проиграна ли игра, останавливает игру в случае
     * проигрыша, выводит сообщение о проигрыше.
     * @returns {boolean} если мы шагнули в стену, тогда true, 
     * иначе false.
     */
    isGameLost() {
        if (this.board.isNextStepToWall(this.snake.body[0])) {
            clearInterval(this.tickIdentifier);
            this.setMessage('Вы проиграли =( Для начала новой партии обновите страницу');
            return true;
        }
        return false;
    }

    /**
     * Метод проверяет съела ли змейка сама себя.
     * @returns {boolean}
     */
    isSnakeSteppedOntoItself() {
        /*
        [
            {x: 1, y: 1}
            {x: 1, y: 2}
            {x: 1, y: 3}
        ]
        =>
        [
            "11", "12", "13"
        ]
        */
        let cellArr = this.snake.body.map(function (cellCoords) {
            return cellCoords.x.toString() + cellCoords.y.toString();
        })

        let head = cellArr.shift();
        if (cellArr.includes(head)) {
            clearInterval(this.tickIdentifier);
            this.setMessage('<br /> Вы проиграли =( <br/>Для начала новой партии обновите страницу.');
            return true;
        }
        return false;
    }

    /**
     * Метод выводит сообщение на странице.
     * @param {string} text 
     */
    setMessage(text) {
        this.messageEl.innerHTML = text;
    }

    /**
     * Метод проверяет выиграна ли игра, останавливает игру,
     * выводит сообщение о выигрыше.
     * @returns {boolean} если длина змейки достигла длины, нужной
     * для выигрыша, тогда true, иначе false.
     */
    isGameWon() {
        if (this.snake.body.length == this.settings.winLength) {
            clearInterval(this.tickIdentifier);
            this.setMessage('<br />ВЫ ВЫИГРАЛИ! <br /> Для начала новой партии обновите страницу.');
            return true;
        }
        return false;
    }
}