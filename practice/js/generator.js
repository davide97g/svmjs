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

function circelData(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let radius;
    for(let i=0;i<N;i++){
        if(i<N/2) {
            radius = randf(0.1,1.5);
            let angle = Math.random()*Math.PI*2;
            let x = Math.cos(angle)*radius;
            let y = Math.sin(angle)*radius;
            data[i] = [x,y];
            labels[i] = 1;
        }
        else{
            radius = randf(2,2.5);
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
    let l = 2;
    for(let i=0;i<N;i++){
        if(i<N*0.5){
            radius = randf(0,l-1);
            let angle = Math.random()*Math.PI*2;
            let x = Math.cos(angle)*radius;
            let y = Math.sin(angle)*radius;
            data[i] = [x+l/2,y+l/2];
            labels[i] = 1;
        }
        else{
            radius = randf(0,l-1);
            let angle = Math.random()*Math.PI*2;
            let x = Math.cos(angle)*radius;
            let y = Math.sin(angle)*radius;
            data[i] = [x-l/2,y-l/2];
            labels[i] = -1;
        }
    }
    return {data:data, labels:labels};
}

function spiralData(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let radius;
    let l = 2;
    let a = 0.1;
    let b = 0.5;
    let theta;
    for(let i=0;i<N/2;i++){
        theta = Math.random()*Math.PI*2;
        let x = (a+b*theta)*Math.cos(theta);
        let y = (a+b*theta)*Math.sin(theta);
        data[i] = [x,y];
        labels[i] = 1;
    }
    a = -a;
    b = -b;
    for(let i=N/2;i<N;i++){
        theta = Math.random()*Math.PI*2;
        let x = (a+b*theta)*Math.cos(theta);
        let y = (a+b*theta)*Math.sin(theta);
        data[i] = [x,y];
        labels[i] = -1;
    }
    return {data:data, labels:labels};
}