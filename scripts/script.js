"use strict"

// *************************** VARIABLES ******************************
let calculatorIsOn = false;
let soundIsOn = true;
const calculator = document.querySelector("#calculator-body");
const divScreen = calculator.querySelector("#screen");
const btnOn = calculator.querySelector("#btn-on");
const btnOff = calculator.querySelector("#btn-off");
const divPwrLed = calculator.querySelector("#power-led");
const divSndLed = calculator.querySelector("#sound-led");
const audioBeep = calculator.querySelector("#audio-beep");


// ********************* FUNCTION DECLARATIONS ************************
function turnOnCalculator() {
    /* If calculator isn´t ON: Turns it on, turns on the screen,
    turns the leds on and plays the beep */
    if (!calculatorIsOn) {
        calculatorIsOn = true;
        playBeep();
        toggleLed(divPwrLed, "power-on");
        toggleLed(divSndLed, "sound-on");
        toggleScreen();        
        console.log(calculatorIsOn);
    }    
}

// Puts initial 0 or turns off the screen
function toggleScreen() {
    calculatorIsOn ? divScreen.textContent = "0." : divScreen.textContent = "";
}

// Toggles ON or OFF the received by argument led
function toggleLed(led, ledStatus) {
    led.classList.toggle(ledStatus);
}

// If sound mode is activated, plays the beep sound
function playBeep() {
    if (soundIsOn) {
        audioBeep.currentTime = 0;
        audioBeep.play();
    }
}

function turnOffCalculator() {
    /* If calculator is ON: Turns it off, turns off the screen,
    and turns the leds off */
    if (calculatorIsOn) {
        calculatorIsOn = false;        
        toggleLed(divPwrLed, "power-on");
        toggleLed(divSndLed, "sound-on"); 
        toggleScreen();      
        console.log(calculatorIsOn);
    }
}


// ********************* CALCULATOR UI BUTTONS ************************
// ON button
btnOn.addEventListener("click", function() {
    turnOnCalculator();
});

// OFF button
btnOff.addEventListener("click", function() {
    turnOffCalculator();
});