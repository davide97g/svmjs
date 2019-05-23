/*
🍀 🐢 🐧 🐓 🐼 🐻 🐵
😄 😐 😱 💀 👍 👎 💪
🔥 ✏
 */

let N = 10000; //dataset
let L = 0; //chosen points
let M = 0; //centers
let seeds = new Array(N); //original
let chosen = []; //original
let data = new Array(M); //accumulative
let canvasID = "canvasLVQ";
let ss= 50.0; // scaling factor for drawing
let density = 2; //drawing precision
let rebornf = 600;
let newf = 30;

function myinitLVQ(){
    console.info("LVQ canvas");
    drawAxes();
}
function start(FPS) {
    console.clear();
    console.info("🔥 START");
    L=0;
    
    let res = spiralData(N);
    for(let i=0;i<N;i++){
        seeds[i] = {};
        seeds[i].x = res.data[i][0];
        seeds[i].y = res.data[i][1];
        seeds[i].label = res.labels[i];
    }
    //console.table(seeds);
    
    res = randomData(M);
    data = res.data;
    labels = res.labels;
    
    //data = [[1,1],[-1,1],[-1,-1],[1,-1]];
    //labels = [1,1,-1,-1];
    M = data.length;
    //console.table(data);
    //console.table(labels);
    
    setInterval(draw, 500/FPS);
}

function draw() {
    if(L>=N) return;
    // console.info("DRAW");
    
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    
    newPoint();
    //drawDataGrid();
    drawAxes();
    drawPoints();
    drawData();
}

function drawAxes(){
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(50,50,50)';
    ctx.lineWidth = 1;
    ctx.moveTo(0, HEIGHT/2);
    ctx.lineTo(WIDTH, HEIGHT/2);
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();
}
function drawData() {
    // draw datapoints
    ctx.strokeStyle = 'rgb(0,0,0)';
    let radius = 8;
    M = data.length;
    // console.info(" ✏ DRAW DATA: "+M);
    for(let i=0;i<M;i++) {
        if (labels[i] === 1) //positive
            ctx.fillStyle = 'rgb(100,200,100)';//green
        else //negative
            ctx.fillStyle = 'rgb(200,100,100)'; //red
        drawCircle(data[i][0]*ss+WIDTH/2, data[i][1]*ss+HEIGHT/2, radius);
    }
}
function drawPoints() {
    // console.info(" ✏ DRAW POINTS: "+L);
    let point,x,y;
    for(let i=0;i<L;i++) {
        point = chosen[i];
        if (point.label === 1) //positive
            ctx.fillStyle = 'rgb(100,200,100)';//green
        else //negative
            ctx.fillStyle = 'rgb(200,100,100)'; //red
        x = (point.x*ss+WIDTH/2);
        y = (point.y*ss+HEIGHT/2);
        ctx.fillRect(x-density/2-1, y-density-1, density+5, density+5);
    }
}

function newPoint() {
    let z = randi(0,N);
    let point = seeds[z];
    // console.info({point});
    move(point);
    
    chosen.push(point);
    if(L% newf === 0){ //ogni 100 aggiungo un centro
        console.info("NEW DATA");
        data.push([point.x,point.y,0]);
        labels.push(point.label);
        M++;
        let res = getAverage(point.label);
        let index = res.max;
        if(L>1500 && L%newf===0) {
            //data[index][2] = rebornf - 1; //last day of life
            data.splice(index,1);
            labels.splice(index,1);
            console.info("REBORN");
            M--;
        }
    }
    L++;
}


// function getMax(point) {
//     let index=0;
//     let Dx,Dy,deltax,deltay;
//     let delta = 0;
//     let max = 0;
//     for(let i=0;i<M;i++){
//         Dx = Math.abs(data[i][0]-point.x);
//         deltax = Math.exp(- Math.pow(Dx,2));
//
//         Dy = Math.abs(data[i][1]-point.y);
//         deltay = Math.exp(-Math.pow(Dy,2));
//
//         delta = deltax+deltay;
//         if(delta>max){
//             max = delta;
//             index = i;
//         }
//     }
//     return index;
// }

/*
function moveOne(point) {
    
    let alpha = 1e-1;
    
    let i = getMax(point);
    
    let Dx = Math.abs(data[i][0]-point.x);
    let deltax = alpha*Math.exp(- Math.pow(Dx,2));
    
    let Dy = Math.abs(data[i][1]-point.y);
    let deltay = alpha*Math.exp(-Math.pow(Dy,2));
    
    let datax = data[i][0];
    let datay = data[i][1];
    
    if(point.label === labels[i]){ //stessa label ==> li avvicino
        if(point.x < datax){
            data[i][0] = datax - deltax;
        }
        else {
            data[i][0] = datax + deltax;
        }
        if(point.y < datay){
            data[i][1] = datay - deltay;
        }
        else {
            data[i][1] = datay + deltay;
        }
    }
    else{
        if(point.x < datax){
            data[i][0] = datax + deltax;
        }
        else{
            data[i][0] = datax - deltax;
        }
        if(point.y < datay){
            data[i][1] = datay + deltay;
        }
        else {
            data[i][1] = datay - deltay;
        }
    }
}
*/


function getAverage(label) {
    let avg = 0;
    let Dx, Dy,deltax,deltay, dist;
    let sum = 0;
    let max = 0;
    let index = 0;
    let counter = 0;
    for(let i=0;i<M;i++){ //for all DATA
        if(label === data[i][2]){
            sum = 0;
            /*
            for(let j=0;j<L;j++){ //for all CHOSEN POINTS
                Dx = data[i][0]-chosen[j].x;
                Dy = data[i][1]-chosen[j].y;
                deltax = Math.exp(-Math.pow(Dx,2));
                deltay = Math.exp(-Math.pow(Dy,2));
                dist = deltay+deltax;
                sum += dist;
            }*/
            
            for(let j=0;j<M;j++){ //for all CHOSEN POINTS
                Dx = data[i][0]-data[j][0];
                Dy = data[i][1]-data[j][1];
                deltax = Math.exp(-Math.pow(Dx,2));
                deltay = Math.exp(-Math.pow(Dy,2));
                dist = deltay+deltax;
                sum += dist;
            }
            if(sum>max){
                max = sum;
                index = i;
            }
            counter++; //data with equal label
        }
    }
    avg = sum/counter;
    return { average:avg, max:index };
}
function move(point) {
    let Dx,Dy,deltax,deltay,datax,datay;
    let alpha = 1e-1;
    for(let i=0;i<M;i++){ //move every data point from 1 chosen seed
    
        data[i][2]++;
        /*
        if(data[i][2] % rebornf === 0){ //fine vita
            data.splice(i,1);
            labels.splice(i,1);
            console.info("REBORN");
            //data[i][0] = point.x;
            //data[i][1] = point.y;
            //data[i][2] = 0; //riporto alla vita
            //labels[i] = point.label;
            i--;
            M--;
            continue;
        }*/
        
        Dx = data[i][0]-point.x;
        deltax = alpha*Math.exp(- Math.pow(Dx,2));
        
        Dy = data[i][1]-point.y;
        deltay = alpha*Math.exp(-Math.pow(Dy,2));
        
        datax = data[i][0];
        datay = data[i][1];
        
        if(point.label === labels[i]){ //stessa label ==> li avvicino
            if(point.x < datax){
                data[i][0] = datax - deltax;
            }
            else {
                data[i][0] = datax + deltax;
            }
            if(point.y < datay){
                data[i][1] = datay - deltay;
            }
            else {
                data[i][1] = datay + deltay;
            }
            /*
            //random
            if(randi(0,100)===50 && (Dx+Dy)>1.5){
                data[i][0] = randf(-3,3);
                data[i][1] = randf(-3,3);
            }*/
        }
        /*
        else{
            if(point.x < datax){
                data[i][0] = datax + deltax;
            }
            else{
                data[i][0] = datax - deltax;
            }
            if(point.y < datay){
                data[i][1] = datay + deltay;
            }
            else {
                data[i][1] = datay - deltay;
            }
        }*/
    }
}

function drawDataGrid() {
    // draw decisions in the grid
    density = 2;
    for(let x=0.0; x<=WIDTH; x+= density) {
        for(let y=0.0; y<=HEIGHT; y+= density) {
            ctx.fillStyle = getColor((x-WIDTH/2)/ss,(y-HEIGHT/2)/ss);
            ctx.fillRect(x-density/2-1, y-density-1, density+2, density+2);
        }
    }
}