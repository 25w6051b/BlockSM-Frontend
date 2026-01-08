function transitionDefinition(colourNumber){
  let transitionBlockList = []; 
  transitionBlockList.push(
  {
    //「もし～というイベントが起きたなら」ブロック
    "type": "customControlsIfType",
    "message0": "もし %1 というイベントが起きたなら",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "trigger"
      },
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "transitionIfElse"
      }
    ],
    "nextStatement": ["customControlsElseIf"],
    "previousStatement": "switchTransition",
    "colour": transitionColor[colourNumber[0]]
  },

  //「ではなく～というイベントが起きたなら」ブロック
  {
    "type": "customControlsElseIfType",
    "message0": "ではなく %1 というイベントが起きたなら",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "trigger"
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "transitionIfElse"
      }
    ],
    "nextStatement": ["customControlsElseIf"],
    "previousStatement": ["customControlsElseIf"],
    "colour": transitionColor[colourNumber[1]]
  },

  //「もし～という条件を満たすなら」ブロック
  {
    "type": "guardIfType",
    "message0": "もし %1 という条件を満たすなら",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "guard"
      },
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "transitionGuard"
      }
    ],
    "nextStatement": ["guardIfElseIf"],
    "previousStatement": ["switchTransition","transitionIfElse"],
    "colour": transitionColor[colourNumber[2]]
  },

  // 「ではなく，もし～という条件を満たすなら」ブロック
  {
    "type": "guardElseIfType",
    "message0": "ではなく %1 という条件を満たすなら",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "guard"
      },
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "transitionGuard"
      }
    ],
    "nextStatement": ["guardIfElseIf"],
    "previousStatement": ["guardIfElseIf"],
    "colour": transitionColor[colourNumber[3]]
  },

  //「～という作用が起こる」ブロック
  {
    "type": "effectType",
    "message0": "%1 という作用が起こる",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "effect"
      },
    ],
    "nextStatement": ["effectChangeState"],
    "previousStatement": ["switchTransition","transitionIfElse","transitionGuard"],
    "colour": transitionColor[colourNumber[4]]
  }
 );

 return transitionBlockList;
}




// トリガーを入れるブロック(ifを実現)
javascript.javascriptGenerator.forBlock['customControlsIfType'] = function(block) {
  var code = '';
  const nextblock = block.getNextBlock(); // 同じ階層で下に接続されているブロックを確認するために用いる
  var conditionCode = getchildBlockvalue(block,"IF0");
  var branchCode;
  conditionCode = JSON.parse(conditionCode); // 配列が文字列で返されるので，元の配列に戻す

  // ブロックが挿入されていなければコンソールにエラーメッセージを出力
  checkForChildBlock(block,"IF0","「もし～というイベントが起きたなら」ブロックに「イベント」ブロックを挿入してください");
  checkForChildBlock(block,"DO0","「もし～というイベントが起きたなら」ブロックは入れ子にすべきブロックが配置されていません");

  // 初期状態の時はイベントを持てないことを説明
  if (currentState == "初期状態"){
    code += `
    // console.log("現在の状態が「初期状態」のときは「もし～というイベントが起きたなら」ブロックを使うことはできません");
           logError("現在の状態が「初期状態」のときは「もし～というイベントが起きたなら」ブロックを使うことはできません",logDiv);`
  }
  // 挿入されたイベントが発生していた場合の処理
  else{
    if (conditionCode[0] == true){
      branchCode = getchildBlockStatment(block,"DO0");
      // ガードがtrueの場合だけ
      if(branchCode != ""){
        code += `${branchCode}`;
      }
      eventIfKey = true;
    }
  }

  if (nextblock === null){
    eventIfKey = false;
  }
  
  return code;
};


// トリガーを入れるブロック()if else ifを実現)
javascript.javascriptGenerator.forBlock['customControlsElseIfType'] = function(block) {
  var code =''; 
  const nextblock = block.getNextBlock(); //オブジェクトを返す
  var conditionCode = getchildBlockvalue(block,"IF0");
  var branchCode;
  conditionCode = JSON.parse(conditionCode);
 
  checkForChildBlock(block,"IF0","「ではなく～というイベントが起きたなら」ブロックに「イベント」ブロックを挿入してください");
  checkForChildBlock(block,"DO0","「ではなく～というイベントが起きたなら」ブロックは入れ子にすべきブロックが配置されていません");

  if (currentState == "初期状態"){
    code += `
    // console.log("現在の状態が「初期状態」のときは「ではなく～というイベントが起きたなら」ブロックを使うことはできません");
           logError("現在の状態が「初期状態」のときは「ではなく～というイベントが起きたなら」ブロックを使うことはできません",logDiv);`; }
  else {
      if (eventIfKey == false && conditionCode[0] == true){
        branchCode = getchildBlockStatment(block,"DO0");
        // ガードがtrueの場合だけ
        if(branchCode != ""){
          code += `${branchCode}`;
        }
         eventIfKey = true;
      };
  };

  if (nextblock == null){
    eventIfKey = false;
  };

  return code;
};


// ガードを入れるブロック(ifを実現)
javascript.javascriptGenerator.forBlock['guardIfType'] = function(block) {
  var code = '';
  const nextblock = block.getNextBlock(); 
  var conditionCode = getchildBlockvalue(block,"IF0");
  var branchCode;

  // ブロックが挿入されていなければコンソールにエラーメッセージを出力
  checkForChildBlock(block,"IF0","「もし～という条件を満たすなら」ブロックに「条件」ブロックを挿入してください");
  checkForChildBlock(block,"DO0","「もし～という条件を満たすなら」ブロックは入れ子にすべきブロックが配置されていません");

  if (currentState == "初期状態"){
    code += `
    // console.log("現在の状態が「初期状態」のときは「もし～という条件を満たすなら」ブロックを使うことはできません");
           logError("現在の状態が「初期状態」のときは「もし～という条件を満たすなら」ブロックを使うことはできません",logDiv);`; }
  else {
    if (conditionCode == "true"){
    branchCode = getchildBlockStatment(block,"DO0");
    code += `${branchCode}`;
    guardIfKey = true;
    };
  };

  if (nextblock === null){
    guardIfKey = false;
  }

  return code;
};


// ガードを入れるブロック(else ifを実現)
javascript.javascriptGenerator.forBlock['guardElseIfType'] = function(block) {
  var code = '';
  const nextblock = block.getNextBlock(); 
  var conditionCode = getchildBlockvalue(block,"IF0");
  var branchCode;

  // ブロックが挿入されていなければコンソールにエラーメッセージを出力
  checkForChildBlock(block,"IF0","「ではなく～という条件を満たすなら」ブロックに「条件」ブロックを挿入してください");
  checkForChildBlock(block,"DO0","「ではなく～という条件を満たすなら」ブロックは入れ子にすべきブロックが配置されていません");

  if (currentState == "初期状態"){
    code += `
    // console.log("現在の状態が「初期状態」のときは「ではなく～という条件を満たすなら」ブロックを使うことはできません");
           logError("現在の状態が「初期状態」のときは「ではなく～という条件を満たすなら」ブロックを使うことはできません",logDiv);`; }
  else {
    if (conditionCode == "true" && guardIfKey == false){
      branchCode = getchildBlockStatment(block,"DO0");
      code += `${branchCode}`;
      guardIfKey = true;
    }
  }
  if (nextblock == null){
    guardIfKey = false;
  }

  return code;
};


// エフェクトを入れるブロック
javascript.javascriptGenerator.forBlock['effectType'] = function(block) {
  var code = '';
  var conditionCode;
  conditionCode = javascript.javascriptGenerator.valueToCode(block, "IF0",
                  javascript.javascriptGenerator.ORDER_ATOMIC) || false; // ブロックが挿入されていなければfalseを返す
  const nextBlock = block.getNextBlock(); // 同じ階層下に繋がってるブロックを取得

  checkForChildBlock(block,"IF0","「～という作用が起こる」ブロックに「作用」ブロックを挿入してください");

  // 状態に先に入ることを言うために「という状態に変わる」ブロックが存在するか調べる
  if (nextBlock && nextBlock.type == "changeStateType") {
    const childBlock = getchildBlockvalue(nextBlock,"IF0"); 
    // 「という状態に変わる」ブロックに挿入される状態名が未定義でないとき
    if (childBlock !== "false") {
      // 子ブロックのエフェクトブロックが挿入されているとき
      if(conditionCode != false){
        // 退場動作の処理
        if (currentState !== "") {
          code += `
            if (!hasInvalidBlocks) {
              if (typeof ${currentState} === "function" &&
                  typeof ${currentState}.saveExitAction === "function") {
                ${currentState}.saveExitAction();
              }
            }
          `;
        }

        // 状態の変更と作用の処理
        code += `
                if (!hasInvalidBlocks){
                  // console.log("現在の状態は：" + "${childBlock}" + "に変更されました");
                  logColoring("現在の状態は：" + "${childBlock}" + "に変更されました","switch",logDiv);
                  // console.log("${conditionCode}" + "という作用が起こった");
                  logColoring("${conditionCode}" + "という作用が起こった","effect",logDiv);
                }`
        previousState = currentState;
        currentState = childBlock; // 現在の状態を更新
      }
    }
  }
  // 「という状態に変わる」ブロックが存在しないない時(そもそも次の状態がないならエフェクトを起こさない)
  else {
    code += `
    // console.log("「～という作用が起こる」ブロックの後に，「～という状態に変わる」ブロックを追加して，次の状態を定義してください");
            logError("「～という作用が起こる」ブロックの後に，「～という状態に変わる」ブロックを追加して，次の状態を定義してください",logDiv);`
  }

  return code;
};




