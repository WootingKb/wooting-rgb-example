const ffi = require("ffi")
const ref = require("ref")

// Define the functions from the DLL
const wootingRgb = ffi.Library('./libs/wooting-rgb-sdk.dll', {
  "wooting_rgb_reset": [ 'bool', [] ],
  "wooting_rgb_array_auto_update": [ 'void', ['bool'] ],
  "wooting_rgb_array_set_full": [ 'bool', [ref.refType('uint8')] ],
});

// Set auto update to true, so the keyboard will directly update the color when we change the array
wootingRgb.wooting_rgb_array_auto_update(true)

// Create and initialize a color array with just green color
let colorArray = []
for(let row = 0; row < 6; row++) {
  colorArray.push([])
  for(let col = 0; col < 21; col++) {
    colorArray[row].push({r: 0, g: 255, b: 0})
  }
}

// After initialization we start an interval, where each interval updates the scan position and then update the keyboard.
let scanPosition = 2
let interval = setInterval(() => {
  // Change scanposition color to red
  colorArray[0][scanPosition] = {r: 255, g: 0, b: 0}
  // Reset previous scanposition to green
  colorArray[0][scanPosition - 1] = {r: 0, g: 255, b: 0}
  
  // Convert the javascript 2d array to a 1d [r, g, b, r, g, b ...]
  let dllArray = []
  colorArray.forEach(row => row.forEach(col => {
    dllArray.push(col.r)
    dllArray.push(col.g)
    dllArray.push(col.b)
  }))
  
  // We use a uint8 array, because the DLL expects a uint8 buffer
  const dllBuffer = Uint8Array.from(dllArray)
  // The Uint8Array argument will pass as a reference
  wootingRgb.wooting_rgb_array_set_full(dllBuffer)

  // Update the scan position
  if(scanPosition < 13) {
    scanPosition++
  } else {
    clearInterval(interval)
  }
}, 100)


// Make sure the lights go back to normal after process exits
process.on('exit', (code) => {
  wootingRgb.wooting_rgb_reset()
})
