var BigNumber = require('bignumber.js')
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN })
var Units = {}

var rawUnits = require('./units.json')
var units = {}

Object.keys(rawUnits).map(function (unit) {
  units[unit] = new BigNumber(rawUnits[unit], 10)
})

Units.units = rawUnits

var re = RegExp(/^[0-9]+\.?[0-9]*$/)

Units.convert = function (value, from, to) {
  if (!re.test(value)) {
    throw new Error('Unsupported value')
  }

  from = from.toLowerCase()
  if (!units[from]) {
    throw new Error('Unsupported input unit')
  }

  to = to.toLowerCase()
  if (!units[to]) {
    throw new Error('Unsupported output unit')
  }

  return new BigNumber(value, 10).times(units[from]).div(units[to]).toString(10)
}

Units.lazyConvert = function (value, to) {
  var tmp = value.split(' ')
  if (tmp.length !== 2) {
    throw new Error('Invalid input')
  }
  return Units.convert(tmp[0], tmp[1], to) + ' ' + to
}

Units.toRing = function(value) {
  return Units.convert(value, 'ring', 'wei')
}

Units.fromWei = function(value) {
  return Units.convert(value, 'wei', 'ring')
}


Units.fromSun = function(value) {
  return Units.convert(value, 'wei', 'mwei')
}

Units.toTrx = function(value) {
  return Units.convert(value, 'mwei', 'wei')
}

export default Units