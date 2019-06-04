function mouseClick(x, y, shiftPressed, ctrlPressed){
    if(ctrlPressed){ //voglio inserire un centro
        if(!KMdataUser) { //se esistono già i centri calcolati
            resetKmeans();
        }
        //abilito le flag a true per la modalità disegno e quella dei dati inseriti dall'utente
        document.getElementById("user_kmeans_points").checked = true;
        KMdataUser = true;
        document.getElementById("draw_kmeans_points").checked = true;
        if(shiftPressed) //verde
            means[0].push([(x-WIDTH/2)/ss, (y-HEIGHT/2)/ss]);
        else means[1].push([(x-WIDTH/2)/ss, (y-HEIGHT/2)/ss]); //rosso
        // draw();
    }
    else { //voglio inserire un punto normale
        // add datapoint at location of click
        N = data.length;
        data[N] = [(x - WIDTH / 2) / ss, (y - HEIGHT / 2) / ss];
        labels[N] = shiftPressed ? 1 : -1;
        if (labels[N] === 1) console.info("Added 💚");
        else console.info("Added ❤️");
        N++;
        if(N>1){
            hideUiThings();
            showUiThings();
        }
        drawTraining(ctx);
        document.getElementById("kmdata").checked = false;
    }
}

function keyUp(key){}

function keyDown(key){}