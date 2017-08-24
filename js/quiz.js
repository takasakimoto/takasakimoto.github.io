var nextQuiz = function() {
	window.location.href = "right.html?no=" + quizNo;
}

function checkAnswer() {
	// 計算結果の確認
	var answerText = document.getElementById("answer");
	console.log("answer=" + answerText.textContent);
	console.log("answerCheckJson=" + quizJson);
	quizNo = Number(quizNo) + 1;
	console.log("quizNo=" + quizNo);
	console.log("point=" + point);
	window.location.href = "right.html?no=" + quizNo;
}
var quizJson;//クイズデータ
var quizNo = 1;//問題番号
var point = 0;//現在のポイント

//変数argはオブジェクトですよ
var arg = new Object;

// 変数pairにURLの?の後ろを&で区切ったものを配列にして代入
var pair=location.search.substring(1).split('&');
    // location.search.substring(1)は、URLから最初の1文字 (?記号) を除いた文字列を取得する
    // .split('&')は&で区切り配列に分割する


// for文でrairがある限りループさせる
for(var i=0;pair[i];i++) {

　　// 変数kvにpairを=で区切り配列に分割する
    var kv = pair[i].split('=');// kvはkey-value

　　// 最初に定義したオブジェクトargに連想配列として格納
    arg[kv[0]]=kv[1];  // kv[0]がkey,kv[1]がvalue

}
console.log(arg.no);

//問題表示
function refresh() {
  $.getJSON("./data/data.json" , function(data) {
	if (arg.no === undefined) {
	  quizNo = 1;
	} else {
	  quizNo = arg.no;
	}
	$("#quiz").textContent=quizNo;
  	if (data.length < quizNo) {
  		return;
  	}
	quizJson = data[quizNo-1];
	quizNo = Number(quizNo) + 1;
  	//タイマー設定
	setTimeout(nextQuiz, quizJson.timeout);
  });
}

refresh();
