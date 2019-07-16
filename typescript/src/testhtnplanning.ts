import * as SG from "./scenegraph"
import * as HTNPlanning from "./htnplanning"
import * as Domain from "./hulkdomain"


export function testApplyTask() {

    const blastOp = Domain.operators("blast");
    
    // Expect this to return: [hulk_blasted]
    const result = HTNPlanning.applyTask(blastOp!, [], Domain.init);
    
    if(!result) {
        console.log("Result was null");
        return false;
    }

    const expected = [Domain.hulk_blasted];
    if(! SG.equals(result, expected)) {
        console.log("Result: " + JSON.stringify(result));
        console.log("Expected: " + JSON.stringify(expected));
        return false;
    }

    return true;
}

function testApplyMethod() {

}

function testSeekPlan() {

}