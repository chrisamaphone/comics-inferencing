import * as HTNUnitTest from "./testhtnplanning"

console.log("---- UNIT TESTS ----")
console.log("applyTask():");
HTNUnitTest.testApplyTaskInApplicableState();
HTNUnitTest.testApplyTaskInNonApplicableState();

console.log("seekPlan(): " + JSON.stringify(HTNUnitTest.testSeekPlan()));

// currently buggy
console.log("seeEventStructure(): " + JSON.stringify(HTNUnitTest.testSeekEventStructure()));

const mydiv = document.getElementById("main");
mydiv!.innerHTML = "Hello, world!";