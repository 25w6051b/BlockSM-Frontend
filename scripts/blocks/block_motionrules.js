function motionRulesDefinition(colourNumber){
  let motionRulesBlockList = []; 
  motionRulesBlockList.push(
    // 「はじめに」ブロック
    {
      "type": "entryType",
      "message0": "初めに %1",
      "args0": [
        {
            "type": "input_statement",
            "name": "DO0",
            "check": "behavior"
        }
      ],
      "previousStatement": "motionRulesSwich",
      "nextStatement": "motionRulesEntry",
      "colour": motionRulesColor[colourNumber[0]]
    },

    // 「ずっと」ブロック
    {
      "type": "doContinuousType",
      "message0": "ずっと %1",
      "args0": [
        {
            "type": "input_statement",
            "name": "DO0",
            "check": "behavior"
        }
      ],
      "previousStatement": ["motionRulesSwich","motionRulesEntry"],
      "nextStatement": "motionRulesDoContinuos",
      "colour": motionRulesColor[colourNumber[1]]
    },

    // 「いちどだけ」ブロック
    {
      "type": "doOnetimeType",
      "message0": "一度だけ %1",
      "args0": [
        {
            "type": "input_statement",
            "name": "DO0",
            "check": "behavior"
        }
      ],
      "previousStatement": ["motionRulesSwich","motionRulesEntry"],
      "nextStatement": "motionRulesDoOnetime",
      "colour": motionRulesColor[colourNumber[2]]
    },

    // 「おわりに」ブロック
    {
      "type": "exitType",
      "message0": "終わりに %1",
      "args0": [
        {
            "type": "input_statement",
            "name": "DO0",
            "check": "behavior"
        }
      ],
      "previousStatement": ["motionRulesSwich","motionRulesEntry","motionRulesDoContinuos","motionRulesDoOnetime"],
      "colour": motionRulesColor[colourNumber[3]]
    }
 );
 return motionRulesBlockList;
}


javascript.javascriptGenerator.forBlock['entryType'] = function(block) {
    var code = '';
    var branchCode = javascript.javascriptGenerator.statementToCode(block, 'DO0') || "false";
    branchCode = branchCode.trim();
    var parentBlock = block.getParent();

    // ブロックが挿入されていない時の確認メッセージを出力
    checkForChildBlock(block,"DO0","「初めに」ブロックに「動き」ブロックを挿入してください");

    if(branchCode != "false"){
      if(parentBlock === null){
        code = `
        // console.log("初めに" + "${branchCode}");
                // logColoring("初めに" + "${branchCode}","behavior",logDiv);
                `
      }
      else{
        code = `["entry","初めに${branchCode}"],`;
      }
    }

    return code;
};


javascript.javascriptGenerator.forBlock['doContinuousType'] = function(block) {
    var code = '';
    var branchCode = javascript.javascriptGenerator.statementToCode(block, 'DO0') || "false";
    branchCode = branchCode.trim();
    var parentBlock = block.getParent();

    // ブロックが挿入されていない時の確認メッセージを出力
    checkForChildBlock(block,"DO0","「ずっと」ブロックに「動き」ブロックを挿入してください");

    if(branchCode != "false"){
      if(parentBlock === null){
        code = `
        // console.log("ずっと" + "${branchCode}");
                // logColoring("ずっと" + "${branchCode}","behavior",logDiv);
                `
      }
      else{
        code = `["do","ずっと${branchCode}"],`;
      }
    }
    return code;
};


javascript.javascriptGenerator.forBlock['doOnetimeType'] = function(block) {
  var code = '';
  var branchCode = javascript.javascriptGenerator.statementToCode(block, 'DO0') || "false";
  branchCode = branchCode.trim();
  var parentBlock = block.getParent();

  // ブロックが挿入されていない時の確認メッセージを出力
  checkForChildBlock(block,"DO0","「一度だけ」ブロックに「動き」ブロックを挿入してください");

  if(branchCode != "false"){
    if(parentBlock === null){
      code = `
      // console.log("一度だけ" + "${branchCode}");
            //  logColoring("一度だけ" + "${branchCode}","behavior",logDiv);
            `
    }
    else{
      code = `["do","一度だけ${branchCode}"],`;
    }
  }

  return code;
};


javascript.javascriptGenerator.forBlock['exitType'] = function(block) {
  var code = '';
  var branchCode = javascript.javascriptGenerator.statementToCode(block, 'DO0') || "false";
  branchCode = branchCode.trim();
  var parentBlock = block.getParent();

  // ブロックが挿入されていない時の確認メッセージを出力
  checkForChildBlock(block,"DO0","「終わりに」ブロックに「動き」ブロックを挿入してください");

  if(branchCode != "false"){
    if(parentBlock === null){
      code = `
      // console.log("終わりに" + "${branchCode}");
              // logColoring("終わりに" + "${branchCode}","behavior",logDiv);
              `
    }
    else{
      code = `["exit","終わりに${branchCode}"],`;
    }
  }
  return code;
};
