class BlockFactory{

    createBlocks() {
            let blocks = [
                {
                    shape: [[[-1, 0], [0, 0], [1, 0], [2, 0]],
                            [[0, -1], [0, 0], [0, 1], [0, 2]],
                            [[-1, 0], [0, 0], [1, 0], [2, 0]],
                            [[0, -1], [0, 0], [0, 1], [0, 2]]],
                    color: "rgb(0, 255, 255)",
                    highlight: "rgb(255, 255, 255)",
                    shadow: "rgb(0, 128, 128)"
                },
                {
                    shape: [[[0, 0], [1, 0], [0, 1], [1, 1]],
                            [[0, 0], [1, 0], [0, 1], [1, 1]],
                            [[0, 0], [1, 0], [0, 1], [1, 1]],
                            [[0, 0], [1, 0], [0, 1], [1, 1]]],
                    color: "rgb(255, 255, 0)",
                    highlight: "rgb(255, 255, 255)",
                    shadow: "rgb(128, 128, 0)"
                },
                {
                    shape: [[[0, 0], [1, 0], [-1, 1], [0, 1]],
                            [[-1, -1], [-1, 0], [0, 0], [0, 1]],
                            [[0, 0], [1, 0], [-1, 1], [0, 1]],
                            [[-1, -1], [-1, 0], [0, 0], [0, 1]]],
                    color: "rgb(0, 255, 0)",
                    highlight: "rgb(255, 255, 255)",
                    shadow: "rgb(0, 128, 0)"
                },
                {
                    shape: [[[-1, 0], [0, 0], [0, 1], [1, 1]],
                            [[0, -1], [-1, 0], [0, 0], [-1, 1]],
                            [[-1, 0], [0, 0], [0, 1], [1, 1]],
                            [[0, -1], [-1, 0], [0, 0], [-1, 1]]],
                    color: "rgb(255, 0, 0)",
                    highlight: "rgb(255, 255, 255)",
                    shadow: "rgb(128, 0, 0)"
                },
                {
                    shape: [[[-1, -1], [-1, 0], [0, 0], [1, 0]],
                            [[0, -1], [1, -1], [0, 0], [0, 1]],
                            [[-1, 0], [0, 0], [1, 0], [1, 1]],
                            [[0, -1], [0, 0], [-1, 1], [0, 1]]],
                    color: "rgb(0, 0, 255)",
                    highlight: "rgb(255, 255, 255)",
                    shadow: "rgb(0, 0, 128)"
                },
                {
                    shape: [[[1, -1], [-1, 0], [0, 0], [1, 0]],
                            [[0, -1], [0, 0], [0, 1], [1, 1]],
                            [[-1, 0], [0, 0], [1, 0], [-1, 1]],
                            [[-1, -1], [0, -1], [0, 0], [0, 1]]],
                    color: "rgb(255, 165, 0)",
                    highlight: "rgb(255, 255, 255)",
                    shadow: "rgb(128, 82, 0)"
                },
                {
                    shape: [[[0, -1], [-1, 0], [0, 0], [1, 0]],
                            [[0, -1], [0, 0], [1, 0], [0, 1]],
                            [[-1, 0], [0, 0], [1, 0], [0, 1]],
                            [[0, -1], [-1, 0], [0, 0], [0, 1]]],
                    color: "rgb(255, 0, 255)",
                    highlight: "rgb(255, 255, 255)",
                    shadow: "rgb(128, 0, 128)"
                }
            ];
            return blocks;
        }

    drawBlock(x, y, type, angle, canvas, target) {
        let context = canvas.getContext("2d");
        let block = this.blocks[type];

        if( target === 'me'){
            for (let i = 0; i < block.shape[angle].length; i++) {
                this.drawCell(context,
                         x + (block.shape[angle][i][0] * this.cellSize),
                         y + (block.shape[angle][i][1] * this.cellSize),
                         this.cellSize,
                         type);
            }
        }
        if( target === 'other'){
                    for (let i = 0; i < block.shape[angle].length; i++) {
                        this.drawCell(context,
                             x + (block.shape[angle][i][0] * this.cellSize2),
                             y + (block.shape[angle][i][1] * this.cellSize2),
                             this.cellSize2,
                             type);
                        }
                    }
            }

    drawCell(context, cellX, cellY, cellSize, type) {
        let block = this.blocks[type];
        let adjustedX = cellX + 0.5;
        let adjustedY = cellY + 0.5;
        let adjustedSize = cellSize - 1;
        context.fillStyle = block.color;
        context.fillRect(adjustedX, adjustedY, adjustedSize, adjustedSize);
        context.strokeStyle = block.highlight;
        context.beginPath();
        context.moveTo(adjustedX, adjustedY + adjustedSize);
        context.lineTo(adjustedX, adjustedY);
        context.lineTo(adjustedX + adjustedSize, adjustedY);
        context.stroke();
        context.strokeStyle = block.shadow;
        context.beginPath();
        context.moveTo(adjustedX, adjustedY + adjustedSize);
        context.lineTo(adjustedX + adjustedSize, adjustedY + adjustedSize);
        context.lineTo(adjustedX + adjustedSize, adjustedY);
        context.stroke();
    }

    createNewBlock() {
        this.currentBlock = this.nextBlock;
        this.nextBlock = this.getRandomBlock();
        this.blockX = Math.floor(this.stageWidth / 2 - 2);
        this.blockY = 0;
        this.blockAngle = 0;
        this.drawNextBlock();
        if (!this.checkBlockMove(this.blockX, this.blockY, this.currentBlock, this.blockAngle, 'me')) {
            let messageElem = document.getElementById("message");
            messageElem.innerText = "GAME OVER";
            return false;
        }
        return true;
    }

    drawNextBlock() {
        this.clear(this.nextCanvas);
        this.drawBlock(this.cellSize * 2, this.cellSize, this.nextBlock,
            0, this.nextCanvas, 'me');
    }

    getRandomBlock() {
        return  Math.floor(Math.random() * 7);
    }

    checkBlockMove(x, y, type, angle, target) {
        if(target === 'me'){
            for (let i = 0; i < this.blocks[type].shape[angle].length; i++) {
                let cellX = x + this.blocks[type].shape[angle][i][0];
                let cellY = y + this.blocks[type].shape[angle][i][1];

                if (cellX < 0 || cellX > this.stageWidth - 1) {
                    return false;
                }
                if (cellY > this.stageHeight - 1) {
                    this.sendGameState();
                    return false;
                }
                if (this.virtualStage[cellX][cellY] != null) {
                    this.sendGameState();
                    return false;
                }
            }
            return true;
        }
        if(target === 'other'){
            for (let i = 0; i < this.blocks[type].shape[angle].length; i++) {
                let cellX = x + this.blocks[type].shape[angle][i][0];
                let cellY = y + this.blocks[type].shape[angle][i][1];
                if (cellX < 0 || cellX > this.stageWidth2 - 1) {
                    return false;
                }
                if (cellY > this.stageHeight2 - 1) {
                    return false;
                }
                if (this.virtualStage2[cellX][cellY] != null) {
                    return false;
                }
            }
            return true;
        }
    }

    fixBlock(x, y, type, angle, target) {
        let cellX = null;
        let cellY = null;
        let filled = null;

        if(target === 'me'){
            for (let i = 0; i < this.blocks[type].shape[angle].length; i++) {
                cellX = x + this.blocks[type].shape[angle][i][0];
                cellY = y + this.blocks[type].shape[angle][i][1];
                if (cellY >= 0) {
                    this.virtualStage[cellX][cellY] = type;
                }
            }
            for (let y = this.stageHeight - 1; y >= 0; ) {
                filled = true;
                for (let x = 0; x < this.stageWidth; x++) {
                    if (this.virtualStage[x][y] == null) {
                        filled = false;
                        break;
                    }
                }
                if (filled) {

                    for (let y2 = y; y2 > 0; y2--) {
                        for (let x = 0; x < this.stageWidth; x++) {
                            this.virtualStage[x][y2] = this.virtualStage[x][y2 - 1];
                        }
                    }
                    for (let x = 0; x < this.stageWidth; x++) {
                        this.virtualStage[x][0] = null;
                    }
                let linesElem = document.getElementById("myScore");
                    this.deletedLines++;
                    linesElem.innerText = "" + this.deletedLines;
                } else {
                    y--;
                }
            }
        }
        if(target === 'other'){
            for (let i = 0; i < this.blocks[type].shape[angle].length; i++) {
                cellX = x + this.blocks[type].shape[angle][i][0];
                cellY = y + this.blocks[type].shape[angle][i][1];

                if (cellY >= 0) {
                    this.virtualStage2[cellX][cellY] = type;
                }
            }
            for(let y = this.stageHeight2-1; y>=0; ) {
                filled = true;
                for (let x = 0; x < this.stageWidth2; x++) {
                    if (this.virtualStage2[x][y] == null) {
                        filled = false;
                        break;
                    }
                }
                if(filled) {
                    for (let y2 = y; y2 > 0; y2--) {
                        for (let x = 0; x < this.stageWidth2; x++) {
                            this.virtualStage2[x][y2] = this.virtualStage2[x][y2 - 1];
                        }
                    }
                    for (let x = 0; x < this.stageWidth2; x++) {
                        this.virtualStage2[x][0] = null;
                    }
                } else {
                    y--;
                }
            }
        }
    }

}