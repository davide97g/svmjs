# svmjs
Repository containing code about some tests with a js library implementing SVM with SMO algorithm for training.
### Algorithms
##### SVM
Implementation of SVM with kernel:
- linear
- polynomial
- gaussian (RBF)

Extra input, generated from input data, is another option for feeding the data to the SVM.

###### training
Sequential minimal optimization in two variants:
- simplified SMO (Karpathy's version)
- full SMO (John Platt's version)

##### KNN
K-Nearest Neighbors algorithm with K from 2 to 10 and distances:
- minkowski
- chebyshev
- mahalanobis

##### K-Means
K-Means algorithm with K from 1 to 50

### Demo
Live demo here: https://davide97g.github.io/svmjs

### Credits
This work is based on the previous work of Andrej Karpathy.
You can found the source code here: https://github.com/karpathy/svmjs
