"use strict"

// *************************** VARIABLE DECLARATIONS ******************************
// CALCULATOR STATUSES AND SAVED NUMBERS
let calculatorIsOn = false;
let soundIsOn = false;
let decimalPointOn = false;
let operation = null;

let savingFirstNumber = false;
let firstNumber = null;
let secondNumber = null;
let newNumber = false; // User is writing a new number? i.e. After using an operation.

// CALCULATOR BODY, SCREEN AND TOP BUTTONS
const calculator = document.querySelector("#calculator-body");
const divScreen = calculator.querySelector("#screen");
const btnOn = calculator.querySelector("#btn-on");
const btnOff = calculator.querySelector("#btn-off");
const btnSnd = calculator.querySelector("#btn-sound");
const divPwrLed = calculator.querySelector("#power-led");
const divSndLed = calculator.querySelector("#sound-led");
const audioBeep = calculator.querySelector("#audio-beep");


// **************************** CALCULATOR UI BUTTONS ********************************
// ON button
btnOn.addEventListener("click", function() {
    if (!calculatorIsOn) {
        turnOnCalculator();
    }    
});

// OFF button
btnOff.addEventListener("click", function() {
    if (calculatorIsOn) {
        turnOffCalculator();
    }
});

// Sound mode button
btnSnd.addEventListener("click", function() {
    if (calculatorIsOn) {
        toggleSound();
    }
});

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
// Creates an object with the operation buttons.
const operationBtns = calculator.querySelectorAll(".btn-operation");
operationBtns.forEach(operationBtn => {    
    operationBtn.addEventListener("click", function() {
        if (calculatorIsOn) {
            setOperation(operationBtn.textContent);
            screenBlink();
        }
    });
});

// EQUALS BUTTON
// If the user starts typing an operation instead of a digit, saves a 0 as the first number.
// Gets the result of the numbers operation.
const equalsBtn = calculator.querySelector("#btn-equals");
equalsBtn.addEventListener("click", function() {
    if (calculatorIsOn && operation != null) {        
        saveNumber();
        getResult();
        screenBlink();
    }
});


// ********************* FUNCTION DECLARATIONS ************************
// Turns calculator ON
function turnOnCalculator() {              
    calculatorIsOn = true;
    decimalPointOn = true;
    savingFirstNumber = true;
    firstNumber = null;
    secondNumber = null;
    newNumber = true;
    operation = null;    
    toggleLed(calculatorIsOn, divPwrLed, "power-light");        
    toggleScreen();
    toggleSound();
    playBeep();
    
    // console.log("Calculator: " + calculatorIsOn);
    // console.log("Entering new: " + newNumber);
    // console.log("Decimal: " + decimalPointOn);
    // console.log("Operation: " + operation);
    // console.log("1st number: " + firstNumber);
    // console.log("2nd number: " + secondNumber);
}

// Turns the screen ON (puts initial 0) or turns it OFF.
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

// Toggles sound mode and its led indicator
function toggleSound() {
    if (calculatorIsOn) {
        soundIsOn ? soundIsOn = false : soundIsOn = true;
        toggleLed(soundIsOn, divSndLed, "sound-light");
        playBeep();
        //console.log("Sound " + soundIsOn);

    } else {
        soundIsOn = false;        
        toggleLed(soundIsOn, divSndLed, "sound-light");
        //console.log("Sound " + soundIsOn);
    }    
}

// If sound mode is ON, plays the beep.
function playBeep() {
    if (soundIsOn) {
        audioBeep.currentTime = 0;
        audioBeep.play();
    }
}

// Adds the blink class to the screen, waits for the animation to complete, then removes the class
function screenBlink() {
    divScreen.classList.add("screen-blink");
    setTimeout(function(){
        divScreen.classList.remove("screen-blink");
    }, 100);
}

// Turns calculator OFF
function turnOffCalculator() {    
    calculatorIsOn = false;    
    toggleLed(calculatorIsOn, divPwrLed, "power-light");                  
    toggleScreen(); 
    toggleSound();           
}

// Writes to calculator screen the pressed digit button.
function writeToScreen(keyPressed) { 
    // If user inputs a new number (after clicking operation or equal buttons), Clears the screen.
    if (newNumber) {
       divScreen.textContent = "";
    }    
    
    if (countDigitsOnScreen() < 9) {
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
            //console.log("Decimal " + false);
        }    
    
        newNumber = false;
        //console.log("Entering new: " + newNumber);
        playBeep();
    }    
}

function countDigitsOnScreen() {
    let digitsOnScreen;
    digitsOnScreen = divScreen.textContent.length;
    return digitsOnScreen;
}

// OPERATION BUTTON
// Sets the operation to be done and saves the number written before the use of the operation button.
function setOperation(operationSelected) {
    // If there is an operation ongoing, does it first (Chaining operations, ie: 12+7-5*3)
    if (operation != null) {
        saveNumber();
        getResult();
    }
    
    // if (divScreen.textContent !== "0") {
    //     operation = operationSelected;
    //     //console.log("Operation: " + operation);
    //     saveNumber();                
    // }
    operation = operationSelected;        
    saveNumber();  
    playBeep();
}

// Saves the number that is on the screen when an operation button is pressed, 
function saveNumber() {
    // If screen has a NaN, i.e the "Error: 0" message, replaces it with a 0.
    let screenNumber = Number(divScreen.textContent);
    if (isNaN(screenNumber)) {
        screenNumber = 0;
    }

    if (savingFirstNumber) {        
        firstNumber = screenNumber;       
        savingFirstNumber = false;
        //console.log("1st number: " + firstNumber + " Type: " + typeof firstNumber);

    } else {        
        secondNumber = screenNumber;
        //console.log("2nd number: " + secondNumber + " Type: " + typeof secondNumber);
    }    
    newNumber = true;
    decimalPointOn = true;    
    //console.log("Decimal: " + decimalPointOn);
    //console.log("Entering new: " + newNumber);
}

// Writes the operation result on the screen
function getResult() {    
    let result = 0;    
    switch (operation) {
        case "–":
            result = firstNumber - secondNumber;
            break;

        case "÷":
            if (secondNumber != 0) {
                result = firstNumber / secondNumber;

            } else {                
                result = "Error: 0";                
            }            
            break;

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "×":
            result = firstNumber * secondNumber;
    }

    // If result is longer than 9 digits, removes the surplus numbers.
    let resultString = result.toString();
    if (resultString.length > 9) {        
       result = Number(resultString.slice(0, 9));
    }

    divScreen.textContent = result;    
    firstNumber = result;
    savingFirstNumber = true;
    newNumber = true;
    operation = null;          
    playBeep();
}