import * as SG from "./scenegraph"
import * as HTNPlanning from "./htnplanning"
import * as Domain from "./hulkdomain"


//---- Test the HTNPlanning.applyTask() function ----

// Test #1: invoking applyTask in an applicable state
export function testApplyTaskInApplicableState() : boolean {

    console.log("Testing HTNPlanning.applyTask() on an applicable state...");

    const blastOp = Domain.operators("blast");
    
    // Expect this to return: [hulk_blasted]
    const result = HTNPlanning.applyTask(blastOp!, ["epsilon", "hulk"], Domain.init);
    
    if(!result) {
        console.log("Failure. Result was null.");
        return false;
    }

    const expected = [Domain.hulk_blasted];
    if(! SG.equals(result, expected)) {
        console.log("Result: " + JSON.stringify(result));
        console.log("Expected: " + JSON.stringify(expected));
        return false;
    }

    console.log("Success! Result: " + JSON.stringify(result));
    return true;
}

// Test #2: invoking applyTask in a non-applicable state
export function testApplyTaskInNonApplicableState() : boolean {

    console.log("Testing HTNPlanning.applyTask() on a non-applicable state...");
    
    const fallOp = Domain.operators("fall");

    // Expect this to return: null
    const result = HTNPlanning.applyTask(fallOp!, [], Domain.init);

    if(result !== null) {
        console.log("Failure. Result was not null.")
        return false;
    }

    else {
        console.log("Success! Result was: " + result);
        return true;
    }
}

// Test #3: invoking applyTask on a task with arguments in an applicable state

// Test #4: invoking applyTask on a task with arguments in a non-applicable state





export function testApplyMethod() {

}

// Test the HTNPlanning.seekPlan() function
export function testSeekPlan() : boolean {

    console.log("Testing HTNPlanning.seekPlan()...");

    const result = HTNPlanning.seekPlan(Domain.hulkDomain, Domain.init, [Domain.task_propel], []);

    if(!result) {
        console.log("Failure. Result was null.");
        return false;
    }

    const expected = [
        {"operator_name":"blast","args":["epsilon", "hulk"]},
        {"operator_name":"fall","args":["hulk"]},
        {"operator_name":"fall'","args":["hulk"]},
        {"operator_name":"fall'","args":["hulk"]},
        {"operator_name":"land","args":["hulk"]}]

    if (JSON.stringify(result!) != JSON.stringify(expected)) {
        console.log("Result: " + JSON.stringify(result));
        console.log("Expected: " + JSON.stringify(expected));
        return false;
    }

    console.log("Success! Result: " + JSON.stringify(result));

    return true;
}