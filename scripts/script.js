"use strict"

// *************************** VARIABLES ******************************
let calculatorIsOn = false;
let soundIsOn = false;
const calculator = document.querySelector("#calculator-body");
const divScreen = calculator.querySelector("#screen");
const btnOn = calculator.querySelector("#btn-on");
const btnOff = calculator.querySelector("#btn-off");
const btnSnd = calculator.querySelector("#btn-sound");
const divPwrLed = calculator.querySelector("#power-led");
const divSndLed = calculator.querySelector("#sound-led");
const audioBeep = calculator.querySelector("#audio-beep");


// ********************* FUNCTION DECLARATIONS ************************
function turnOnCalculator() {
    //Turns calculator ON, turns power led ON,
    //turns screen ON, turns sound mode ON and plays the beep.          
    calculatorIsOn = true;
    console.log("Calculator " + calculatorIsOn);
    toggleLed(calculatorIsOn, divPwrLed, "power-light");        
    toggleScreen();
    toggleSound();
    playBeep();                 
}

// Turns ON the screen (puts initial 0) or turns it OFF.
function toggleScreen() {
    calculatorIsOn ? divScreen.textContent = "0." : divScreen.textContent = "";
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
        soundIsOn ? btnSnd.textContent = "volume_off" : btnSnd.textContent = "volume_up";
        toggleLed(soundIsOn, divSndLed, "sound-light");
        console.log("Sound " + soundIsOn);

    } else {
        soundIsOn = false;
        btnSnd.textContent = "volume_off";
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

function turnOffCalculator() {
    // Turns calculator OFF, turns the power led OFF, turns the screen OFF, 
    // and turns sound mode OFF.
    calculatorIsOn = false;
    console.log("Calculator " + calculatorIsOn);       
    toggleLed(calculatorIsOn, divPwrLed, "power-light");                  
    toggleScreen(); 
    toggleSound();            
}


// ********************* CALCULATOR UI BUTTONS ************************
// ON button: Turns on calculator if it is OFF.
btnOn.addEventListener("click", function() {
    if (!calculatorIsOn) {
        turnOnCalculator();
    }
});

// OFF button: Turns off calculator if it is ON
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