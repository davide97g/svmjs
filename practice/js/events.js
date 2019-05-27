function mouseClick(x, y, shiftPressed){
    
    // add datapoint at location of click
    N = data.length;
    data[N] = [(x-WIDTH/2)/ss, (y-HEIGHT/2)/ss];
    labels[N] = shiftPressed ? 1 : -1;
    if(labels[N]===1) console.info("Added 💚");
    else console.info("Added ❤️");
    N += 1;
    drawTraining(ctx);
    document.getElementById("kmdata").checked = false;
}

function keyUp(key){}

function keyDown(key){}