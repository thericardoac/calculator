"use strict"

// *************************** VARIABLES ******************************
let calculatorIsOn = false;
let soundIsOn = true;
const calculator = document.querySelector("#calculator-body");
const divScreen = calculator.querySelector("#screen");
const btnOn = calculator.querySelector("#btn-on");
const divPwrLed = calculator.querySelector("#power-led");
const divSndLed = calculator.querySelector("#sound-led");
const audioBeep = calculator.querySelector("#audio-beep");


// ********************* FUNCTION DECLARATIONS ************************
function turnOnCalculator() {
    /* If calculator isn´t ON: Turns it on, starts the screen,
    turns the leds on and plays the beep */
    if (!calculatorIsOn) {
        calculatorIsOn = true;        
        startScreen();
        toggleLed(divPwrLed, "power-on");
        toggleLed(divSndLed, "sound-on");
        playBeep();
        console.log(calculatorIsOn);
    }    
}

// Puts initial 0 on the screen
function startScreen() {
    divScreen.textContent = "0.";
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


// ********************* CALCULATOR UI BUTTONS ************************
// ON button
btnOn.addEventListener("click", function() {
    turnOnCalculator();
});