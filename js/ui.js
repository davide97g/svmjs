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
    $("#degport").text("Polynomial Kernel degree = " + Degree);

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
    $("#pport").text("Minkowski with P = " + P);
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
    $("#kmeans1port").text("K1 =" + Km1);
}
function refreshKmeans2(event, ui) {
    Km2 =  ui.value;
    $("#kmeans2port").text("K2 = " + Km2);
}
function refreshUpdateFrequency(event, ui) {
    updateFrequency =  ui.value;
    $("#updateFrequencyport").text("Update Frequency = " + updateFrequency +" ms");
}
function refreshStepsFrequency(event, ui) {
    stepsFrequency =  ui.value;
    $("#stepsFrequencyport").text("Steps Frequency = " + stepsFrequency +" steps");
}

function refreshTrees(event, ui) {
    let numTrees = Math.floor(ui.value);
    $("#treesreport").text("Number of Trees = " + numTrees);
    options.numTrees= numTrees;
}
function refreshDepth(event, ui) {
    let maxDepth = Math.floor(ui.value);
    $("#depthreport").text("Max Depth = " + maxDepth);
    options.maxDepth = maxDepth;
}
function refreshTries(event, ui) {
    let tries = Math.floor(ui.value);
    $("#triesreport").text("Hypotheses / node = " + tries);
    options.numTries = tries;
}

function refreshAlpha(event, ui) {
    alpha = Math.floor(ui.value);
    $("#alphaport").text("Alpha = " + alpha);
}
function refreshLambda(event, ui) {
    alpha = Math.floor(ui.value);
    $("#lambdaport").text("Lambda = " + lambda);
}
function refreshIterations(event, ui) {
    iterations = Math.floor(ui.value);
    $("#iterationsport").text("Iterations = " + iterations);
}

function setTabVisibility(id,value) {
    if(id.search("info")>=0){
        info_tab = value;
    }
    else if(id.search("draw")>=0){
        draw_tab = value;
    }
    else if(id.search("statistics")>=0){
        statistics_tab = value;
    }
    else if(id.search("options")>=0){
        options_tab = value;
    }
    else if(id.search("kmeans")>=0){
        kmeans_tab = value;
    }
    hideUiThings();
    showUiThings();
}

function showUiThings() {
    if(info_tab)
        $("#info").show();
    if(draw_tab)
        $("#draw").show();
    if(statistics_tab)
        $("#statistics").show();
    if(options_tab)
        $("#options").show();
    if(kmeans_tab)
        $("#kmeans").show();
    $("#s0").show();
    $("#s11").show();
    $("#statisticsTraining").show();
    $("#checkboxTest").show();
    $("#s9").show(); //slider for Km1
    $("#s10").show(); //slider for Km2
    if(useTest) {
        $("#statisticsTest").show();
        $("#downloadTest").show();
    }

    if(methodID===0){ //SVM
        $("#kernels").show();
        $("#execution_options").show();
        // $("#svm").show();
        $("#s1").show();
        // $("#optimization").show();
        // if(ssca) $("#s5").show();
        $("#statistics_svm").show();
        if(karpathy){
            $("#timer_options").show();
            if(use_timer) {
                $("#s12").show();
                $("#s13").show();
            }
        }
        if(kernelid === 0){ //linear
            $("#input_transformations").show();
            if (input_transformation) {
                $("#statistics_score").show();
                $("#input").show();
                $("#input_choice").show();
            }
        }
        else if(kernelid === 1){ //poly
            $("#s3").show();
            $("#s4").show();
            $("#actions").show();
        }
        else if(kernelid === 2){ //rbf
            $("#s2").show();
        }
        else if(kernelid === 3){//sigmoid
            $("#s4").show();
        }
    }
    else if(methodID===1) { //KNN
        // $("#knn").show();
        $("#s6").show(); //slider for K in KNN
        $("#distances").show(); //distances buttons
        if(distanceid===0)  //minkowski
            $("#s7").show(); //slider for minkowski P
    }
    else if(methodID===2){ //RBF
        // $("#rbf").show();
        $("#s8").show(); //slider for epsilon
    }
    else if(methodID===3){ //Random Forest
        $("#decisions").show();
        $("#assignments").show();
        $("#s14").show(); //slider for epsilon
        $("#s15").show(); //slider for epsilon
        $("#s16").show(); //slider for epsilon
    }
    else if(methodID===4){
        $("#s17").show(); //slider for epsilon
        $("#s18").show(); //slider for epsilon
        $("#s19").show(); //slider for epsilon
    }
}

function hideUiThings() {
    $("#info").hide();
    $("#draw").hide();
    $("#statistics").hide();
    $("#options").hide();
    $("#fakeInputFormula").hide();
    $("#optimization").hide();
    $("#downloadTest").hide();
    $("#actions").hide();
    $("#input").hide();
    $("#input_choice").hide();
    $("#input_transformations").hide();
    $("#timer_options").hide();
    $("#distances").hide();
    $("#statisticsTraining").hide();
    $("#statisticsTest").hide();
    $("#statistics_svm").hide();
    $("#statistics_score").hide();
    $("#kmeans").hide();
    $("#kernels").hide();
    $("#execution_options").hide();
    $("#decisions").hide();
    $("#assignments").hide();
    $(".slider_container").hide(); // per nascondere gli slider che non servono
}

function moveProgressBar(percentage,duration) {
    // console.log("moveProgressBar");
    let getPercent = percentage / 100;
    let getProgressWrapWidth = $('.progress-wrap').width();
    let progressTotal = getPercent * getProgressWrapWidth;

    // on page load, animate percentage bar to data percentage length
    // .stop() used to prevent animation queueing
    $('.progress-bar').stop().animate({
        left: progressTotal
    }, duration);
}