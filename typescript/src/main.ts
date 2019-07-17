import * as HTNUnitTest from "./testhtnplanning"

console.log("---- UNIT TESTS ----")
console.log("applyTask():");
HTNUnitTest.testApplyTaskInApplicableState();
HTNUnitTest.testApplyTaskInNonApplicableState();

console.log("seekPlan(): " + JSON.stringify(HTNUnitTest.testSeekPlan()));

const mydiv = document.getElementById("main");
mydiv!.innerHTML = "Hello, world!";




