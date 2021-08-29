//BMI = 體重(公斤) / (身高(公尺) x 身高(公尺))
// 計算功能寫在外面，另外的功能應另外寫出來。

// 宣告 DOM
let bmiText = document.querySelector("#bmiText");
bmiText.style.display = "none";
//事件點擊按鈕
let BMIbtn = document.querySelector(".calcualteBMI");
let reset = document.querySelector(".reset");

//計算BMI

function bmi(weight, height) {
  let w = parseInt(weight);
  let h = parseInt(height) / 100; //因為公分要轉公尺所以除以100
  let bmi = (w / (h * h)).toFixed(2); //toFixed讓小數點4捨5入只有2位
  return bmi;
}

// 取出輸入值寫入畫面
function calculateBMI() {
  let bodyWeight = document.querySelector(".bodyWeight").value;
  let bodyHeight = document.querySelector(".bodyHeight").value;
  let resultText = document.querySelector("#resultText");
  let bmiText = document.querySelector("#bmiText");
  //  印出值來
  if (bodyWeight != "" && bodyHeight != "") {
    bmiText.style.display = "block";
    resultText.innerHTML = bmi(bodyWeight, bodyHeight);
    bmiText.innerHTML = checkBMI(bmi(bodyWeight, bodyHeight));
  } else {
    bmiText.style.display = "none";
    alert("請輸入身高體重！");
    return;
  }
  resultText.innerHTML = bmi(bodyWeight, bodyHeight);
}
//  bmi 範圍
function checkBMI(bmi) {
  if (bmi < 18.5) {
    return "太輕囉";
  } else if (bmi >= 18.5 && bmi < 24) {
    return "恭喜你!很健康呢!請繼續維持~ ";
  } else if (bmi >= 24 && bmi < 27) {
    return "要注意一下囉 ";
  } else if (bmi >= 27 && bmi < 30) {
    return "有點胖呢 ";
  } else if (bmi >= 30 && bmi < 35) {
    return "相當胖呢 ";
  } else if (bmi >= 35) {
    return "別想了減肥吧 ";
  }
}
//清空值
function undo(e) {
  document.querySelector(".bodyWeight").value = "";
  document.querySelector(".bodyHeight").value = "";
  bmiText.style.display = "none";
  resultText.innerHTML = 0;
  return;
}

//事件監聽
BMIbtn.addEventListener("click", calculateBMI);
reset.addEventListener("click", undo);
