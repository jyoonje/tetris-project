class Tetris {
    constructor() {
        this.stageWidth = 10;
        this.stageHeight = 20;
        this.stageCanvas = document.getElementById("stage");
        this.nextCanvas = document.getElementById("next");
        let cellWidth = this.stageCanvas.width / this.stageWidth;
        let cellHeight = this.stageCanvas.height / this.stageHeight;
        this.cellSize = cellWidth < cellHeight ? cellWidth : cellHeight;
        this.stageLeftPadding = (this.stageCanvas.width - this.cellSize * this.stageWidth) / 2;
        this.stageTopPadding = (this.stageCanvas.height - this.cellSize * this.stageHeight) / 2;

        this.rivalStageWidth = 10;
        this.rivalStageHeight = 20;
        this.rivalStageCanvas = document.getElementById("stage2");
        let rivalCellWidth = this.rivalStageCanvas.width / this.rivalStageWidth;
        let rivalCellHeight = this.rivalStageCanvas.height / this.rivalStageHeight;
        this.rivalCellSize = rivalCellWidth < rivalCellHeight ? rivalCellWidth : rivalCellHeight;
        this.rivalStageLeftPadding = (this.rivalStageCanvas.width - this.rivalCellSize * this.rivalStageWidth) / 2;
        this.rivalStageTopPadding = (this.rivalStageCanvas.height - this.rivalCellSize * this.rivalStageHeight) / 2;

        this.blocks = this.createBlocks();
        this.deletedLines = 0;

        this.socket = null;
        this.cliendId = null;

        window.onkeydown = (e) => {
            if (e.keyCode === 37) {
                this.moveLeft();
            } else if (e.keyCode === 38) {
                this.rotate();
            } else if (e.keyCode === 39) {
                this.moveRight();
            } else if (e.keyCode === 32) {
                this.fall();
            } else if (e.keyCode === 40) {
                this.fallFast();
            }
        }
    }

    startGame() {
        let virtualStage = new Array(this.stageWidth);
        let rivalVirtualStage = new Array(this.rivalStageWidth);

        this.getClientId();

        for (let i = 0; i < this.stageWidth; i++) {
            virtualStage[i] = new Array(this.stageHeight).fill(null);
        }

         for (let i = 0; i < this.rivalStageWidth; i++) {
            rivalVirtualStage[i] = new Array(this.rivalStageHeight).fill(null);
        }

        this.virtualStage = virtualStage;
        this.rivalVirtualStage = rivalVirtualStage;

        this.currentBlock = null;
        this.currentRivalBlock = null;
        this.nextBlock = this.getRandomBlock();
        this.mainLoop();
    }

    mainLoop() {
        this.isFilled = false;
        if (this.currentBlock == null) {        // 현재 블럭이 없고, 새로운 블럭 생성에 실패하면 게임 종료
            if (!this.createNewBlock()) {
                return;
            }
        } else {                                // 현재 블럭이 있으면 진행
            this.fallBlock();
        }
        this.drawStage();
        if (this.currentBlock != null) {
            this.drawBlock(this.stageLeftPadding + this.blockX * this.cellSize,
                this.stageTopPadding + this.blockY * this.cellSize,
                this.currentBlock, this.blockAngle, this.stageCanvas, 'me');
        }
        if(!this.isFilled){
            this.sendGameState();
        }
        let waitTime = 500;
        if(this.deletedLines > 0) {
            waitTime = Math.max(50, 500 - (this.deletedLines * 200));
        }
        setTimeout(this.mainLoop.bind(this), waitTime);
    }

    getClientId() {
        fetch('/client-id')
            .then(response => response.json())
            .then(id => {
                this.clientId = id;
                document.getElementById('clientId').innerText = this.clientId;
            });
    }

    drawStage() {
        this.clear(this.stageCanvas);
        let context = this.stageCanvas.getContext("2d");
        for (let x = 0; x < this.virtualStage.length; x++) {
            for (let y = 0; y < this.virtualStage[x].length; y++) {
                if (this.virtualStage[x][y] != null) {
                    this.drawCell(context,
                        this.stageLeftPadding + (x * this.cellSize),
                        this.stageTopPadding + (y * this.cellSize),
                        this.cellSize,
                        this.virtualStage[x][y]);
                }
            }
        }
    }

    drawRivalStage() {
        this.clear(this.rivalStageCanvas);
        let context = this.rivalStageCanvas.getContext("2d");
        for (let x = 0; x < this.rivalVirtualStage.length; x++) {
             for (let y = 0; y < this.rivalVirtualStage[x].length; y++) {
                   if (this.rivalVirtualStage[x][y] != null) {
                        this.drawCell(context,
                        this.rivalStageLeftPadding + (x * this.rivalCellSize),
                        this.rivalStageTopPadding + (y * this.rivalCellSize),
                        this.rivalCellSize,
                        this.rivalVirtualStage[x][y]);
                   }
             }
       }
    }

    refreshStage() {
         this.clear(this.stageCanvas);
         this.drawStage();
         this.drawBlock(this.stageLeftPadding + this.blockX * this.cellSize,
                         this.stageTopPadding + this.blockY * this.cellSize,
                         this.currentBlock, this.blockAngle, this.stageCanvas, 'me');
    }

    clear(canvas) {
         let context = canvas.getContext("2d");
         context.fillStyle = "rgb(0, 0, 0)";
         context.fillRect(0, 0, canvas.width, canvas.height);
     }

    drawBlock(x, y, type, angle, canvas, target) {
        let context = canvas.getContext("2d");
        let block = this.blocks[type];

            for (let i = 0; i < block.shape[angle].length; i++) {
                if(target === 'me'){
                    this.drawCell(context,
                         x + (block.shape[angle][i][0] * this.cellSize),
                         y + (block.shape[angle][i][1] * this.cellSize),
                         this.cellSize,
                         type);
                 }
                 if( target === 'other'){
                 this.drawCell(context,
                         x + (block.shape[angle][i][0] * this.rivalCellSize),
                         y + (block.shape[angle][i][1] * this.rivalCellSize),
                         this.rivalCellSize,
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

    fallBlock() {
        if(this.currentBlock != null){
            if (this.checkBlockMove(this.blockX, this.blockY + 1, this.currentBlock, this.blockAngle, 'me')) {
                this.blockY++;
            } else {
                this.fixBlock(this.blockX, this.blockY, this.currentBlock, this.blockAngle, 'me');
                this.currentBlock = null;
            }
        }
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
//                this.sendGameState();
                return false;
            }
            if (this.virtualStage[cellX][cellY] != null) {
//                this.sendGameState();
                return false;
            }
        }
        return true;
    }
    if(target === 'other'){
            for (let i = 0; i < this.blocks[type].shape[angle].length; i++) {
                let cellX = x + this.blocks[type].shape[angle][i][0];
                let cellY = y + this.blocks[type].shape[angle][i][1];
                if (cellX < 0 || cellX > this.rivalStageWidth - 1) {
                    return false;
                }
                if (cellY > this.rivalStageHeight - 1) {
                    return false;
                }
                if (this.rivalVirtualStage[cellX][cellY] != null) {
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
                    this.isFilled = true;
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
                    this.rivalVirtualStage[cellX][cellY] = type;
                }
            }
            for(let y = this.rivalStageHeight-1; y>=0; ) {
                filled = true;
                for (let x = 0; x < this.rivalStageWidth; x++) {
                    if (this.rivalVirtualStage[x][y] == null) {
                        filled = false;
                        break;
                    }
                }
                if(filled) {
                    for (let y2=y; y2>0; y2--) {
                        for (let x = 0; x < this.rivalStageWidth; x++) {
                            this.rivalVirtualStage[x][y2] = this.rivalVirtualStage[x][y2 - 1];
                        }
                    }
                    for (let x = 0; x < this.rivalStageWidth; x++) {
                        this.rivalVirtualStage[x][0] = null;
                    }
                } else {
                    y--;
                }
            }
        }
    }

    connect() {
        this.socket = new WebSocket('ws://192.168.0.247:8080/ws');

        this.socket.onopen = (event) => {
             console.log('Connected to: ' + event.currentTarget.url);
        };

        this.socket.onmessage = (event) => {
             const rivalState = JSON.parse(event.data);
             this.currentRivalBlock = rivalState.currentBlock;
             if(rivalState.clientId != this.clientId){
                  document.getElementById('othersId').innerText = 'ID: ' + rivalState.clientId;
                  document.getElementById('othersScore').innerText = 'SCORE: ' + rivalState.myScore;
                 this.updateRivalTetris(rivalState);
              }
        };

        this.socket.onclose = (event) => {
             console.log('웹 소켓 통신 종료');
        };

        this.socket.onerror = (error) => {
             console.log('Error: ' + error.message);
        };
    }

    sendGameState() {
        const gameState = {
            clientId: this.clientId,
            myScore: this.deletedLines,
            currentBlock: this.currentBlock,
            blockX: this.blockX,
            blockY: this.blockY,
            blockAngle: this.blockAngle,
            stage: this.stage,
            deletedLines: this.deletedLines
    };
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(gameState));
        }
    }

    updateRivalTetris(rivalState) {
       this.drawRivalStage();
       if (this.currentRivalBlock != null)  {
              this.rivalBlockY = rivalState.blockY;
              this.rivalBlockX = rivalState.blockX;
              this.rivalBlockAngle = rivalState.blockAngle;
              this.fallRivalBlock();
        }
       this.drawRivalStage();
       if (this.currentRivalBlock != null){
              this.drawBlock(this.rivalStageLeftPadding + this.rivalBlockX * this.rivalCellSize,
              this.rivalStageTopPadding + this.rivalBlockY * this.rivalCellSize,
              this.currentRivalBlock, this.rivalBlockAngle, this.rivalStageCanvas, 'other');
          }
    }

      fallRivalBlock() {
            if(this.currentRivalBlock != null){
                if (this.checkBlockMove(this.rivalBlockX, this.rivalBlockY + 1, this.currentRivalBlock, this.rivalBlockAngle, 'other')) {
                    this.rivalBlockY++;
                } else {
                    this.fixBlock(this.rivalBlockX, this.rivalBlockY, this.currentRivalBlock, this.rivalBlockAngle, 'other');
                    this.currentRivalBlock = null;
                }
            }
        }

    fallFast() {
        if(this.currentBlock != null){
            if (this.checkBlockMove(this.blockX, this.blockY + 1, this.currentBlock, this.blockAngle, 'me')) {
                this.blockY++;
                this.refreshStage();
                this.sendGameState();
                }
        }
    }

    moveLeft() {
        if(this.currentBlock != null){
            if (this.checkBlockMove(this.blockX - 1, this.blockY, this.currentBlock, this.blockAngle, 'me')) {
               this.blockX--;
               this.refreshStage();
               this.sendGameState();
                }
            }
    }

    moveRight() {
    if(this.currentBlock != null){
        if (this.checkBlockMove(this.blockX + 1, this.blockY, this.currentBlock, this.blockAngle, 'me')) {
            this.blockX++;
            this.refreshStage();
            this.sendGameState();
        }
        }
    }

    rotate() {
        let newAngle;
        if (this.blockAngle < 3) {
            newAngle = this.blockAngle + 1;
        } else {
            newAngle = 0;
        }
        if(this.currentBlock != null){
        if (this.checkBlockMove(this.blockX, this.blockY, this.currentBlock, newAngle, 'me')) {
            this.blockAngle = newAngle;
            this.refreshStage();
            this.sendGameState();
        }
        }
    }

    fall() {
        if(this.currentBlock != null){
            while (this.checkBlockMove(this.blockX, this.blockY + 1, this.currentBlock, this.blockAngle, 'me')) {
                this.blockY++;
                this.refreshStage();
                this.sendGameState();
            }
        }
    }

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
}