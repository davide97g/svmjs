//distances for KNN

//minkowski
function minkowski(x1,y1,x2,y2) {
    let p = P;
    let v1 = [x1,y1];
    let v2 = [x2,y2];
    if(v1.length!==v2.length){
        return 0;
    }
    let sum = 0;
    for(let i=0;i<v1.length;i++){
        sum+=Math.pow(Math.abs(v1[i]-v2[i]),p);
    }
    return Math.pow(sum,1/p);
}

//chebyshev
function chebyshev(x1,y1,x2,y2) {
    return Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
}

//mahalanobis
function mahalanobis(x1,y1,x2,y2) {
    let distance = 0;
    let diff = 0;
    let x = [x1,y1];
    let y = [x2,y2];
    for (let i=0;i<data[0].length;i++){
        diff = x[i]-y[i];
        distance += Math.pow(diff,2)/Math.pow(v[i],2);
    }
    return Math.sqrt(distance);
}

function variance() {
    let v = new Array(data[0].length);
    let m = average();
    let sum,diff;
    for(let i=0;i<v.length;i++){
        sum = 0;
        diff = 0;
        for(let j=0;j<data.length;j++){
            diff = data[j][i]-m[i];
            sum += Math.pow(diff,2);
        }
        v[i] = Math.sqrt(sum/data.length);
    }
    return v;
}

function average() {
    let m = new Array(data[0].length); //numero di coordinate per punto
    for(let i=0;i<m.length;i++){
        m[i] = 0; //inizializzo a zero
        for (let j=0;j<data.length;j++){ //per ogni punto
            m[i]+=data[j][i];
        }
        m[i]= m[i] / data.length;
    }
    return m;
}