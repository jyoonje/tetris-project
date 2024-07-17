class WebSocket{


   connect() {
    console.log('연결 시도');
           this.socket = new WebSocket('ws://localhost:8080/ws');

           this.socket.onopen = (event) => {
                console.log('Connected to: ' + event.currentTarget.url);
           };

           this.socket.onmessage = (event) => {
                 const opponentState = JSON.parse(event.data);
//                if(opponentState.clientId != this.clientId){
                     document.getElementById('othersId').innerText = 'ID: ' + opponentState.clientId;
                     document.getElementById('othersScore').innerText = 'SCORE: ' + opponentState.myScore;
                    this.updateOpponentTetris(opponentState);
//                 }
           };

           this.socket.onclose = (event) => {
                console.log('Disconnectedasdasdsad');
           };

           this.socket.onerror = (error) => {
                console.log('Error: ' + error.message);
           };
    }

    sendMessage() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send('Hello, Server!');
        }
    }

    sendGameState() {
        const gameState = {
            clientId: this.clientId,
            myScore: this.deletedLines,
            currentBlock: this.currentBlock,
            nextBlock: this.nextBlock,
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

}