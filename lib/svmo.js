/*
On-line method for building epsilon-insensitive support vector machine for regression

🍀 🐢 🐧 🐓 🐼 🐻 🐵
😄 😐 😱 💀 👍 👎 💪
🔥 ✏
 */

let svmojs = (function(exports){
    let SVMO = function(options) {};
    SVMO.prototype ={
        setUp: function(data,alpha,labels,b,options){
            console.info("🐢 SETUP");
            this.data = data;
            this.alpha = alpha;
            this.labels = labels;
            this.b = b;
            this.options = options || {};
            this.d =  2;
            this.c =  0;
            this.epsilon = 1e-2;
            this.kernel = function () {}; //need to check
            this.kernel =  makePolyKernel(this.d,this.c);
            
            this.S = []; //set of margin support vectors
            this.R = []; //set of ignored, classified correctly
            this.E = []; //set of error support vectors (not necessarily misclassified)
            
            let value = 0;
            for(let i=0;i<this.data.length;i++){
                value = this.g(i);
                if(this.g(i)===0)
                    this.S.push(i);
                else if(value > 0)
                    this.R.push(i);
                else this.E.push(i);
            }
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
        increment:function (candidate) {
            console.info("INCREMENT");
            let xc = candidate.x;
            let yc = candidate.y;
            let label = candidate.label;
            let alphaC = 0;
            this.data.push([xc,yc]);
            this.alpha.push(alphaC);
            this.labels.push(label);
            let c = this.data.length-1;
            if(g(c)>0) {
                //add candidate to R and exit
                this.R.push(c);
            }
            else{
                //increment alphaC
                let constant = 0.1;
                alphaC += constant;
                //updating in array
                this.alpha[c] = alphaC;
                //updating every alphaI in S
                for(let i=0;i<this.S.length;i++){
                    //this.alpha[this.S[i]] = this.lambda[this.S[i]];
                }
            }
        },
        decrement: function () {
            console.info("DECREMENT");
        },
        addVector: function (vc) {
        
        },
        removeVector: function (vc) {
        
        },
        updateVector: function (vc) {
        
        }
        
    };
    // export public members
    exports = exports || {};
    exports.SVMO = SVMO;
    return exports;
    
})(typeof module != 'undefined' && module.exports);  // add exports to module.exports if in node.js

// let svmOnline = new svmojs.SVMO();
// svmOnline.setUp(data,alpha,labels);