class Rival(){
    constructor(){

        this.stageWidth2 = 10;
        this.stageHeight2 = 20;
        this.stageCanvas2 = document.getElementById("stage2");
        let cellWidth2 = this.stageCanvas2.width / this.stageWidth2;
        let cellHeight2 = this.stageCanvas2.height / this.stageHeight2;
        this.cellSize2 = cellWidth2 < cellHeight2 ? cellWidth2 : cellHeight2;
        this.stageLeftPadding2 = (this.stageCanvas2.width - this.cellSize2 * this.stageWidth2) / 2;
        this.stageTopPadding2 = (this.stageCanvas2.height - this.cellSize2 * this.stageHeight2) / 2;

    }

    updateOpponentTetris(opponentState) {
        this.drawStage2();
        if (opponentState.currentBlock != null)  {
                opponentState.blockY = this.fallBlock2(opponentState);
        }
        if (opponentState.currentBlock != null)  {
            this.drawBlock(this.stageLeftPadding2 + opponentState.blockX * this.cellSize2,
            this.stageTopPadding2 + opponentState.blockY * this.cellSize2,
            opponentState.currentBlock, opponentState.blockAngle, this.stageCanvas2, 'other');
        }
    }

    fallBlock2(opponentState) {
        if (this.checkBlockMove(opponentState.blockX, opponentState.blockY + 1, opponentState.currentBlock, opponentState.blockAngle, 'other')) {
            opponentState.blockY++;
        } else {
            console.log('ddddd');
            this.fixBlock(opponentState.blockX, opponentState.blockY, opponentState.currentBlock, opponentState.blockAngle, 'other');
            opponentState.currentBlock = null;
        }
        return opponentState.blockY;
    }

}