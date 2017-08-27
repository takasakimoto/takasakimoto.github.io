var quizJson = new Object;//クイズデータ
var stage = 1;//ステージ
var level = 1;//難易度
var quizCount = 1;//問題番号
var acquisitionPoint = 0;//獲得できるポイント
var countDownTime = 1;//残り時間
var setTimeoutId = 0;
var point = 0;//現在のポイント
var damagePoint = 0;//不正解もしくは時間切れでダメージを受けるポイント
var perfectPoint = 0;//全問題正解のポイント
var opr1 = 0;//計算値
var opr2 = 0;//計算値
var operator = "";//演算子
var isConfirm = false;//入力確定しているか？
var hasNextStage = false;//次のステージがあるか？
var imgPreloader = new Image();//キャラクター表示用
var imgUrl;//キャラクター画像のURL
var imgStyle;//SPANタグへのキャラクター画像URLのスタイル設定

imgPreloader.onload=function() {
	//ロード完了で画像を表示
	$("#quiz_image").css({'background-image':imgStyle});
}

var displayImage = function(filename) {
	imgUrl = "image/" + filename;
	imgStyle = "url('image/" + filename + "')";
	imgPreloader.src = imgUrl;
}

//クイズの開始
var startQuiz = function(_quizJson) {
	quizJson = _quizJson;
	
	//画像取得
	var imgCount = quizJson.image.length;
	var imgIdx = Math.floor(Math.random() * (imgCount));
	displayImage(quizJson.image[imgIdx]);

	acquisitionPoint = quizJson.point;
	damagePoint = quizJson.damage_point;
	perfectPoint = perfectPoint + acquisitionPoint;
	hasNextStage = quizJson.has_next_stage;
	$("#acquisition_point").text("獲得できるポイント " + acquisitionPoint + " (ダメージを受けるポイント " + damagePoint + " )");
	$("#stage").text("ステージ" + stage);
	$("#quiz_count").text("第" + quizCount + "問目");
	$("#answer_confirm").text("問題" + quizCount + "に答える");
	$("#answer_confirm").click(function(){
		isConfirm = true;
		checkAnswer(Number($("#answer").val()));
	});
	$("#point").text("現在" + point + "ポイント獲得");
	//計算式の構築
	opr1 = Math.floor(Math.random() * (quizJson.ope1to + 1 - quizJson.ope1from)) + quizJson.ope1from;
	opr2 = Math.floor(Math.random() * (quizJson.ope2to + 1 - quizJson.ope2from)) + quizJson.ope2from;
	operator = quizJson.operator;
	console.log("quiz=" + opr1 + operator + opr2);
	$("#calc").text(opr1 + operator + opr2);
	  	
	//クイズの出題
	countDownTime = quizJson.timeout[level-1];
	$("#count_down").text("残り" + countDownTime + "秒");
	setTimeoutId = setTimeout(function(){dispCountDown()}, 1000/*1秒*/);
    $('#input_focus').trigger('click');
	$("#answer").keypress(function (e) {
		if (e.which == 13) {
			isConfirm = true;
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
		alert("攻撃成功！！")
		point = Number(point) + Number(acquisitionPoint);
	} else {
		//不正解
		alert("攻撃がかわされて、攻撃を受けた！ " + damagePoint + "ポイントのダメージを受けた。")
		point = Number(point) - Number(damagePoint);
		if (point < 0) {
			point = 0;
		}
	}
	nextQuiz(false);
	return correct;
}

// カウントダウン表示
var dispCountDown = function() {
	countDownTime = countDownTime - 1;
	$("#count_down").text("残り" + countDownTime + "秒");	
	if (countDownTime == 0 && !isConfirm) {
		//時間切れ
		nextQuiz(true);
	} else {
		setTimeout(function(){dispCountDown()}, 1000/*1秒*/);
	}
}

// 次のクイズへ
var nextQuiz = function(timeout) {
	console.log("quizCount=" + quizCount);
	console.log("Json quizCount=" + quizJson.quiz_count);
	if (timeout) {
		alert("攻撃が遅いので攻撃を受けた！\n" + damagePoint + "ポイントのダメージを受けた。")
		point = Number(point) - Number(damagePoint);
		if (point < 0) {
			point = 0;
		}
	}
	if (Number(quizCount) == Number(quizJson.quiz_count)) {
		if (!hasNextStage) {
			//クイズ終了
			finishQuiz();
			return;
		}
		stage++;
		quizCount = 1;
	} else {
		quizCount++;
	}
	window.location.href = 
		"right.html"  +
		"?level=" + level + 
		"&stage=" + stage + 
		"&quizCount=" + quizCount +
		"&perfect=" + perfectPoint +
		"&point=" + point;
}

var finishQuiz = function() {
	clearTimeout(setTimeoutId);
	
	var finishMsg = "終了〜"
	var imgFilename = "";
	//正解率で出来具合を表示
	var percent = parseInt(point / perfectPoint * 100);
	console.log("perfectPoint=" + perfectPoint);
	console.log("percent=" + percent);
	switch (true) {
	case (percent == 100) :
		finishMsg = "やりました！パーフェクト！！";
		imgFilename = "perfect.jpg";
		break;
	case (percent >= 80) :
		finishMsg = "すばらしい！";
		imgFilename = "verygood.jpeg";
		break;
	case (percent >= 70) :
		finishMsg = "おお。いいね！";
		imgFilename = "good.jpg";
		break;
	case (percent >= 60) :
		finishMsg = "まぁまぁいいんじゃね。";
		imgFilename = "soso.jpeg";
		break;
	case (percent >= 50) :
		finishMsg = "まだまだだな。。";
		imgFilename = "notsogood.jpg";
		break;
	case (percent >= 40) :
		finishMsg = "がんばれ〜〜〜";
		imgFilename = "sobad.jpg";
		break;
	case (percent < 40) :
		finishMsg = "コラ〜！出直してこーい！！";
		imgFilename = "bad.jpeg";
		break;
	}
	displayImage(imgFilename);
	$("#calc").remove();
	$("#count_down").remove();
	$("#quiz_title").remove();
	$("#answer_confirm").remove();
	$("#answer").remove();
	$("#point").remove();
	$("#finish_comment1").text(finishMsg);
	$("#finish_comment2").text(point + "ポイント獲得しました！（ポイント獲得率：" + percent + "%）");	
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
if (arg.level !== undefined) {
	level = arg.level;
}
if (arg.quizCount !== undefined) {
	quizCount = arg.quizCount;
}
if (arg.perfect !== undefined) {
	perfectPoint = Number(arg.perfect);
}
if (arg.point !== undefined) {
	point = arg.point;				
	$("#point").text("現在" + point + "ポイント獲得");
}
console.log("stage=" + stage);
console.log("level=" + level);
console.log("quizCount=" + quizCount);
console.log("perfect=" + perfectPoint);
console.log("point=" + point);

var jsonFilename = "./data/stage" + stage + ".json";
$.getJSON(jsonFilename ,function(_quizJson) {
	if (_quizJson === undefined) {
		//クイズは終わり
		return;
	}	
	startQuiz(_quizJson);
});

$(document).ready(function(){
    var focusTextField = function(){
        console.log("answer focus");
    };
    var onClickHandler = function(){
        $('#answer').focus();
    };
    $('#answer').bind('focus', focusTextField);
    $('#input_focus').bind('click', onClickHandler);
});
