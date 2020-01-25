var file = document.getElementById("file");
var canvas = document.getElementById("canvas");
var uploadImgSrc;
var ctx = canvas.getContext("2d");
let data = [];
var sugar;
var result = document.getElementById("result");
const classifier = ml5.imageClassifier("MobileNet", modelLoaded);

window.onload = function(){
  canvas.width = 0;
  canvas.height = 0;
  document.getElementById("file").disabled = "disabled";
  alert("機械学習のモデルをロード中（ロードには数秒かかります）");
}

function modelLoaded(){
  alert("機械学習のモデルのロードが完了しました");
  document.getElementById("file").disabled = "";
}

if(window.File && window.FileReader && window.FileList && window.Blob) {
  function loadLocalImage(e) {
    var fileData = e.target.files[0];
    if(!fileData.type.match("image.*")) {
      alert("画像を選択してください");
      file.value = "";
      return;
    };
    var reader = new FileReader();
    reader.onload = function() {
      uploadImgSrc = reader.result;
      canvasDraw();
    };
    reader.readAsDataURL(fileData);
  };
}else{
  file.style.display = "none";
  alert("APIに対応したブラウザで試してみてください");
};
file.addEventListener("change", loadLocalImage, false);

function canvasDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var img = new Image();
  img.src = uploadImgSrc;
  img.onload = function() {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    classifier.classify(img, gotResults);
    function gotResults(error, results){
      if(error){
        alert("エラーが発生しました");
      };
      data = results;
      ctx.drawImage(img, 0, 0);
      if(data[0].label == "banana"
      || data[1].label == "banana"
      || data[2].label == "banana"){
        Calculate();
      }else{
        alert("この画像はバナナの画像ではないようです");
        result.innerHTML = "None";
        file.value = "";
        if(!(document.form0.elements[0].checked)){
        ClearCanvas();
        };
      };
    };
  };
};

function Calculate(){
  var k = 0;
  var b1 = 40;
  var r1 = 167;
  var g1 = 132;
  var r2 = 190;
  var g2 = 156;
  var r3 = 223;
  var g3 = 190;
  canvas.size = canvas.width*canvas.height;
  var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  imageData.getRGB = function(x,y,z){
    return this.data[this.width*4*y+4*x+z];
  }
  for(var i = 0; i <canvas.width; i++){
    for(var j = 0; j <canvas.height; j++){
      if(imageData.getRGB(i,j,2) >= b1 - 30 && imageData.getRGB(i,j,2) <= b1 + 30){
        if(imageData.getRGB(i,j,0) == r1
        || imageData.getRGB(i,j,1) == g1
        || imageData.getRGB(i,j,0) == g2
        || imageData.getRGB(i,j,1) == r2
        || imageData.getRGB(i,j,0) == r3
        || imageData.getRGB(i,j,1) == g3){
          k = k + 1;
        };
      };
    };
  };
  sugar = 285.902578*k/canvas.size+18.54427223;
  result.innerHTML = Math.round(sugar*10)/10;
  file.value = "";
  if(!(document.form0.elements[0].checked)){
    ClearCanvas();
  };
};

function ClearCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  var canvas2 = document.getElementById("canvas");
  canvas2.width = 0;
  canvas2.height = 0;
};
