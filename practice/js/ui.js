// UI stuff
function refreshC(event, ui) {
    let logC = ui.value;
    svmC= Math.pow(10, logC);
    $("#creport").text("C = " + svmC.toPrecision(2));
}

function refreshSig(event, ui) {
    let logSig = ui.value;
    rbfKernelSigma= Math.pow(10, logSig);
    $("#sigreport").text("RBF Kernel sigma = " + rbfKernelSigma.toPrecision(2));
}

function refreshDegree(event, ui) {
    Degree = ui.value;
    $("#degport").text("Polynomial Kernel degree = " + Degree.toPrecision(2));

}

function refreshInfluence(event, ui) {
    Influence =  ui.value;
    $("#infport").text("Polynomial Kernel influence = " + Influence.toPrecision(2));
}

function refreshUpperBound(event, ui) {
    ub =  ui.value;
    $("#ubport").text("Upper Bound = " + ub.toPrecision(2));
}

function refreshK(event, ui) {
    K =  ui.value;
    $("#kport").text("K = " + K.toPrecision(2));
}

function refreshP(event, ui) {
    P =  ui.value;
    $("#pport").text("Minkowski with P = " + P.toPrecision(2));
}

function refreshN(event, ui) {
    N =  ui.value;
    $("#nport").text("N = " + N);
    setDataSet(datasetID);
}
function refreshNtest(event, ui) {
    Ntest =  ui.value;
    $("#ntestport").text("N Test = " + Ntest);
    setTrainingSet(datasetID);
}

function refreshEpsilon(event, ui) {
    Epsilon =  ui.value;
    $("#epsilonport").text("Epsilon = " + Epsilon.toPrecision(2));
}
function refreshKmeans1(event, ui) {
    Km1 =  ui.value;
    $("#kmeans1port").text("K1 (Means) = " + Km1.toPrecision(2));
}
function refreshKmeans2(event, ui) {
    Km2 =  ui.value;
    $("#kmeans2port").text("K2 (Means) = " + Km2.toPrecision(2));
}

function showUiThings() {
    $("#s0").show();
    $("#s11").show();
    $("#statisticsTraining").show();
    $("#checkboxTest").show();
    $("#s9").show(); //slider for Km1
    $("#s10").show(); //slider for Km2
    $("#kmeans").show();
    if(useTest) {
        $("#statisticsTest").show();
        $("#downloadTest").show();
    }
    if(kernelid<3){
        $("#s1").show();
        // $("#optimization").show();
        $("#statistics_svm").show();
        if(kernelid === 1){
            $("#s2").show();
        }
        if(kernelid === 2){
            $("#s3").show();
            $("#s4").show();
            $("#input").show();
            $("#actions").show();
            if (input_transformation) {
                $("#input_choice").show();
            }
        }
        if(ssca) $("#s5").show();
    }
    if(kernelid===3) {
        $("#s6").show(); //slider for K in KNN
        $("#distances").show(); //distances buttons
        if(distanceid===0)  //minkowski
            $("#s7").show(); //slider for minkowski P
    }
    if(kernelid===4){
        $("#s8").show(); //slider for epsilon
    }
}

function hideUiThings() {
    $("#fakeInputFormula").hide();
    $("#optimization").hide();
    $("#downloadTest").hide();
    $("#actions").hide();
    $("#input").hide();
    $("#input_choice").hide();
    $("#distances").hide();
    $("#statisticsTraining").hide();
    $("#statisticsTest").hide();
    $("#statistics_svm").hide();
    $("#kmeans").hide();
    $(".slider_container").hide(); // per nascondere gli slider che non servono
}