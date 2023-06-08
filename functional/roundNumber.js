export const GenerateRandomNumbers=(num)=> {
  var numbers = "";
  for (var i = 0; i < num; i++) {
    var randomNum = Math.floor(Math.random() * 10);
    numbers += randomNum;
  }
  return numbers;
}
