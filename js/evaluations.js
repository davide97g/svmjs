
/*
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
*/
/*
function KNN1(x,y){
let distance = minkowski(x,y,data[0][0],data[0][1],2);
let label = labels[0];
let d = 0;
for(let i=0;i<data.length;i++){
    d = minkowski(x,y,data[i][0],data[i][1],2);
    if(distance>d){ //se è più distante metto questo punto i-esimo
        distance = d;
        label = labels[i];
    }
}
return label;
}
*/

let distanceF = minkowski;//variable for distance function

/**
 * @return {number}
 */
function KNN(x,y,n){
    n = n||1;
    if(n<1) n=1;
    if(n>data.length) {
        //console.warn("need more data: KNN with K: "+K+" and #data: "+data.length);
        return 0;
    }
    //if(n===1) return KNN1(x,y);
    
    let nearest = new Array(n);
    for(let i=0;i<n;i++){
        nearest[i] = {};
        nearest[i].distance = distanceF(x,y,data[i][0],data[i][1]);
        nearest[i].label = labels[i];
    }
    
    nearest.sort(function(a,b){return b.distance-a.distance}); //ordino decrescente
    
    let d = 0;
    //find nn sets
    for(let i=n;i<data.length;i++){
        d = distanceF(x,y,data[i][0],data[i][1]);
        if(nearest[0].distance>d){ //se è più distante il più distante dei nearest, aggiorno la lista
            nearest[0].distance = d;
            nearest[0].label = labels[i];
            nearest.sort(function(a,b){return b.distance-a.distance}); //ordino decrescente
        }
    }
    
    //label definition
    let c = 0;
    for (let i=0;i<n;i++){
        c+=nearest[i].label;
    }
    if(c>0) return 1;
    if(c===0){//indecision between two classes -> could approximate finding the value for n-1 of n+1
        //return KNN(x,y,n+1); //equal to call knn on the next k
        //return KNN(x,y,n-1); //equal to call knn on the previous k
        return 0;
    }
    return -1;
}

/**
 * @return {number}
 */
function RBF(x,y) {
    let s = 0;
    let diff = 0;
    let v1 = [x,y];
    let rbf;
    let rbfs=0;
    for(let i=0;i<data.length;i++){
        s=0; //somma per un rbf
        for(let j=0;j<v1.length;j++){
            diff = v1[j]-data[i][j];
            s += Math.pow(diff,2);
        }
        rbf = Math.exp(-s/(2.0*Math.pow(rbfKernelSigma,2))); //extend with 1/(x+1) formula too
        rbfs += labels[i]*rbf; //sum of rbf evaluations with weight = labels[i]
    }
    
    if(rbfs>=0){ //above
        //if(KMdata) return 2;
        if(rbfs<Epsilon) return 1; //error for above
        else return 2; //redundant from above
    }
    else{ //below
        //if(KMdata) return -2;
        if(rbfs>-Epsilon) return -1; //error from below
        else return -2; //redundant from below
    }
}