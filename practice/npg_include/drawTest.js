//Simple game engine
//Author: Andrej Karpathy
//License: BSD
//This function does all the boring canvasTest stuff. To use it, just create functions:
//update()          gets called every frame
//draw()            gets called every frame
//myinit()          gets called once in beginning
//mouseClick(x, y)  gets called on mouse click
//keyUp(keycode)    gets called when key is released
//keyDown(keycode)  gets called when key is pushed

let canvasTest;
let ctxTest;
let WIDTHt;
let HEIGHTt;
let FPSTest;

function drawBubbleTest(x, y, w, h, radius)
{
    let r = x + w;
    let b = y + h;
    ctxTest.beginPath();
    ctxTest.strokeStyle="black";
    ctxTest.lineWidth="2";
    ctxTest.moveTo(x+radius, y);
    ctxTest.lineTo(x+radius/2, y-10);
    ctxTest.lineTo(x+radius * 2, y);
    ctxTest.lineTo(r-radius, y);
    ctxTest.quadraticCurveTo(r, y, r, y+radius);
    ctxTest.lineTo(r, y+h-radius);
    ctxTest.quadraticCurveTo(r, b, r-radius, b);
    ctxTest.lineTo(x+radius, b);
    ctxTest.quadraticCurveTo(x, b, x, b-radius);
    ctxTest.lineTo(x, y+radius);
    ctxTest.quadraticCurveTo(x, y, x+radius, y);
    ctxTest.stroke();
}

function drawRectTest(x, y, w, h){
    ctxTest.beginPath();
    ctxTest.rect(x,y,w,h);
    ctxTest.closePath();
    ctxTest.fill();
    ctxTest.stroke();
}

function drawCircleTest(x, y, r){
    ctxTest.beginPath();
    ctxTest.arc(x, y, r, 0, Math.PI*2, true);
    ctxTest.closePath();
    ctxTest.stroke();
    ctxTest.fill();
}

//uniform distribution integer
function randi(s, e) {
    return Math.floor(Math.random()*(e-s) + s);
}

//uniform distribution
function randf(s, e) {
    return Math.random()*(e-s) + s;
}

//normal distribution random number
function randn(mean, variance) {
    let V1, V2, S;
    do {
        let U1 = Math.random();
        let U2 = Math.random();
        V1 = 2 * U1 - 1;
        V2 = 2 * U2 - 1;
        S = V1 * V1 + V2 * V2;
    } while (S > 1);
    X = Math.sqrt(-2 * Math.log(S) / S) * V1;
    X = mean + Math.sqrt(variance) * X;
    return X;
}
/*
function eventClick(e) {
    //get position of cursor relative to top left of canvasTest
    let x;
    let y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvasTest.offsetLeft;
    y -= canvasTest.offsetTop;

    //call user-defined callback
    mouseClick(x, y, e.shiftKey);
}
*/
//event codes can be found here:
//http://www.aspdotnetfaq.com/Faq/What-is-the-list-of-KeyCodes-for-JavaScript-KeyDown-KeyPress-and-KeyUp-events.aspx
function eventKeyUp(e) {
    let keycode = ('which' in e) ? e.which : e.keyCode;
    keyUp(keycode);
}

function eventKeyDown(e) {
    let keycode = ('which' in e) ? e.which : e.keyCode;
    keyDown(keycode);
}

function drawTestInit(FPS,id){
    //takes frames per secont to run at
    canvasTest = document.getElementById(id);
    ctxTest = canvasTest.getContext('2d');
    WIDTH = canvasTest.width;
    HEIGHT = canvasTest.height;
    //canvasTest.addEventListener('click', eventClick, false);
    //canvasTest element cannot get focus by default. Requires to either set
    //tabindex to 1 so that it's focusable, or we need to attach listeners
    //to the document. Here we do the latter
    document.addEventListener('keyup', eventKeyUp, true);
    document.addEventListener('keydown', eventKeyDown, true);

    myinitTest();
}

class Engine {
    constructor(id,options){
        console.info("new ENGINE");
        let canvas = document.getElementById(id);
        if(canvas) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            if(options){
                if(options.eventClick)
                    this.canvas.addEventListener('click', this.eventClick, false);
            }
        }
        else {
            throw "Canvas not defined";
        }
    }
    eventClick(e) {
        //get position of cursor relative to top left of canvasTest
        let x;
        let y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= this.canvas.offsetLeft;
        y -= this.canvas.offsetTop;

        //call user-defined callback
        mouseClick(x, y, e.shiftKey);
    }
}