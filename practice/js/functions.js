$(function() {
    // for C parameter
    $("#slider0").slider({
        orientation: "horizontal",
        slide: refreshN,
        max: 1000,
        min: 10,
        step: 10,
        value: 100
    });
    
    // for C parameter
    $("#slider1").slider({
        orientation: "horizontal",
        slide: refreshC,
        max: 2.0,
        min: -2.0,
        step: 0.1,
        value: 0.0
    });
    
    // for rbf kernel sigma
    $("#slider2").slider({
        orientation: "horizontal",
        slide: refreshSig,
        max: 2.0,
        min: -2.0,
        step: 0.1,
        value: 0.0
    });
    
    // for polynomial kernel degree
    $("#slider3").slider({
        orientation: "horizontal",
        slide: refreshDegree,
        max: 5.0,
        min: 1.0,
        step: 1.0,
        value: 2.0
    });
    
    // for polynomial kernel influence
    $("#slider4").slider({
        orientation: "horizontal",
        slide: refreshInfluence,
        max: 3.0,
        min: 0.0,
        step: 0.1,
        value: 0.0
    });
    
    // for upper bound in SSCA
    $("#slider5").slider({
        orientation: "horizontal",
        slide: refreshUpperBound,
        max: 1.5,
        min: 0.0,
        step: 0.1,
        value: 1.3
    });
    
    // for K in KNN
    $("#slider6").slider({
        orientation: "horizontal",
        slide: refreshK,
        max: 15,
        min: 1,
        step: 1,
        value: 1
    });
    
    // for P in minkowski distance
    $("#slider7").slider({
        orientation: "horizontal",
        slide: refreshP,
        max: 10,
        min: 1,
        step: 1,
        value: 2
    });
    
    // for Epsilon in RBF
    $("#slider8").slider({
        orientation: "horizontal",
        slide: refreshEpsilon,
        max: 3,
        min: 0.1,
        step: 0.1,
        value: 0.1
    });
    
    // for K1 in Kmeans
    $("#slider9").slider({
        orientation: "horizontal",
        slide: refreshKmeans1,
        max: 50,
        min: 1,
        step: 1,
        value: 3
    });
    
    // for K2 in Kmeans
    $("#slider10").slider({
        orientation: "horizontal",
        slide: refreshKmeans2,
        max: 50,
        min: 1,
        step: 1,
        value: 3
    });
    
    // for K2 in Kmeans
    $("#slider11").slider({
        orientation: "horizontal",
        slide: refreshNtest,
        max: 1000,
        min: 10,
        step: 1,
        value: 100
    });
    
});


function changeKernel(id){
    if(kernelid !== id){
        kernelid = id;
        hideUiThings();
        showUiThings();
    }
}

function changeDistance(id) {
    if(distanceid === id) return;
    if(id===0)
        distanceF = minkowski;
    else if(id===1)
        distanceF = chebyshev;
    else if(id===2)
        distanceF = mahalanobis;
    
    distanceid = id;
    hideUiThings();
    showUiThings();
}

function setSSCA(value) {
    ssca = value;
    
}
