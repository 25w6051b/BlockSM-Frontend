function behaviorDefinision(colourNumber){
  let behaviorBlockList = []; // 動きブロックの設定情報をまとめるリスト
  // ブロックごとに設定を決める
  for (let i = 0; i < behaviorNames.length; i++){
    behaviorBlockList.push(
      {
          "type": `behavior${i}`,
          "message0": behaviorNames[i],
          "colour": behaviorColor[colourNumber[i]],
          "previousStatement": "behavior"
      });
  }

  // ブロックごとにその処理を定義する必要があるのでbehaviorの数だけ定義
  for (let i = 0; i < behaviorNames.length; i++) {
      javascript.javascriptGenerator.forBlock[`behavior${i}`] = behaviorActivity(i) // イベントごとにその処理を定義
  }

  return behaviorBlockList;
}


// Blockly.defineBlocksWithJsonArray を使って一括で定義
Blockly.defineBlocksWithJsonArray(behaviorDefinision(behaviorColor[0]));

// イベントブロックが行う処理を定義する関数
// ただ，ブロックごとにfunction(block)を返さなければいけないので，returnではfunction(block)を返す　
function behaviorActivity(behaviorIndex){
    return function(block){
      var code = '';
      code = processStateWithParentCheck(block,behaviorNames[behaviorIndex]); // 動きブロックごとに定義する
      return code;
    }
}



