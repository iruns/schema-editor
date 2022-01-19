const objSizes: number[] = []
let lastSize = 10
for (let l = 0; l < 5; l++) {
  objSizes.unshift(lastSize)
  lastSize = Math.ceil(lastSize * 1.5)
}
console.log(objSizes)
