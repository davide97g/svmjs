/*
On-line method for building epsilon-insensitive support vector machine for regression

🍀 🐢 🐧 🐓 🐼 🐻 🐵
😄 😐 😱 💀 👍 👎 💪
🔥 ✏
 */

let svmojs = (function(exports){
    let SVMO = function(options) {};
    SVMO.prototype ={
        setUp: function(data,alpha,labels,options){
            console.info("🐢 setUp");
            this.data = data;
            this.alpha = alpha;
            this.labels = labels;
            this.options = options || {};
            this.b = options.b || 0;
            this.C = options.C || 0.5;
            this.d =  2;
            this.c =  0;
            this.epsilon = 1e-2;
            this.kernel = function () {}; //need to check
            this.kernel =  makePolyKernel(this.d,this.c);

            this.D = []; //set of all data
            this.S = []; //set of margin support vectors
            this.R = []; //set of ignored, classified correctly
            this.E = []; //set of error support vectors (not necessarily misclassified)

            for(let i=0;i<this.data.length;i++){
                this.D.push(i);
                if(this.g(i) === 0)
                    this.S.push(i);
                else if(this.g(i) > 0)
                    this.R.push(i);
                else
                    this.E.push(i);
            }
            this.margin = new Array(this.data.length-this.S.length);
            this.beta = new Array(this.S.length+1);
            this.beta[0] = this.b;
        },
        g:function(i){
            let sum = 0;
            for(let j=0;j<this.data.length;j++){
                sum += this.Q(i,j)*this.alpha[j];
            }
            return sum + this.label[i]*this.beta[0]-1;
        },
        /**
         * @return {number}
         */
        Q: function(i,j){
          return this.labels[i]*this.labels[j]*this.kernel(this.data[i],this.data[j]);
        },
        margin_sensitivity: function(i,c){
            let sum = 0;
            for(let j=0;j<this.S.length;j++){
                sum += this.Q(i,j)*this.beta[j];
            }
            return this.Q(i,c) + sum +this.labels[c]*this.beta[0];
        },
        updateR: function(c){
            console.info("updateR");
            let dim = this.R.length;
            let expandedR = zeros(dim+1);
            for(let i=0;i<dim;i++){
                expandedR[i] = this.R[i];
                expandedR[i].push(0);
            }

            let matrix = new Array(dim+1);
            for(let i=0;i<dim+1;i++){
                matrix[i] = new Array(dim+1);
                for(let j=0;j<dim+1;j++){
                    if(i !== dim && j !== dim)
                        matrix[i][j] = this.beta[i]*this.beta[j];
                    else if(i !== dim)
                        matrix[i][j] = this.beta[i];
                    else if( j !== dim)
                        matrix[i][j] = this.beta[j];
                    else
                        matrix[i][j] = 1;
                }
            }

            let marginC = this.margin_sensitivity(c,c);

            for(let i=0;i<dim+1;i++) {
                for (let j=0;j<dim+1;j++) {
                    expandedR[i][j] += matrix[i][j]/marginC;
                }
            }

            this.R = expandedR;
        },
        updateBeta: function(c){
          console.info("updateBeta");
          let dim = this.R.length;
          let beta = new Array(dim);
          let sum = 0;
          for(let i=0;i<dim;i++){
              for(let j=0;j<dim;i++){
                  if(i!==0)
                      sum += this.R[i][j]*this.Q(this.S[i],c);
                  else
                    sum += this.R[i][j]*this.labels[c];
              }
              beta[i] = -sum;
          }
          this.beta = beta;
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
            return {
                index: index,
                value: min
            };
        },
        bookkeeping: function(c){
            console.info("bookkeeping");

            let value = 0;
            let i;
            let min_values = new Array(4);

            let max_values_allowed = [];
            //from S to R
            for(i=0;i<this.S.length;i++) {
                value = (0-this.alpha[i])/this.beta[i];
                max_values_allowed.push(value);
            }
            min_values[0] = min(max_values_allowed);



            max_values_allowed = [];
            //from S to E
            for(i=0;i<this.S.length;i++) {
                value = (this.C-this.alpha[i])/this.beta[i];
                max_values_allowed.push(value);
            }
            min_values[1] = min(max_values_allowed);



            max_values_allowed = [];
            //from E to S
            for(i=0;i<this.E.length;i++) {
                value = (0-this.g(i))/this.margin_sensitivity(i,c);
                max_values_allowed.push(value);
            }
            min_values[2] = min(max_values_allowed);



            max_values_allowed = [];
            //from R to S
            for(i=0;i<this.R.length;i++) {
                value = (0-this.g(i))/this.margin_sensitivity(i,c);
                max_values_allowed.push(value);
            }
            min_values[3] = min(max_values_allowed);

            let MIN = min_values[0];

            let index = 0;
            for(i=0;i<min_values.length;i++){
                if(min_values[i].value<MIN.value){
                    MIN = min_values[i];
                    index = i;
                }
            }

            return {
                operation: index,
                value: MIN.value,
                index: MIN.index
            };

        },
        migration: function(payload){
            let operation = payload.operation;
            let index = payload.index;
            //migrations
            if(operation === 0){ //from S to R
                this.fromStoR(index)
            }
            else if(operation === 1){ //from S to E
                this.fromStoE(index);
            }
            else if (operation === 2){ //from E to S
                this.fromEtoS(index);
            }
            else{ //from R to S
                this.fromRtoS(index);
            }
        },
        fromStoR: function(z){
            // ...
        },
        fromStoE: function(z){
            // ...
        },
        fromEtoS: function(z){
            // ...
        },
        fromRtoS: function(z){
            // ...
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
            if (this.g(c)>0) {
                this.R.push(c); //add candidate to R
                console.info("Added to R");
                return; // exit
            }
            let finished = false;
            while(!finished) {
                if(this.g(c) === 0){
                    this.S.push(c);
                    this.updateBeta(c);
                    this.updateR(c);
                    console.info("Added to S");
                    finished = true;
                }
                else if(alphaC === this.C){
                    this.E.push(c);
                    console.info("Added to E");
                    finished = true;
                }
                else {
                    let res = this.bookkeeping(c);
                    this.alpha[c] += res.value; //increment
                    this.migration(res);
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