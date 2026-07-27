

// ======================================
// SUPER CALCULATOR PRO V3
// PART 1 - Calculator Engine
// ======================================

const display = document.getElementById("result");
const history = document.getElementById("history");

let expression = "";
let memory = 0;

// ----------------------
// Update Display
// ----------------------

function updateDisplay() {
    display.value = expression || "0";
}

// ----------------------
// Add Value
// ----------------------

function addValue(value) {
    expression += value;
    updateDisplay();
}

// ----------------------
// Clear
// ----------------------

function clearDisplay() {
    expression = "";
    history.textContent = "";
    updateDisplay();
}

// ----------------------
// Backspace
// ----------------------

function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

// ----------------------
// Calculate
// ----------------------

function calculate() {

    try {

        let exp = expression;

        exp = exp.replace(/×/g, "*");
        exp = exp.replace(/÷/g, "/");
        exp = exp.replace(/π/g, Math.PI);
        exp = exp.replace(/√\(/g, "Math.sqrt(");
        exp = exp.replace(/sin\(/g, "Math.sin(");
        exp = exp.replace(/cos\(/g, "Math.cos(");
        exp = exp.replace(/tan\(/g, "Math.tan(");
        exp = exp.replace(/log\(/g, "Math.log10(");

        const answer = eval(exp);

        history.textContent = expression + " =";

        expression = answer.toString();

        updateDisplay();

    } catch (e) {

        display.value = "Error";

        expression = "";

    }

}

// ----------------------
// Memory
// ----------------------

function memoryAction(type) {

    switch (type) {

        case "MC":
            memory = 0;
            break;

        case "MR":
            expression += memory;
            updateDisplay();
            break;

        case "M+":
            memory += Number(display.value) || 0;
            break;

        case "M-":
            memory -= Number(display.value) || 0;
            break;

    }

}

// Initial Display

updateDisplay();
// ======================================
// PART 2 - Button System & Keyboard
// ======================================

// All Calculator Buttons
const buttons = document.querySelectorAll(".buttons button");

buttons.forEach(button => {

    button.addEventListener("click", function () {

        const value = this.innerText;

        switch (value) {

            case "C":
                clearDisplay();
                break;

            case "⌫":
                backspace();
                break;

            case "=":
                calculate();
                break;

            case "MC":
            case "MR":
            case "M+":
            case "M-":
                memoryAction(value);
                break;

            case "π":
                addValue("π");
                break;

            case "√":
                addValue("√(");
                break;

            case "sin":
                addValue("sin(");
                break;

            case "cos":
                addValue("cos(");
                break;

            case "tan":
                addValue("tan(");
                break;

            case "log":
                addValue("log(");
                break;

            default:
                addValue(value);

        }

    });

});

// ==========================
// Keyboard Support
// ==========================

document.addEventListener("keydown", function (e) {

    const key = e.key;

    if ("0123456789+-*/().%".includes(key)) {
        addValue(key);
    }

    if (key === "Enter") {
        e.preventDefault();
        calculate();
    }

    if (key === "Backspace") {
        e.preventDefault();
        backspace();
    }

    if (key === "Escape") {
        clearDisplay();
    }

});
// ======================================
// PART 3 - Converter Engine
// ======================================

const converterType = document.getElementById("converterType");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const converterInput = document.getElementById("converterInput");
const converterResult = document.getElementById("converterResult");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");

const units = {

    length: {
        Meter: 1,
        Kilometer: 1000,
        Centimeter: 0.01,
        Millimeter: 0.001,
        Inch: 0.0254,
        Foot: 0.3048,
        Yard: 0.9144,
        Mile: 1609.344
    },

    weight: {
        Kilogram: 1,
        Gram: 0.001,
        Milligram: 0.000001,
        Pound: 0.453592
    },

    temperature: {
        Celsius: 1,
        Fahrenheit: 1,
        Kelvin: 1
    }

};

function loadUnits(){

    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";

    const type = converterType.value;

    if(!units[type]) return;

    Object.keys(units[type]).forEach(unit=>{

        fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
        toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;

    });

}

converterType.addEventListener("change", loadUnits);

loadUnits();

swapBtn.addEventListener("click", ()=>{

    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;

});

convertBtn.addEventListener("click", ()=>{

    const value = Number(converterInput.value);

    if(isNaN(value)){
        converterResult.innerHTML="Enter a valid number";
        return;
    }

    const type = converterType.value;

    // Length & Weight
    if(type==="length" || type==="weight"){

        const base = value * units[type][fromUnit.value];

        const result = base / units[type][toUnit.value];

        converterResult.innerHTML =
        `${value} ${fromUnit.value} = <b>${result.toFixed(4)}</b> ${toUnit.value}`;

        return;

    }

    // Temperature
    if(type==="temperature"){

        let result = value;

        if(fromUnit.value==="Celsius" && toUnit.value==="Fahrenheit")
            result=(value*9/5)+32;

        else if(fromUnit.value==="Fahrenheit" && toUnit.value==="Celsius")
            result=(value-32)*5/9;

        else if(fromUnit.value==="Celsius" && toUnit.value==="Kelvin")
            result=value+273.15;

        else if(fromUnit.value==="Kelvin" && toUnit.value==="Celsius")
            result=value-273.15;

        converterResult.innerHTML =
        `${value} ${fromUnit.value} = <b>${result.toFixed(2)}</b> ${toUnit.value}`;

        return;

    }

    converterResult.innerHTML =
    "🚧 This converter will be available in the next update.";

});
// ======================================
// PART 4 - Navigation & Settings
// ======================================

// Navigation
const navBtns = document.querySelectorAll(".nav-btn");

const calculatorPage = document.querySelector(".calculator");
const historyPage = document.querySelector(".history-panel");
const settingsPopup = document.getElementById("settingsPopup");

navBtns.forEach((btn, index) => {

    btn.addEventListener("click", () => {

        navBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Hide all
        calculatorPage.style.display = "none";
        historyPage.style.display = "none";
        converterPage.style.display = "none";

        switch(index){

            case 0:
                calculatorPage.style.display = "block";
                historyPage.style.display = "block";
                break;

            case 1:
                converterPage.style.display = "block";
                break;

            case 2:
                alert("📅 Age Calculator - Coming Soon");
                calculatorPage.style.display = "block";
                historyPage.style.display = "block";
                break;

            case 3:
                settingsPopup.style.display = "flex";
                calculatorPage.style.display = "block";
                historyPage.style.display = "block";
                break;

        }

    });

});

// Theme Button
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){
        themeBtn.innerHTML="☀️";
    }else{
        themeBtn.innerHTML="🌙";
    }

});

// Settings Popup
document.getElementById("settingsBtn").onclick=()=>{

    settingsPopup.style.display="flex";

};

document.getElementById("closePopup").onclick=()=>{

    settingsPopup.style.display="none";

};

window.addEventListener("click",(e)=>{

    if(e.target===settingsPopup){
        settingsPopup.style.display="none";
    }

});
// ======================================
// PART 5 - Final Setup
// ======================================

// Live Clock & Date
function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const date = now.toLocaleDateString([], {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const clock = document.getElementById("liveClock");
    const dateBox = document.getElementById("liveDate");

    if (clock) clock.textContent = time;
    if (dateBox) dateBox.textContent = date;
}

setInterval(updateClock, 1000);
updateClock();

// --------------------------
// LocalStorage Theme
// --------------------------

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light");
    if (themeBtn) themeBtn.innerHTML = "☀️";
}

themeBtn.addEventListener("click", () => {

    if (document.body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }

});

// --------------------------
// App Loaded
// --------------------------

window.addEventListener("load", () => {

    updateDisplay();

    console.log("✅ Super Calculator Pro Loaded Successfully");

});
