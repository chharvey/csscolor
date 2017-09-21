var Util = require('./Util.class.js')
var Color = require('./Color.class.js')

/**
 * A 32-bit color that can be displayed in a pixel, given three primary color components
 * and a transparency component.
 * @extends Color
 * @module
 */
module.exports = class ColorAlpha extends Color {
  /**
   * Construct a ColorAlpha object.
   * Calling `new ColorAlpha()` (no arguments) will result in black (#000000FF).
   * @param {number=} red   the red   component of this color (an integer 0—255)
   * @param {number=} green the green component of this color (an integer 0—255)
   * @param {number=} blue  the blue  component of this color (an integer 0—255)
   * @param {number=} alpha a number in [0,1]; the alpha, or opacity, of this color
   */
  constructor(red = 0, green = 0, blue = 0, alpha = 1) {
    super(red, green, blue)
  }










  /**
   * Return a new color with the complemented alpha of this color.
   * An alpha of, for example, 0.7, complemented, is 0.3 (the complement with 1.0).
   * @return {ColorAlpha} a new ColorAlpha object with the same color but complemented alpha
   */
  negative() {
    return new ColorAlpha(...this.rgb, 1 - this.alpha)
  }










}
