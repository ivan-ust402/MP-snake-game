/**
 * Здесь будет храниться статус игры, например, в игре, 
 * завершили или приостановили
 */
class Status {
    constructor() {
        this.setPaused();
    }

    /**
     * Установка состояния: В игре
     */
    setPlaying() {
        this.condition = 'playing';
    }

    /**
     * Установка состояния: Игра на паузе или приостановлена
     */
    setPaused() {
        this.condition = 'paused';
    }

    /**
     * Проверка состояния: В игре
     * @returns если сейчас играем, тогда true, иначе false
     */
    isPlaying() {
        return this.condition === 'playing';
    }

        /**
     * Проверка состояния: На паузе
     * @returns если сейчас игра на паузе, тогда true, иначе false
     */
    isPaused() {
        return this.condition === 'paused';
    }
}