var file = document.getElementById("file");
var canvas = document.getElementById("canvas");
var uploadImgSrc;
var ctx = canvas.getContext("2d");
let data = [];
var sugar;
const classifier = ml5.imageClassifier("MobileNet", modelLoaded);

window.onload = function(){
  canvas.width = 0;
  canvas.height = 0;
  document.getElementById("file").disabled = "disabled";
  document.getElementById("progress").innerHTML="機械学習モデルをロード中..."
}

function modelLoaded(){
  document.getElementById("progressbar").value = 100;
  document.getElementById("progress").innerHTML="機械学習モデルのロードが完了しました"
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
  document.getElementById("progress").innerHTML="計算中..."
  document.getElementById("progressbar").value = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var img = new Image();
  img.src = uploadImgSrc;
  img.onload = function() {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    classifier.classify(img, getImageType);
    function getImageType(error, ImageType){
      data = ImageType;
      if(error){
        alert("エラーが発生しました");
      }else if(data[0].label == "banana"
             || data[1].label == "banana"
             || data[2].label == "banana"){
               ctx.drawImage(img, 0, 0);
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
  document.getElementById("progressbar").value = 100;
  document.getElementById("progress").innerHTML="計算完了!"
};

function Calculate(){
  var sumR = 0;
  var sumG = 0;
  var supR = 0;
  var supG = 0;
  var maxR = 234;
  var maxG = 203;
  var minR = 138;
  var minG = 110;
  canvas.size = canvas.width*canvas.height;
  var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  imageData.getRGB = function(x,y,z){
    return this.data[this.width*4*y+4*x+z];
  }
  for(var i = 0; i <canvas.width; i++){
    for(var j = 0; j <canvas.height; j++){
      if(imageData.getRGB(i,j,0) == 255){
        supR += 1
      }else if(imageData.getRGB(i,j,0) <= maxR && imageData.getRGB(i,j,0) >= minR){
        sumR += 1
      };
      if(imageData.getRGB(i,j,1) == 255){
        supG += 1
      }else if(imageData.getRGB(i,j,1) <= maxG && imageData.getRGB(i,j,1) >= minG){
        sumG += 1;
      };
    };
  };
  var x = (sumR/(canvas.size-supR)+sumG/(canvas.size-supG))/2;
  //(* arithmetic mean of cumulative relative frequency of R value and G value);
  sugar = 5.364725266316210*x+16.795256433435;
  console.log("Sugar Content:"+sugar);
  document.getElementById("progressbar").value = 100;
  document.getElementById("result").value = (Math.round(sugar*10)/10).toFixed(1);
  if(!(document.form0.elements[0].checked)){
    ClearCanvas();
  };
};

function ClearCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  var canvas2 = document.getElementById("canvas");
  canvas2.width = 0;
  canvas2.height = 0;
  document.getElementById("progress").innerHTML=""
};

function ClearFile(){
  file.value = "";
}
