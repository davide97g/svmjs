/*
On-line method for building epsilon-insensitive support vector machine for regression

🍀 🐢 🐧 🐓 🐼 🐻 🐵
😄 😐 😱 💀 👍 👎 💪
🔥 ✏
 */

let svmojs = (function(exports){
    let SVMO = function(options) {};
    SVMO.prototype ={
        setUp: function(data,labels,options){
            console.info("🐢 setUp");
            this.data = data;
            this.alpha = [];
            this.labels = labels;
            this.options = options || {};
            this.b = options.b || 0;
            this.C = options.C || 0.5;
            this.d =  2;
            this.c =  0;
            this.epsilon = 1e-2;
            this.kernel = function () {}; //need to check
            this.kernel =  makePolyKernel(this.d,this.c);
            
            this.S = []; //set of margin support vectors
            this.R = []; //set of ignored, classified correctly
            this.E = []; //set of error support vectors (not necessarily misclassified)
            this.E_start = []; //set of error support vectors (not necessarily misclassified)
            
            for(let i=0;i<this.data.length;i++){
                if(this.g(i)=== 0 || this.g_start(i) === 0)
                    this.S.push(i);
                else if(this.g(i) > 0 && this.g_start(i) > 0)
                    this.R.push(i);
                else if(this.g(i)<0)
                    this.E.push(i);
                else
                    this.E_start.push(i);
            }
            this.lambda = new Array(this.data.length-this.S.length);
            this.gamma = new Array(this.S.length);
        },
        g:function(i){
            let sum = 0;
            for(let j=0;j<this.data.length;j++){
                sum+= this.labels[i]*this.labels[j]*this.kernel(this.data[i],this.data[j])*this.alpha[j]
            }
            return sum-this.label[i]+this.epsilon+this.b;
        },
        g_start:function(i){
            return 2*this.epsilon-this.g(i);
        },
        updateR: function(){
            console.info("updateR");
        },
        min: function(set){
            let min = set[0];
            let index = 0;
            for(let i=0;i<set.length;i++){
                if(min>set[i]){
                    min = set[i];
                    index = i;
                }
            }
            return index;
        },
        bookkeeping: function(c){
            console.info("bookeeping");

            let max_values_allowed = [];
            let value = 0;
            let i=0;

            //from E to S
            for(i=0;i<this.E.length;i++) {
                value = -this.g(i)/this.lambda[i];
                max_values_allowed.push(value);
            }
            i = min(max_values_allowed);
            if(max_values_allowed[i]>0) {
                this.alpha[c] += max_values_allowed[i];
                //to do
            }

            //from S to E
            for(i=0;i<this.S.length;i++) {
                value = (this.C-this.alpha[i])/this.gamma[i];
                max_values_allowed.push(value);
            }
            i = min(max_values_allowed);
            if(max_values_allowed[i]>0) {
                this.alpha[c] += max_values_allowed[i];
                //to do
            }

                //from S to R
                //from R to S
                //from S to E_star
                //from E_start to S
        },
        increment:function (candidate) {
            console.info("increment");
            let data = candidate.data;
            let label = candidate.label;
            let alphaC = 0;
            this.data.push(data);
            this.alpha.push(alphaC);
            this.labels.push(label);
            let c = this.data.length-1;
            let gc = this.g(c);
            let gc_start = this.g_start(c);
            if (gc > 0 && gc_start > 0 ) {
                this.R.push(c); //add candidate to R
                return; // exit
            }
            while(true) {
                if (gc <= 0) {
                    //increment alphaC
                    let constant = 0.1;
                    alphaC += constant;
                    //updating in array
                    this.alpha[c] = alphaC;
                    //gc === 0
                    if(this.g(c) === 0){
                        this.S.push(c);
                        this.updateR();
                        return;
                    }
                    else if(alphaC === this.C){
                        this.E.push(c);
                        return;
                    }
                    //bookkeeping
                    this.bookkeeping(c);
                }
                else {
                    //decrement alphaC
                    let constant = 0.1;
                    alphaC -= constant;
                    //updating in array
                    this.alpha[c] = alphaC;
                    //gc_start === 0
                    if(this.g_start(c) === 0){
                        this.S.push(c);
                        this.updateR();
                        return;
                    }
                    else if(alphaC === -this.C){
                        this.E_start.push(c);
                        return;
                    }
                    //bookkeeping
                    this.bookkeeping(c);
                }
            }
        },
        decrement: function () {
            console.info("decrement");
        },
        addVector: function (vc) {
            console.info("add Vector "+vc);
        },
        removeVector: function (vc) {
            console.info("remove Vector "+vc);
        },
        updateVector: function (vc) {
            console.info("update Vector "+vc);
        }
        
    };
    // export public members
    exports = exports || {};
    exports.SVMO = SVMO;
    return exports;
    
})(typeof module != 'undefined' && module.exports);  // add exports to module.exports if in node.js

// let d = [[1,2],[2,3],[-1,-2.3],[1.2,-1.9],[-0.5,2]];
// let l = [1,-1,1,1,-1];
//  let svmOnline = new svmojs.SVMO();
//  svmOnline.setUp(d,l);