const ffi = require("ffi")

// Define the functions from the DLL
const wootingRgb = ffi.Library('./libs/wooting-rgb-sdk.dll', {
  "wooting_rgb_reset": [ 'bool', [] ],
  "wooting_rgb_array_update_keyboard": [ 'bool', [] ],
  "wooting_rgb_array_set_single": [ 'bool', ['uint8', 'uint8', 'uint8', 'uint8', 'uint8'] ],
});

// Initialize the array in the DLL with a green color
for(let row = 0; row < 6; row++) {
  for(let col = 0; col < 22; col++) {
    wootingRgb.wooting_rgb_array_set_single(row, col, 0, 255, 0)
  }
}

// Send the color from the RGB array to the keyboard
wootingRgb.wooting_rgb_array_update_keyboard()

// After initialization we start an interval, where each interval updates the scan position and then update the keyboard.
let scanPosition = 2
const interval = setInterval(() => {
  // Change scanposition color to red
  wootingRgb.wooting_rgb_array_set_single(0, scanPosition, 255, 0, 0)
  
  // Reset previous scanposition to green
  wootingRgb.wooting_rgb_array_set_single(0, scanPosition - 1, 0, 255, 0)

  // Send the color from the RGB array to the keyboard
  wootingRgb.wooting_rgb_array_update_keyboard()

  // Update the scan position or clear the interval when the end of the row is reached
  if(scanPosition < 13) {
    scanPosition++
  } else {
    clearInterval(interval)
  }
}, 200)

// Make sure the lights go back to normal after process exits
process.on('exit', (code) => {
  wootingRgb.wooting_rgb_reset()
})
