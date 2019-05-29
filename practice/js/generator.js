function randomData(N){
    let data = new Array(N);
    let labels = new Array(N);
    for(let i=0;i<N;i++){
        data[i] = [randf(-3,3),randf(-3,3)];
        if(randi(0,2))
            labels[i] = 1;
        else labels[i] = -1;
    }
    return {data:data, labels:labels};
}

function circleMultipleData(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let radius;
    for(let i=0;i<N;i++){
        if(i<N/3) {
            radius = randf(0.1,2.5);
            let angle = Math.random()*Math.PI*2;
            let x = Math.cos(angle)*radius;
            let y = Math.sin(angle)*radius;
            data[i] = [x,y];
            labels[i] = 1;
        }
        else if(i<N*2/3){
            radius = randf(2,3);
            let angle = Math.random()*Math.PI*2;
            let x = Math.cos(angle)*radius;
            let y = Math.sin(angle)*radius;
            data[i] = [x,y];
            labels[i] = -1;
        }
        else{
            radius = randf(2.75,4);
            let angle = Math.random()*Math.PI*2;
            let x = Math.cos(angle)*radius;
            let y = Math.sin(angle)*radius;
            data[i] = [x,y];
            labels[i] = 1;
        }
    }
    return {data:data, labels:labels};
}

function circleData(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let radius;
    for(let i=0;i<N;i++){
        if(i<N/2) {
            radius = randf(0.1,2.5);
            let angle = Math.random()*Math.PI*2;
            let x = Math.cos(angle)*radius;
            let y = Math.sin(angle)*radius;
            data[i] = [x,y];
            labels[i] = 1;
        }
        else{
            radius = randf(2.25,4);
            let angle = Math.random()*Math.PI*2;
            let x = Math.cos(angle)*radius;
            let y = Math.sin(angle)*radius;
            data[i] = [x,y];
            labels[i] = -1;
        }
    }
    return {data:data, labels:labels};
}


function exclusiveOrData(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let l = 3;
    for(let i=0;i<N;i++){
        if(i<N*0.25) {
            data[i] = [randf(0,l),randf(0,l)];
            labels[i] = 1;
        }
        else if(i<N*0.5){
            data[i] = [randf(0,l),randf(-l,0)];
            labels[i] = -1;
        }
        else if(i<N*0.75){
            data[i] = [randf(-l,0),randf(-l,0)];
            labels[i] = 1;
        }
        else{
            data[i] = [randf(-l,0),randf(0,l)];
            labels[i] = -1;
        }
    }
    return {data:data, labels:labels};
}

function gaussianData(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let radius;
    let l = 3;
    for(let i=0;i<N;i++){
        if(i<N*0.5){
            radius = randf(0,l-1);
            let angle = Math.random()*Math.PI*2;
            let x = Math.cos(angle)*radius;
            let y = Math.sin(angle)*radius;
            data[i] = [x+l/4,y+l/4];
            labels[i] = 1;
        }
        else{
            radius = randf(0,l-1);
            let angle = Math.random()*Math.PI*2;
            let x = Math.cos(angle)*radius;
            let y = Math.sin(angle)*radius;
            data[i] = [x-l/4,y-l/4];
            labels[i] = -1;
        }
    }
    return {data:data, labels:labels};
}

function spiralData(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let a = 0.1;
    let b = 0.5;
    let theta;
    let perturbation = 0.2;
    for(let i=0;i<N/2;i++){
        theta = Math.random()*Math.PI*2;
        let x = (a+b*theta)*Math.cos(theta);
        x = x + randf(-perturbation,perturbation);
        let y = (a+b*theta)*Math.sin(theta);
        y = y + randf(-perturbation,perturbation);
        data[i] = [x,y];
        labels[i] = 1;
    }
    a = -a;
    b = -b;
    for(let i=N/2;i<N;i++){
        theta = Math.random()*Math.PI*2;
        let x = (a+b*theta)*Math.cos(theta);
        x = x + randf(-perturbation,perturbation);
        let y = (a+b*theta)*Math.sin(theta);
        y = y + randf(-perturbation,perturbation);
        data[i] = [x,y];
        labels[i] = -1;
    }
    return {data:data, labels:labels};
}

function stripesVData(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let x,y;
    for(let i=0;i<N;i++){
        y=randf(-4,4);
        /*
        if(i<N/6){
            x=randf(-3,-2);
            labels[i] = 1;
        }
        else if(i<N/3){
            x=randf(-2,-1);
            labels[i] = -1;
        }
        else if(i<N/2){
            x=randf(-1,0);
            labels[i] = 1;
        }
        else if(i<N*2/3){
            x=randf(0,1);
            labels[i] = -1;
        }
        else if(i<N*5/6){
            x=randf(1,2);
            labels[i] = 1;
        }
        else{
            x = randf(2,3);
            labels[i] = -1;
        }*/
        if(i<N/4){
            x=randf(-3,-1.75);
            labels[i] = 1;
        }
        else if(i<N/2){
            x=randf(-1.5,-0.25);
            labels[i] = -1;
        }
        else if(i<N*3/4){
            x=randf(0.25,1.5);
            labels[i] = 1;
        }
        else{
            x=randf(1.75,3);
            labels[i] = -1;
        }
        data[i] = [x,y];
    }
    return {data:data, labels:labels};
}
function stripesHData(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let x,y;
    for(let i=0;i<N;i++){
        x=randf(-4,4);
        /*
        if(i<N/6){
            x=randf(-3,-2);
            labels[i] = 1;
        }
        else if(i<N/3){
            x=randf(-2,-1);
            labels[i] = -1;
        }
        else if(i<N/2){
            x=randf(-1,0);
            labels[i] = 1;
        }
        else if(i<N*2/3){
            x=randf(0,1);
            labels[i] = -1;
        }
        else if(i<N*5/6){
            x=randf(1,2);
            labels[i] = 1;
        }
        else{
            x = randf(2,3);
            labels[i] = -1;
        }*/
        if(i<N/4){
            y=randf(-3,-1.75);
            labels[i] = 1;
        }
        else if(i<N/2){
            y=randf(-1.5,-0.25);
            labels[i] = -1;
        }
        else if(i<N*3/4){
            y=randf(0.25,1.5);
            labels[i] = 1;
        }
        else{
            y=randf(1.75,3);
            labels[i] = -1;
        }
        data[i] = [x,y];
    }
    return {data:data, labels:labels};
}