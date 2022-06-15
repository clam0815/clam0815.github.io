const puzzle = "070000043040009610800634900094052000358460020000800530080070091902100005007040802";
const solution = "679518243543729618821634957794352186358461729216897534485276391962183475137945862";

function newGame() {
    let counter = 0;
    $("#board").empty();
    for (let r=1; r < 10; r++) {
        const tr = document.createElement("tr");
        $(tr).attr("class", "R" + r);
        for (let c=1; c < 10; c++) {
            const td = document.createElement("td");
            $(td).attr("class", "C" + c);
            if (puzzle[counter] != "0") {
                $(td).append(puzzle[counter]).addClass("fix");
            }
            counter++;
            $(td).attr("onclick", "cellClicked(" + r + "," + c +")");
            $(tr).append(td);            
        }
        $("#board").append(tr);
    }
}

function check() {
    $(".error").removeClass("error");

    //rows
    for (let r = 1; r < 10; r++) {
        const numbers = [];
        for (let c = 1; c < 10; c++) {
            if (!checkCell(numbers, r, c)) {
                return;
            }           
        }
    }

    //columns
    for (let c = 1; c < 10; c++) {
        const numbers = [];
        for (let r = 1; r < 10; r++) {
            if (!checkCell(numbers, r, c)) {
                return;
            }          
        }
    }

    //sections
    for (let sr = 0; sr < 3; sr++) {
        for (let sc = 0; sc < 3; sc++) {
            const numbers = [];
            for (let r = sr * 3 + 1; r < sr * 3 + 4; r++) {
                for (let c = sc * 3 + 1; c < sc * 3 + 4; c++) {
                    if (!checkCell(numbers, r, c)) {
                        return;
                    }
                }
            }
        }
    }

    alert("Sieht gut aus!")
}

function checkCell(numbers, r, c) {
    const cell = $('.R' + r).find(".C" + c);
    const value = $(cell).html();
    if (value.length > 0) {
        if (numbers.indexOf(value) >= 0) {
            $('.R' + r).find(".C" + c).removeClass("selected").addClass("error");
            alert("Doppelte Zahl " + value + " an Stelle " + r + " / " + c);
            return false;
        }
        numbers.push(value);
    }
    return true;
}

// features:
//  single final number in the center
//  1 - 9 small numbers (marks) around the border
//  1 - 9 small numbers in the cell
//  background color

function buttonClicked(number) {
    $(".selected").html(number == 0 ? "" : number);
}

function cellClicked(r, c) {
    $(".selected").removeClass("selected");
    const cell = $('.R' + r).find(".C" + c)
    if (!$(cell).hasClass("fix")) {
        $(cell).addClass("selected");
    }    
}

newGame();