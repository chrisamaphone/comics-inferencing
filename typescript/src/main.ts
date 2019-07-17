import * as HTNUnitTest from "./testhtnplanning"

// console.log("A")
// const foo = 5;
// const myStuff = [1,2,3,4,5]
// console.log("Random member of myStuff: "+ HTN.randomMember(myStuff))

// console.log("Expanding propel by explosion:")
// console.log(expandHTN(composite_propel_by_explosion));
console.log("---- UNIT TESTS ----")
console.log("applyTask(): " + JSON.stringify(HTNUnitTest.testApplyTask()));
console.log("seekPlan(): " + JSON.stringify(HTNUnitTest.testSeekPlan()));

const mydiv = document.getElementById("main");
mydiv!.innerHTML = "Hello, world!";




