Class Player{

    constructor(){

         this.block = new Block();

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



    fallFast() {
        if(this.currentBlock != null){
            if (this.checkBlockMove(this.blockX, this.blockY + 1, this.currentBlock, this.blockAngle, 'me')) {
                this.blockY++;
                this.refreshStage();
                }
        }
    }

    moveLeft() {
        if(this.currentBlock != null){
            if (this.checkBlockMove(this.blockX - 1, this.blockY, this.currentBlock, this.blockAngle, 'me')) {
               this.blockX--;
               this.refreshStage();
                }
            }
    }

    moveRight() {
    if(this.currentBlock != null){
        if (this.checkBlockMove(this.blockX + 1, this.blockY, this.currentBlock, this.blockAngle, 'me')) {
            this.blockX++;
            this.refreshStage();
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


}