var currCell;
var contentHeader = document.getElementById("content-header");
var contentBody = document.getElementById("content-body");
var data = {};
var columns = 26;
var rows = 100;
var currSheet = 1;
var arrMatrix = new Array();

for(var col=0;col<columns;col++) {
    var column = document.createElement("th");
    column.innerText = String.fromCharCode(65+col);
    contentHeader.appendChild(column);
}
for(var ro=0;ro<rows;ro++) {
    var row = document.createElement("tr");
    var cell = document.createElement("th");
    cell.innerText = ro+1;
    row.appendChild(cell);
    for(var col=0;col<columns;col++) {
        var column = document.createElement("td");
        column.setAttribute("contentEditable","true");
        column.setAttribute("spellcheck","false");
        column.setAttribute("id",`${String.fromCharCode(65+col)}${ro+1}`);
        column.addEventListener("focus",(event) => onFocus(event));
        column.addEventListener("input",(event) => onFocus(event));
        row.appendChild(column);
    }
    contentBody.appendChild(row);
}

if(arrMatrix.length == 0) {
    var matrix = new Array(rows);
    for(var i=0;i<rows;i++) {
        matrix[i] = new Array(columns);
        for(var j=0;j<columns;j++) {
            matrix[i][j] = {id: `${String.fromCharCode(65+j)}${i+1}`, text: null, style: null,};
        }
    }
    arrMatrix.push(matrix);
    document.getElementById("sheets").innerHTML += `<button id='sheet${currSheet}' onclick='load("sheet${currSheet}")'>Sheet ${currSheet}</button>`;
}

document.getElementById("sheet1").addEventListener("click",load("sheet1"));

document.getElementById("add-sheet").addEventListener("click",() => {
    currSheet++;
    var matrix = new Array(rows);
    for(var i=0;i<rows;i++) {
        matrix[i] = new Array(columns);
        for(var j=0;j<columns;j++) {
            matrix[i][j] = {id: `${String.fromCharCode(65+j)}${i+1}`, text: null,
            style: null,};
        }
    }
    arrMatrix.push(matrix);
    arrMatrix[currSheet-1].forEach((row) => {
        row.forEach((cell) => {
          if (cell.id) {
            var myCell = document.getElementById(cell.id);
            myCell.innerText = null;
            myCell.style.cssText = null;
          }
        });
      });
    document.getElementById("sheets").innerHTML += `<button id='sheet${currSheet}' onclick='load("sheet${currSheet}")'>Sheet ${currSheet}</button>`;
});

document.getElementById("del-sheet").addEventListener("click",() => {
    if(currSheet>1) {
        currSheet--;
        document.getElementById("sheets").removeChild(document.getElementById("sheets").lastChild);
        arrMatrix.pop();
    }
});

function load(id) {
    var show = id.split("")[id.length-1];
    arrMatrix[show-1].forEach((row) => {
        row.forEach((cell) => {
          if (cell.id) {
            var myCell = document.getElementById(cell.id);
            myCell.innerText = cell.text;
            myCell.style.cssText = cell.style;
          }
        });
      });
}

function onFocus(e) {
    currCell = e.target;
    document.querySelector("h3").innerText = e.target.id;
    updateJSON(currCell);
}

var fonts = document.getElementById("fonts");
fonts.addEventListener("input",() => {
    currCell.style.fontFamily = fonts.value;
    updateJSON(currCell);
});

var fontSize = document.getElementById("font-size");
fontSize.addEventListener("input",() => {
    currCell.style.fontSize = fontSize.value;
    updateJSON(currCell);
});

var textColor = document.getElementById("text-color");
textColor.addEventListener("input",() => {
    currCell.style.color = textColor.value;
    updateJSON(currCell);
});

var backgroundColor = document.getElementById("background-color");
backgroundColor.addEventListener("input",() => {
    currCell.style.backgroundColor = backgroundColor.value;
    updateJSON(currCell);
});

var bold = document.getElementById("bold");
bold.addEventListener("click",() => {
    if(currCell.style.fontWeight == "bold") {
        currCell.style.fontWeight = "normal";
    } else {
        currCell.style.fontWeight = "bold";
    }
    updateJSON(currCell);
});

var italic = document.getElementById("italic");
italic.addEventListener("click",() => {
    if(currCell.style.fontStyle == "italic") {
        currCell.style.fontStyle = "normal";
    } else {
        currCell.style.fontStyle = "italic";
    }
    updateJSON(currCell);
});

var underline = document.getElementById("underline");
underline.addEventListener("click",() => {
    if(currCell.style.textDecoration == "underline") {
        currCell.style.textDecoration = "none";
    } else {
        currCell.style.textDecoration = "underline";
    }
    updateJSON(currCell);
});

var leftAlign = document.getElementById("left-align");
leftAlign.addEventListener("click",() => {
    currCell.style.textAlign = "left";
    updateJSON(currCell);
});

var center = document.getElementById("center");
center.addEventListener("click",() => {
    currCell.style.textAlign = "center";
    updateJSON(currCell);
});

var rightAlign = document.getElementById("right-align");
rightAlign.addEventListener("click",() => {
    currCell.style.textAlign = "right";
    updateJSON(currCell);
});

var cutBtn = document.getElementById("cut");
cutBtn.addEventListener("click",() => {
    data = {
        text: currCell.innerText,
        style: currCell.style.cssText,
    };
    currCell.innerText = null;
    currCell.style = null;
    updateJSON(currCell);
});

var copyBtn = document.getElementById("copy");
copyBtn.addEventListener("click",() => {
    data = {
        text: currCell.innerText,
        style: currCell.style.cssText,
    };
});

var paste = document.getElementById("paste");
paste.addEventListener("click",() => {
    currCell.innerText = data.text;
    currCell.style = data.style;
    updateJSON(currCell);
});

function downloadJSON() {
    // Define your JSON data

    // Convert JSON data to a string
    const jsonString = JSON.stringify(arrMatrix);

    // Create a Blob with the JSON data and set its MIME type to application/json
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create an anchor element and set its href attribute to the Blob URL
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json"; // Set the desired file name

    // Append the link to the document, click it to start the download, and remove it afterward
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById("upload").addEventListener("change", readJsonFile);

function readJsonFile(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const fileContent = e.target.result;

      // {id,style,text}
      // Parse the JSON file content and process the data
      try {
        while (document.getElementById("sheets").hasChildNodes()) {
            currSheet--;
            document.getElementById("sheets").removeChild(document.getElementById("sheets").lastChild);
        }
        const jsonData = JSON.parse(fileContent);
        arrMatrix = jsonData;
        jsonData.forEach((row) => {
            currSheet++;
            document.getElementById("sheets").innerHTML += `<button id='sheet${currSheet}' onclick='load("sheet${currSheet}")'>Sheet ${currSheet}</button>`;
            row.forEach((column) => {
                column.forEach((cell) => {
                    if (cell.id) {
                        var myCell = document.getElementById(cell.id);
                        myCell.innerText = cell.text;
                        myCell.style.cssText = cell.style;
                    }
                });
            });
        });
        // Process the JSON data as needed
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };

    reader.readAsText(file);
  }
}

function updateJSON(cell) {
    var json = {
        id: cell.id,
        text: cell.innerText,
        style: cell.style.cssText,
    }
    var id = cell.id.split("");
    var i = id[1]-1;
    var j = id[0].charCodeAt(0) - 65;
    arrMatrix[currSheet-1][i][j] = json;
}
