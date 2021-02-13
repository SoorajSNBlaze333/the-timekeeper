const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const { height, width } = canvas;
const polygonHeight = 10;
const polygonWidth = 40;
const offset = 5;
const scaleFactor = 0.5;
const spacing = (polygonWidth + (offset * 2)) * scaleFactor;
ctx.fillStyle = '#000';
const numbers = {
  0: [1, 1, 1, 1, 1, 1, 0],
  1: [0, 1, 1, 0, 0, 0, 0],
  2: [1, 1, 0, 1, 1, 0, 1],
  3: [1, 1, 1, 1, 0, 0, 1],
  4: [0, 1, 1, 0, 0, 1, 1],
  5: [1, 0, 1, 1, 0, 1, 1],
  6: [1, 0, 1, 1, 1, 1, 1],
  7: [1, 1, 1, 0, 0, 0, 0],
  8: [1, 1, 1, 1, 1, 1, 1],
  9: [1, 1, 1, 1, 0, 1, 1],
}

var universalTime = 0;

const convertTimestampToCountdown = function(seconds) {
  let days = Math.floor(seconds / (24 * 3600)); 
  seconds %= (24 * 3600); 
  let hours = Math.floor(seconds / 3600); 
  seconds %= 3600; 
  let minutes = Math.floor(seconds / 60); 
  seconds %= 60; 
  return (days < 10 ? '0'+days:days)+":"+(hours < 10 ? '0'+hours:hours)+":"+(minutes < 10 ? '0'+minutes:minutes)+":"+(seconds < 10 ? '0'+seconds:seconds);
}

const createTimekeeper = function(timekeeper) {
  let timer = timekeeper.getAttribute('timer');
  timekeeper.style.overflow = 'hidden';
  timekeeper.innerText = timer;
  renderBars(0)
}

const updateTimekeeper = function(timekeeper) {
  let reverse = timekeeper.getAttribute('reverse');
  let timer = timekeeper.getAttribute('timer').split(':').map(t => +t);
  let seconds = 0;
  if (reverse && reverse === 'true') {
    seconds = (timer[3] + (timer[2] * 60) + (timer[1] * 60 * 60) + (timer[0] * 60 * 60 * 24)) + universalTime;
  } else {
    seconds = (timer[3] + (timer[2] * 60) + (timer[1] * 60 * 60) + (timer[0] * 60 * 60 * 24)) - universalTime;
  }
  if (seconds < 0) return;
  let updatedTime = convertTimestampToCountdown(seconds)
  timekeeper.innerText = updatedTime;
  let canvaTime = updatedTime.split(':');
  
  renderBars(seconds % 10)
}

const renderBars = function(digit) {
  ctx.clearRect(0, 0, width, height);
  let arr = numbers[digit];
  if (arr[0]) renderBar({ ctx, height, width, polygonHeight, polygonWidth, offset, x: 0, y: -spacing, rot: 0 })
  if (arr[1]) renderBar({ ctx, height, width, polygonHeight, polygonWidth, offset, x: spacing/2, y: -spacing/2, rot: 90 })
  if (arr[2]) renderBar({ ctx, height, width, polygonHeight, polygonWidth, offset, x: spacing/2, y: spacing/2, rot: 90 })
  if (arr[3]) renderBar({ ctx, height, width, polygonHeight, polygonWidth, offset, x: 0, y: spacing, rot: 0 })
  if (arr[4]) renderBar({ ctx, height, width, polygonHeight, polygonWidth, offset, x: -spacing/2, y: spacing/2, rot: 90 })
  if (arr[5]) renderBar({ ctx, height, width, polygonHeight, polygonWidth, offset, x: -spacing/2, y: -spacing/2, rot: 90 })
  if (arr[6]) renderBar({ ctx, height, width, polygonHeight, polygonWidth, offset, x: 0, y: 0, rot: 0 }) 
}

const renderBar = function({ ctx, height, width, polygonHeight, polygonWidth, offset, x, y, rot }) {
  ctx.save();
  ctx.translate((width / 2) - (polygonWidth / 2) + (x), (height / 2)  - (polygonHeight / 2) + (y));

  ctx.translate(polygonWidth/2 - offset / 2, polygonHeight/2);
  ctx.rotate(rot * (Math.PI / 180));
  ctx.scale(scaleFactor, scaleFactor);
  ctx.translate(-(polygonWidth/2 - offset / 2), -(polygonHeight/2));

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(polygonWidth - offset, 0);
  ctx.lineTo(polygonWidth, polygonHeight/2);
  ctx.lineTo(polygonWidth - offset, polygonHeight);
  ctx.lineTo(0, polygonHeight);
  ctx.lineTo(-offset, polygonHeight/2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

window.addEventListener('DOMContentLoaded', function(e) {
  console.log("Loaded DOM!");
  let timekeepers = document.querySelectorAll('[timekeeper]')
  timekeepers.forEach(function(timekeeper) { createTimekeeper(timekeeper) })

  setInterval(function() {
    universalTime += 1;
    timekeepers.forEach(function(timekeeper) { updateTimekeeper(timekeeper) })
  }, 1000)
})