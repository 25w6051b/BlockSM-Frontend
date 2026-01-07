// ガード名から変数名を取得する関数(エフェクトに含まれる変数はseparateEffect()で取得)
function getVariableFromGuard(){
  for(let i = 0; i < guardNames.length; i++){
    let guardName = guardNames[i];
    // 変数名はキャプチャグループで抜き出す
    // index = 0の時はマッチした部分すべて，index = 2の時は変数名が抜ける
    let equalMatch = guardName.match(/^(\w+)+\s*==/); 
    let lessThanMatch = guardName.match(/^(\w+)+\s*</);
    let greaterThanMatch = guardName.match(/^(\w+)+\s*>/);
    
    if(equalMatch != null){
      variableNames.push(equalMatch[1]);
    }
    else if (lessThanMatch != null){
      variableNames.push(lessThanMatch[1]);
    }
    else if (greaterThanMatch != null){
      variableNames.push(greaterThanMatch[1]);
    }
  }
}


// 変数名のリストを作成する関数
function createVariableList(){
  getVariableFromGuard(); // ガード名に含まれる変数名も取得
  variableNames = new Set(variableNames); // 重複する変数は削除する
  variableNames = [...variableNames] // Setオブジェクトをリストに直す
  setValueByKey(); // キーの設定をして値を保持できるようにする
}


// 各変数に値を保持できるようにKeyを設定する関数
function setValueByKey(){
  for (let i = 0; i < variableNames.length; i++) {
      variableNames[`variableKey${i}`] = "";
  }
}


function variableDefinition(colourNumber){
  let variableBlockList = [];
  for (let i = 0; i < variableNames.length; i++){
    variableBlockList.push(
      {
          "type": `variable${i}`,
          "message0": variableNames[i],
          "output": "variable",
          "colour": variableColor[colourNumber[i]]
      });
  }

  // ブロックごとにその処理を定義する必要があるので変数の数だけ定義
  for (let i = 0; i < variableNames.length; i++) {
    javascript.javascriptGenerator.forBlock[`variable${i}`] = variableActivity(i) // イベントごとにその処理を定義
  }

  return variableBlockList;
}


function variableActivity(variableIndex){
  return function(block){
    var code = '';
    code = variableIndex;
    return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
  }
}

