/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


let classCode = ""; // 作成したクラスを格納するための変数
let currentState = ""; // 現在の状態を格納する変数
let previousState = ""; // 前回の状態を一時的に用いる変数
let currentTask = ""; // 現在の課題名を格納する変数
const STORAGE_KEY = "BlockSMWorkspace_"
let pbJson = []; // ワークスペース内のブロック情報を格納する(json形式)
let testKey = false; // テストボタンが押されたかを判断するために用いる，falseなら押されていない，trueなら押されている
let initialStateKey = false; // 初めの状態を更新する際に用いる，falseなら更新しない，trueなら更新
let finalStateKey = false; // 終了状態に遷移したかを判定する　falseなら遷移していない，trueなら遷移している
let switchKey = false; // swich case文を実現するための変数　
                       // この変数がfalseならcase文の確認を順に行う　trueならそれ以降のcase文の確認は行なわない
let eventIfKey = false; // eventの発生確認を行うswich case文を実現するための変数　
                        // この変数がfalseならcase文の確認を順に行う　trueならそれ以降のcase文の確認は行なわない  
let guardIfKey = false; // guardの発生確認を行うswich case文を実現するための変数　
                        // この変数がfalseならcase文の確認を順に行う　trueならそれ以降のcase文の確認は行なわない  
let hasInvalidBlocks = false; // エフェクトや次状態への遷移を制御する変数 ブロックが正しく配置されていない時などに使う
let logBuffer = []; // 実行中のログを一時的に貯める
let skipModelConversion = false; // モデルに変換できないミス(例えば，ブロックが配置されていないなど)はある場合はこの変数をtrueにして制御する
let undefinedStateNumber = 0; // 未定義の状態数を数える変数
let plantUmlText = ""; // ワークスペース情報がplantUML形式で格納される変数(サーバーとのresponse時に格納)
let isLogPanelVisible = false; // 実行ログパネルが表示されているか否かを格納する変数
let lastDefLogged = false; // 前回の探索時，初期状態が定義されているか確認する変数
let lastTransLogged = false; // 前回の探索時，初期状態からの遷移が定義されているか確認する変数
let hasInitialStateDefined = false; // 初期状態が二回以上定義されているかを確認する変数
const definedStateNamesInSwitch = []; // 「状態が～の時の動きは」ブロックに挿入される状態名を保持するset関数
const definedStateNamesInAction = []; // 「状態が～の時の動きは」ブロックに挿入される状態名を保持するset関数
let hasDuplicateStateInSwitch = false; // swichブロックにおいて状態が複数回定義されているかを確認する変数
let hasDuplicateStateInAction = false; // actionブロックにおいて状態が複数回定義されているかを確認する変数
let logCount = 1; // ログの順番を表示する変数
initCreateSaveItem(); // データの復元メニューをwebリロード時に追加
                      
// 退場動作を実現するための変数
// 退場動作は次の状態に遷移するタイミングで実行されるため～という状態に変わるブロックと連携して実装する
// let exitStatement = ""; // 退場遷移の処理内容を格納する変数
// let exitKey = false; // 前回の状態に退場動作が状態に含まれていたかを判定する　falseなら含まれていない，trueなら含まれている
// let exitState = "";

// logarea(コンソールに出力される内容を取得して出力するための領域)にログを出力すための変数
let logDiv = document.getElementById("log-area");
let currentStateDiv = document.getElementById("current-state-area");

// 動きに関するログ
// const logContainer = document.getElementById("behaiviorLog");
// const imgContainer = document.getElementById("behaiviorImage");


// 要求文に依存する鍵
// let heatingkey = false;  //trueは押さた時，falseは押されていない時
// let powerswitchKey = false; //trueなら電源スイッチボタンが押された，falseなら電源スイッチが押されていない
// let powerswitchstate = false; //trueは電源ON，falseは電源OFF
// let ignitekey = false; // 点火されているかを判定するtrueは点火済み，falseは点火していない
// let fankey = false; // 換気扇がついているかを判定するtrueは回っている，falseは回っていない

// errorkeyは要求文に依存する事柄を制御するときに用いる(自動化への障害が考えられる)
// let effecterrorkey = false; // エラー発生時に予期せぬ問題を避ける ただし使用後は必ずfalseにもどすこと
// let motionRuleserrorkey = false; // エラー発生時に予期せぬ問題を避ける ただし使用後は必ずfalseにもどすこと


(function () {
  let currentButton;

  // function handlePlay(event) {
  //   // Add code for playing sound.
  //   loadWorkspace(event.target);
  //   let code = javascript.javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
  //   try {
  //     eval(code);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // function save(button) {
  //   // Add code for saving the behavior of a button.
  //   blocklySave = Blockly.serialization.workspaces.save(Blockly.getMainWorkspace());
  // }

  // saveボタンが押されたときに実行される
  function handleSave() {
    document.body.setAttribute('mode', 'blockly');
    // save(currentButton);
  }

  // function checkBlocksAndHandleEvent() {
  //   const workspace = Blockly.getMainWorkspace(); // ワークスペースの情報を取得する関数
  // } 

  

  // // editボタンが押されたときに実行される
  // function enableEditMode() {
  //   document.body.setAttribute('mode', 'edit');
  //   document.querySelectorAll('.button').forEach((btn) => {
  //     btn.removeEventListener('click', handlePlay);
  //     btn.addEventListener('click', enableBlocklyMode);
  //   });
  // }
  document.body.setAttribute('mode', 'blockly'); //初めに開くモードを設定

  // doneボタンが押されたときに実行される
  function enableMakerMode() {
    // document.body.setAttribute('mode', 'blockly'); //初めに開くモードを設定
    // document.querySelectorAll('.button').forEach((btn) => {
    //   btn.addEventListener('click', handlePlay);
    //   btn.removeEventListener('click', enableBlocklyMode);
    // });
  }


  // function enableBlocklyMode(e) {
  //   document.body.setAttribute('mode', 'blockly');
  //   currentButton = e.target;
  // }

  // function loadWorkspace(button) {
  //   const workspace = Blockly.getMainWorkspace();
  //   if (button.blocklySave) {
  //     Blockly.serialization.workspaces.load(button.blocklySave, workspace);
  //   } else {
  //     workspace.clear();
  //   }
  // }
  
  // document.querySelector('#edit').addEventListener('click', enableEditMode);
  // document.querySelector('#done').addEventListener('click', enableMakerMode);
  // document.querySelector('#save').addEventListener('click', handleSave);

  // ボタンが押されたときの処理
  // アロー関数を用いて関数を設定＆クリック時にhandleEventActionを呼び出す
  // 直接handleEventAction(0)と呼びだすと即時実行されてしまうので，この書き方とする
  document.querySelector('#behavior-inspector').addEventListener('click', functionalTest);
  document.querySelector('#reset-control').addEventListener('click', resetLogData);
  // document.querySelector('#nonEvent').addEventListener('click', handleNonEventAction);
  document.getElementById('restoreMenu').addEventListener('change', handleRestoreChange);
  document.getElementById('taskSelect').addEventListener('change', handleTaskChange);

  // ログのイベントリスナー
  document.querySelector('#logGet').addEventListener('click',  handleLogGet);
  document.getElementById("closeLogPanel").addEventListener("click", hideLogPanel);
// const logPanel = document.getElementById("logPanel");

  // 色を変えるイベントリスナー
  document.addEventListener("paste", (e) => {handlePasteShortcut(e)});
  document.addEventListener("keydown", (e) => {
    handleUndoShortcut(e);
    handleRedoShortcut(e);
  });


  document.querySelector('#addNameButton').addEventListener('click',createSaveItem);
  document.querySelector('#deleteButton').addEventListener('click',deleteSaveItem);
  document.querySelector("#saveButton").addEventListener('click', () => {
  displayStyle("inputSaveNameContainer","saveNameInput")});
  document.querySelector("#deleteRestoreButton").addEventListener('click', () => {
  displayStyle("inputdeleteNameContainer","deleteNameInput")})
  // document.querySelector("#pbToPuml").addEventListener('click',stmbpToPuml)
  document.getElementById("blockGuidance").addEventListener("click", openGuidancePanel);
  document.getElementById("closeGuidance").addEventListener("click", function () {
  document.getElementById("guidancePanel").classList.remove("open");});
  // ガイダンスパネルの幅を変える
  setupPanelResize("guidancePanel", ".resize-handle", 480, 1000);

  // ガイダンスを表示する
  document.querySelectorAll(".toggle-step button").forEach(container => {
    container.addEventListener("click", event => {
        if (event.target.tagName === "BUTTON") {
          const id = event.target.id;
          showGuidance(id);
        }
    });
  });

  



  // document.querySelector("#deleteRestoreButton").addEventListener('click',handelDeleteMenu); // 削除ボタンにアクセス
  // document.getElementById('#createSave').addEventListener('click',createSaveItem)

  // document.querySelector('#saveData').addEventListener('click', saveData);


  // // 変更イベントリスナーを追加
  // workspace.addChangeListener(function(event) {
  //     if (event.type === Blockly.Events.SELECTED) { 
  //         var block = workspace.getBlockById(event.newValue); // クリックされたブロックを取得

  //     }
  // });


  enableMakerMode();
})();

// 各カテゴリごとにブロックの中身(厳密には色)を初期化する
let behaviorColourNumber_list = new Array(behaviorNames.length).fill(0);  
let eventColourNumber_list = new Array(eventNames.length + eventTypes.length).fill(0);  
let guardColourNumber_list = new Array(guardTypes.length).fill(0);  
let effectColourNumber_list = new Array(effectNames.length + effectTypes.length).fill(0); 
let variableColourNumber_list = new Array(variableNames.length).fill(0);
let colourNumber_list = [swichColorNumberList,transitionColorNumberList,stateColorNumberList,
  motionRulesColorNumberList,behaviorColourNumber_list,eventColourNumber_list,
                         guardColourNumber_list,effectColourNumber_list,variableColourNumber_list];


// 各カテゴリが持つ要素分だけの長さをもつ配列を作成(ブロックの色の設定で用いる)
function updateColorNumberList(){
  behaviorColourNumber_list = new Array(behaviorNames.length).fill(0);  
  eventColourNumber_list = new Array(eventNames.length + eventTypes.length).fill(0);  
  guardColourNumber_list = new Array(guardTypes.length).fill(0);  
  effectColourNumber_list = new Array(effectNames.length + effectTypes.length).fill(0); 
  variableColourNumber_list = new Array(variableNames.length).fill(0);
  colourNumber_list = [swichColorNumberList,transitionColorNumberList,stateColorNumberList,
  motionRulesColorNumberList,behaviorColourNumber_list,eventColourNumber_list,
                         guardColourNumber_list,effectColourNumber_list,variableColourNumber_list];
}



// ツールボックスを定義する関数
function addCategoryToBox(){
  // 各カテゴリに入るブロックが存在しない場合は，カテゴリを追加しないものとする
  // カテゴリボックスを定義する
  let toolbox = {
    'kind': 'categoryToolbox',
    'contents':[
      {
        'kind':'category',
        'name':'切り替え',
        'categorystyle': 'switch_category',
        "custom": "swich_COLOUR_PALETTE",
        'contents': [
        ]
      },
      {
        "kind": "category",
        "name": "きっかけ",
        'categorystyle': 'transition_category',
        "custom": "transition_COLOUR_PALETTE",
        "contents": [
        ]
      },
      {
        'kind':'category',
        'name':'状態',
        'categorystyle': 'state_category',
        "custom": "state_COLOUR_PALETTE",
        'contents': [
        ]
      }
    ]
  };

  if (behaviorNames.length != 0){
    toolbox.contents.push({
        'kind':'category',
        'name':'動きのきまり',
        'categorystyle': 'motionRules_category',
        "custom": "motionRules_COLOUR_PALETTE",
        'contents': []
      });
    toolbox.contents.push({
        'kind':'category',
        'name':'動き',
        'categorystyle': 'behavior_category',
        "custom": "behavior_COLOUR_PALETTE",
        'contents': []
      });
  }

  if (eventNames.length != 0){
    toolbox.contents.push({
        'kind':'category',
        'name':'イベント',
        'categorystyle': 'trigger_category',
        "custom": "event_COLOUR_PALETTE",
        'contents': []
      });
  }

  if (guardNames.length != 0){
    toolbox.contents.push({
        'kind':'category',
        'name':'条件',
        'categorystyle': 'guard_category',
        "custom": "guard_COLOUR_PALETTE",
        'contents': []
      });
  }

  if (effectNames.length != 0 || guardNames.length != 0){
    toolbox.contents.push({
        'kind':'category',
        'name':'作用',
        'categorystyle': 'effect_category',
        "custom": "effect_COLOUR_PALETTE",
        'contents': []
      });
  }

  if (variableNames.length != 0){
    toolbox.contents.push({
        'kind':'category',
        'name':'変数',
        'categorystyle': 'variable_category',
        "custom": "variable_COLOUR_PALETTE",
        'contents': []
      });
  }

  return toolbox;
}


const theme = Blockly.Theme.defineTheme('customTheme', {
  'base': Blockly.Themes.Classic, // ベーステーマを指定
  'blockStyles': {
      'logic_blocks': {
          'colourPrimary': '#4a148c', // ロジックブロックの主色
          'colourSecondary': '#6a1b9a', // ロジックブロックの副色
          'colourTertiary': '#7b1fa2' // ロジックブロックの三次色
      },
      'math_blocks': {
          'colourPrimary': '#0d47a1' // 数学ブロックの主色
      },
      // 他のブロックスタイルを追加
  },
  'categoryStyles': {
      'switch_category': {
          'colour': '#800080'
      },
      'transition_category': {
          'colour': '#FFA500'
      },
      'state_category': {
          'colour': '#FF69B4'
      },
      'trigger_category': {
          'colour': '#FF0015'
      },
      'guard_category': {
          'colour': 'green'
      },
      'effect_category': {
          'colour': '#32CD32'
      },
      'motionRules_category': {
          'colour': 'blue'
      },
      'behavior_category': {
          'colour': '#00BFFF'
      },
      'variable_category': {
          'colour': '#8B4513'
      },
  },
  'componentStyles': {
      'toolbox': {
          'backgroundColour': '#f0f0f0', // ツールボックスの背景色
          'borderColour': '#b0bec5', // ツールボックスの境界色
      }
  },
  'fontStyle': {
      'family': 'sans-serif', // フォントファミリー
      'size': 16, // フォントサイズ
      'weight': 'normal' // フォントの太さ
  },
  'startHats': true // スタートハットを表示
});

let blockspace;

// カテゴリボックスを定義する関数
function defineCategoryBox(toolbox){
  if (Blockly.getMainWorkspace()) {
    Blockly.getMainWorkspace().dispose(); // 既存のワークスペースを破棄
  }
  Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    theme: theme,
    scrollbars: true,
    horizontalLayout: false,
    toolboxPosition: "start",
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    }
  });

  defineBlockspaceEventListener();
}


// 警告文を消す(ブロックの再定義に関する警告文)
const originalConsoleWarn = console.warn;
// console.warn をオーバーライドして警告を抑制
  console.warn = function(message, ...args) {
  if (message && message.includes('Block definition')) {
    return;  // 'Block definition' を含む警告は表示しない
  }
  originalConsoleWarn.apply(console, [message, ...args]);
};

// ブロックの選択時に選ばれたブロックIDと名前を保存しておく変数　
// selectedにおいてブロックの選択・解除で用いる
let temporaryBlockType;
let blockText;

// ブロックスペースが切り替わるたびにイベントリスナーを設定する関数
function defineBlockspaceEventListener(){
  // ブロックスペースを変更するときは以前のブロックスペースで設定されたイベントリスナーを削除する
  if (blockspace) {
    blockspace.removeChangeListener(monitorEventType);
  }

  blockspace = Blockly.getMainWorkspace(); // ワークスペースの情報を取得する

  if (blockspace) {
    blockspace.addChangeListener(monitorEventType);
  }
}

// イベントタイプを監視する
function monitorEventType(event) {
  // console.log(event.type)
  let selectedBlockId = event.blockId; // 選択されたブロックのIDを取得
  if (event.type == "selected"){
    selectedBlockId = event.newElementId;
    if (selectedBlockId) {
        let block = blockspace.getBlockById(selectedBlockId); // ブロックIDからブロックを取得
        if (block){
          temporaryBlockType = block.type;
          blockText = `${block.type}, 「${normalizeQuestionMarks(block.toString())}」`;
          logToTxt("選択：" + blockText);
          initBlockKeyOnClick();
          setBlockKeyOnClick(block); // ブロック内で選択されたことを記録
          boostOpacity(opaqueBlockTypes.map.get(temporaryBlockType)); // ブロックの色を変える
          resetColor();
        }
    }
    else{
      // 一度ワークスペース内のブロックの;dataプロパティを初期化
      initBlockKeyOnClick();
      logToTxt("解除：" + blockText);
      resetcomponent(swichColorNumberList,transitionColorNumberList,stateColorNumberList,motionRulesColorNumberList,behaviorColourNumber_list,eventColourNumber_list,guardColourNumber_list,effectColourNumber_list,variableColourNumber_list);
    }
  }
  else if(event.type == "move"){
    moveAnalyze(event);
  }
  // delete
  else if(event.type == "delete"){
    if (selectedBlockId) {
      let block = blockspace.getBlockById(selectedBlockId); // ブロックIDからブロックを取得
      if (block){
        blockText = `${block.type}, 「${normalizeQuestionMarks(block.toString())}」`;
      }
    }
    logToTxt("削除：" + blockText);
  }
  // click
  // else if(event.type == "click"){
  //   console.log("クリックは" + event.blockId)
  //   if (selectedBlockId) {
  //     let block = blockspace.getBlockById(selectedBlockId); // ブロックIDからブロックを取得
  //     if (block){
  //       blockText = block.toString();
  //     }
  //   }
  //   logToTxt("クリック：「" + blockText + "」");
  // }
  // drag
  else if(event.type == "drag"){
    if (selectedBlockId) {
      let block = blockspace.getBlockById(selectedBlockId); // ブロックIDからブロックを取得
      if (block){
        blockText = `${block.type}, 「${normalizeQuestionMarks(block.toString())}」`;
      }
    }
    logDrag("ドラッグ：" + blockText);
  }
  // create
  else if(event.type == "create"){
    if (selectedBlockId) {
      let block = blockspace.getBlockById(selectedBlockId); // ブロックIDからブロックを取得
      if (block){
        blockText = `${block.type}, 「${normalizeQuestionMarks(block.toString())}」`;
      }
    }
    logToTxt("作成：" + blockText);
    resetColor();
  }
  else if(event.type == "change"){
    if (selectedBlockId) {
      let block = blockspace.getBlockById(selectedBlockId); // ブロックIDからブロックを取得
      if (block){
        blockText = `${block.type}, 「${normalizeQuestionMarks(block.toString())}」`;
      }
    }
    logToTxt("文字入力：" + blockText);
  }
  // trashcan_open
  else if(event.type == "trashcan_open"){
    logToTxt("ゴミ箱");
  }
  // toolbox_item_select
  else if(event.type == "toolbox_item_select"){
    logToTxt("カテゴリボックス");
  }
  else if (event.type === "viewport_change") {
    logViewportChange();
  }
}



defineBlockspaceEventListener(); // 最初のワークスペースに対してイベントリスナーを設定

function moveAnalyze(event){
  // if (event.type === Blockly.Events.BLOCK_MOVE) {
    const movedBlock = Blockly.getMainWorkspace().getBlockById(event.blockId);

    if(movedBlock != null){
        let movedBlockText = movedBlock.toString();
      // 接続された場合
      if (event.newParentId && !event.oldParentId) {
        // const parentBlockText = (Blockly.getMainWorkspace().getBlockById(event.newParentId)).toString();
        // logToTxt(`移動：「${movedBlockText} 」が接続`)
        const parentBlock = Blockly.getMainWorkspace().getBlockById(event.newParentId);
        const parentBlockText = parentBlock ? parentBlock.toString() : "不明ブロック";
        const inputName = event.newInputName || "上下";
        logToTxt(`移動：${movedBlock.type}, 「${movedBlockText}」が「${parentBlockText}」の「${inputName}」に接続`);
      }

      // 切断された場合
      else if (!event.newParentId && event.oldParentId) {
        const oldParentBlock = Blockly.getMainWorkspace().getBlockById(event.oldParentId);
        const oldParentBlockText = oldParentBlock ? oldParentBlock.toString() : "(親なし)";
        logToTxt(`移動：${movedBlock.type}, 「${movedBlockText} 」が「 ${oldParentBlockText} 」から切断`)
      }

      // 単なる位置移動の場合
      else if (!event.newParentId && !event.oldParentId) {
        logToTxt(`移動：${movedBlock.type}, 「${movedBlockText} 」（未接続）`)
      }
    }
}








// 最初に必要な処理をおこなう関数
function prepareSession(){
  const firstTaskName = Object.keys(astahData)[0];
  currentTask = firstTaskName; // 現在のタスク名を変更
  // イベントボタンの設定
  createEventButton(astahData[firstTaskName].event); // 初めの課題のボタンの追加

  // ブロックおよびワークスペースの変更
  updateBlockElements(firstTaskName); // 要求文に依存する要素の再定義
  defineCategoryBox(addCategoryToBox()); // カテゴリボックスを定義
  updateColorNumberList(); // カラーナンバーの再定義
  defineCategoryTypes(swichColorNumberList,transitionColorNumberList,stateColorNumberList,motionRulesColorNumberList,behaviorColourNumber_list,eventColourNumber_list,guardColourNumber_list,effectColourNumber_list,variableColourNumber_list);
  resetcomponent(swichColorNumberList,transitionColorNumberList,stateColorNumberList,motionRulesColorNumberList,behaviorColourNumber_list,eventColourNumber_list,guardColourNumber_list,effectColourNumber_list,variableColourNumber_list); 
  opaqueBlockChange();

  // 保存したデータの表示変更
  initCreateSaveItem(); // 今回の課題の保存メニューを追加
}


