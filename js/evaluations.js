
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