window.onload = function() {
  console.log("hi");

  let canv = document.getElementById("myCanvas");
  let ctx = canv.getContext("2d");

  var girl = document.getElementById("f4");
  var angry_emote = document.getElementById("e1");

  ctx.drawImage(girl, 10, 100);
  ctx.drawImage(angry_emote, 25, 50, 50, 50);
  
};
