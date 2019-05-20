// UI stuff
function refreshC(event, ui) {
    let logC = ui.value;
    svmC= Math.pow(10, logC);
    $("#creport").text("C = " + svmC.toPrecision(2));
    retrainSVM();
}

function refreshSig(event, ui) {
    let logSig = ui.value;
    rbfKernelSigma= Math.pow(10, logSig);
    $("#sigreport").text("RBF Kernel sigma = " + rbfKernelSigma.toPrecision(2));
    if(kernelid === 1) {
        retrainSVM();
    }
}

function refreshDegree(event, ui) {
    //let logDegree = ui.value;
    //Degree = Math.pow(10, logDegree);
    Degree = ui.value;
    $("#degport").text("Polynomial Kernel degree = " + Degree.toPrecision(2));
    if(kernelid === 2) {
        retrainSVM();
    }
}

function refreshInfluence(event, ui) {
    Influence =  ui.value;
    $("#infport").text("Polynomial Kernel influence = " + Influence.toPrecision(2));
    if(kernelid === 2) {
        retrainSVM();
    }
}

function refreshUpperBound(event, ui) {
    ub =  ui.value;
    $("#ubport").text("Upper Bound = " + ub.toPrecision(2));
    if(ssca) {
        retrainSVM();
    }
}

function refreshK(event, ui) {
    K =  ui.value;
    $("#kport").text("K = " + K.toPrecision(2));
    if(kernelid===3) {
        retrainSVM();
    }
}

function refreshP(event, ui) {
    P =  ui.value;
    $("#pport").text("Minkowski with P = " + P.toPrecision(2));
    if(kernelid===3) {
        retrainSVM();
    }
}

function refreshN(event, ui) {
    N =  ui.value;
    $("#nport").text("N = " + N.toPrecision(2));
    setDataSet(datasetID);
    retrainSVM();
}

function toggleSSCA(value){
    setSSCA(value);
    
    if(value) {
        $("#SSCAtoggle").text("SSCA on");
    }
    else{
        $("#SSCAtoggle").text("SSCA off");
    }
    retrainSVM();
}