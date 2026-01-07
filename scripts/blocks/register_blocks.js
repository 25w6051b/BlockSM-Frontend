let categorytypes;

// ブロックの色を定義する関数
function defineCategoryTypes(swichColorNumberList,transitionColorNumberList,stateColorNumberList,motionRulesColorNumberList,behaviorColourNumber_list,eventColourNumber_list,guardColourNumber_list,effectColourNumber_list,variableColourNumber_list) {
  categorytypes = [
    reset_switch(blockspace,swichColorNumberList).map(block => ({ type: block.type, number: 1 })),
    reset_transition(blockspace,transitionColorNumberList).map(block => ({ type: block.type, number: 1 })),
    reset_state(blockspace,stateColorNumberList).map(block => ({ type: block.type, number: 1 })),
    reset_motionRules(blockspace,motionRulesColorNumberList).map(block => ({ type: block.type, number: 1 })),
    reset_behavior(blockspace,behaviorColourNumber_list).map(block => ({ type: block.type, number: 1 })),
    reset_event(blockspace,eventColourNumber_list).map(block => ({ type: block.type, number: 1 })),
    reset_guard(blockspace,guardColourNumber_list).map(block => ({ type: block.type, number: 1 })),
    reset_effect(blockspace,effectColourNumber_list).map(block => ({ type: block.type, number: 1 })),
    reset_variable(blockspace,variableColourNumber_list).map(block => ({ type: block.type, number: 1 }))
  ];
}




// 各ブロックタイプにおいて繋げられるブロックタイプを記載
let opaqueBlockTypes = {}

// 課題ごとに対応するブロックを決める関数
function opaqueBlockChange(){
    opaqueBlockTypes = {
    map: new Map([
      ["firstDefinitionType", ["switchIfType"]],
      ["switchIfType", ["firstDefinitionType", "switchElseIfType", "stateActionType", "changeStateType", "customControlsIfType", "guardIfType", "effectType", "initialStateType", "stateDefinitionType"]],
      ["switchElseIfType", ["switchIfType", "switchElseIfType", "stateActionType", "changeStateType", "customControlsIfType", "guardIfType", "effectType", "initialStateType", "stateDefinitionType"]],
      ["stateActionType", ["switchIfType", "switchElseIfType", "stateActionType","stateDefinitionType", "entryType", "doContinuousType", "doOnetimeType", "exitType"]],
      ["changeStateType", ["switchIfType", "switchElseIfType", "customControlsIfType", "customControlsElseIfType", "finalStateType", "stateDefinitionType", "guardIfType", "guardElseIfType", "effectType"]],
      ["customControlsIfType", ["switchIfType", "switchElseIfType", "customControlsElseIfType", "guardIfType", "effectType", "changeStateType"]],
      ["customControlsElseIfType", ["switchIfType", "switchElseIfType", "customControlsIfType", "guardIfType", "effectType", "changeStateType"]],
      // ["customControlsIfType", ["switchIfType", "switchElseIfType", "customControlsElseIfType", "completeEvent", "guardIfType", "effectType", "changeStateType"]],
      // ["customControlsElseIfType", ["switchIfType", "switchElseIfType", "customControlsIfType", "completeEvent", "guardIfType", "effectType", "changeStateType"]],
      ["guardIfType", ["switchIfType", "switchElseIfType", "customControlsIfType", "customControlsElseIfType", "guardElseIfType", "effectType", "changeStateType","checkComputationType","logicalOperationsType","NegationType"]],
      ["guardElseIfType",["guardIfType","effectType", "changeStateType","checkComputationType","logicalOperationsType","NegationType"]],
      ["effectType", ["switchIfType", "switchElseIfType", "customControlsIfType", "customControlsElseIfType", "guardIfType","guardElseIfType", "changeStateType","valueChangeType"]],
      ["initialStateType", ["switchIfType", "switchElseIfType"]],
      ["finalStateType",["changeStateType"]],
      ["stateDefinitionType", ["switchIfType", "switchElseIfType", "changeStateType", "stateActionType"]],
      ["entryType", ["stateActionType", "doContinuousType", "doOnetimeType", "exitType"]],
      ["doContinuousType", ["stateActionType", "entryType", "exitType"]],
      ["doOnetimeType", ["stateActionType", "entryType", "exitType"]],
      ["exitType", ["stateActionType", "entryType", "doContinuousType", "doOnetimeType"]],
      // ["completeEvent",["customControlsIfType","customControlsElseIfType"]],
      ["checkComputationType",["guardIfType","guardElseIfType","logicalOperationsType"]],
      ["logicalOperationsType",["guardIfType","guardElseIfType","checkComputationType","NegationType"]],
      ["NegationType",["guardIfType","guardElseIfType","checkComputationType"]],
      ["valueChangeType",["effectType"]]
    ])
  };



  // opaquelistのブロックタイプは要求文に依存したブロックと繋げられるため別で定義する
  opaquelist = [["entryType", "doContinuousType", "doOnetimeType","exitType"],
                ["customControlsIfType","customControlsElseIfType"],
                ["effectType"],
                ["checkComputationType","valueChangeType","NegationType"]]

  // 要求文に依存するブロックと関連したブロックタイプをopaqueBlockTypesに追加するための処理
  // (関連したブロックタイプはすでにopaqueBlockTypesで定義しているが，要求文に依存するブロックはまだ追加できていないのでここで追加)
  // 要求文に依存するブロックはbehavior,event,effect,variableの4つなので4回繰り返す
  for (let i = 0; i < 4; i++){
    const uniqueBlocks = uniqueblocks_definision(i);
    const uniqueBlockTypes = uniqueBlocks.map(block => block.type);
    // behavior,event,effect,variableの子ブロックは対応する親ブロックを要求文ごとに追加
    for (let j = 0; j < uniqueBlocks.length; j++){
      opaqueBlockTypes.map.set(uniqueBlockTypes[j],opaquelist[i]);
      // 変数ブロックはガード，エフェクトとも繋がるためif文で制御し，opaqueBlockTypesに追加
      // if(i == 2){
      //   opaqueBlockTypes.map.get(uniqueBlockTypes[j]).push("valueChangeType");
      //   opaqueBlockTypes.map.get("valueChangeType").push(uniqueBlockTypes[j]);
      // }
    }
    // event,guard,effect,behaviorの親ブロックは対応する子ブロックを要求文ごとに追加(opaquelistの各要素に対して追加しなければならない)
    // opaquelist[i] の各要素に対してブロックタイプを追加
    uniqueBlockTypes.forEach(type => {
      opaquelist[i].forEach(category => {
        opaqueBlockTypes.map.get(category)?.push(type);  // categoryが未定義ならスキップ
      });
    });
  }
}



function uniqueblocks_definision(index){
  var blockList = [[],[],[],[]];
  let statemachine_component = [["behavior",behaviorNames],["event",eventNames],["effect",effectNames],["variable",variableNames]];

  // variable_settingで設定したブロックを定義
  for (let i = 0; i < statemachine_component.length; i++){
    let component = statemachine_component[i];
    for(let j = 0; j < component[1].length; j++){
      blockList[i].push({
        'kind': 'block',
        'type': component[0] + `${j}` // 各要素ごとに番号を付けて実装
      });
    }
  }
  return blockList[index];
}


function reset_behavior(blockspace,indexlist){
  Blockly.defineBlocksWithJsonArray(behaviorDefinision(indexlist));
  return uniqueblocks_definision(0);
}

function reset_variable(blockspace,indexlist){
  Blockly.defineBlocksWithJsonArray(variableDefinition(indexlist));
  return uniqueblocks_definision(3);
}

function reset_event(blockspace,indexlist){
  var blockList = [];
  Blockly.defineBlocksWithJsonArray(eventDefinision(indexlist));
  blockList = uniqueblocks_definision(1);
  for(let i = 0;i < eventTypes.length; i++){
    blockList.push(
        {
        'kind':'block',
        'type':eventTypes[i],
        }
      );
  }
  return blockList;
}

function reset_guard(blockspace,indexlist){
  var blockList = [];
  Blockly.defineBlocksWithJsonArray(guardDefinision(indexlist));
  // blockList = uniqueblocks_definision(2);
  // ガードが存在しなければ演算式も追加しない
  if (guardNames.length != 0){
    for(let i = 0;i < guardTypes.length; i++){
      blockList.push(
          {
          'kind':'block',
          'type':guardTypes[i],
          }
        );
    }
  }
  return blockList;
}

function reset_effect(blockspace,indexlist){
  Blockly.defineBlocksWithJsonArray(effectDefinision(indexlist));
  blockList = uniqueblocks_definision(2);
  // ガードが存在しなければ演算式も追加しない
  if (guardNames.length != 0){
    for(let i = 0;i < effectTypes.length; i++){
      blockList.push(
          {
          'kind':'block',
          'type':effectTypes[i],
          }
        );
    }
  }
  return blockList;
}


function reset_state(blockspace,indexlist){
  Blockly.defineBlocksWithJsonArray(stateDefinition(indexlist));
  var blockList = [];
  for(let i = 0;i < stateTypes.length; i++){
    blockList.push(
      {
      'kind':'block',
      'type':stateTypes[i],
      }
    );
  }
  return blockList;
}

function reset_switch(blockspace,indexlist){
  Blockly.defineBlocksWithJsonArray(swichDefinition(indexlist));
  var blockList = [];
  for(let i = 0;i < switchTypes.length; i++)
  blockList.push(
    {
      'kind':'block',
      'type':switchTypes[i],
    }
  );
  return blockList;
}


function reset_transition(blockspace,indexlist){
  Blockly.defineBlocksWithJsonArray(transitionDefinition(indexlist));

  var blockList = [];
  for(let i = 0;i < transitionTypes.length; i++){
      blockList.push(
        {
          'kind':'block',
          'type':transitionTypes[i],
        }
      );
  }
  return blockList;
}

function reset_motionRules(blockspace,indexlist){
  Blockly.defineBlocksWithJsonArray(motionRulesDefinition(indexlist));
  var blockList = [];
  // 振る舞いが存在しなければフロー制御も追加しない
  if (behaviorNames.length != 0){
    for(let i = 0;i < motionRulesTypes.length; i++)
    blockList.push(
      {
        'kind':'block',
        'type':motionRulesTypes[i],
      }
    );
  }
  return blockList;
}




function resetcomponent(swichColorNumberList,transitionColorNumberList,stateColorNumberList,motionRulesColorNumberList,behaviorColourNumber_list,eventColourNumber_list,guardColourNumber_list,effectColourNumber_list,variableColourNumber_list){
  colourNumber_list.forEach(list => {
    list.forEach((_, index) => {
      list[index] = 0;  // 各要素を 0 に設定
    });
  });


  blockspace.registerToolboxCategoryCallback('swich_COLOUR_PALETTE',() => reset_switch(blockspace,swichColorNumberList));
  blockspace.registerToolboxCategoryCallback('transition_COLOUR_PALETTE', () => {
    let transitionBlocks = reset_transition(blockspace,transitionColorNumberList);
    // ガードブロックが存在しない場合は，「ガードブロックを入れるブロック」は削除する
    if(guardNames.length == 0){
      transitionBlocks = transitionBlocks.filter(block => block.type != "guardIfType" && block.type != "guardElseIfType");
    }
    // イベントブロックが存在しない場合は，「イベントブロックを入れるブロック」は削除する
    if(eventNames.length == 0){
      transitionBlocks = transitionBlocks.filter(block => block.type != "customControlsIfType" && block.type != "customControlsElseIfType");
    }
    // エフェクトブロックが存在しない場合は，「エフェクトブロックを入れるブロック」は削除する(ただし，本ツールはガードがある場合，エフェクトブロックがないと操作できないの，ガードブロックがないかも確認する)
    if(effectNames.length == 0 && guardNames.length == 0){
      transitionBlocks = transitionBlocks.filter(block => block.type != "effectType");
    }
    return transitionBlocks;
  });
  blockspace.registerToolboxCategoryCallback('state_COLOUR_PALETTE',() =>  reset_state(blockspace,stateColorNumberList));
  blockspace.registerToolboxCategoryCallback('motionRules_COLOUR_PALETTE', () => reset_motionRules(blockspace,motionRulesColorNumberList));
  blockspace.registerToolboxCategoryCallback('behavior_COLOUR_PALETTE', () => reset_behavior(blockspace,behaviorColourNumber_list));
  blockspace.registerToolboxCategoryCallback('event_COLOUR_PALETTE', () => reset_event(blockspace,eventColourNumber_list)); 
  blockspace.registerToolboxCategoryCallback('guard_COLOUR_PALETTE', () => reset_guard(blockspace,guardColourNumber_list));
  blockspace.registerToolboxCategoryCallback('effect_COLOUR_PALETTE', () => reset_effect(blockspace,effectColourNumber_list));
  blockspace.registerToolboxCategoryCallback('variable_COLOUR_PALETTE', () => reset_variable(blockspace,variableColourNumber_list));
}


prepareSession();  // 最初に一つ目の課題に対してサイトを作る
