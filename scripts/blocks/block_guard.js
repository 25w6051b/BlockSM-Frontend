function guardDefinision(colourNumber){
  let guardBlockList = []; 
  guardBlockList.push(
  {
    "type": "checkComputationType",
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
          ["==", "VALUE0"],
          ["<", "VALUE1"],
          [">", "VALUE2"],
          ["<=", "VALUE3"],
          [">=", "VALUE4"]
        ]
      },
      {
        "type": "field_input",
        "name": "IF2",
        "text": "数字を入力"   
      }
    ],
    "inputsInline": true, // arg0を横並びにするため
    "output":"guard",
    "colour": guardColor[colourNumber[0]]
  },    
  {
    "type": "logicalOperationsType",
    "message0": " %1%2%3",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "guard"
      },
      {
        "type": "field_dropdown",
        "name": "IF1",
        "options": [
          ["かつ", "VALUE0"],
          ["または", "VALUE1"]
        ]
      },
      {
        "type": "input_value",
        "name": "IF2",
        "check": "guard"
      }
    ],
    "inputsInline": true, // arg0を横並びにするため
    "output":"guard",
    "colour": guardColor[colourNumber[1]]
  },
  {
    "type": "NegationType",
    "message0": " %1が%2ではない",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "variable"
      },
      {
        "type": "field_input",
        "name": "IF1",
        "text": "数字を入力"  
      }
    ],
    "inputsInline": true, // arg0を横並びにするため
    "output":"guard",
    "colour": guardColor[colourNumber[2]]
  }
  )
 return guardBlockList;
}


// 「 [] == [数字] 」ブロック
javascript.javascriptGenerator.forBlock["checkComputationType"] = function(block) {
  var code = false;
  var conditionCode0 = getchildBlockvalue(block,"IF0"); 
  var conditionCode1 = block.getFieldValue("IF1");
  var conditionCode2 = block.getFieldValue("IF2") || null;

  let variableValue = variableNames[`variableKey${conditionCode0}`]; // 変数の値

  // 変数が値を持たない時は条件を見ない
  if(variableValue == ""){
    // variableValue = false;
    logError("変数が初期化されていない状態で比較演算を行おうとしています",logDiv);
    hasInvalidBlocks = true;
  }
  // 変数が値を持つ時
  else {
    // 自由入力のため全角で書かれた場合，半角に直す
    if(conditionCode2 != false){
      conditionCode2 = conditionCode2.replace(/[！-～]/g, function(char) {
        let charCode = char.charCodeAt(0); // 文字コードに変換
        let halfWidthCharCode = charCode - 0xFEE0;  // 半角に変換するためのコード計算
        return String.fromCharCode(halfWidthCharCode);  // 半角文字に変換して返す
      });
    }

    let computationList = ["==", "<", ">", "<=", ">="];
    let operator = computationList[parseInt(conditionCode1.replace("VALUE", ""))];

    // ブロックが挿入されていない時の確認メッセージを出力
    checkForChildBlock(block,"IF0",`「」 ${operator} 「」ブロックに変数を入力してください`);
    if (conditionCode2 == "数字を入力" || conditionCode2 == null || isNaN(conditionCode2)){
      logError(`「」 ${operator} 「」ブロックに数字を入力してください`,logDiv);
      hasInvalidBlocks = true;
      // console.log(`「」 ${operator} 「」ブロックに数字を入力してください`);
    }

    // conditionCode2 == 0のときfalseと判定されるため，0かどうかの確認が必要
    if(variableValue == 0){
      if (eval(`variableValue ${operator} conditionCode2`)) {
        code = true;
      }
    }
    if(variableValue != false){
      if (eval(`variableValue ${operator} conditionCode2`)) {
        code = true;
      }
    }
  }
  return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
};



// 「 [] かつ [] 」ブロック
javascript.javascriptGenerator.forBlock["logicalOperationsType"] = function(block) {
  var code = false;
  var conditionCode0 = getchildBlockvalue(block,"IF0"); 
  var conditionCode1 = block.getFieldValue("IF1");
  var conditionCode2 = getchildBlockvalue(block,"IF2"); 
  

  // ブロックが挿入されていない時の確認メッセージを出力
  if(conditionCode1 == "VALUE0"){
    checkForChildBlock(block,"IF0","「」 かつ 「」ブロックに変数を入力してください");
    checkForChildBlock(block,"IF2","「」 かつ 「」ブロックに変数を入力してください");
  }
  else if(conditionCode1 == "VALUE1"){
    checkForChildBlock(block,"IF0","「」 または 「」ブロックに変数を入力してください");
    checkForChildBlock(block,"IF2","「」 または 「」ブロックに変数を入力してください");
  }


  if (conditionCode1 == "VALUE0"){
    if(conditionCode0 == "true" && conditionCode2 == "true"){
      code = true;
    }
  }
  else if (conditionCode1 == "VALUE1"){
    if(conditionCode0 == "true" || conditionCode2 == "true"){
      code = true;
    }
  }

  return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
};


// 「 []が[数字]ではないとき 」ブロック
javascript.javascriptGenerator.forBlock["NegationType"] = function(block) {
  var code = false;
  var conditionCode0 = getchildBlockvalue(block,"IF0"); 
  var conditionCode1 = block.getFieldValue("IF1") || false;


  let variableValue = variableNames[`variableKey${conditionCode0}`];
  // 変数が値を持たない時は条件を見ない
  if(variableValue == ""){
    // variableValue = false;
    logError("変数が初期化されていない状態で比較演算を行おうとしています",logDiv);
    hasInvalidBlocks = true;
  }
  // 変数が値を持つ時
  else {
    // 自由入力のため全角で書かれた場合，半角に直す
    if(conditionCode1 != false){
      conditionCode1 = conditionCode1.replace(/[！-～]/g, function(char) {
        let charCode = char.charCodeAt(0); // 文字コードに変換
        let halfWidthCharCode = charCode - 0xFEE0;  // 半角に変換するためのコード計算
        return String.fromCharCode(halfWidthCharCode);  // 半角文字に変換して返す
      });
    }

    if (conditionCode1 == "数字を入力" || conditionCode1 == null || isNaN(conditionCode1)){
      logError(`「」 が 「」ではない　ブロックに数字を入力してください`,logDiv);
      hasInvalidBlocks = true;
      // console.log(`「」が「」ではない　ブロックに数字を入力してください`);
    }

    if(variableValue != false){
      if (variableValue != conditionCode1) {
        code = true;
      }
    }
  }

  return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
};
