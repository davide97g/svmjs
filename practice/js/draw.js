let drawerjs = (function (exports) {
    let drawer = function (options) {};
    drawer.prototype = {
        setup: function (canvas_id,options){
            this.status = 0;
            //creo un nuovo oggetto per le canvas
            options.eventClick = true;
            try {
                this.engine = new Engine(canvas_id, options);
                //collego le funzioni per il controllo utente
                this.status = 1;
            }
            catch (e) {
                console.info(e);
            }
        },
        draw: function (training_set_input,test_set_input,options) {

            if(this.status){
                //prosegui
                // let training = {
                //     data: training_set_input.data,
                //     labels: training_set_input.labels,
                // };
                let training = training_set_input;
                let test = test_set_input;

                let kmeans = options.kmeans || false;
                this.status = 2;
            }
            else{
                //avviso utente di fare il setup
                console.info("need to setup the drawer to proceed");
            }
            drawTraining(ctx);

            ctxTest.clearRect(0,0,WIDTH,HEIGHT);

            drawGrid(ctxTest);
            drawAxes(ctxTest);

            drawData(ctxTest);

            //draw test points
            if(useTest) drawTest(ctxTest);

            //draw kmeans centers
            if(!KMdata) drawKmeans(ctxTest);
            else drawDataKmeans(ctxTest);

            //draw linear kernel lines and support vector
            if( kernelid===0 || (kernelid === 2 && Degree ===  1))
                drawDataLinearKernel(ctxTest);
        },
    };
    // export public members
    exports = exports || {};
    exports.drawer = drawer;
    return exports;

})(typeof module != 'undefined' && module.exports);  // add exports to module.exports if in node.js

function clean() {
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    data = [];
    labels = [];
    N = 0;
    Ntest = 0;
    draw();
}

function draw(){

    drawTraining(ctx);

    ctxTest.clearRect(0,0,WIDTH,HEIGHT);
    if(N===0) return;
    drawGrid(ctxTest);
    drawAxes(ctxTest);

    drawData(ctxTest);

    //draw test points
    if(useTest) drawTest(ctxTest);

    //draw kmeans centers
    if(!KMdata) {
        if(drawKmeansPoints)
            drawKmeans(ctxTest);
    }
    else drawDataKmeans(ctxTest);

    //draw linear kernel lines and support vector
    if( !input_transformation && (kernelid===0 || (kernelid === 2 && Degree ===  1)))
        drawDataLinearKernel(ctxTest);
}

function drawTraining(ctx) {
    ctx.clearRect(0,0,WIDTH,HEIGHT); //clear canvas
    // draw axes
    drawAxes(ctx);
    // draw datapoints
    ctx.strokeStyle = 'rgb(0,0,0)';
    let radius = 5;
    let d,l,n;
    if(KMdata){
        d = dataOLD;
        l = labelsOLD;
        n = dataOLD.length;
    }
    else{
        d = data;
        l = labels;
        n = data.length;
    }
    console.info(" ✏ DRAW TRAINING DATA: "+n);
    for(let i=0;i<n;i++) {
        if(l[i]===1) //positive{
            ctx.fillStyle = 'rgb(100,200,100)';//green
        else //negative
            ctx.fillStyle = 'rgb(200,100,100)'; //red
        drawCircle(d[i][0]*ss+WIDTH/2, d[i][1]*ss+HEIGHT/2, radius);
    }
}

function drawAxes(ctx){
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(50,50,50)';
    ctx.lineWidth = 1;
    ctx.moveTo(0, HEIGHT/2);
    ctx.lineTo(WIDTH, HEIGHT/2);
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();
}

function drawData(ctx) {
    ctx.strokeStyle = 'rgb(0,0,0)';
    let radius = 5;
    let value = 0;
    console.info(" ✏ DRAW DATA: "+N);
    let values = [];
    for(let i=0;i<N;i++) {
        if(kernelid<3) {
            if(svm.alpha[i]>1e-7) {
                ctx.lineWidth = 3; // distinguish support vectors
                radius = Math.floor(3+svm.alpha[i]*5.0/svmC);
            }
            else{
                ctx.lineWidth = 1;
                radius = 4;
            }
        }
        value = getValue(data[i]);
        //COLORS
        if(value>0){ //positive
            if(labels[i]===1) { //positive
                ctx.fillStyle = 'rgb(100,200,100)'; //green
            }
            else { //false positive
                ctx.fillStyle = 'rgb(55,55,250)'; //blue
            }
        }
        else {
            if(labels[i]===1) { //false negative
                ctx.fillStyle = 'rgb(240,240,80)'; //yellow
            }
            else { //negative
                ctx.fillStyle = 'rgb(200,100,100)'; //red
            }
        }

        drawCircleTest(data[i][0]*ss+WIDTH/2, data[i][1]*ss+HEIGHT/2, radius);
        values.push(value);
    }
    let stats = statisticEval(labels,values);
    updateStats(stats);
}

function drawTest(ctx) {
    ctx.strokeStyle = 'rgb(0,0,0)';
    let radius = 5;
    console.info(" ✏ DRAW DATA TEST: "+Ntest);
    let values = [];
    let value = 0;
    for(let i=0;i<Ntest;i++) {
        value = getValue(datatest[i]);
        //COLORS
        if(value>0){ //positive
            if(labelstest[i]===1) { //positive
                ctx.fillStyle = 'rgb(100,200,100)'; //green
            }
            else { //false positive
                ctx.fillStyle = 'rgb(55,55,250)'; //blue
            }
        }
        else {
            if(labelstest[i]===1) { //false negative
                ctx.fillStyle = 'rgb(240,240,80)'; //yellow
            }
            else { //negative
                ctx.fillStyle = 'rgb(200,100,100)'; //red
            }
        }

        drawRectTest(datatest[i][0]*ss+WIDTH/2, datatest[i][1]*ss+HEIGHT/2, radius,radius);
        values.push(value);
    }
    let stats = statisticEval(labelstest,values);
    updateStatsTest(stats);
}

function drawKmeans(ctx) {
    // draw means
    ctx.strokeStyle = 'rgb(0,0,0)';
    let radius = 10;
    ctx.lineWidth = 3;
    console.info(" ✏ DRAW MEANS 1: "+means[0].length);
    for(let i=0;i<means[0].length;i++) {
        ctx.fillStyle = 'rgb(100,200,100)'; //green
        drawCircleTest(means[0][i][0]*ss+WIDTH/2, means[0][i][1]*ss+HEIGHT/2, radius);
    }
    console.info(" ✏ DRAW MEANS 2: "+means[1].length);
    for(let i=0;i<means[1].length;i++) {
        ctx.fillStyle = 'rgb(200,100,100)'; //red
        drawCircleTest(means[1][i][0]*ss+WIDTH/2, means[1][i][1]*ss+HEIGHT/2, radius);
    }
}

function drawDataKmeans(ctx) {
    let L = dataOLD.length;
    ctx.strokeStyle = 'rgb(0,0,0)';
    let radius = 6;
    ctx.lineWidth = 1;
    console.info(" ✏ DRAW DATA KMEANS: "+L);
    let values = [];
    let value;
    for(let i=0;i<L;i++) {
        value = getValue(dataOLD[i]);
        //COLORS
        if(value>0){ //positive
            if(labelsOLD[i]===1) { //positive
                ctx.fillStyle = 'rgb(100,200,100)'; //green
            }
            else { //false positive
                ctx.fillStyle = 'rgb(55,55,250)'; //blue
            }
        }
        else {
            if(labelsOLD[i]===1) { //false negative
                ctx.fillStyle = 'rgb(240,240,80)'; //yellow
            }
            else { //negative
                ctx.fillStyle = 'rgb(200,100,100)'; //red
            }
        }

        drawRectTest(dataOLD[i][0]*ss+WIDTH/2, dataOLD[i][1]*ss+HEIGHT/2,radius,radius);
        values.push(value);
    }

    let stats = statisticEval(labelsOLD,values);
    updateStats(stats);

    data = dataOLD;
    labels = labelsOLD;
}

function drawGrid(ctx) {
    density = 2;
    for(let x=0.0; x<=WIDTH; x+= density) {
        for(let y=0.0; y<=HEIGHT; y+= density) {
            ctx.fillStyle = getColor([(x-WIDTH/2)/ss,(y-HEIGHT/2)/ss]);
            ctx.fillRect(x-density/2-1, y-density-1, density+2, density+2);
        }
    }
}

function drawDataLinearKernel(ctx) {
    let xs= [-5, 5];
    let ys= [0, 0];
    wb.b = -wb.b;
    ys[0]= (-wb.b - wb.w[0]*xs[0])/wb.w[1];
    ys[1]= (-wb.b - wb.w[0]*xs[1])/wb.w[1];
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // wx+b=0 line
    ctx.moveTo(xs[0]*ss+WIDTH/2, ys[0]*ss+HEIGHT/2);
    ctx.lineTo(xs[1]*ss+WIDTH/2, ys[1]*ss+HEIGHT/2);
    // wx+b=1 line
    ctx.moveTo(xs[0]*ss+WIDTH/2, (ys[0]-1.0/wb.w[1])*ss+HEIGHT/2);
    ctx.lineTo(xs[1]*ss+WIDTH/2, (ys[1]-1.0/wb.w[1])*ss+HEIGHT/2);
    // wx+b=-1 line
    ctx.moveTo(xs[0]*ss+WIDTH/2, (ys[0]+1.0/wb.w[1])*ss+HEIGHT/2);
    ctx.lineTo(xs[1]*ss+WIDTH/2, (ys[1]+1.0/wb.w[1])*ss+HEIGHT/2);
    ctx.stroke();

    // draw margin lines for support vectors. The sum of the lengths of these
    // lines, scaled by C is essentially the total hinge loss.
    for(let i=0;i<N;i++) {
        if(svm.alpha[i]<1e-2) continue;
        if(labels[i]===1) {
            ys[0]= (1 -wb.b - wb.w[0]*xs[0])/wb.w[1];
            ys[1]= (1 -wb.b - wb.w[0]*xs[1])/wb.w[1];
        } else {
            ys[0]= (-1 -wb.b - wb.w[0]*xs[0])/wb.w[1];
            ys[1]= (-1 -wb.b - wb.w[0]*xs[1])/wb.w[1];
        }
        let u= (data[i][0]-xs[0])*(xs[1]-xs[0])+(data[i][1]-ys[0])*(ys[1]-ys[0]);
        u = u/((xs[0]-xs[1])*(xs[0]-xs[1])+(ys[0]-ys[1])*(ys[0]-ys[1]));
        let xi= xs[0]+u*(xs[1]-xs[0]);
        let yi= ys[0]+u*(ys[1]-ys[0]);
        ctx.moveTo(data[i][0]*ss+WIDTH/2, data[i][1]*ss+HEIGHT/2);
        ctx.lineTo(xi*ss+WIDTH/2, yi*ss+HEIGHT/2);
    }
    ctx.stroke();
}

function getValue(v) {
    let value = 0;
    let x = v[0];
    let y = v[1];

    if(kernelid<3){
        if(kernelid===2 && input_transformation){
            let input_f = (function () {});
            for(let i=0;i<input_functions.length;i++){
                input_f = input_functions[i];
                v = input_f(v);
            }
        }
        value = svm.marginOne(v);
    }
    else if(kernelid===3) { //KNN
        value = KNN(x,y,K);
    }
    else if(kernelid===4){ //RBF
        value = RBF(x,y);
    }
    return value;
}

function getColor(v) {
    let color;
    let value = getValue(v);
    if(kernelid<3){
        // value= getValue(v);
        if(value>0) color = 'rgb(150,250,150)';
        else color = 'rgb(250,150,150)';
    }
    else if(kernelid===3) { //KNN
        // value = getValue(v);
        if(value === 1) color = 'rgb(150,250,150)'; //green
        else if(value === 0) color = 'rgb(244,220,66)'; //yellow gold
        else color = 'rgb(250,150,150)'; //red
    }
    else if(kernelid===4){ //RBF
        // value = getValue(v);
        if(value === 2) color = 'rgb(150,250,150)'; //green
        else if(value === 0) color = 'rgb(0,0,0)'; //pure black
        else if(value === 1) color = 'rgb(255,255,50)'; //yellow gold
        else if(value === -1) color = 'rgb(255,165,50)'; //orange
        else if(value === -2) color = 'rgb(250,150,150)'; //red
    }
    return color;
}

function updateStats(stats) {
    let CM = stats.CM;
    let tp = CM[0][0];
    let fp = CM[0][1];
    let fn = CM[1][0];
    let tn = CM[1][1];
    document.getElementById("tp").innerText=tp;
    document.getElementById("fp").innerText=fp;
    document.getElementById("fn").innerText=fn;
    document.getElementById("tn").innerText=tn;
    document.getElementById("precision").innerText=(stats.precision*100).toPrecision(3);
    document.getElementById("recall").innerText=(stats.recall*100).toPrecision(3);
    document.getElementById("accurancy").innerText=(stats.accurancy*100).toPrecision(3);
    document.getElementById("specificity").innerText=(stats.specificity*100).toPrecision(3);
    document.getElementById("fmeasure").innerText=(stats.fMeasure*100).toPrecision(3);
}

function updateStatsTest(stats) {
    let CM = stats.CM;
    let tp = CM[0][0];
    let fp = CM[0][1];
    let fn = CM[1][0];
    let tn = CM[1][1];
    document.getElementById("tp2").innerText=tp;
    document.getElementById("fp2").innerText=fp;
    document.getElementById("fn2").innerText=fn;
    document.getElementById("tn2").innerText=tn;
    document.getElementById("precision2").innerText=(stats.precision*100).toPrecision(3);
    document.getElementById("recall2").innerText=(stats.recall*100).toPrecision(3);
    document.getElementById("accurancy2").innerText=(stats.accurancy*100).toPrecision(3);
    document.getElementById("specificity2").innerText=(stats.specificity*100).toPrecision(3);
    document.getElementById("fmeasure2").innerText=(stats.fMeasure*100).toPrecision(3);
}