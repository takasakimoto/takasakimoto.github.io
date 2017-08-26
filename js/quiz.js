var quizJson = new Object;//クイズデータ
var stage = 1;//ステージ
var quizCount = 1;//問題番号
var acquisitionPoint = 0;//獲得できるポイント
var point = 0;//現在のポイント
var opr1 = 0;//計算値
var opr2 = 0;//計算値
var operator = "";

//クイズの開始
var startQuiz = function(_quizJson) {
	quizJson = _quizJson;
	acquisitionPoint = quizJson.point;
	$("#acquisition_point").text("獲得できるポイント" + acquisitionPoint);
	$("#stage").text("ステージ" + stage);
	$("#quiz_count").text("第" + quizCount + "問目");
	$("#quiz").text("問題" + quizCount + "に答える");
	$("#point").text("現在" + point + "ポイント獲得");
	//計算式の構築
	opr1 = quizJson.ope1from + Math.floor(Math.random() * quizJson.ope1to);
	opr2 = quizJson.ope2from + Math.floor(Math.random() * quizJson.ope2to);
	operator = quizJson.operator;
	console.log("quiz=" + opr1 + operator + opr2);
	$("#calc").text(opr1 + operator + opr2);
	  	
	//クイズの出題
	setTimeout(function(){nextQuiz(true)}, quizJson.timeout);
	$("#answer").focus();
	$("#answer").keypress(function (e) {
		if (e.which == 13) {
			checkAnswer(Number($("#answer").val()));
		}
	});
}

	
// 計算結果の確認
var checkAnswer = function(_answer) {
	var correct = false;//正解したか
	//正解を計算
	var answer = 0;
	console.log("answer=" + answer);
	console.log("_answer=" + _answer);
	switch (operator){
	case "×":
    	answer = opr1 * opr2;
		break;
	case "÷":
    	answer = parseInt(opr1 / opr2);
		break;
	case "":
		break;
	}
	console.log(answer);
	if (_answer == answer) {
		correct = true;
	}
	if (correct) {
		//正解
		alert("正解！！")
		point = Number(point) + Number(acquisitionPoint);
	} else {
		//不正解
		alert("不正解だよー！！")
	}
	nextQuiz(false);
	return correct;
}

// 次のクイズへ
var nextQuiz = function(timeout) {
	console.log("quizCount=" + quizCount);
	console.log("Json quizCount=" + quizJson.quiz_count);
	if (timeout) {
		alert("時間切れでーす。")
	}
	if (Number(quizCount) == Number(quizJson.quiz_count)) {
		stage++;
		quizCount = 1;
	} else {
		quizCount++;
	}
	window.location.href = 
		"right.html"  +
		"?stage=" + stage + 
		"&quizCount=" + quizCount +
		"&point=" + point;
}

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


if (arg.stage !== undefined) {
	stage = arg.stage;
}
if (arg.quizCount !== undefined) {
	quizCount = arg.quizCount;
}
if (arg.point !== undefined) {
	point = arg.point;				
	$("#point").text("現在" + point + "ポイント獲得");
}
console.log("stage=" + stage);
console.log("quizCount=" + quizCount);
console.log("point=" + point);



var jsonFilename = "./data/stage" + stage + ".json";
$.getJSON(jsonFilename ,function(_quizJson) {
	if (_quizJson === undefined) {
		//クイズは終わり
		return;
	}	
	startQuiz(_quizJson);
});
