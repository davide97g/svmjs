// compose the Confusion Matrix
function statisticEval(labels,values){
    
    let CM =[[0,0],[0,0]];
    //let value = 0;
    let total = labels.length;
    console.info("🔎 STATISTICS "+total);
    for(let i=0;i<total;i++){
        //value = marginF(data[i],data,alpha,labels); //evaluation
        if(values[i]>0){ //predicted positive
            if(labels[i]===1) { //is positive
                CM[0][0]++;
            }
            else{ //is negative
                CM[0][1]++;
            }
        }
        else{ //predicted negative
            if(labels[i]===1) { //is positive
                CM[1][0]++;
            }
            else{ //is negative
                CM[1][1]++;
            }
        }
    }
    
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
}