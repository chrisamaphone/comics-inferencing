import * as HTNUnitTest from "./testhtnplanning"

console.log("---- UNIT TESTS ----")
console.log("applyTask():");
HTNUnitTest.testApplyTaskInApplicableState();
HTNUnitTest.testApplyTaskInNonApplicableState();

function runTestPrintResult(s:string, f : () => any) {
    console.log(s + JSON.stringify(f()));
}

runTestPrintResult("seekPlan(): ", HTNUnitTest.testSeekPlan);
runTestPrintResult("seeEventStructure(): ", HTNUnitTest.testSeekEventStructure);

// Friday 9/6: Returns null :( -- CRM
runTestPrintResult("seekMatchingEventStructure(): ", HTNUnitTest.testSeekMatchingEventStructure);

const mydiv = document.getElementById("main");
mydiv!.innerHTML = "Hello, world!";