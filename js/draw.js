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
            if( kernelid===0)
                drawDataLinearKernel(ctxTest);
        },
    };
    // export public members
    exports = exports || {};
    exports.drawer = drawer;
    return exports;

})(typeof module != 'undefined' && module.exports);  // add exports to module.exports if in node.js
let max;
let min;
function clean() {
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    data = [];
    labels = [];
    dataOLD = [];
    labelsOLD = [];
    datatest = [];
    labelstest = [];
    N = 0;
    Ntest = 0;
    KMdata = false;
    cleanKmeans();
    hideUiThings();
    showUiThings();
    draw();
}

function draw(){

    drawTraining(ctx);

    //draw kmeans centers
    if(drawKmeansPoints)
        drawKmeans(ctx,drawCircle);

    ctxTest.clearRect(0,0,WIDTH,HEIGHT);
    if(N===0) return;
    if(methodID!==3)
        drawGrid(ctxTest);
    else
        drawRandomForest(ctxTest);

    drawAxes(ctxTest);

    drawData(ctxTest);

    //draw test points
    if(useTest) drawTest(ctxTest);

    //draw kmeans centers
    if(!KMdata) {
        if(drawKmeansPoints)
            drawKmeans(ctxTest,drawCircleTest);
    }
    else drawDataKmeans(ctxTest);

    //draw linear kernel lines and support vector
    if( methodID===0 && !input_transformation && kernelid===0)
        drawDataLinearKernel(ctxTest);
}

function drawRandomForest(ctx) {
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    density = 2;
    // draw decisions in the grid
    for(let x=0.0; x<=WIDTH; x+= density) {
        for(let y=0.0; y<=HEIGHT; y+= density) {

            let dec= tree.predictOne([(x-WIDTH/2)/ss, (y-HEIGHT/2)/ss]);

            if(!drawSoft) {
                if(dec > 0.5) ctx.fillStyle = 'rgb(150,250,150)';
                else ctx.fillStyle = 'rgb(250,150,150)';
            } else {
                let ri= 250*(1-dec) + 150*dec;
                let gi= 250*dec + 150*(1-dec);
                ctx.fillStyle = 'rgb('+Math.floor(ri)+','+Math.floor(gi)+',150)';
            }

            ctx.fillRect(x-density/2-1, y-density-1, density+2, density+2);
        }
    }

    // draw axes
    // drawAxes(ctx);

    // // draw datapoints.
    // ctx.strokeStyle = 'rgb(0,0,0)';
    // for(let i=0;i<N;i++) {
    //     if(labels[i]===1) ctx.fillStyle = 'rgb(100,200,100)';
    //     else ctx.fillStyle = 'rgb(200,100,100)';
    //     drawCircle(data[i][0]*ss+WIDTH/2, data[i][1]*ss+HEIGHT/2, 5);
    // }
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
    // console.info(" ✏ DRAW TRAINING DATA: "+n);
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
    // console.info(" ✏ DRAW DATA: "+N);
    let values = [];
    for(let i=0;i<N;i++) {
        if(methodID===0) {
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
        if(methodID===0) value = 2*value-1;
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
    ctx.lineWidth = 0.75;
    ctx.strokeStyle = 'rgb(255,255,255)';
    let radius = 6;
    // console.info(" ✏ DRAW DATA TEST: "+Ntest);
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
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.lineWidth = 1;
}

function drawKmeans(ctx,drawF) {
    // draw means
    ctx.strokeStyle = 'rgb(255,255,255)';
    let radius = 10;
    ctx.lineWidth = 5;
    // console.info(" ✏ DRAW MEANS 1: "+means[0].length);
    for(let i=0;i<means[0].length;i++) {
        ctx.fillStyle = 'rgb(100,200,100)'; //green
        drawF(means[0][i][0]*ss+WIDTH/2, means[0][i][1]*ss+HEIGHT/2, radius);
    }
    // console.info(" ✏ DRAW MEANS 2: "+means[1].length);
    for(let i=0;i<means[1].length;i++) {
        ctx.fillStyle = 'rgb(200,100,100)'; //red
        drawF(means[1][i][0]*ss+WIDTH/2, means[1][i][1]*ss+HEIGHT/2, radius);
    }
    ctx.strokeStyle = 'rgb(0,0,0)';
}

function drawDataKmeans(ctx) {
    let L = dataOLD.length;
    ctx.strokeStyle = 'rgb(0,0,0)';
    let radius = 6;
    ctx.lineWidth = 1;
    // console.info(" ✏ DRAW DATA KMEANS: "+L);
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
    if(methodID===5)
        density = 3;
    else density = 2;
    for(let x=0.0; x<=WIDTH; x+= density) {
        for(let y=0.0; y<=HEIGHT; y+= density) {
            ctx.fillStyle = getColor([(x-WIDTH/2)/ss,(y-HEIGHT/2)/ss]);
            ctx.fillRect(x-density/2-1, y-density-1, density+2, density+2);
        }
    }
}

function drawIntermidiate(ctx,wb) {
    // ctx.clearRect(0,0,WIDTH,HEIGHT); //clear canvas
    // draw();
    let xs= [-7, 7];
    let ys= [0, 0];
    if(!karpathy)
        wb.b = -wb.b;
    ys[0]= (-wb.b - wb.w[0]*xs[0])/wb.w[1];
    ys[1]= (-wb.b - wb.w[0]*xs[1])/wb.w[1];
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // wx+b=0 line
    ctx.moveTo(xs[0]*ss+WIDTH/2, ys[0]*ss+HEIGHT/2);
    ctx.lineTo(xs[1]*ss+WIDTH/2, ys[1]*ss+HEIGHT/2);
    ctx.stroke();
}

function drawDataLinearKernel(ctx) {
    wb = svm.getWeights();
    let xs= [-7, 7];
    let ys= [0, 0];
    if(!karpathy)
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

    if(methodID===0){
        if(kernelid===0){
            let input_f = (function () {});
            for(let i=0;i<input_functions.length;i++){
                input_f = input_functions[i];
                v = input_f(v);
            }
        }
        value = svm.marginOne(v);
        value = (Math.tanh(value)+1)/2;
    }
    else if(methodID===1) { //KNN
        value = KNN(x,y,K);
    }
    else if(methodID===2){ //RBF
        value = RBF(x,y);
    }
    else if(methodID===3){ //Random Forest
        value = tree.predictOne(v);
        if(value>0.5) value = 1;
        else value = -1;
    }
    else if(methodID===4){ //Logistic Regression
        value = Manager.predict(v) >= classifier.threshold ? 1: 0;
    }
    else if(methodID===5){ //Neural Networks
        let input = new convnetjs.Vol(1,1,2,0.0);
        input.w[0] = x;
        input.w[1] = y;
        let a = net.forward(input, false);
        value = a.w[0]>a.w[1] ? -1:1;
        // let a = predictOne(v);
        // value = a.w[0]>a.w[1] ? -1:1;
    }
    return value;
}

function getColor(v) {
    let color;
    let value = getValue(v);
    if(methodID===0){
        // if(value>0.5) color = 'rgb(150,250,150)';
        // else color = 'rgb(250,150,150)';
        if(value>1) color = 'rgb(150,250,150)';
        else if(value<-1) color = 'rgb(250,150,150)';
        else if(value===0) color = 'rgb(200,200,150)'; //yellow gold
        else {
            let ri, gi;
            if (value < 0) { // less red 250-150
                ri = 150-100*value; //with value = -1 ===> ri = 250
                gi = 250+100*value; //with value = -1 ===> gi = 150
            } else { //less green 150-250
                ri = 250-100*value; //with value = 1 ===> ri = 150
                gi = 150+100*value; //with value = 1 ===> gi = 250
            }
            color = 'rgb(' + Math.floor(ri) + ',' + Math.floor(gi) + ',150)';
        }
    }
    else if(methodID===1) { //KNN
        if(value===0) color = 'rgb(200,200,150)'; //yellow gold
        else {
            let ri, gi;
            if (value < 0) { // less red 250-150
                ri = 150-100*value; //with value = -1 ===> ri = 250
                gi = 250+100*value; //with value = -1 ===> gi = 150
            } else { //less green 150-250
                ri = 250-100*value; //with value = 1 ===> ri = 150
                gi = 150+100*value; //with value = 1 ===> gi = 250
            }
            color = 'rgb(' + Math.floor(ri) + ',' + Math.floor(gi) + ',150)';
        }
    }
    else if(methodID===2){ //RBF
        if(value === 2) color = 'rgb(150,250,150)'; //green
        else if(value === 0) color = 'rgb(0,0,0)'; //pure black
        else if(value === 1) color = 'rgb(255,255,50)'; //yellow gold
        else if(value === -1) color = 'rgb(255,165,50)'; //orange
        else if(value === -2) color = 'rgb(250,150,150)'; //red
    }
    else if(methodID===3){ // Random Forest
        if(value > 0) color = 'rgb(150,250,150)';
        else color = 'rgb(250,150,150)';
    }
    else if(methodID===4){ //Logistic Regression
        if(value===1) color = 'rgb(150,250,150)';
        else color = 'rgb(250,150,150)';
    }
    else if(methodID===5){
        if(value===1) color = 'rgb(150,250,150)';
        else color = 'rgb(250,150,150)';
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

function predictOne(v) {
    let x = v[0];
    let y = v[1];
    let layers = net.layers;
    let fc1 = layers[1];
    let fc2 = layers[3];
    let n1 = fc1.biases.w[0] + fc1.filters[0].w[0]*x + fc1.filters[0].w[1]*y;

    let n2 = fc1.biases.w[1] + fc1.filters[1].w[0]*x + fc1.filters[1].w[1]*y;

    let t1 = Math.tanh(n1);

    let t2 = Math.tanh(n2);

    let o1 = fc2.biases.w[0]+fc2.filters[0].w[0]*t1 + fc2.filters[0].w[1]*t2;

    let o2 = fc2.biases.w[1]+fc2.filters[1].w[0]*t1 + fc2.filters[1].w[1]*t2;

    let V = new convnetjs.Vol(1, 1, 2, 0.0);
    V.w[0]= o1;
    V.w[1]= o2;

    return V;
}

function getFormulaNet(formulaNet) {
    let x = "x";
    let y = "y";
    let layers = net.layers;
    let fc1 = layers[1];
    let fc2 = layers[3];
    let fN1 = fc1.biases.w[0].toPrecision(4)+"+"+fc1.filters[0].w[0].toPrecision(4)+"*"+x+" "+fc1.filters[0].w[1].toPrecision(4)+"*"+y;
    let fN2 = fc1.biases.w[1].toPrecision(4)+"+"+fc1.filters[1].w[0].toPrecision(4)+"*"+x+" "+fc1.filters[1].w[1].toPrecision(4)+"*"+y;
    let fT1 = "tanh("+fN1+")";
    let fT2 = "tanh("+fN2+")";
    let fO1 = fc2.biases.w[0].toPrecision(4)+"+"+fc2.filters[0].w[0].toPrecision(4)+"*"+fT1+"+"+fc2.filters[0].w[1].toPrecision(4)+"*"+fT2;
    let fO2 = fc2.biases.w[1].toPrecision(4)+"+"+fc2.filters[1].w[0].toPrecision(4)+"*"+fT1+"+"+fc2.filters[1].w[1].toPrecision(4)+"*"+fT2;
    formulaNet+="1: "+fO1+"+\n"+"2: "+fO2;
    return formulaNet;
}