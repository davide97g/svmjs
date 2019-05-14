// MIT License
// Andrej Karpathy
// Polynomial Kernel implemented by Davide Ghiotto
//import {makePolyKernel} from "./kernels";
let svmjs = (function(exports){
  
  /*
    This is a binary SVM and is trained using the SMO algorithm.
    Reference: "The Simplified SMO Algorithm" (http://math.unt.edu/~hsp0009/smo.pdf)
    
    Simple usage example:
    svm = svmjs.SVM();
    svm.train(data, labels);
    testlabels = svm.predict(testdata);
  */
  //let polyK = new kernels.makePolyKernel(0,1);
  let SVM = function(options) {};
  
  SVM.prototype = {
    
    // data is NxD array of floats. labels are 1 or -1.
    train: function(data, labels, options) {
      console.info("TRAIN: "+data.length+"#");
      // we need these in helper functions
      this.data = data;
      this.labels = labels;
      
      // parameters
      options = options || {};
      let C = options.C || 1.0; // C value. Decrease for more regularization
      let tol = options.tol || 1e-4; // numerical tolerance. Don't touch unless you're pro
      let alphatol = options.alphatol || 0; // non-support vectors for space and time efficiency are truncated. To guarantee correct result set this to 0 to do no truncating. If you want to increase efficiency, experiment with setting this little higher, up to maybe 1e-4 or so.
      let maxiter = options.maxiter || 10000; // max number of iterations
      let numpasses = options.numpasses || 10; // how many passes over data with no change before we halt? Increase for more precision.
      let SSCA = options.SSCA || false;
      let UB = options.UB || 0.5;
      //***************
      let quadratic = options.quadratic || false; //decide if use x^2
      
      if(quadratic){
        let data2 = zeros(this.data.length);
        for(let i=0;i<this.data.length;i++){
          data2[i] = [this.data[i][0],this.data[i][1],this.data[i][0]*this.data[i][0]];
        }
        this.data = data2;
      }
      
      this.C = C;
      this.tol = tol;
      this.alphatol = alphatol;
      this.maxiter = maxiter;
      this.numpasses = numpasses;
      this.eps = 1e-3; // for the full implemented SMO algorithm
      
      // instantiate kernel according to options. kernel can be given as string or as a custom function
      let kernel = linearKernel;
      this.kernelType = "linear";
      if("kernel" in options) {
        if(typeof options.kernel === "string") {
          // kernel was specified as a string. Handle these special cases appropriately
          if(options.kernel === "linear") {
            this.kernelType = "linear";
            kernel = linearKernel;
          }
          if(options.kernel === "rbf") {
            let rbfSigma = options.rbfsigma || 0.5;
            this.rbfSigma = rbfSigma; // back this up
            this.kernelType = "rbf";
            kernel = makeRbfKernel(rbfSigma);
          }
          if(options.kernel === "poly"){
            let degree = options.degree || 2;
            this.degree = degree;
            let influence = options.influence || 1;
            if(influence<0) //cannot be negative
              influence = 0; //setting to zero
            this.influence = influence;
            this.kernelType = "poly";
            kernel = makePolyKernel(degree, influence);
          }
        }
        else {
          // assume kernel was specified as a function. Let's just use it
          this.kernelType = "custom";
          kernel = options.kernel;
        }
      }
  
      //kernel choice
      this.kernel = kernel;
      //initializations
      this.N = this.data.length;
      this.D = this.data[0].length;
      this.alpha = zeros(N);
      this.b = 0.0;
      this.usew_ = false; // internal efficiency flag
      
      // Cache kernel computations to avoid expensive recomputation.
      // This could use too much memory if N is large.
      if (options.memoize) {
        this.kernelResults = new Array(N);
        for (let i=0;i<N;i++) {
          this.kernelResults[i] = new Array(N);
          for (let j=0;j<N;j++) {
            this.kernelResults[i][j] = this.kernel(data[i],data[j]);
          }
        }
      }
      
      //*
      //FULL Sequential Minimal Optimization (Platt)
      let stats = {};
      //find non-pruned solution for SVM
      stats = this.SMO();
      
      //Smoothed Separable Case Approximation
      if(SSCA){
        this.SSCA(UB,options);
        //retrain SVM
        stats = this.SMO();
      }
      
      return stats; //ritorno il numero di iterazioni svolte
      //**/
      
      /*
      //run SMO algorithm (Karpathy version, not full)
      let iter = 0;
      let passes = 0;
      while(passes < numpasses && iter < maxiter) {
        
        let alphaChanged = 0;
        for(let i=0;i<N;i++) {
          
          let Ei= this.marginOne(data[i]) - labels[i];
          if( (labels[i]*Ei < -tol && this.alpha[i] < C) || (labels[i]*Ei > tol && this.alpha[i] > 0) ){
            
            // alpha_i needs updating! Pick a j to update it with
            let j = i;
            while(j === i) j= randi(0, this.N);
            let Ej= this.marginOne(data[j]) - labels[j];
            
            // calculate L and H bounds for j to ensure we're in [0 C]x[0 C] box
            let ai= this.alpha[i];
            let aj= this.alpha[j];
            let L = 0; let H = C;
            if(labels[i] === labels[j]) {
              L = Math.max(0, ai+aj-C);
              H = Math.min(C, ai+aj);
            }
            else {
              L = Math.max(0, aj-ai);
              H = Math.min(C, C+aj-ai);
            }
            
            if(Math.abs(L - H) < 1e-4) continue;
            
            let eta = 2*this.kernelResult(i,j) - this.kernelResult(i,i) - this.kernelResult(j,j);
            if(eta >= 0) continue;
            
            // compute new alpha_j and clip it inside [0 C]x[0 C] box
            // then compute alpha_i based on it.
            let newaj = aj - labels[j]*(Ei-Ej) / eta;
            if(newaj>H) newaj = H;
            if(newaj<L) newaj = L;
            if(Math.abs(aj - newaj) < 1e-4) continue;
            this.alpha[j] = newaj;
            let newai = ai + labels[i]*labels[j]*(aj - newaj);
            this.alpha[i] = newai;
            
            // update the bias term
            let b1 = this.b - Ei - labels[i]*(newai-ai)*this.kernelResult(i,i) - labels[j]*(newaj-aj)*this.kernelResult(i,j);
            let b2 = this.b - Ej - labels[i]*(newai-ai)*this.kernelResult(i,j) - labels[j]*(newaj-aj)*this.kernelResult(j,j);
            this.b = 0.5*(b1+b2);
            if(newai > 0 && newai < C) this.b= b1;
            if(newaj > 0 && newaj < C) this.b= b2;
            
            alphaChanged++;
            
          } // end alpha_i needed updating
        } // end for i=1..N
        
        iter++;
        //console.log("iter number %d, alphaChanged = %d", iter, alphaChanged);
        if(alphaChanged === 0) passes++;
        else passes= 0;
        
      } // end outer loop
      
      
      //STORE
      // if the user was using a linear kernel, lets also compute and store the
      // weights. This will speed up evaluations during testing time
      if(this.kernelType === "linear") {
        
        // compute weights and store them
        this.w = new Array(this.D);
        for(let j=0;j<this.D;j++) {
          let s= 0.0;
          for(let i=0;i<this.N;i++) {
            s+= this.alpha[i] * labels[i] * data[i][j];
          }
          this.w[j] = s;
          this.usew_ = true;
        }
      }
      else {
        
        // okay, we need to retain all the support vectors in the training data,
        // we can't just get away with computing the weights and throwing it out
        
        // But! We only need to store the support vectors for evaluation of testing
        // instances. So filter here based on this.alpha[i]. The training data
        // for which this.alpha[i] = 0 is irrelevant for future.
        let newdata = [];
        let newlabels = [];
        let newalpha = [];
        for(let i=0;i<this.N;i++) {
          //console.log("alpha=%f", this.alpha[i]);
          if(this.alpha[i] > alphatol) { //only if they are useful
            newdata.push(this.data[i]);
            newlabels.push(this.labels[i]);
            newalpha.push(this.alpha[i]);
          }
        }
        
        // store data and labels
        this.data = newdata;
        this.labels = newlabels;
        this.alpha = newalpha;
        this.N = this.data.length;
        //console.log("filtered training data from %d to %d support vectors.", data.length, this.data.length);
      }
      
      //RETURN STATS
      let trainstats = {};
      trainstats.iters= iter;
      return trainstats; //ritorno il numero di iterazioni svolte
      //*/
    },
    
    update: function(){
      // update value
      this.N = this.data.length;
      this.D = this.data[0].length;
      
    },
    
    // inst is an array of length D. Returns margin of given example
    // this is the core prediction function. All others are for convenience mostly
    // and end up calling this one somehow.
    marginOne: function(inst) {
      //console.info("marginOne");
      let f = -this.b;
      // if the linear kernel was used and w was computed and stored,
      // (i.e. the svm has fully finished training)
      // the internal class variable usew_ will be set to true.
      if(this.usew_) { //only with linear kernel
        // we can speed this up a lot by using the computed weights
        // we computed these during train(). This is significantly faster
        // than the version below
        for(let j=0;j<this.D;j++) {
          f += inst[j] * this.w[j];
        }
      }
      else { // others kernel or not already finished computing the weights
        for(let i=0;i<this.data.length;i++) { //for every data entry (N times)
          f += this.alpha[i] * this.labels[i] * this.kernel(inst, this.data[i]); //sum of all these product, including kernel evaluation with
        }
      }
      
      return f;
    },
    
    predictOne: function(inst) {
        return this.marginOne(inst) > 0 ? 1 : -1;
    },
    
    // data is an NxD array. Returns array of margins.
    margins: function(data) {
      
      // go over support vectors and accumulate the prediction.
      const N = data.length;
      let margins = new Array(N);
      for(let i=0;i<N;i++) {
        margins[i] = this.marginOne(data[i]);
      }
      return margins;
      
    },
    
      //used just for memoize the values calculated from the kernel
    kernelResult: function(i, j) {
      if (this.kernelResults) {
        return this.kernelResults[i][j];
      }
      return this.kernel(this.data[i], this.data[j]);
    },
    
    // data is NxD array. Returns array of 1 or -1, predictions
    predict: function(data) {
      let margs = this.margins(data);
      for(let i=0;i<margs.length;i++) {
        margs[i] = margs[i] > 0 ? 1 : -1;
      }
      return margs;
    },
    
    // THIS FUNCTION IS NOW DEPRECATED. WORKS FINE BUT NO NEED TO USE ANYMORE.
    // LEAVING IT HERE JUST FOR BACKWARDS COMPATIBILITY FOR A WHILE.
    // if we trained a linear svm, it is possible to calculate just the weights and the offset
    // prediction is then yhat = sign(X * w + b)
    getWeights: function() {
      //if(this.usew_) return {w: this.w, b:this.b};
      // DEPRECATED
        let D = this.data[0].length;
      let w = new Array(D);
      for(let j=0;j<D;j++) {
        let s= 0.0;
        for(let i=0;i<N;i++) {
          s+= this.alpha[i] * this.labels[i] * this.data[i][j];
        }
        w[j]= s;
      }
      return {w: w, b: this.b};
    },
    
    toJSON: function() {
      
      if(this.kernelType === "custom") {
        console.log("Can't save this SVM because it's using custom, unsupported kernel...");
        return {};
      }
      
      let json = {};
      json.N = this.N;
      json.D = this.D;
      json.b = this.b;
      
      json.kernelType = this.kernelType;
      if(this.kernelType === "linear") {
        // just back up the weights
        json.w = this.w;
      }
      if(this.kernelType === "rbf") {
        // we need to store the support vectors and the sigma
        json.rbfSigma = this.rbfSigma;
        json.data = this.data;
        json.labels = this.labels;
        json.alpha = this.alpha;
      }
      if(this.kernelType === "poly"){
        //we need to store the support vectors, the influence and the degree
        json.influence = this.influence;
        json.degree = this.degree;
        json.data = this.data;
        json.labels = this.labels;
        json.alpha = this.alpha;
      }
      return json;
    },
    
    fromJSON: function(json) {
      
      this.N = json.N;
      this.D = json.D;
      this.b = json.b;
      
      this.kernelType = json.kernelType;
      if(this.kernelType === "linear") {
        
        // load the weights!
        this.w = json.w;
        this.usew_ = true;
        this.kernel = linearKernel; // this shouldn't be necessary
      }
      else if(this.kernelType === "rbf") {
        
        // initialize the kernel
        this.rbfSigma = json.rbfSigma;
        this.kernel = makeRbfKernel(this.rbfSigma);
        
        // load the support vectors
        this.data = json.data;
        this.labels = json.labels;
        this.alpha = json.alpha;
      }
      else if(this.kernelType === "poly") {
        
        // initialize the kernel
        this.degree = json.degree;
        this.influence = json.influence;
        this.kernel = makePolyKernel(this.degree, this.influence);
        
        // load the support vectors
        this.data = json.data;
        this.labels = json.labels;
        this.alpha = json.alpha;
      }
      else {
        console.log("ERROR! unrecognized kernel type." + this.kernelType);
      }
    },
    
    //********** FULL SMO ALGORITHM
    
    takeStep: function(i1,i2,i,j){
      //console.info("trying taking step with "+i+","+j);
      if(i === j) return 0; //basta controllare l'indice
      //console.info("not equal, go on");
      let alph1 = this.alpha[i];
      let alph2 = this.alpha[j];
      let y1 = this.labels[i];
      let y2 = this.labels[j];
      let E1 = this.getE(i);
      let E2 = this.getE(j);
      let s = y1*y2;
      //Compute L, H via equations (13) and (14)
      let C = this.C; //utiliy variable
      let L,H;
      if(y1 === y2) {
        L = Math.max(0, alph2+alph1-C);
        H = Math.min(C, alph2+alph1);
      }
      else {
        L = Math.max(0, alph2-alph1);
        H = Math.min(C, C+alph2-alph1);
      }
      //console.info("L-H = "+Math.abs(L-H)+" < "+1e-4+" ?");
      if(L===H) return 0;
      //console.info("no, go on");
      let k11 =this.kernelResult(i,i);
      let k12 =this.kernelResult(i,j);
      let k22 =this.kernelResult(j,j);
      let eta = k11 + k22 - 2*k12;
      
      let a1;
      let a2;
      if(eta > 0){
        a2 = alph2 + y2*(E1-E2)/eta;
        if(a2<L) a2 = L;
        else if(a2>H) a2 = H;
      }
      else{
          //console.info("eta <0");
          let f1 = y1*(E1+this.b)-alph1*this.kernelResult(i,i)-s*alph2*this.kernelResult(i,j);
          let f2 = y2*(E2+this.b)-s*alph1*this.kernelResult(i,j)-alph2*this.kernelResult(j,j);
          let L1 = alph1+s*(alph2-L);
          let H1 = alph1+s*(alph2-H);
          let Lobj = L1*f1-L*f2+0.5*L1*L1*this.kernelResult(i,i)+0.5*L*L*this.kernelResult(j,j)+s*L*L1*this.kernelResult(i,j);
          let Hobj = H1*f1+H*f2+0.5*H1*H1*this.kernelResult(i,i)+0.5*H*H*this.kernelResult(j,j)+s*H*H1*this.kernelResult(i,j);
          
        if(Lobj < Hobj-this.eps)
          a2 = L;
        else if( Lobj > Hobj+this.eps)
          a2 = H;
        else
          a2 = alph2;
        //this.alpha[i] = value; //risetto il valore a quello di prima
      }
      //console.info("a2-alph2 = "+Math.abs(a2-alph2)+" < "+this.eps*(a2+alph2+this.eps)+" ?");
      if(Math.abs(a2-alph2)<this.eps*(a2+alph2+this.eps))
        return 0;
      //console.info("No,you're done");
      a1 = alph1+s*(alph2-a2);
      
      //console.info("updating");
      //Update threshold to reflect change in Lagrange multipliers
      let b1 = this.b + E1 + y1*(a1-alph1)*this.kernelResult(i,i) + y2*(a2-alph2)*this.kernelResult(i,j);
      let b2 = this.b + E2 + y1*(a1-alph1)*this.kernelResult(i,j) + y2*(a2-alph2)*this.kernelResult(j,j);
      this.b = 0.5*(b1+b2);
      if(a1 > 0 && a1 < C) this.b = b1;
      if(a2 > 0 && a2 < C) this.b = b2;
        
      if(this.kernelType === "linear") {
            //console.info("store weights");
            // compute weights and store them
            let D = this.data[0].length;
            this.w = new Array(D);
            for(let j=0;j<D;j++) {
                let s=0.0;
                for(let i=0;i<this.data.length;i++) {
                    s += this.alpha[i] * this.labels[i] * this.data[i][j];
                }
                this.w[j] = s;
                this.usew_ = true;
            }
      }
      //Update error cache using new Lagrande multipliers
      //************not implemented caching
      
      //Store a1 in the alpha array
      this.alpha[i] = a1;
      //Store a2 in the alpha array
      this.alpha[j] = a2;
      //console.info("step taken");
      return 1;
      
    },
    
    notAtBoundsAlpha: function(){
      let indexes = [];
      for(let i=0;i<this.alpha.length;i++){
        if(!this.isAtBounds(this.alpha[i]))
          indexes.push(i);
      }
      return indexes;
    },
  
    isAtBounds: function(value){
      return value === 0 || value === this.C;
    },
    
    getE: function(i){
      return this.marginOne(this.data[i]) - this.labels[i];
    },
      
      /*
      @TODO: check & test
       */
    getMaxStepAlpha: function(i){
      let index = 0;
      let E1 = this.getE(i);
      //let E = new Array(this.data.length);
      let E = [];
      for(let j=0;j<this.data.length;j++){ //fill E vector
        E.push(this.getE(i));
      }
      if(E1 > 0){ //if positive, find the min
        let min = E[0];
        for(let j=0;j<E.length;j++){ //sort the best
          if(j!==i){
            if(min>E[j]) {
              index = j; // save the index
              min = E[j]; //new min
            }
          }
        }
      }
      else{ //non-positive, find the max
        let max = E[0];
        for(let j=0;j<E.length;j++){ //sort the best
          if(j!==i){
            if(max<E[j]){
              index = j; //save the index
              max = E[j]; //new max
            }
          }
        }
      }
      
      return index;
    },
    
    examineExample: function(i2, i){
      //console.info("examineExample");
      //let labels = this.labels;
      //let C = this.C;
      //let tol = this.tol;
      //let limit = this.data.length;
      //***************
      let y2 = this.labels[i];
      let alph2 = this.alpha[i];
      let E2 = this.getE(i);
      let r2 = E2*y2;
      let i1;
      if( (r2 < -this.tol && alph2 < this.C) || (r2 > this.tol && alph2 > 0) ) {
        let indexes = this.notAtBoundsAlpha();
        if(indexes.length > 1){ //number of non-zero & non-C alpha > 1
          let index = this.getMaxStepAlpha(i);
          i1 = this.data[index];//result of second choice heuristic
          if(this.takeStep(i1,i2,index,i)){
              return 1;
          }
        }
        
        let counter=0;
        let rand = randi(0,indexes.length);
        for(let j=rand;counter<indexes.length;j++){ //loop over all non-zero and non-C alpha, starting at a random point
          if(j === indexes.length){
            j=-1;
            continue; //skip this cycle
          }
          i1 = this.data[indexes[j]];
          if(this.takeStep(i1,i2,j,i))
            return 1;
          
          counter++;
        }
        
        counter = 0;
        rand = randi(0,this.data.length);
        for(let j=rand;counter<this.data.length;j++){ //loop over all possibile i1, starting at a random point
          if(j === this.data.length){
            j=-1;
            continue; //skip this cycle
          }
          i1 = this.data[j];
          //console.info("trying with index: "+j);
          if(this.takeStep(i1,i2,j,i))
            return 1;
          counter++;
        }
      }
      return 0;
    },
    
      /**
       * @return {number}
       */
      SMO: function () {
      console.info("SMO starts");
      console.info("# data: "+this.data.length);
      this.update();
      let numChanged  = 0;
      let examineAll = 1;
      let iter = 0;
      let N = this.data.length; //length of training examples
      while(numChanged > 0 || examineAll){
        numChanged = 0;
        if(examineAll){
          //console.info("examineAll "+N+" training examples");
          for (let i=0;i<N;i++){ //loop over all training examples
            numChanged += this.examineExample(this.data[i],i);
          }
        }
        else {
          //console.info("examineNotAtBounds");
          for (let i=0;i<N;i++){ //loop over examples
            if(!this.isAtBounds(this.alpha[i])){//where alpha is not 0 & not C
                numChanged += this.examineExample(this.data[i],i);
            }
          }
        }
        //console.info("examineAll: "+examineAll);
        //console.info("numChanged: "+numChanged);
        if(examineAll === 1)
          examineAll = 0;
        else if( numChanged === 0)
          examineAll = 1;
        iter++;
      }
      //run statistics evaluation
      let statistics = this.statisticEval();
      statistics.data = this.data;
      statistics.labels = this.labels;
      statistics.iters = iter;
      //console.table({statistics});
        
      this.ROC();
      
      //************************
      console.info("STORE");
      // if the user was using a linear kernel, lets also compute and store the
      // weights. This will speed up evaluations during testing time
      if(this.kernelType === "linear") {
    
        // compute weights and store them
        this.w = new Array(this.D);
        let s;
        for(let j=0;j<this.D;j++) {
          s=0;
          for(let i=0;i<this.data.length;i++) {
            s += this.alpha[i] * this.labels[i] * this.data[i][j];
          }
          this.w[j] = s;
          this.usew_ = true;
        }
        
      }
      else {
        // okay, we need to retain all the support vectors in the training data,
        // we can't just get away with computing the weights and throwing it out
    
        // But! We only need to store the support vectors for evaluation of testing
        // instances. So filter here based on this.alpha[i]. The training data
        // for which this.alpha[i] = 0 is irrelevant for future.
        let newdata = [];
        let newlabels = [];
        let newalpha = [];
        for(let i=0;i<N;i++) {
          //console.log("alpha=%f", this.alpha[i]);
          if(this.alpha[i] > this.alphatol) { //only if they are useful
            newdata.push(this.data[i]);
            newlabels.push(this.labels[i]);
            newalpha.push(this.alpha[i]);
          }
        }
    
        // store data and labels
        this.data = newdata;
        this.labels = newlabels;
        this.alpha = newalpha;
        this.N = this.data.length;
        //console.log("filtered training data from %d to %d support vectors.", data.length, this.data.length);
      }
      
      console.info("SMO ends");
      
      return statistics;
    },
    
    findMaxDistance: function(){
        let max = this.marginOne(this.data[0]);
        let value=0;
        for(let i=0;i<this.data.length;i++){
          value = this.marginOne(this.data[i]);
          if(value > max){
            max = value;
          }
        }
        return max;
    },
  
    /*
    @TODO: Set up a better probability distribution function
    */
    logisticValue: function(x,L){
      let k = 1;
      let exponent = -k*(x);
      return L / (1 + (Math.exp(exponent)));
    },
    
    assignProbabilities: function(max){
        let rich_data = zeros(this.data.length);
        let value=0;
        for(let i=0;i<this.data.length;i++){
          let inst = {};
          inst.instance = this.data[i];
          inst.class = this.labels[i];
          value = this.marginOne(this.data[i])/max;
          inst.score = this.logisticValue( value,1).toPrecision(2); //just change this for better probability distribution
          rich_data[i] = inst;
        }
        //sorting for max
        //console.table(rich_data);
        rich_data.sort(function(a, b){return a.score-b.score}); //ascending order
        rich_data.reverse(); //descending order
        //console.table(rich_data);
        return rich_data; //contains data[i], labels[i] and score[i], ordered by "score"
    },
    
    getProbsCM: function(threshold,data){
      let CM = [[0,0],[0,0]];
      for(let i=0;i<data.length;i++){
        //console.info("threshold: "+threshold+">"+data[i].score+"?");
        if(threshold>data[i].score){ //predicted positive with probability
          if(data[i].class === 1){ //is positive
            CM[0][0]++;
          }
          else{ //is negative
            CM[0][1]++;
          }
        }
        else{ //predicted negative with probability
          if(data[i].class === 1){ //is positive
            CM[1][0]++;
          }
          else{ //is negative
            CM[1][1]++;
          }
        }
      }
      return CM;
    },
    
    ROC: function(){
        console.info("ROC curve");
        let max = this.findMaxDistance(); //unique
        let rich_data = this.assignProbabilities(max); //unique
        let step = 0.02;
        let curve = []; //Array of pair(s)
        //console.table(rich_data);
        for(let i=0.0;i<=0.73;i+=step){
          let cm = this.getProbsCM(i,rich_data);
          let tp = cm[0][0];
          let fp = cm[1][0];
          let total = cm[0][0]+cm[0][1]+cm[1][0]+cm[0][0];
          let tris = [Math.round(i*1000)/1000,Math.round(fp/total*1000)/1000,Math.round(tp/total*1000)/1000];
          /*
          @TODO: Calculate the coords of the ROC function
          * */
          curve.push(tris);
        }
        //console.table(curve);
    },
    
    // compose the Confusion Matrix
    statisticEval:function(){
      
      let CM =[[0,0],[0,0]];
      let value = 0;
      let total = this.data.length;
      console.info("EVALUATE STATISTICS: "+total+"#");
      for(let i=0;i<total;i++){
        value = this.marginOne(this.data[i]); //evaluation
        //console.info(value);
        if(value>0){ //predicted positive
          if(this.labels[i]===1) { //is positive
            CM[0][0]++;
            //console.info(i+" -> tp");
          }
          else{ //is negative
            CM[0][1]++;
//              console.info(i+" -> fp");
          }
        }
        else{ //predicted negative
          if(this.labels[i]===1) { //is positive
            CM[1][0]++;
//              console.info(i+" -> fn");
          }
          else{ //is negative
            CM[1][1]++;
//              console.info(i+" -> tn");
          }
        }
      }
      //console.info("Confusion Matrix");
      //console.table(CM);
      
      let tp,tn,fp,fn,P,N;
      tp = CM[0][0];
      tn = CM[1][1];
      fp = CM[0][1];
      fn = CM[1][0];
      P = tp+fp;
      N = tn+fn;
      //precision
      let precision = tp/(P);
      if(P===0)
        precision = 0;
      //recall/sensitivity
      let recall = tp/(tp+fn);
      if((tp+fn)===0)
        recall = 0;
      //accurancy
      let accurancy = (tp+tn)/(P+N);
      if((P+N)===0)
        accurancy = 0;
      //specificity
      let specificity = (tn/(N));
      if(N===0)
        specificity = 0;
      //F-measure
      let fMeasure = 2*(precision*recall)/(precision+recall);
      if((precision+recall) === 0)
        fMeasure = 0;

      //statistic object
      let statistic = {};
      statistic.CM = CM;
      statistic.recall = recall;
      statistic.precision = precision;
      statistic.accurancy = accurancy;
      statistic.specificity = specificity;
      statistic.fMeasure = fMeasure;
      return statistic;
    },
      
    //********** SSCA
    //********* Smoothed Separable Case Approximation
    
    ruleA: function(i){
      console.info("ruleA");
      this.labels[i] = -this.labels[i];
    },
    
    ruleB: function(i){
      console.info("ruleB element: "+i);
      this.data.splice(i,1);
      this.alpha.splice(i,1);
      this.labels.splice(i,1);
    },
    
    SSCA: function (D,options) {
      console.info("SSCA starts");
      let value;
      let indexes = [];
      for(let i=0; i<this.data.length;i++){ //per ogni dato
        value = this.marginOne(this.data[i])*this.labels[i];
        //SCA
        if(value<0){ //misclassified
          this.ruleA(i); //flip label
          value = this.marginOne(this.data[i])*this.labels[i];
          if(value<0){ //misclassified
            indexes.push(i); //for ruleB
            continue; //vado avanti
          }
        }
        //SSCA
        if(value < D){ //misclassified if it's under a threshold D
          console.info("under "+D);
          indexes.push(i); //for ruleB
        }
      }
      
      console.info("Eliminations: "+indexes.length);
      if(indexes.length>0)
        console.table(indexes);
      
      for(let i=0;i<indexes.length;i++){ //per tutti quelli che devo eliminare
          this.ruleB(indexes[i]-i);
      }
      
      console.info("--------");
        console.info("Checking...");
      for(let i=0;i<this.data.length;i++){ //per tutti quelli che devo eliminare
        value = this.marginOne(this.data[i])*this.labels[i];
        if(value<0) console.info(value);
      }
      
      options.SSCA = false; //not SSCA again after training
      //train again
      //return this.train(this.data,this.labels,options);
        console.info("SSCA ends");
    }
  };
  
  // Kernels
  
  function makePolyKernel(d,c){
    return function(v1, v2){
      let s=0;
      for(let q=0;q<v1.length;q++) { s += v1[q] * v2[q]; }
      s = s+c;
      return Math.pow(s,d);
    }
  }
  
  function makeRbfKernel(sigma) {
    return function(v1, v2) {
      let s=0;
      for(let q=0;q<v1.length;q++) { s += (v1[q] - v2[q])*(v1[q] - v2[q]); }
      return Math.exp(-s/(2.0*sigma*sigma));
    }
  }
  
  function linearKernel(v1, v2) {
    let s=0;
    for(let q=0;q<v1.length;q++) { s += v1[q] * v2[q]; }
    return s;
  }
  
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
  
  // export public members
  exports = exports || {};
  exports.SVM = SVM;
  exports.makePolyKernel = makePolyKernel;
  exports.makeRbfKernel = makeRbfKernel;
  exports.linearKernel = linearKernel;
  return exports;
  
})(typeof module != 'undefined' && module.exports);  // add exports to module.exports if in node.js
