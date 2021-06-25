var correct = 0;
var all = 0;

$(document).ready(function(){
	restart();
});

function newQuestion()
{
	var x = Math.floor((Math.random() * 100) + 1);
	var y = Math.floor((Math.random() * 100) + 1);
	
	if (x < y)
	{
		var temp = x;
		x = y;
		y = temp;
	}
	
	var result = x - y;
	
	var result2 = result -10 + Math.floor((Math.random() * 20));
	var result3 = result -10 + Math.floor((Math.random() * 20));
	
	while (result2 == result)
	{
		result2 = result -10 + Math.floor((Math.random() * 20));
	}
	
	while (result2 == result3 || result == result3)
	{
		result3 = result -10 + Math.floor((Math.random() * 20));
	}
	
	var random = Math.floor((Math.random() * 10)) % 3;
	
	$(".answer").css("background-color","").removeClass("correct");
	
	if (random == 0)
	{
		$("#button1").val(result).addClass("correct");
		$("#button2").val(result2);
		$("#button3").val(result3);
	} else if (random == 1) {
		$("#button2").val(result).addClass("correct");
		$("#button1").val(result2);
		$("#button3").val(result3);
	} else {
		$("#button3").val(result).addClass("correct");
		$("#button2").val(result2);
		$("#button1").val(result3);
	}
	
	$('#text').html(x + " - " + y);
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