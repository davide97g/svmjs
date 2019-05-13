// Kernels
//this file contains the formula definition for the various kernels trick implemented in svm.js
//let kernels = (function (exports) {
    
    export function makePolyKernel(d, c) {
        return function (v1, v2) {
            let s = 0;
            for (let q = 0; q < v1.length; q++) {
                s += v1[q] * v2[q];
            }
            s = s + c;
            return Math.pow(s, d);
        }
    }
    
    function makeRbfKernel(sigma) {
        return function (v1, v2) {
            let s = 0;
            for (let q = 0; q < v1.length; q++) {
                s += (v1[q] - v2[q]) * (v1[q] - v2[q]);
            }
            return Math.exp(-s / (2.0 * sigma * sigma));
        }
    }
    
    function linearKernel(v1, v2) {
        let s = 0;
        for (let q = 0; q < v1.length; q++) {
            s += v1[q] * v2[q];
        }
        return s;
    }
    
    /*
    //export public members
    exports = exports || {};
    exports.makePolyKernel = makePolyKernel;
    exports.makeRbfKernel = makeRbfKernel;
    exports.linearKernel = linearKernel;
    return exports;
    
})(typeof module != 'undefined' && module.exports);
    */