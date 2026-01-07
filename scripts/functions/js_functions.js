

// 子ブロックの情報(input_value)を取得する関数
function getchildBlockvalue(block,x){
    var conditionCode =''
    conditionCode = javascript.javascriptGenerator.valueToCode(block, x,
      javascript.javascriptGenerator.ORDER_ATOMIC) || `false`;
      return conditionCode;
  }
  

  
// 子ブロックの情報(input_statement)を取得する関数
function getchildBlockStatment(block,x){
var branchCode =''
branchCode = javascript.javascriptGenerator.statementToCode(block, x) || '';
    return branchCode;
}



// フィールドごとにブロックが接続・挿入されているか確認する関数
function checkForChildBlock(block,name,errorMessage){
    var code = '';
    var Input = block.inputList.find(input => input.name === name); // nameのフィールドを特定する変数
    var insertCheck = Input.connection.targetConnection // 接続・挿入されているかを確認　nullなら接続されていない
  
    // ブロックが接続・挿入されていなければエラーメッセージを出力する
    if (insertCheck == null) {
      // console.log(errorMessage + "\n");
      logError(errorMessage,logDiv);
      hasInvalidBlocks = true; // ブロックが正しく接続できていないなら遷移やエフェクトが発生しないように制御
    //   logDiv.innerText += errorMessage + "\n";
    } 
  
    return code;
  }



// 終了状態に遷移後に出力するメッセージ
function handleExitState(){
  if (finalStateKey == true){
      // console.log("すでに終了状態に変わりました，これ以上状態を変えることはできません\n");
      // logMessage("------------------------------------------------------",logDiv);
      logError("現在の状態は終了状態です。システムはすでに終了しているため、これ以上状態を変更することはできません。",logDiv);
  }
}


// 親ブロックの存在を確認して挙動を変える関数
// 具体的には親ブロックが存在すれば親にcodeを渡す．親ブロックが存在しなければそのまま出力する
function processStateWithParentCheck(block,activity){
    var code = '';
    var parentBlock = block.getParent();
    // 親ブロックがないとき
    // 受け取った内容をそのまま出力する
    if(parentBlock === null){
        code = `// console.log("${activity}");`
    }
    // 親ブロックがあるとき
    // 受け取った内容を親に返す(親ブロックで受け取った内容に何かしらの内容を付け加えて出力する)
    else{
      code = activity;
    }  
    return code;
  }

currentCondition();

// 通常時に出力する(ボタン押下など)関数
function logMessage(message,logDiv) {
    // const logEntry = document.createElement('div');  // 新しいdiv要素を作成
    // logEntry.textContent = message;  // メッセージを設定
    // logDiv.appendChild(logEntry);  // logDivに追加
    logBuffer.push({ message, type: "normal" });
    logToTxt(`実行時ログ：${message}`);
  } 
  
// ブロック実行時に出力するメッセージを追加する関数
  function blocklogMessage(message,logDiv) {
    // const logEntry = document.createElement('div');  // 新しいdiv要素を作成
    // logEntry.textContent = message;  // メッセージを設定
    // logDiv.appendChild(logEntry);  // logDivに追加
    logBuffer.push({ message, type: "normal" });
  } 
  
  // エラーメッセージを追加する関数
  // 赤色でメッセージを出力する
  function logError(message,logDiv) {
    // const logEntry = document.createElement('div');  // 新しいdiv要素を作成+
    // logEntry.classList.add('log-entry', 'error');    // 'log-entry' と 'error' クラスを追加
    // logEntry.textContent = message;  // メッセージを設定
    // logDiv.appendChild(logEntry);  // logDivに追加
    // logToTxt(`実行時エラーログ：${message}`);
    logBuffer.push({ message, type: "error" });
  }

  // 色付きのメッセージを出力する関数
  function logColoring(message,type,logDiv) {
    const numberedMessage = `${logCount}. ${message}`; 
    logCount++; // 順番を増やす
    logBuffer.push({ message: numberedMessage, type});
    // const logEntry = document.createElement('div');  // 新しいdiv要素を作成+
    // logEntry.classList.add('log-entry',type );    // 'log-entry' と 'error' クラスを追加
    // logEntry.textContent = message;  // メッセージを設定
    // logDiv.appendChild(logEntry);  // logDivに追加
    // logToTxt(`実行時ログ：${message}`);
  }
  
  // まとめてメッセージを出力する関数
  function flushLog(logDiv) {
    if (logBuffer.length === 0) return;

    const box = document.createElement("div");
    box.classList.add("log-box");

    // 中身をまとめて作る
    let html = "";
    logBuffer.forEach(item => {
      html += `<div class="log-entry ${item.type}">${item.message}</div>`;
    });

    box.innerHTML = html;
    logDiv.appendChild(box); // ログ領域に追加
    logDiv.scrollTop = logDiv.scrollHeight // 一番下にスクロール

    // テキストログにもまとめて書く
    logToTxt("--- 実行ログ ---\n" + logBuffer.map(l => l.message).join("\n"));

    // バッファをクリア
    logBuffer = [];
    logCount = 1;
  }

// 現在の状態と変数の値を表示する領域
function currentCondition() {
    let testConditionText = "";
    let currentConditionText;
    let currentGuardValue = "";
    if(testKey == true){
      testConditionText = '<div style="text-align:center; color:red;">---------- 動作テスト中 ----------</div>';
    }
    if(hasInvalidBlocks == true){
        currentState = previousState;
    }
    currentConditionText = "現在の状態は：" + currentState + "\n";
    for (let i = 0; i < variableNames.length; i++){
      currentGuardValue += variableNames[i] + "の値は：" + variableNames[`variableKey${i}`] + "\n"; 
      if (Number.isNaN(variableNames[`variableKey${i}`])) {
        logError(variableNames[i] + "は数値として無効です",logDiv);
      }
      
    }
    
    
    currentStateDiv.innerHTML = testConditionText + currentConditionText + currentGuardValue;
  }



