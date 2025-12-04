
let arr1 = [[1, [2, 3], 4], [5, [6, 7], 8, 9]];
let twoArr = [];
twoArr.push(...arr1);
let result = [];
result.concat(...twoArr);
console.log(result);

// 数组拉平
const arr = [[1, 2], [3, 4], [5, 6]]
function fn(array) {
  // 初始化数组为[]使用ES6语法第一次reduce回调中相当于执行[].concat([1,2])
  // 之后正常叠加
  const a = array.reduce((newArr = [], present) => {
    console.log(newArr); //[1,2] //[1,2,3,4]  //[1,2,3,4,5,6]
    return newArr.concat(present)
  })
  return a;
}
console.log(fn(arr));




