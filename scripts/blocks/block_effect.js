// エフェクト名を「変数を含むもの」と「変数を含まないもの」に分離する関数
function separateEffect(){
  let nonVariableEffectNames = [];

  for (let i = 0; i < effectNames.length; i++){
    effectName = effectNames[i];
    let valueMatch = effectName.match(/^(\w+)/);
    if(valueMatch !=  null){
      variableNames.push(valueMatch[1]); // 変数はvariableNamesに追加する
    }
    else{
      nonVariableEffectNames.push(effectName);
    }
  }
  effectNames = nonVariableEffectNames;
}


function effectDefinision(colourNumber){
  let effectBlockList = []; // イベントブロックの設定情報をまとめるリスト
  // ブロックごとに設定を決める
  for (let i = 0; i < effectNames.length; i++){
    effectBlockList.push(
      {
          "type": `effect${i}`,
          "message0": effectNames[i],
          "output": "effect",
          "colour": effectColor[colourNumber[i]]
      });
  }
  effectBlockList.push(
    {
      "type": "valueChangeType",
      "message0": " %1%2%3",
      "args0": [
        {
          "type": "input_value",
          "name": "IF0",
          "check": "variable"
        },
        {
          "type": "field_dropdown",
          "name": "IF1",
          "options": [
            ["=", "VALUE0"],
            ["+=", "VALUE1"],
            ["-=", "VALUE2"],
            ["*=", "VALUE3"],
            ["/=", "VALUE4"]
          ]
        },
        {
          "type": "field_input",
          "name": "IF2",
          "text": "数字を入力"   
        }
      ],
      "inputsInline": true, // arg0を横並びにするため
      "output":"effect",
      "colour": effectColor[colourNumber[effectNames.length + 0]]
    })


  // ブロックごとにその処理を定義する必要があるのでeventの数だけ定義
  for (let i = 0; i < effectNames.length; i++) {
    javascript.javascriptGenerator.forBlock[`effect${i}`] = effectActivity(i) // イベントごとにその処理を定義
  }

  
  return effectBlockList;
}


function effectActivity(effectIndex){
  return function(block){
    var code = '';
    var parentBlock = block.getParent();
    // 親ブロックがあるときだけ実行できるようにする
    if (parentBlock != null){
      code = effectNames[effectIndex];
    }
    return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
  }
}



javascript.javascriptGenerator.forBlock["valueChangeType"] = function(block) {
  var code = '';
  var parentBlock = block.getParent();
  var conditionCode0 = getchildBlockvalue(block,"IF0"); 
  var conditionCode1 = block.getFieldValue("IF1");
  var conditionCode2 = block.getFieldValue("IF2") || "aaa";


  if (parentBlock != null){
    // 自由入力のため全角で書かれた場合，半角に直す
    if(conditionCode2 != null) {
      conditionCode2 = conditionCode2.replace(/[！-～]/g, function(char) {
        let charCode = char.charCodeAt(0); // 文字コードに変換
        let halfWidthCharCode = charCode - 0xFEE0;  // 半角に変換するためのコード計算
        return String.fromCharCode(halfWidthCharCode);  // 半角文字に変換して返す
      });
    }

    // ブロックが挿入されていない時の確認メッセージを出力
    checkForChildBlock(block,"IF0","「 = 」ブロックに変数を入力してください");
    if(isNaN(conditionCode2)){
      code += 
      // console.log("「 = 」ブロックには数字のみを入力してください");
                logError("「 = 」ブロックには数字のみを入力してください",logDiv);
    }
    

    if(conditionCode0 != "false"){
      code += `${variableNames[conditionCode0]}`
      // conditionCode2に数字が正しく入力されているかを確認
      if (!isNaN(conditionCode2)) {
        // 初めに [? = 0]をしないとエラーを出す
        if(variableNames[`variableKey${conditionCode0}`] == "" && conditionCode1 != "VALUE0"){
          logError("変数が初期化されていない状態で代入演算を行おうとしています",logDiv);
          hasInvalidBlocks = true;
        }
        else{
          let currentValue = Number(variableNames[`variableKey${conditionCode0}`]); // 文字列型なので数値型に変更
          // 演算の実行
          let computedValue;
          if (conditionCode1 === "VALUE0") {
            code += " = ";
            computedValue = conditionCode2;  // そのまま代入
          } else if (conditionCode1 === "VALUE1") {
            code += " += ";
            computedValue = currentValue + Number(conditionCode2);  // 加算
          } else if (conditionCode1 === "VALUE2") {
            code += " −= ";
            computedValue = currentValue - Number(conditionCode2);  // 減算
          }  else if (conditionCode1 === "VALUE3") {
            code += " *= ";
            computedValue = currentValue * Number(conditionCode2);  // 乗算
          }  else if (conditionCode1 === "VALUE4") {
            code += " /= ";
            computedValue = currentValue / Number(conditionCode2);  // 除算
          } 
          code += `${conditionCode2}`;
          variableNames[`variableKey${conditionCode0}`] = computedValue; // 計算結果を代入する
        }
      }
      else{
        hasInvalidBlocks = true;
      }
    }
  }
  return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
};


