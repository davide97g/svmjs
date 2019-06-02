/*
🍀 🐢 🐧 🐓 🐼 🐻 🐵
😄 😐 😱 💀 👍 👎 💪
🔥 ✏
 */

let N = 10000; //dataset
let L = 0; //chosen points
let M = 0; //centers
let C = 0; //centers kmeans
let weightC = 20; //weight for the kmeans centers
let seeds = new Array(N); //original
let centers = new Array(C); //centers of kmeans
let labelsC = new Array(C); //labels for centers of kmeans
let chosen = []; //original
let chosenLabels  = [];
let fold = 200; //keeps track of the fold where are in speaking about chosen point array
let data = new Array(M); //accumulative
let labels = new Array(M);
let canvasID = "canvasLVQ";
let ss= 50.0; // scaling factor for drawing
let density = 2; //drawing precision
let Km1 = 5;
let Km2 = 10;

let datasetID = 2;

function setDataSet(id) {
    datasetID = id;
}

function getDataSet(id,n) {
    if(id===1)
        return randomData(n);
    else if(id===2)
        return circleData(n);
    else if(id===3)
        return exclusiveOrData(n);
    else if(id===4)
        return gaussianData(n);
    else if(id===5)
        return spiralData(n);
    else if(id===6)
        return circleMultipleData(n);
}

function myinitLVQ(){
    console.info("LVQ canvas");
    drawAxes();
}
function start(FPS) {
    console.clear();
    console.info("🔥 START 🔥");
    L=0;
    
    let res = getDataSet(datasetID,N);
    for(let i=0;i<N;i++){
        seeds[i] = {};
        seeds[i].x = res.data[i][0];
        seeds[i].y = res.data[i][1];
        seeds[i].label = res.labels[i];
    }
    
    res = randomData(M);
    data = res.data;
    labels = res.labels;
    
    
    //data = [[1,1],[-1,1],[-1,-1],[1,-1]];
    //labels = [1,1,-1,-1];
    M = data.length;
    
    setInterval(draw, 100/FPS);
}

function draw() {
    if(L>=N) return;
    //console.info("DRAW");
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    newPoint();
    drawAxes();
    drawPoints();
    //drawData();
    drawCenters();
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
    ctx.strokeStyle = 'rgb(0,0,0)';
    let radius = 8;
    M = data.length;
    console.info("\tDRAW DATA: "+M);
    for(let i=0;i<M;i++) {
        if (labels[i] === 1) //positive
            ctx.fillStyle = 'rgb(100,200,100)';//green
        else //negative
            ctx.fillStyle = 'rgb(200,100,100)'; //red
        drawCircle(data[i][0]*ss+WIDTH/2, data[i][1]*ss+HEIGHT/2, radius);
    }
}
function drawPoints() {
    //console.info("\tDRAW POINTS: "+L);
    let point,x,y;
    for(let i=0;i<L;i++) {
        point = chosen[i];
        if (point.label === 1) //positive
            ctx.fillStyle = 'rgba(100,200,100,0.5)';//green
        else //negative
            ctx.fillStyle = 'rgba(200,100,100,0.5)'; //red
        x = (point.x*ss+WIDTH/2);
        y = (point.y*ss+HEIGHT/2);
        ctx.fillRect(x-density/2-1, y-density-1, density+5, density+5);
    }
}
function drawCenters() {
    ctx.strokeStyle = 'rgb(0,0,0)';
    let radius = 8;
    C = centers.length;
    if(C===0) return;
    // console.info("\tDRAW CENTERS: "+C);
    for(let i=0;i<C;i++) {
        if (labelsC[i] === 1) //positive
            ctx.fillStyle = 'rgb(100,200,100)';//green
        else //negative
            ctx.fillStyle = 'rgb(200,100,100)'; //red
        drawCircle(centers[i][0]*ss+WIDTH/2, centers[i][1]*ss+HEIGHT/2, radius);
    }
}
function newPoint() {
    let z = randi(0,N);
    let point = seeds[z];
    //move(point);
    chosen.push(point);
    chosenLabels.push(point.label);
    if(L%fold === 0 && L!==0){
        evaluateCenters();
        //fold++;
    }
    /*
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
    */
    L++;
}


function evaluateCenters() {
    console.info("\tEVALUATE");
    let set = {data:[],labels:[]};
    
    let input = setUpChosen();
    let I = input.data.length;
    if(C===0){ //è la prima volta che calcolo i centri dei KMeans
        set.data = input.data;
        set.labels = input.labels;
    }
    else{
        for(let i=0;i<C;i++){ //per tutti i centri
            for(let j=0;j<weightC;j++){
                set.data.push( centers[i] );
                set.labels.push( labelsC[i] );
            }
        }
        for(let i=0;i<I;i++){ //per tutti i chosen points
            set.data.push( input.data[i] );
            set.labels.push( input.labels[i] );
        }
    }
    
    console.info("\tCenters: "+C*weightC+"#");
    console.info("\tInput: "+L+"#");
    
    let res =  KMEANS(set.data,set.labels);
    centers = res.data;
    labelsC = res.labels;
    C = centers.length;
    
}

function setUpChosen() {
    let res = {data:[],labels:[]};
    for(let i=0;i<L;i++){
        res.data.push([chosen[i].x,chosen[i].y]);
        res.labels.push(chosenLabels[i]);
    }
    return res;
}

function prepareData(data) {
    let formatted = new Array(data.length);
    let x,y;
    for(let i=0;i<formatted.length;i++){
        x = data[i].x;
        y = data[i].y;
        formatted[i] = [x,y];
    }
    return formatted;
}

function KMEANS(data,labels) {
    let separated = separateData(data,labels);
    //Km1 = separated[0].length/10;
    //Km2 = separated[1].length/10;
    let kmeans1 = new KMeans({
        canvas: document.getElementById('canvasLVQ'),
        data: separated[0],
        k: Km1,
        p: 1
    });
    let kmeans2 = new KMeans({
        canvas: document.getElementById('canvasLVQ'),
        data: separated[1],
        k: Km2,
        p: 1
    });
    
    let means = new Array(2);
    means[0] = kmeans1.means;
    means[1] = kmeans2.means;
    let L1 = means[0].length;
    let L2 = means[1].length;
    let Ltot = L1+L2;
    
    let newData = new Array(Ltot);
    let newLabels = new Array(Ltot);
    
    for(let i=0;i<L1;i++){
        newData[i] = means[0][i];
        newLabels[i] = 1;
    }
    for(let i=L1;i<Ltot;i++) {
        newData[i] = means[1][i-L1];
        newLabels[i] = -1;
    }

    return {
        data: newData,
        labels: newLabels
    };
}

function separateData(data,labels) {
    let res = new Array(2);
    res[0] = [];
    res[1] = [];
    for(let i=0;i<data.length;i++){
        if(labels[i]===1)
            res[0].push(data[i]);
        else res[1].push(data[i]);
    }
    return res;
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
/*
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
            
            for(let j=0;j<L;j++){ //for all CHOSEN POINTS
                Dx = data[i][0]-chosen[j].x;
                Dy = data[i][1]-chosen[j].y;
                deltax = Math.exp(-Math.pow(Dx,2));
                deltay = Math.exp(-Math.pow(Dy,2));
                dist = deltay+deltax;
                sum += dist;
            }
            
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
*/
/*
function drawDataGrid() {
    // draw decisions in the grid
    density = 2;
    for(let x=0.0; x<=WIDTH; x+= density) {
        for(let y=0.0; y<=HEIGHT; y+= density) {
            ctx.fillStyle = getColor((x-WIDTH/2)/ss,(y-HEIGHT/2)/ss);
            ctx.fillRect(x-density/2-1, y-density-1, density+2, density+2);
        }
    }
}*/