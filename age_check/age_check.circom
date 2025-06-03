// age_check.circom
pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";

template AgeCheck() {
    signal input age;        // private input
    signal output is_valid;  // public output: 1 if valid, 0 if not

    component gt = GreaterThan(8); // 8-bit comparison
    gt.in[0] <== age;
    gt.in[1] <== 18;

    is_valid <== gt.out;
}

component main = AgeCheck();
