"use strict"

// *************************** VARIABLE DECLARATIONS ******************************
// CALCULATOR STATUSES AND SAVED NUMBER
let calculatorIsOn = false;
let soundIsOn = false;
let decimalPointOn = false;
let operation = null;

let savedNumber = null;
let resetScreen= false;

// TOP BUTTONS
const calculator = document.querySelector("#calculator-body");
const divScreen = calculator.querySelector("#screen");
const btnOn = calculator.querySelector("#btn-on");
const btnOff = calculator.querySelector("#btn-off");
const btnSnd = calculator.querySelector("#btn-sound");
const divPwrLed = calculator.querySelector("#power-led");
const divSndLed = calculator.querySelector("#sound-led");
const audioBeep = calculator.querySelector("#audio-beep");

// DIGIT BUTTONS
// Creates an object with the digit buttons. (0-9 and decimal point).
// Each button writes to calculator screen its value.
const digitBtns = calculator.querySelectorAll(".btn-digit");
digitBtns.forEach(digitBtn => {    
    const keyPressed = digitBtn.textContent
    digitBtn.addEventListener("click", function() {
        if (calculatorIsOn) {            
            writeToScreen(keyPressed);
        }
    });
});

// OPERATION BUTTONS
const operationBtns = calculator.querySelectorAll(".btn-operation");
operationBtns.forEach(operationBtn => {    
    operationBtn.addEventListener("click", function() {
        if (calculatorIsOn) {
            saveScreenNumber();
            operation = operationBtn.textContent;            
            console.log("Operation " + operation);            
        }
    });
});


// ********************* FUNCTION DECLARATIONS ************************
function turnOnCalculator() {
    //Turns calculator ON, enables the use of decimal point, turns power led ON,
    //turns screen ON, turns sound mode ON and plays the beep.          
    calculatorIsOn = true;
    console.log("Calculator " + calculatorIsOn);
    decimalPointOn = true;    
    toggleLed(calculatorIsOn, divPwrLed, "power-light");        
    toggleScreen();
    toggleSound();
    playBeep();
    
    console.log("Reset screen " + resetScreen);
    console.log("Decimal "+ decimalPointOn);
    console.log("Operation "+ operation);
}

// Turns ON the screen (puts initial 0) or turns it OFF.
function toggleScreen() {
    calculatorIsOn ? divScreen.textContent = "0" : divScreen.textContent = "";
}

// Toggles ON or OFF the desired led.
function toggleLed(status, led, ledClass) {
    if (status) {
        led.classList.add(ledClass);
    } else {
        led.classList.remove(ledClass);
    }
}

// If the calculator is ON, toggles sound mode (toggles sound led and changes icon of sound button).
// If the calculator has just turned OFF, turns sound mode OFF (turns sound led OFF and changes icon of sound button).
function toggleSound() {
    if (calculatorIsOn) {
        soundIsOn ? soundIsOn = false : soundIsOn = true;        
        playBeep();
        toggleLed(soundIsOn, divSndLed, "sound-light");
        console.log("Sound " + soundIsOn);

    } else {
        soundIsOn = false;        
        toggleLed(soundIsOn, divSndLed, "sound-light");
        console.log("Sound " + soundIsOn);
    } 
}

// If sound mode is ON, plays the beep sound.
function playBeep() {
    if (soundIsOn) {
        audioBeep.currentTime = 0;
        audioBeep.play();
    }
}

// Turns calculator OFF, turns the power led OFF, turns the screen OFF, 
// and turns sound mode OFF.
function turnOffCalculator() {    
    calculatorIsOn = false;
    console.log("Calculator " + calculatorIsOn);       
    toggleLed(calculatorIsOn, divPwrLed, "power-light");                  
    toggleScreen(); 
    toggleSound();            
}

// Writes to calculator screen the pressed digit button.
function writeToScreen(keyPressed) {    
    // If user selected an operation, the screen will reset.
    if (resetScreen) {
        divScreen.textContent = "";
    }
    
    if (keyPressed !== ".") {
        if (divScreen.textContent == "0") {
            divScreen.textContent = keyPressed;
        } else {
            divScreen.textContent += keyPressed;
        }

    // Once the decimal point is used, it is disabled.
    } else if (keyPressed == "." && decimalPointOn) {        
        if (divScreen.textContent == "") {
            divScreen.textContent = "0";
        }
        divScreen.textContent += keyPressed;
        decimalPointOn = false;
        console.log("Decimal " + false);
    }    
    
    resetScreen = false;
    console.log("Reset screen " + resetScreen);

    if (soundIsOn) {
        playBeep();
    }
}

// Captures the number on the screen when an operation button is pressed.
function saveScreenNumber() {
    savedNumber = Number(divScreen.textContent);    
    decimalPointOn = true;
    resetScreen = true;
    console.log("Saved " + savedNumber);    
    console.log("Decimal " + decimalPointOn);
    console.log("Reset screen " + resetScreen);
}


// ********************* CALCULATOR UI BUTTONS ************************
// ON button: Turns ON calculator if it is OFF.
btnOn.addEventListener("click", function() {
    if (!calculatorIsOn) {
        turnOnCalculator();
    }
});

// OFF button: Turns OFF calculator if it is ON
btnOff.addEventListener("click", function() {
    if (calculatorIsOn) {
        turnOffCalculator();
    }
});

// Sound button: Toggles sound if calculator is ON
btnSnd.addEventListener("click", function() {
    if (calculatorIsOn) {
        toggleSound();
    }
});