function mouseClick(x, y, shiftPressed, ctrlPressed){
    if(ctrlPressed){
        if(!KMdataUser && (drawKmeansPoints || KMdata)) {
            delete means[0];
            delete means[1];
            means[0] = [];
            means[1] = [];
        }
        KMdataUser = true;
        drawKmeansPoints = true;
        if(shiftPressed)
            means[0].push([(x-WIDTH/2)/ss, (y-HEIGHT/2)/ss]);
        else means[1].push([(x-WIDTH/2)/ss, (y-HEIGHT/2)/ss]);
        // draw();
    }
    else {
        // add datapoint at location of click
        N = data.length;
        data[N] = [(x - WIDTH / 2) / ss, (y - HEIGHT / 2) / ss];
        labels[N] = shiftPressed ? 1 : -1;
        if (labels[N] === 1) console.info("Added 💚");
        else console.info("Added ❤️");
        N += 1;
        drawTraining(ctx);
        document.getElementById("kmdata").checked = false;
    }
}

function keyUp(key){}

function keyDown(key){}