const Quaternion = require('quaternion')

const q = new Quaternion()
console.log(q)

const qv = Quaternion.fromBetweenVectors(
  [0, 1, 0],
  [0, 99, 99]
)
console.log(qv)
