window.onload = function() {
  console.log("hi");

  let canv = document.getElementById("myCanvas");
  let ctx = canv.getContext("2d");

  var girl = document.getElementById("f4");
  var angry_emote = document.getElementById("e1");
  var signpost = document.getElementById("sign");
  var rainbow = document.getElementById("rainbow");

  let image_attributes =
  {
    "person": 
    {
      "f4": ["upright", "facing_forward", "arms_raised", "brown_hair"],
      "f1": []
    }

  }

  ctx.drawImage(girl, 10, 50, 200, 250);
  ctx.drawImage(angry_emote, 75, 25, 75, 75);
  ctx.drawImage(signpost, 250, 150, 100, 100);
  ctx.drawImage(rainbow, 265, 155, 50, 50);

   
};
