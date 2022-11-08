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
const btnClear = calculator.querySelector("#btn-clear");


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
// In some cases, changes the button icon for the correct arithmetic operator. 
const operationBtns = calculator.querySelectorAll(".btn-operation");
operationBtns.forEach(operationBtn => {    
    operationBtn.addEventListener("click", function() {
        if (calculatorIsOn) {
            let operationClicked = operationBtn.textContent;
            
            switch (operationClicked){                
                case "–":
                    operationClicked = "-";
                    break;
                    
                case "÷":
                    operationClicked = "/";
                    break;

                case "×":
                    operationClicked = "*";
            }

            setOperation(operationClicked);
            screenBlink();
        }
    });
});

// EQUALS BUTTON
// If the user starts typing an operation instead of a digit, saves a 0 as the first number.
const equalsBtn = calculator.querySelector("#btn-equals");
equalsBtn.addEventListener("click", function() {
    if (calculatorIsOn && operation != null) {        
        saveNumber();
        getResult();
        screenBlink();
    }
});

// CLEAR BUTTON (BACKSPACE)
btnClear.addEventListener("click", function() {
    if (calculatorIsOn) {
        clearDigit();
    }
});


// ************************* KEYBOARD SUPPORT BUTTONS ***********************
document.addEventListener("keydown", (event) => {
    const keyPressed = event.key;

    // Letter "O" regardless of case, turns ON or OFF the calculator.
    if (keyPressed == "o" || keyPressed == "O") {
        if (!calculatorIsOn) {
            turnOnCalculator();
        } else {
            turnOffCalculator();
        }
    }

    if (calculatorIsOn) {
        // Converts the pressed key to a number. If it is "0-9" or decimal point, writes it to screen.
        const keyToNumber = Number(keyPressed);
        if (keyToNumber >= 0 || keyPressed == ".") {
            writeToScreen(keyPressed);
        }

        if (keyPressed == "+" || keyPressed == "-" || 
        keyPressed == "*" || keyPressed == "/") {
            setOperation(keyPressed);
            screenBlink();
        }
        
        if ((keyPressed == "=" || keyPressed == "Enter") && operation != null) {
            saveNumber();
            getResult();
            screenBlink();
        }

        if (keyPressed == "m" || keyPressed == "M") {
            toggleSound();
        }
    }    
}, false);


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

    } else {
        soundIsOn = false;        
        toggleLed(soundIsOn, divSndLed, "sound-light");        
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
    }, 301);
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
        }    
    
        newNumber = false;        
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

    } else {        
        secondNumber = screenNumber;
    }    
    newNumber = true;
    decimalPointOn = true;    
}

// Writes the operation result on the screen
function getResult() {    
    let result = 0;    
    switch (operation) {        
        case "-":
            result = firstNumber - secondNumber;
            break;
        
        case "/":
            if (secondNumber != 0) {
                result = firstNumber / secondNumber;

            } else {                
                result = "Error: 0";                
            }            
            break;

        case "+":
            result = firstNumber + secondNumber;
            break;
        
        case "*":
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

// Deletes a single digit at the time.
function clearDigit() {    
    let screenContent = divScreen.textContent;    

    if (screenContent != 0) {
        if (screenContent == "Error: 0" || screenContent.length == 1) {
            screenContent = "0";

        } else if (screenContent != "Error: 0") {
            let deletedDigit;
            deletedDigit = screenContent.at(-1);

            if (deletedDigit == ".") {
                decimalPointOn = true;
            }

            screenContent = screenContent.slice(0, -1);    
        }

        divScreen.textContent = screenContent;
        screenBlink();
        playBeep();
    }    
}