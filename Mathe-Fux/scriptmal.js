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
	
	if (random == 0)
	{
		$("#button1").val(result).addClass("correct");
		$("#button2").val(Math.floor((Math.random() * 100) + 1));
		$("#button3").val(Math.floor((Math.random() * 100) + 1));
	} else if (random == 1) {
		$("#button2").val(result).addClass("correct");
		$("#button1").val(Math.floor((Math.random() * 100) + 1));
		$("#button3").val(Math.floor((Math.random() * 100) + 1));
	} else {
		$("#button3").val(result).addClass("correct");
		$("#button2").val(Math.floor((Math.random() * 100) + 1));
		$("#button1").val(Math.floor((Math.random() * 100) + 1));
	}
	
	$('#text').html(x + " &#x2022; " + y);
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