import * as SG from "./scenegraph"
import * as HTNPlanning from "./htnplanning"
import * as Domain from "./hulkdomain"


// Test the HTNPlanning.applyTask() function
export function testApplyTask() : boolean {

    console.log("Testing HTNPlanning.applyTask()...")

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

    console.log("Success. Result: " + JSON.stringify(result));

    return true;
}

export function testApplyMethod() {

}

// Test the HTNPlanning.seekPlan() function
export function testSeekPlan() : boolean {

    console.log("Testing HTNPlanning.seekPlan()...");

    const result = HTNPlanning.seekPlan(Domain.hulkDomain, Domain.init, [Domain.task_propel], []);

    if(!result) {
        console.log("Result was null");
        return false;
    }

    const expected = [
        {"operator_name":"blast","args":[]},
        {"operator_name":"fall","args":[]},
        {"operator_name":"fall'","args":[]},
        {"operator_name":"fall'","args":[]},
        {"operator_name":"land","args":[]}]

    if (JSON.stringify(result!) != JSON.stringify(expected)) {
        console.log("Result: " + JSON.stringify(result));
        console.log("Expected: " + JSON.stringify(expected));
        return false;
    }

    console.log("Success. Result: " + JSON.stringify(result));

    return true;
}