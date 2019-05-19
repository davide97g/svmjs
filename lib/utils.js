// Misc utility functions
// generate random floating point number between a and b
function randf(a, b) {
    return Math.random()*(b-a)+a;
}

// generate random integer between a and b (b excluded)
function randi(a, b) {
    return Math.floor(Math.random()*(b-a)+a);
}

// create vector of zeros of length n
function zeros(n) {
    let arr= new Array(n);
    for(let i=0;i<n;i++) { arr[i]= 0; }
    return arr;
}

//create a copy of the original array
function copyArray(v){
    let array = new Array(v.length);
    for(let i=0;i<v.length;i++){
        array[i] = v[i];
    }
    return array;
}