/**
 * A 256-bit color that can be displayed in a pixel, given three primary color components.
 * @type {Color}
 */
module.exports = (function () {
  // CONSTRUCTOR
  /**
   * Construct a Color object, given
   * three arguments (RGB),
   * one argument (grayscale), or
   * zero arguments (black, `#000000`).
   * @constructor
   * @param {number=0} red an integer in [0, 255]; the red component of this color
   * @param {number=red} grn an integer in [0, 255]; the green component of this color
   * @param {number=red} blu an integer in [0, 255]; the blue component of this color
   */
  function Color(red, grn, blu) {
    var self = this
    self._RED   = red || 0
    self._GREEN = grn || self._RED
    self._BLUE  = blu || self._RED

    var _max = Math.max(self._RED, self._GREEN, self._BLUE) / 255
    var _min = Math.min(self._RED, self._GREEN, self._BLUE) / 255
    var _chroma = _max - _min

    /**
     * The HSV-space hue of this color, or what "color" this color is.
     * A number bound by [0, 360).
     *
     * Exercise: prove:
     * _HSV_HUE === Math.atan2(Math.sqrt(3) * (g - b), 2*r - g - b)
     *
     * @type {number}
     */
    self._HSV_HUE = (function () {
      if (_chroma === 0) return 0

      var $rgb = [
        self._RED   / 255
      , self._GREEN / 255
      , self._BLUE  / 255
      ]

      return [
        function (r, g, b) { return ((g - b) / _chroma % 6) * 60 }
      , function (r, g, b) { return ((b - r) / _chroma + 2) * 60 }
      , function (r, g, b) { return ((r - g) / _chroma + 4) * 60 }
      ][$rgb.indexOf(_max)].apply(null, $rgb)
    })()

    /**
     * The brightness of this color. A lower value means the color is closer to black, a higher
     * value means the color is more true to its hue.
     * The HSV-space value ("brightness") of this color is equivalent to the ratio of the
     * brightest RGB-component’s value to 255, as a percentage.
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HSV_VAL = (function () {
      return _max
    })()

    /**
     * The vividness of this color. A lower saturation means the color is closer to white,
     * a higher saturation means the color is more true to its hue.
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HSV_SAT = (function () {
      return _chroma / self._HSV_VAL
    })()

    /**
     * The Hue of this color. Identical to `this._HSV_HUE`.
     * A number bound by [0, 360).
     * @type {number}
     */
    self._HSL_HUE = (function () {
      return self._HSV_HUE
    })()

    /**
     * How "white" or "black" the color is. A lower luminosity means the color is closer to black,
     * a higher luminosity means the color is closer to white.
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HSL_LUM = (function () {
      return 0.5 * (_max + _min)
    })()

    /**
     * The amount of "color" in the color. A lower saturation means the color is more grayer,
     * a higher saturation means the color is more colorful.
     * A number bound by [0, 1].
     *
     * Exercise: prove:
     * _HSL_SAT === _chroma / (1 - Math.abs(2*self._HSL_LUM - 1))
     * Proof:
     * denom == (function (x) {
     *   if (x <= 0.5) return 2x
     *   else          return 2 - 2x
     * })(_HSL_LUM)
     * Part A. Let x <= 0.5. Then 2x - 1 <= 0, and |2x - 1| == -(2x - 1).
     * Then 1 - |2x - 1| == 1 + (2x - 1) = 2x. //
     * Part B. Let 0.5 < x. Then 1 < 2x - 1, and |2x - 1| == 2x - 1.
     * Then 1 - |2x - 1| == 1 - (2x - 1) = 2 - 2x. //
     *
     * @type {number}
     */
    self._HSL_SAT = (function () {
      if (_chroma === 0) return 0 // covers the cases (self._HSL_LUM === 0) || (self._HSL_LUM === 1)
      return _chroma / ((self._HSL_LUM <= 0.5)  ?  2*self._HSL_LUM  :  (2 - 2*self._HSL_LUM))
    })();
  }


  // ACCESSOR FUNCTIONS
  /**
   * Get the red component of this color.
   * @return {number} the red component of this color
   */
  Color.prototype.red = function red() { return this._RED }
  /**
   * Get the green component of this color.
   * @return {number} the green component of this color
   */
  Color.prototype.green = function green() { return this._GREEN }
  /**
   * Get the blue component of this color.
   * @return {number} the blue component of this color
   */
  Color.prototype.blue = function blue() { return this._BLUE }

  /**
   * Get the hsv-hue of this color.
   * @return {number} the hsv-hue of this color
   */
  Color.prototype.hsvHue = function hsvHue() { return this._HSV_HUE }
  /**
   * Get the hsv-saturation of this color.
   * @return {number} the hsv-saturation of this color
   */
  Color.prototype.hsvSat = function hsvSat() { return this._HSV_SAT }
  /**
   * Get the hsv-value of this color.
   * @return {number} the hsv-value of this color
   */
  Color.prototype.hsvVal = function hsvVal() { return this._HSV_VAL }

  /**
   * Get the hsl-hue of this color.
   * @return {number} the hsl-hue of this color
   */
  Color.prototype.hslHue = function hslHue() { return this._HSL_HUE }
  /**
   * Get the hsl-saturation of this color.
   * @return {number} the hsl-saturation of this color
   */
  Color.prototype.hslSat = function hslSat() { return this._HSL_SAT }
  /**
   * Get the hsl-luminosity of this color.
   * @return {number} the hsl-luminosity of this color
   */
  Color.prototype.hslLum = function hslLum() { return this._HSL_LUM }

  // Convenience getter functions.
  /**
   * Return an array of RGB components (in that order).
   * @return {Array<number>} an array of RGB components
   */
  Color.prototype.rgb = function rgb() { return [this.red(), this.green(), this.blue()] }
  /**
   * Return an array of HSV components (in that order).
   * @return {Array<number>} an array of HSV components
   */
  Color.prototype.hsv = function hsv() { return [this.hsvHue(), this.hsvSat(), this.hsvVal()] }
  /**
   * Return an array of HSL components (in that order).
   * @return {Array<number>} an array of HSL components
   */
  Color.prototype.hsl = function hsl() { return [this.hslHue(), this.hslSat(), this.hslLum()] }


  // METHODS
  /**
   * Return a new color that is the complement of this color.
   * The complement of a color is the difference between that color and white (#fff).
   * @return {Color} a new Color object that corresponds to this color’s complement
   */
  Color.prototype.complement = function complement() {
    return new Color(255 - this.red(), 255 - this.green(), 255 - this.blue())
  }

  /**
   * Return a new color that is a hue-rotation of this color.
   * @param  {number} a the number of degrees to rotate
   * @return {Color} a new Color object corresponding to this color rotated by `a` degrees
   */
  Color.prototype.rotate = function rotate(a) {
    var newhue = (this.hsvHue() + a) % 360
    return Color.fromHSV(newhue, this.hsvSat(), this.hsvVal())
  }

  /**
   * Return a new color that is the inverse of this color.
   * The inverse of a color is that color with a hue rotation of 180 degrees.
   * @return {Color} a new Color object that corresponds to this color’s inverse
   */
  Color.prototype.invert = function invert() {
    return this.rotate(180)
  }

  /**
   * Return a new color that is a more saturated (more colorful) version of this color by a percentage.
   * This method calculates saturation in the HSL space.
   * A parameter of 1.0 returns a color with full saturation, and 0.0 returns an identical color.
   * A negative number will {@link Color.desaturate()|desaturate} this color.
   * @param  {number} p must be between -1.0 and 1.0; the value by which to saturate this color
   * @param  {boolean=} relative true if the saturation added is relative
   * @return {Color} a new Color object that corresponds to this color saturated by `p`
   */
  Color.prototype.saturate = function saturate(p, relative) {
    var newsat = this.hslSat() + (relative ? (this.hslSat() * p) : p)
    newsat = Math.min(Math.max(0, newsat), 1)
    return Color.fromHSL(this.hslHue(), newsat, this.hslLum())
  }

  /**
   * Return a new color that is a less saturated version of this color by a percentage.
   * A parameter of 1.0 returns a grayscale color, and 0.0 returns an identical color.
   * @see Color.saturate()
   * @param  {number} p must be between -1.0 and 1.0; the value by which to desaturate this color
   * @param  {boolean=} relative true if the saturation subtracted is relative
   * @return {Color} a new Color object that corresponds to this color desaturated by `p`
   */
  Color.prototype.desaturate = function desaturate(p, relative) {
    return this.saturate(-p, relative)
  }

  /**
   * Return a new color that is a brighter version of this color by a percentage.
   * This method calculates with luminosity in the HSL space.
   * A parameter of 1.0 returns white (#fff), and 0.0 returns an identical color.
   * A negative parameter will {@link Color.darken()|darken} this color.
   *
   * Set `relative = true` to specify the amount as relative to the color’s current brightness.
   * For example, if `$color` has an HSL-lum of 0.5, then calling `$color.brighten(0.5)` will return
   * a new color with an HSL-lum of 1.0, because the argument 0.5 is simply added to the color’s luminosity.
   * However, calling `$color.brighten(0.5, true)` will return a new color with an HSL-lum of 0.75,
   * because the argument 0.5, relative to the color’s current luminosity of 0.5, results in
   * an added luminosity of 0.25.
   *
   * @param {number} p must be between -1.0 and 1.0; the amount by which to lighten this color
   * @param {boolean=} relative true if the luminosity added is relative
   * @return {Color} a new Color object that corresponds to this color brightened by `p`
   */
  Color.prototype.brighten = function brighten(p, relative) {
    var newlum = this.hslLum() + (relative ? (this.hslLum() * p) : p)
    newlum = Math.min(Math.max(0, newlum), 1)
    return Color.fromHSL(this.hslHue(), this.hslSat(), newlum)
  }

  /**
   * Return a new color that is a darker version of this color by a percentage.
   * A parameter of 1.0 returns black (#000), and 0.0 returns an identical color.
   * @see Color.brighten()
   * @param {number} p must be between -1.0 and 1.0; the amount by which to darken this color
   * @param {boolean=} relative true if the luminosity subtracted is relative
   * @return {Color} a new Color object that corresponds to this color darkened by `p`
   */
  Color.prototype.darken = function darken(p, relative) {
    return this.brighten(-p, relative)
  }

  /**
   * Mix (average) another color with this color, with a given weight favoring that color.
   * If `w == 0.0`, return exactly this color.
   * `w == 1.0` return exactly the other color.
   * `w == 0.5` (default if omitted) return a perfectly even mix.
   * Note that `color1.mix(color2, w)` returns the same result as `color2.mix(color1, 1-w)`.
   * @param {Color} $color the second color
   * @param {number=0.5} w between 0.0 and 1.0; the weight favoring the other color
   * @return {Color} a mix of the two given colors
   */
  Color.prototype.mix = function mix($color, w) {
    if (w !== 0) w = +w || 0.5
    function average(a, b, w) {
      return (a * (1-w)) + (b * w)
    }
    var r = Math.round(average(this.red(),   $color.red(),   w))
    var g = Math.round(average(this.green(), $color.green(), w))
    var b = Math.round(average(this.blue(),  $color.blue(),  w))
    return new Color(r, g, b)
  }

  /**
   * Compare this color with another color.
   * Return `true` if they are the same color.
   * @param  {Color} $color a Color object
   * @return {boolean} true if the argument is the same color as this color
   */
  Color.prototype.equals = function equals($color) {
    return this.red()   === $color.red()
      &&   this.green() === $color.green()
      &&   this.blue()  === $color.blue()
  }
  /**
   * Return the *contrast ratio* between two colors.
   * More info can be found at
   * {@link https://www.w3.org/TR/WCAG/#contrast-ratiodef}
   * @param {Color} $color the second color to check
   * @return {number} the contrast ratio of this color with the argument
   */
  Color.prototype.contrastRatio = function contrastRatio($color) {
    /**
     * Return the relative lumance of a color.
     * @param  {Color} c a Color object
     * @return {number} the relative lumance of the color
     */
    function luma(c, b) {
      /**
       * A helper function.
       * @param  {number} p a decimal representation of an rgb component of a color
       * @return {number} the output of some mathematical function of `p`
       */
      function coef(p) {
        return (p <= 0.03928) ? p/12.92 : Math.pow((p + 0.055)/1.055, 2.4)
      }
      return 0.2126*coef(c.red()  /255)
           + 0.7152*coef(c.green()/255)
           + 0.0722*coef(c.blue() /255)
    }
    var both = [luma(this), luma($color)]
    return (Math.max.apply(null, both) + 0.05) / (Math.min.apply(null, both) + 0.05)
  }

  /**
   * Tests whether this color is gray.
   * A color is gray if and only if its red, green, and blue compoenents are equal,
   * or equivalently, if its saturation (in HSV or HSL) is zero.
   * @return {boolean} true if this color’s saturation equals 0
   */
  Color.prototype.isGrayscale = function isGrayscale() {
    return this.hsvSat() === 0
  }

  /**
   * Return a string representation of this color.
   * If `space === 'hsv'`, return `hsv(h, s, v)`
   * If `space === 'hsl'`, return `hsl(h, s, l)`
   * If `space === 'hex'`, return `#rrggbb`
   * If `space === 'rgb'` (default), return `rgb(r, g, b)`
   * @param {string='rgb'} space represents the space in which this color exists
   * @return {string} a string representing this color.
   */
  Color.prototype.toString = function toString(space) {
    /**
     * Converts a decimal number to a hexadecimal number, as a string.
     * @param  {number} n a number in base 10
     * @return {string} a number in base 16
     */
    function toHex(n) {
      return '0123456789abcdef'.charAt((n - n % 16) / 16) + '0123456789abcdef'.charAt(n % 16)
    }
    if (space === 'hex') return '#' + toHex(this.red()) + toHex(this.green())  + toHex(this.blue())
    if (space === 'hsv') return 'hsv(' + this.hsvHue()  + ', ' + this.hsvSat() + ', ' + this.hsvVal() + ')'
    if (space === 'hsl') return 'hsl(' + this.hslHue()  + ', ' + this.hslSat() + ', ' + this.hslLum() + ')'
                         return 'rgb(' + this.red()     + ', ' + this.green()  + ', ' + this.blue()   + ')'
    // CHANGED ES6
    // if (space === 'hex') return `#${toHex(this.red())}${toHex(this.green())}${toHex(this.blue())}`
    // if (space === 'hsv') return `hsv(${this.hsvHue()}, ${this.hsvSat()}, ${this.hsvVal()})`
    // if (space === 'hsl') return `hsl(${this.hslHue()}, ${this.hslSat()}, ${this.hslLum()})`
    //                      return `rgb(${this.red()   }, ${this.green() }, ${this.blue()  })`
  }


  // STATIC MEMBERS
  /**
   * Return a new Color object, given a string of the form `rgb(r,g,b)` or `rgb(r, g, b)`,
   * where `r`, `g`, and `b` are decimal RGB components (in base 10, out of 255).
   * @param {string} rgb_string a string of the form `rgb(r,g,b)` or `rgb(r, g, b)`
   * @return {Color} a new Color object constructed from the given rgb string
   */
  Color.fromRGB = function fromRGB(rgb_string) {
    var splitted = rgb_string.slice(4, -1).split(',')
    return new Color(+splitted[0], +splitted[1], +splitted[2])
  }

  /**
   * Return a new Color object, given a string of the form `#rrggbb`,
   * where `rr`, `gg`, and `bb` are hexadecimal RGB components (in base 16, out of ff, lowercase).
   * The `#` must be included.
   * @param {string} hex_string a string of the form `#rrggbb` (lowercase)
   * @return {Color} a new Color object constructed from the given hex string
   */
  Color.fromHex = function fromHex(hex_string) {
    var r_hex = hex_string.slice(1,3)
    var g_hex = hex_string.slice(3,5)
    var b_hex = hex_string.slice(5,7)
    /**
     * Converts a hexadecimal number (as a string) to a decimal number.
     * @param  {string} n a number in base 16
     * @return {number} a number in base 10
     */
    function toDec(x) {
      var tens = 0
      var ones = 0
      for (var i = 0; i < 16; i++) {
        if ('0123456789abcdef'.charAt(i) === x.slice(0,1)) tens = i*16
        if ('0123456789abcdef'.charAt(i) === x.slice(1,2)) ones = i
      }
      return tens + ones
    }
    return new Color(toDec(r_hex), toDec(g_hex), toDec(b_hex))
  }

  /**
   * Return a new Color object, given hue, saturation, and value in HSV-space.
   *
   * Takes HSV-components as number arguments and returns a new Color object with
   * RGB-components, each a base-10 number from 0 to 255.
   *
   * Photoshop, etc. represents the saturation and "brightness" (value) values from 0 to 100,
   * however, the saturation and value are calculated from a range of 0 to 1. Make that conversion
   * before calling this method.
   *
   * Ported from the excellent java algorithm by Eugene Vishnevsky at:
   * {@link http://www.cs.rit.edu/~ncs/color/t_convert.html}
   *
   * @param {number} hue must be between 0 and 360; hue in HSV-space
   * @param {number} sat must be between 0.0 and 1.0; saturation in HSV-space
   * @param {number} val must be between 0.0 and 1.0; brightness in HSV-space
   * @return {Color} a new Color object with hsv(hue, sat, val)
   */
  Color.fromHSV = function fromHSV(hue, sat, val) {
    var c = sat * val
    var x = c * (1 - Math.abs(hue/60 % 2 - 1))
    var m = val - c
    var rgb;
         if (  0 <= hue && hue <  60) { rgb = [c, x, 0] }
    else if ( 60 <= hue && hue < 120) { rgb = [x, c, 0] }
    else if (120 <= hue && hue < 180) { rgb = [0, c, x] }
    else if (180 <= hue && hue < 240) { rgb = [0, x, c] }
    else if (240 <= hue && hue < 300) { rgb = [x, 0, c] }
    else if (300 <= hue && hue < 360) { rgb = [c, 0, x] }
    rgb = rgb.map(function (el) { return Math.round((el + m) * 255) })
    return new Color(rgb[0], rgb[1], rgb[2])
    // XXX ILLEGAL setting immutable properties
    // returned._HSV_HUE = hue
    // returned._HSV_SAT = sat
    // returned._HSV_VAL = val
  }

  /**
   * Return a new Color object, given hue, saturation, and luminosity.
   * @param {number} hue must be between 0 and 360; hue in HSL-space (same as hue in HSV-space)
   * @param {number} sat must be between 0.0 and 1.0; saturation in HSL-space
   * @param {number} lum must be between 0.0 and 1.0; luminosity in HSL-space
   * @return {Color} a new Color object with hsl(hue, sat, lum)
   */
  Color.fromHSL = function fromHSL(hue, sat, lum) {
    var c = sat * (1 - Math.abs(2*lum - 1))
    var x = c * (1 - Math.abs(hue/60 % 2 - 1))
    var m = lum - c/2
    var rgb;
         if (  0 <= hue && hue <  60) { rgb = [c, x, 0] }
    else if ( 60 <= hue && hue < 120) { rgb = [x, c, 0] }
    else if (120 <= hue && hue < 180) { rgb = [0, c, x] }
    else if (180 <= hue && hue < 240) { rgb = [0, x, c] }
    else if (240 <= hue && hue < 300) { rgb = [x, 0, c] }
    else if (300 <= hue && hue < 360) { rgb = [c, 0, x] }
    rgb = rgb.map(function (el) { return Math.round((el + m) * 255) })
    return new Color(rgb[0], rgb[1], rgb[2])
    // XXX ILLEGAL setting immutable properties
    // returned._HSL_HUE = hue
    // returned._HSL_SAT = sat
    // returned._HSL_LUM = lum
  }

  /**
   * Checks the type of an argument, and converts it to a color.
   * @param  {unknown} arg any argument
   * @return {Color} a new Color object constructed from the given argument
   */
  Color.typeCheck = function typeCheck(arg) {
    if (arg instanceof Color) return arg
    if (typeof arg === 'string') {
      if (arg.slice(0,1) === '#')    return Color.fromHex(arg)
      if (arg.slice(0,4) === 'rgb(') return Color.fromRGB(arg)
      if (arg.slice(0,4) === 'hsv(') return Color.fromHSV(arg)
      if (arg.slice(0,4) === 'hsl(') return Color.fromHSL(arg)
                                     return new Color()
    }
    if (typeof arg === 'number') {
      var graytone = Math.min(Math.max(0, arg), 255) // bound(arg, 0, 255)
      return new Color(+graytone, +graytone, +graytone)
    }
    return new Color()
  }

  return Color
})()
