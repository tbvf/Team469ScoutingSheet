//Variables
var form = document.querySelector("form");
var spreadsheet = new Array();
var arrayItem = new Array();
var csvFileData = "";
var title = "";
var dropdown = "";

// Configuration
document.getElementById("AddEntry").disabled = true;
document.getElementById("CreateSheet").disabled = true;
fetch("Config.json")
  .then((response) => response.json())
  .then((data) => {
    data.Categories.forEach((category) => {
      // Prepare HTML & Array
      title = category.title;

      form.innerHTML = `${form.innerHTML} 
            <h4>${title}</h4>`;

      category.numbers.forEach((number) => {
        form.innerHTML = `${
          form.innerHTML
        } <label for="${number}">${number}</label> <input type="number" id="${
          title + number
        }" name="get${number}value" value="0" min="0" /> <br> <br>`;
        arrayItem.push(number);
      });

      category.dropdowns.forEach((field) => {
        dropdown = field.name;
        form.innerHTML = `${form.innerHTML} 
        <label for="${dropdown}">${dropdown}</label>
        <select name="${title + dropdown}" id="${title + dropdown}">
        </select> <br> <br>`;

        field.items.forEach((item) => {
          var menu = document.getElementById(`${title + dropdown}`);
          menu.innerHTML = `${menu.innerHTML} 
            <option value="${item}">${item}</option>`;
        });

        arrayItem.push(dropdown);
      });

      category.fields.forEach((field) => {
        form.innerHTML = `${
          form.innerHTML
        } <label for="${field}">${field}</label> 
            <input type="text" id="entered${
              title + field
            }" name="get${field}Value" placeholder="${field}" required /> <br> <br>`;
        arrayItem.push(field);

        // Add Event Listeners
        document
          .getElementById(`entered${title + field}`)
          .addEventListener("keyup", (e) => {
            //Check for the input's value
            if (e.target.value == "") {
              document.getElementById("AddEntry").disabled = true;
            } else {
              document.getElementById("AddEntry").disabled = false;
            }
          });
      });

      category.checks.forEach((check) => {
        form.innerHTML = `${
          form.innerHTML
        } <label for="${check}">${check}</label> <input type="checkbox" id="${
          title + check
        }" name="get${check}value" />`;
        arrayItem.push(check);
      });
    });

    if (localStorage.getItem("spreadsheet") == null) {
      spreadsheet.push(arrayItem);
      localStorage.setItem("spreadsheet", JSON.stringify(spreadsheet));
    } else {
      spreadsheet = JSON.parse(localStorage.getItem("spreadsheet"));
    }

    if (spreadsheet.length > 1) {
      document.getElementById("CreateSheet").disabled = false;
    }

    console.log(spreadsheet);
    arrayItem = new Array();
  });

// Functions
function createArray() {
  fetch("Config.json")
    .then((response) => response.json())
    .then((data) => {
      data.Categories.forEach((category) => {
        title = category.title;

        category.numbers.forEach((number) => {
          var name = document.getElementById(title + number).value;
          arrayItem.push(name);
          document.getElementById(title + number).value = 0;
        });

        category.dropdowns.forEach((field) => {
          var name = document.getElementById(title + field.name);
          arrayItem.push(name.value);
        });

        category.fields.forEach((field) => {
          var name = document.getElementById(`entered${title + field}`).value;
          arrayItem.push(name);
          document.getElementById(`entered${title + field}`).value = "";
        });

        

        category.checks.forEach((check) => {
          var name = document.getElementById(`${title + check}`);
          if (name.checked) {
            arrayItem.push(true);
            name.checked = false;
          } else {
            arrayItem.push(false);
          }
        });
      });

      spreadsheet.push(arrayItem);
      localStorage.setItem("spreadsheet", JSON.stringify(spreadsheet));
      console.log(spreadsheet);
      arrayItem = new Array();
    });
  document.getElementById("CreateSheet").disabled = false;
  document.getElementById("AddEntry").disabled = true;
}

function createSheet() {
  localStorage.removeItem("spreadsheet");

  spreadsheet.forEach((row) => {
    csvFileData += row.join(",");
    csvFileData += "\n";
  });

  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvFileData);
  hiddenElement.target = "_blank";

  //provide the name for the CSV file to be downloaded
  hiddenElement.download = "ScoutingInfo.csv";
  hiddenElement.click();

  location.reload();
}

// Event Listeners
document.getElementById("AddEntry").addEventListener("click", createArray);
document.getElementById("CreateSheet").addEventListener("click", createSheet);
