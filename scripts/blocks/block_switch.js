function swichDefinition(colourNumber){
  let swichBlockList = []; 
  swichBlockList.push(
    {
    //「初めの状態は～とする」ブロック
    // 開始疑似状態からの遷移を設定するブロック
    "type": "firstDefinitionType",
    "message0": '初めは「初期状態」とする',
    "nextStatement": "firstSwichIf",
    "colour": switchColor[colourNumber[0]]
  },
  //「今の状態が～のとき」ブロック
  {
    "type": "switchIfType",
    "message0": '今の状態が %1 のとき',
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": ["initialState","swicthState"]
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "switchTransition"
      }
    ],
    "nextStatement": ["switchIfSwitchElseIf","switchStateAction"],
    "previousStatement": "firstSwichIf",
    "colour": switchColor[colourNumber[1]]
  },

  //「ではなく，今の状態が～のとき」ブロック
  {
    "type": "switchElseIfType",
    "message0": 'ではなく，今の状態が %1 のとき',
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": ["initialState","swicthState"]
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "switchTransition"
      }
    ],
    "nextStatement": ["switchIfSwitchElseIf","switchStateAction"],
    "previousStatement": "switchIfSwitchElseIf",
    "colour": switchColor[colourNumber[2]]
  },
  // 「状態が～のときの動きは」
  // 状態の定義を行うブロック
  {
    "type": "stateActionType",
    "message0": '状態が %1 のときの動きは',
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "swicthState"
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "motionRulesSwich"
      }
    ],
    "nextStatement": "switchStateAction",
    "previousStatement": "switchStateAction",
    "colour": switchColor[colourNumber[3]]
  },
  //「～という状態に変わる」ブロック
  {
    "type": "changeStateType",
    "message0": "%1 という状態に変わる",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": ["swicthState","finalState"]
      },
    ],
    "previousStatement": ["switchTransition","transitionIfElse","transitionGuard","effectChangeState"],
    "colour": switchColor[colourNumber[4]]
  });
  return swichBlockList;
}



javascript.javascriptGenerator.forBlock['stateActionType'] = function(block) {
  var code = '';
  var conditionCode = getchildBlockvalue(block,"IF0"); // この関数はブロックの情報を取得できなければfalseを返す
  var branchCode;
  var stateClass = "";

  // ブロックが挿入されていなければコンソールにエラーメッセージを出力
  checkForChildBlock(block,"IF0","「状態が～の時の動きは」ブロックに「状態」ブロックを挿入してください");
  checkForChildBlock(block,"DO0","「状態が～の時の動きは」ブロックは入れ子にすべきブロックが配置されていません");

  if(conditionCode != "状態名を入力" && conditionCode != "false"){
    branchCode = getchildBlockStatment(block,"DO0");

    // ここでは各状態におけるクラスの作成を行う
    let list = `[${branchCode} ["",""]]`; // ダミー配列を入れないと","が余ってしまう branchCodeは文字列で渡される
    list = JSON.parse(list); // listを文字列から配列に変更
    // 状態を表すクラスに各活動を追加　lengthはダミー配列があるため-1する
    for(let i = 0; i < list.length - 1; i++){
      // motionrulesから受け取った配列は[識別子,活動の内容]
      // 0番目の位置には識別子が入るのでentry,do,exitであるかを確認
      if(list[i][0] == "entry"){
        var entryAction = list[i][1]; // entryの活動内容を代入
        stateClass += `static saveEntryAction(){
                        // console.log("${entryAction}");
                        logColoring("${entryAction}","behavior",logDiv);
                        };\n`
      }
      else if(list[i][0] == "do"){
        var doAction = list[i][1]; // doの活動内容を代入
        stateClass += `static saveDoAction(){
                        // console.log("${doAction}");
                        logColoring("${doAction}","behavior",logDiv);
                        }; \n`
      }
      else if(list[i][0] == "exit"){
        var exitAction = list[i][1]; // exitの活動内容を代入
        stateClass += `static saveExitAction(){
                        // console.log("${exitAction}");
                        logColoring("${exitAction}","behavior",logDiv);
                        };\n`
      }
    }

    classCode += `class ${conditionCode} { ${stateClass}; };\n`;
  }

  return code;
};



javascript.javascriptGenerator.forBlock['firstDefinitionType'] = function(block) {
  var code = '';
  if (initialStateKey == false){
    const hasInitialState = pbJson.find(item => item.state === "初期状態");
    // 開始疑似状態からの遷移はただ一つだけかどうか調べる
    // 次の状態が"未定義"じゃないかも調べる
    if (hasInitialState.transition.length == 1){
      if(!hasInitialState.transition[0].nextState.includes("未定義")){
        currentState = "初期状態";
        // console.log("初めの状態は：" + currentState + "です");
        code +=`if (!hasInvalidBlocks){
                  logColoring("初めの状態は：" + "${currentState}" + "です","switch",logDiv);
                }`
        initialStateKey = true;
        block.setColour('#C8A2D6'); 
      }
      else{
        // console.log("「初期状態」の次の状態を決めてください");
        logError("「初期状態」の次の状態を決めてください",logDiv);
      }
    }
    else if (hasInitialState.transition.length == 0){
      // console.log("「初期状態」の次の状態を決めてください");
      logError("「初期状態」の次の状態を決めてください",logDiv);
    }
    else {
      // console.log("「初期状態」から到達できるのは一つの状態だけです");
      logError("「初期状態」から到達できるのは一つの状態だけです",logDiv);
      logError("「初期状態」には「イベント」を設定できません",logDiv);
    }
  }
  return code;
};



javascript.javascriptGenerator.forBlock['switchIfType'] = function(block) {
  var code ='';
  const nextblock = block.getNextBlock(); // 同じ階層で下に接続されているブロックを確認するために用いる
  var conditionCode = getchildBlockvalue(block,"IF0");
  var branchCode;

  // ブロックが挿入されていない時の確認メッセージを出力
  checkForChildBlock(block,"IF0","「今の状態が～のとき」ブロックに「状態名」ブロックを入れてください");
  checkForChildBlock(block,"DO0","「今の状態が～のとき」ブロックは入れ子にすべきブロックが配置されていません");

  // 現在の状態と挿入されたブロックが一致しているかの判定をする関数
  if (conditionCode == "true"){
      branchCode = getchildBlockStatment(block,"DO0");
      code += `${branchCode}`;
      switchKey = true; // if-elseを制御するキー
    }
  
  // swich case文を実装するために次に接続されているブロックが存在するかを確認する
  // 次に接続されているブロックが存在しなければswitchKeyをfalseにする
  // nextblockはオブジェクトを返すので単純な文字列比較はできない　テンプレートリテラルは用いない
  if (nextblock === null){
    switchKey = false;
  }

  return code;
}


javascript.javascriptGenerator.forBlock['switchElseIfType'] = function(block) {
  var code =''; 
  const nextblock = block.getNextBlock(); //オブジェクトを返す
  var conditionCode = getchildBlockvalue(block,"IF0");
  var branchCode;

  // ブロックが挿入されていない時の確認メッセージを出力
  checkForChildBlock(block,"IF0","「ではなく，今の状態が～のとき」ブロックに「状態名」ブロックを入れてください");
  checkForChildBlock(block,"DO0","「ではなく，今の状態が～のとき」ブロックは入れ子にすべきブロックが配置されていません");


  // 現在の状態と挿入されたブロックが一致しているかの判定をする　＆
  // このブロック以前のcaseと該当していないかどうかの判定をする(swich case文の再現)
  // 状態の一致を確認する
  if (conditionCode == "true"){
    const childBlock = block.getInputTargetBlock("DO0");
    // 子ブロックが「もし～というイベントが起きたなら」ブロックではない時(つまり，トリガーを持っていない時)
    // 子ブロックがイベントを持っていないときはすぐに次の状態へ遷移する(完了イベントの再現のため)
    
    if (childBlock && childBlock.type != "customControlsIfType") {
      branchCode = getchildBlockStatment(block,"DO0");
      code += `${branchCode}`;
      switchKey = true; 
    }
    // 子ブロックがトリガーを持つ時
    else{
      if (switchKey === false ){
        branchCode = getchildBlockStatment(block,"DO0");
        code += `${branchCode}`;
        switchKey = true; 
      }
    }
  }

  // swich case文を実装するために次に接続されているブロックが存在するかを確認する
  // 次に接続されているブロックが存在しなければswitchKeyをfalseにする
  // nextblockはオブジェクトを返すので単純な文字列比較はできない　テンプレートリテラルは用いない
  if (nextblock == null || nextblock.type == "stateActionType"){
    switchKey = false;
  }

  return code;
}


// 次の状態を入れるブロック
javascript.javascriptGenerator.forBlock['changeStateType'] = function(block) {
  var code = '';
  var temporaryState = getchildBlockvalue(block,"IF0"); // 遷移後の状態を取得
  
  // ブロックが挿入されていない時の確認メッセージを出力
  checkForChildBlock(block,"IF0","「～という状態に変わる」ブロックに「状態名」ブロックを挿入してください");
  

  // ブロックが挿入されて入れば現在の状態を更新する
  // if(currentState == "終了状態"){

  // }
  if(currentState == ""){
    logError("最初の状態は「初期状態」としてください",logDiv);
    // console.log("最初の状態は「初期状態」としてください");
  }
  else if(temporaryState != "false"){
    // 「動き」ブロックに関するの画像とログを変更する
    // let previousStateBhavior = containsBehavior(currentState);
    // let currentStateBhaivior = containsBehavior(temporaryState);
    //runMotionSequence(currentState,temporaryState,previousStateBhavior[2],currentStateBhaivior[0],3000); //「動き」の画像とログを出力するための関数


    // 親ブロックがエフェクトブロックかどうかを確認
    // エフェクトブロックがなかったらここで状態の変更を言う
    if (block.getParent() && block.getParent().type !== "effectType") {

      // 退場動作の処理 
      let exitActionLog = "";
      if (currentState !== "") {
        exitActionLog = `
          if (!hasInvalidBlocks) {
            if (typeof ${currentState} === "function" &&
                typeof ${currentState}.saveExitAction === "function") {
              ${currentState}.saveExitAction();
            }
          }
        `;
      }

      // 状態遷移ログ
      const transitionLog = `
        if (!hasInvalidBlocks) {
          logColoring("現在の状態は：${temporaryState}に変更されました", "switch", logDiv);
        }
      `;

      // 状態更新
      previousState = currentState;
      currentState = temporaryState;

      // --- まとめて code に追加 ---
      code += `
        ${exitActionLog}
        ${transitionLog}
      `;
    }

    // 状態がentryとdoを持っていればそれぞれを実行する
    // 実行タイミングとしては状態に入ったときなのでこのブロックで実行する
    code += `if (!hasInvalidBlocks){
              if (typeof ${temporaryState} == 'function') {
                if(typeof ${temporaryState}.saveEntryAction == "function"){
                  ${temporaryState}.saveEntryAction();
                }
                if(typeof ${temporaryState}.saveDoAction == "function"){
                  ${temporaryState}.saveDoAction();
                }
              }
            }`;
  }
  return code;
};
