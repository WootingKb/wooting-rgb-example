const ffi = require("ffi")

// Define the functions from the DLL
const wootingRgb = ffi.Library('./libs/wooting-rgb-sdk.dll', {
  "wooting_rgb_kbd_connected": [ 'bool', [] ],
  "wooting_rgb_reset": [ 'bool', [] ],
  "wooting_rgb_direct_set_key": [ 'bool', ['uint8', 'uint8', 'uint8', 'uint8', 'uint8'] ],
  "wooting_rgb_direct_reset_key": [ 'bool', ['uint8', 'uint8'] ],
});

const keyboardConnected = wootingRgb.wooting_rgb_kbd_connected()

if(!keyboardConnected) {
  console.log('Keyboard not connected')
} else {
  const row = 2
  const column = 2
  const red = 255
  const green = 0
  const blue = 255

  // Set the key to a color and reset it after 2 seconds (2000 milliseconds)
  wootingRgb.wooting_rgb_direct_set_key(row, column, red, green, blue)
  setTimeout(() => wootingRgb.wooting_rgb_direct_reset_key(row, column), 2000)
}

// Make sure the lights go back to normal after process exits
process.on('exit', () => {
  wootingRgb.wooting_rgb_reset()
})
