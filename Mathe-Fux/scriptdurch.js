var correct = 0;
var all = 0;

$(document).ready(function(){
	restart();
});

function newQuestion()
{
	var x = Math.floor((Math.random() * 10) + 1);
	var y = Math.floor((Math.random() * 10) + 1);	
	var result = x * y;
	
	var random = Math.floor((Math.random() * 10)) % 3;
	
	$(".answer").css("background-color","").removeClass("correct");
	
	var r1 = (y + 1) % 10;
	var r2 = (y - 1) % 10;
	
	if (random == 0)
	{
		$("#button1").val(y).addClass("correct");
		$("#button2").val(r1);
		$("#button3").val(r2);
	} else if (random == 1) {
		$("#button2").val(y).addClass("correct");
		$("#button1").val(r1);
		$("#button3").val(r2);
	} else {
		$("#button3").val(y).addClass("correct");
		$("#button2").val(r1);
		$("#button1").val(r2);
	}
	
	$('#text').html(result + " : " + x);
	$('#text').attr("data-result", result);
	
	checking = false;
}

function restart()
{
	newQuestion();
	correct = 0;
	all = 0;
	$("#all").text(all);
	$("#correct").text(correct);
}

var checking = false;
function check(button)
{
	if (checking) return;
	checking = true;
	
	all++;
	if ($(button).hasClass("correct"))
	{
		correct++;
		$(button).css("background-color","#0f0");
	} else {
		$(".correct").css("background-color","#f00");
	}
	$("#all").text(all);
	$("#correct").text(correct);
	
	window.setTimeout(newQuestion, 2000);
}