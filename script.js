
function drawPridePanel1(ctx, girl, angry_emote, signpost, rainbow) {
  ctx.drawImage(girl, 10, 50, 200, 250);
  ctx.drawImage(angry_emote, 75, 25, 75, 75);
  ctx.drawImage(signpost, 250, 150, 100, 100);
  ctx.drawImage(rainbow, 265, 155, 50, 50);
}

// Image database mapping object names to images with
// sets of attributes.
let image_attributes =
{
  "jane":
  // When we reference the "jane" object, 
  // the following images qualify.
  { "f1": [
      "upright",
      "facing_forward",
      "idle"],
    "f4": [
      "upright", 
      "facing_forward", 
      "arms_raised"]
  },
  "john":
  // When we reference the "john" object,
  // the following images qualify.
  { "m1": [
      "upright",
      "facing_forward",
      "idle"],
    "m4": [
      "upright", 
      "facing_forward", 
      "arms_raised"]
  }
}

function member(element, arr) {
  for(var i=0; i < arr.length; i++) {
    if (arr[i] == element) return true;
  }
  return false;
}

function subset(a1, a2) {
  for(var i=0; i < a1.length; i++) {
    if(!(member(a1[i], a2))) return false;
  }
  return true; // XXX
}

// fetch(object_name : string, attributes : string list)
//  returns a set of document IDs matching the name & attrs.
// e.g.:
// fetch("jane", ["upright"]) = ["f1", "f4"]
// fetch("john", ["arms_raised"]) = ["f4"]
function fetch(object_name, attributes) {
  let candidates = image_attributes[object_name];
  var matches = [];
  for (var key in candidates) {
    //console.log(key);
    let cand_attrs = candidates[key];
    //console.log(JSON.stringify(cand_attrs));
    
    // Need to make sure attributes \subseteq cand_attrs
    if(subset(attributes, cand_attrs)) {
      matches.push(key);
    }
  }
  return matches;

}

function get_random(options) {
  let idx = Math.floor(Math.random() * options.length);
  return options[idx];
}

function fetch_random(obj_name, attrs) {
  return get_random(fetch(obj_name, attrs));
}


window.onload = function() {
  let canv = document.getElementById("myCanvas");
  let ctx = canv.getContext("2d");

  var girl_id = fetch_random("jane", ["arms_raised"]);
  var girl = document.getElementById(girl_id);

  /*
  var girl = document.getElementById("f4");
  var angry_emote = document.getElementById("e_anger");
  var signpost = document.getElementById("sign");
  var rainbow = document.getElementById("rainbow");
  var desk = document.getElementById("desk");
  // XXX - replace these with calls to fetch
  */

  // Debugging
  /*
  for (var obj in image_attributes) {
    console.log(obj);
    fetch(obj, []);
  }
  */

  // drawPridePanel1(ctx, girl, angry_emote, signpost, rainbow);
   
};


