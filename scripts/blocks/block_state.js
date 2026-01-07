function stateDefinition(colourNumber){
  let stateBlockList = []; 
  stateBlockList.push(
  // 「初期状態」ブロック
  {
    "type": "initialStateType",
    "message0": '初期状態',
    "output": "initialState",
    "colour": stateColor[colourNumber[0]],
  },

  // // 「終了状態」ブロック
  {
    "type": "finalStateType",
    "message0": '終了状態',
    "output": "finalState",
    "colour": stateColor[colourNumber[1]],
  },

  // ユーザーに入力させる状態ブロック
  {
    "type": "stateDefinitionType",
    "message0": "%1",
    "args0": [
      {
        "type": "field_input",   // ユーザーに状態名を入力させるフィールド
        "name": "STATE_NAME",     // フィールド名を指定
        "text": "状態名を入力"   // デフォルトの状態名
      }
    ],
    "output": "swicthState",
    "colour": stateColor[colourNumber[2]]
  })

  return stateBlockList;
}

function checkStateMatch(block, stateName) {
  var code = `false`; // デフォルトは false（状態が一致しない場合）

  // 親ブロックの情報を取得
  var parentBlock = block.getParent();

  // 親ブロックが存在する場合のみ処理
  if (parentBlock != null) {
    var parenttype = parentBlock.type; // 親ブロックのタイプを取得

    // 親ブロックが現在の状態との比較をしたい場合
    if (parenttype === "switchIfType" || parenttype === "switchElseIfType") {

      // 現在の状態が引数 stateName と一致する場合
      if(currentState != ""){
        if (currentState === stateName) {
          code = "true"; // 一致する場合は "true" を返す
        }
      }
    }

    // 親ブロックがstateブロックのvalueを知りたい場合
    if (parenttype === "firstDefinitionType" || parenttype === "stateActionType" || parenttype === "changeStateType") {
      code = `${stateName}`; // 引数 stateName を文字列として code に代入
    }
  }

  return code; // 最終的な結果を返す
}



// 開始疑似状態を意味するブロック
javascript.javascriptGenerator.forBlock['initialStateType'] = function(block) {
  var stateName = "初期状態"; 
  var code = checkStateMatch(block, stateName);
  return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
};

// 終了状態を意味するブロック
javascript.javascriptGenerator.forBlock['finalStateType'] = function(block) {
  var stateName = "終了状態";
  finalStateKey = true; // 終了状態に遷移したらこれ以上遷移できなくする
  var code = checkStateMatch(block, stateName);
  return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
};

// ユーザーに状態名を入力させるブロック
javascript.javascriptGenerator.forBlock['stateDefinitionType'] = function(block) {
  var stateName = block.getFieldValue('STATE_NAME');
  var code = checkStateMatch(block, stateName);
  return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
};
