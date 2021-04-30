//initialize variables

let canvas, c, w, h, scale, game, tileSize, moves, status;
//initialize the game board
const init = () => {
    moves = 0;
    tileSize = 96;
    createGame(3);
    canvas = document.createElement('canvas');
    updateCanvas();
    const options = document.createElement('div');
    const scrambleBtn = document.createElement('button');
    scrambleBtn.innerText = "Scramble";
    scrambleBtn.addEventListener('click', () => scramble(Math.floor(Math.random()*100)));
    const cubeSize = document.createElement('select');
    for(let i = 3; i < 6; i++){
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = i;
        cubeSize.appendChild(opt);
    }
    cubeSize.addEventListener('change', function(){ //listens for a response from the player
        const value = parseInt(this.value);
        tileSize = 96 - (value-3) * 16;
        createGame(value);
        updateCanvas();
        scramble(100);
    })
    status = document.createElement('div');
    status.id = 'status';
    options.appendChild(cubeSize);
    options.appendChild(scrambleBtn);
    document.body.appendChild(status);
    document.body.appendChild(canvas);
    document.body.appendChild(options);
    scramble(1000);
}

//this function refreshes the canvas
const updateCanvas = () => {
    scale = window.devicePixelRatio;
    w = game[0].length * tileSize;
    h =  game.length * tileSize;
    canvas.width = w * scale;
    canvas.height = h * scale;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    c = canvas.getContext('2d');
    c.scale(scale, scale);
    c.textAlign = "center";
    c.textBaseline = "middle";
    const fontSize = 24;
    c.font = `${fontSize}px Arial`;
    canvas.addEventListener('click', move);
}

//this function recreates a new game
const createGame = num => {
    game = Array(num).fill().map(_ => Array(num).fill(0))
    for(let i = 0; i < num; i++){
        for(let j = 0; j < num; j++){
            game[i][j] = (i * num + j + 1) % (num*num)
        }
    }
}

const getPos = e => {return {x: Math.floor(e.offsetX / tileSize), y: Math.floor(e.offsetY / tileSize)};} //gets the existing position of the tiles following a move

//draw the tiles on the screen
const draw = () => {
    c.clearRect(0,0,w,h);
    c.strokeStyle = "black";
    for(let i = 0; i < game.length; i++){
        for(let j = 0; j < game[0].length; j++){
            const piece = game[i][j];
            if(!piece)
                continue
            const x = j * tileSize;
            const y = i * tileSize;
            c.fillStyle = "white";
            c.fillRect(x, y, tileSize, tileSize);
            c.strokeRect(x, y, tileSize, tileSize);
            c.fillStyle = "black";
            c.fillText(piece, x+tileSize/2, y+tileSize/2);
        }
    }
}

//Looks for the empty position on the canvas
const findEmptyPos = () => {
    for(let i = 0; i < game.length; i++){
        for(let j = 0; j < game[0].length; j++){
            if(game[i][j]==0){
                return {x: j, y: i};
            }
        }
    }
}

const checkInvalid = (x, y, i, j) => {
 
    if (x + j <0 || x + j >= game[0].length || y + i <0 || y + i >= game.length )
        return true
    else
        return false
}
//
//
//Please update this function - insert code here to check if a move is invalid
//
//

const getNeighbour = pos => { //recalculates the new numbers that will b0e adjacent in a new game 
    let n = []
    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            if(checkInvalid(pos.x, pos.y, i, j))
                continue
             
            if(game[pos.y+i][pos.x+j])
                n.push({x: pos.x+j, y: pos.y+i});
            
        }
       
    }
    return n
}

const scramble = (num =1) => { //scrambles the numbers to start a new game
    moves = 0
    for(let i = 0; i < num; i++){
        const emptyPos = findEmptyPos();
        const n = getNeighbour(emptyPos);
        const move = n[Math.floor(Math.random() * n.length)];
        tradePos(move, emptyPos);
    }
    draw();
    if(!checkGameWin()){
        status.innerText = '';
    }
}

const lookEmptyPos = pos => {   
    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            if(checkInvalid(pos.x, pos.y, i, j))
                continue
            if(!game[pos.y+i][pos.x+j])
                return {x: pos.x+j, y: pos.y+i};
        }
    }
    return null
}

const tradePos = (pos, newPos) => {  //handles the trading of tiles in a move
    if(!newPos) 
        return
    game[newPos.y][newPos.x] = game[pos.y][pos.x];
    game[pos.y][pos.x] = 0;
}

const checkGameWin = () => {
    var win = true;
    var counter = 0;
    for(var i =0; i<game.length; i++){
        for(var j=0; j<game.length; j++){
            counter  +=1;
            if(game[i][j] !=counter){
                if(!game[i][j])
                    continue
                return false;
            }
        }
    }
        return win
}

const move = e => { //handles the movement of an actual tile.
    const pos = getPos(e);
    const newPos = lookEmptyPos(pos);
    tradePos(pos, newPos);
    status.innerText = checkGameWin() ? `Win - ${moves} moves` : '';
    draw();
    moves += 1;
}

init();
