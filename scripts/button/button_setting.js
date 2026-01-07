
// 画面上のイベントボタンを作成する関数
function createEventButton(eventNames){
    if (eventNames.length > 0){
        const container = document.querySelector('.button-group');
        for (let i = 0; i < eventNames.length; i++){
            const button = document.createElement('button');
            button.classList.add('mode-blockly','mdl-button', 'mdl-js-button', 'mdl-button--raised', 'button','event-button');  // 必要なクラスを追加
            button.id = `event${i}`;  // IDを設定
            button.textContent = eventNames[i];  // ボタンのテキストを設定
            container.appendChild(button);
            setupEventButtonListeners(eventNames,i)
        }
    }
}

// イベントボタンにイベントリスナーを設定する関数
function setupEventButtonListeners(eventNames,num){
    eventNames[`eventKey${num}`] = false; // イベントごとにキーを振りなおす
    const button = document.querySelector(`#event${num}`);
    if (!button.dataset.listenerAdded) {
        button.addEventListener('click', () => handleEventAction(eventNames, num));
        button.dataset.listenerAdded = "true";
    }
}


// 画面上のイベントボタンを削除する関数(課題を変更するときに使用)
function deleteEventButton(eventNames){
    const container = document.querySelector('.button-group'); // ボタンの親コンテナを取得
    const buttons = container.querySelectorAll('button'); // コンテナに含まれるすべてのボタンを取得
    // 各ボタンの情報を取得
    for (let button of buttons){
        // ボタンのid名に"event"が含まれているか確認
        if (button.id.includes("event")){
            container.removeChild(button); // ボタンを削除
        }
    }
}


let completeEventKey = false;


// イベントボタンが押されたときの処理を設定する関数
function handleEventAction(eventNames,eventnumber){
    if(testKey == true){
        if(currentState == "終了状態"){
            handleExitState();
            flushLog(logDiv); // 実行ログを出力する
        }
        else{
            eventNames[`eventKey${eventnumber}`] = true;
            logToTxt("「" + eventNames[eventnumber] + "」というイベントを起こして実行しました");
            // logMessage("------------------------------------------------------",logDiv);
            logMessage("「" + eventNames[eventnumber] + "」というイベントを起こして実行しました",logDiv);

            let temporaryState = currentState;
            let code = javascript.javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
            codea = classCode + code;
            try {
                // console.log(codea);
                eval(codea);
                currentCondition();
            } catch (error) {
                console.log(error);
            }
            classCode = "";
            flushLog(logDiv); // 実行ログを出力する
            eventNames[`eventKey${eventnumber}`] = false;  
            hasInvalidBlocks = false; // ボタンが押されるたびにブロックが正しく接続されているか確認するため
        }
    }
    else {
        logToTxt("まず「テスト」ボタンを押してください");
        // logMessage("------------------------------------------------------",logDiv);
        logMessage("まず「テスト」ボタンを押してください",logDiv);
        flushLog(logDiv); // 実行ログを出力する
    }
}



// // 「イベントなし」ボタンが押されたときの処理を設定する関数
// function handleNonEventAction(eventnumber){
//     if(testKey == true){
//         if(currentState == "終了状態"){
//             handleExitState();
//         }
//         else{
//             completeEventKey = true;
//             logToTxt("イベントを起こさずに実行しました");
//             logMessage("------------------------------------------------------",logDiv);
//             logMessage("イベントを起こさずに実行しました",logDiv);

//             let temporaryState = currentState;
//             let code = javascript.javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
//             codea = classCode + code;
//             try {
//             console.log(codea);
//                 eval(codea);
//             currentCondition();
//             } catch (error) {
//                 console.log(error);
//             }
//             classCode = "";
//             completeEventKey = false;
//             hasInvalidBlocks = false; // ボタンが押されるたびにブロックが正しく接続されているか確認するため
//         }
//     }
//     else {
//         logToTxt("まず「テスト」ボタンを押してください");
//         logMessage("------------------------------------------------------",logDiv);
//         logMessage("まず「テスト」ボタンを押してください",logDiv);
//     }
// }

let testPressedKey = 0;



// 「動作テスト」ボタンが押されたときに実行される
function functionalTest() {
    showLogPanel() // ログ領域を表示する
    // 「動作テスト」ボタンがまだ押されていないとき
    if(testKey == false){
        testKey = true;
        completeEventKey = true;

        logToTxt("「動作テスト」ボタンが押されました");
        // logMessage("------------------------------------------------------",logDiv);
        logMessage("動作テストボタンが押されました",logDiv);

        // 実行前に複数の状態が定義されていないか確認する
        // 複数定義されていれば実行せずにエラーを出力する
        if(hasDuplicateStateInSwitch == true || hasDuplicateStateInAction == true){
            // swich文において複数の状態が定義されているとき
            if(hasDuplicateStateInSwitch == true){
                logError("同じ状態は複数回定義できません",logDiv);
                logError("「今の状態が～のとき」もしくは「ではなく，今の状態が～のとき」ブロックにおいて同じ状態名が定義されています．",logDiv);
            }
            // action文において複数の状態が定義されているとき
            if(hasDuplicateStateInAction == true){
                logError("同じ状態は複数回定義できません",logDiv);
                logError("「状態が～のときの動きは」ブロックにおいて同じ状態名が定義されています．",logDiv);
            }
        }
        else {
            // let temporaryState = currentState;
            let code = javascript.javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
            codea = classCode + code;
            try {
                // console.log(codea);
                eval(codea);
                currentCondition();
            } catch (error) {
                console.log(error);
            }
            classCode = "";
            flushLog(logDiv); // 実行ログを出力する
            completeEventKey = false;
            hasInvalidBlocks = false; // ボタンが押されるたびにブロックが正しく接続されているか確認するため
        }
    }
    else {
        logToTxt("すでに「動作テスト」ボタンが押されています");
        // logMessage("------------------------------------------------------",logDiv);
        logMessage("すでに「動作テスト」ボタンが押されています",logDiv);
        flushLog(logDiv);
    }
}

// ログ領域を表示する関数
function showLogPanel() {
  if (isLogPanelVisible) return; // すでに表示中なら何もしない
  isLogPanelVisible = true;

  const logPanel = document.getElementById("logPanel");
  const startScreen = document.querySelectorAll(".startScreen-container");

  logPanel.classList.remove("hidden");

  startScreen.forEach(screen => {
    screen.style.transform = "translateX(510px)";
  });
  
  logPanel.classList.add("show");
}



// ログ領域を隠す関数
function hideLogPanel() {
if (!isLogPanelVisible) return; //  すでに非表示なら何もしない
  isLogPanelVisible = false;

  const logPanel = document.getElementById("logPanel");
  const startScreen = document.querySelectorAll(".startScreen-container");

  logPanel.classList.remove("show");

  startScreen.forEach(screen => {
    screen.style.transform = "translateX(0)";
  });
  logPanel.classList.add("hidden");
}




// 「リセット」ボタンが押されたときに実行される
function resetLogData(){
    logToTxt("「リセット」ボタンが押されました");
    // logMessage("---------------------------------------------------",logDiv);
    logMessage("リセットボタンが押されました",logDiv);
    // 初期化関数
    currentState = ""; 
    currentStatebutton = false; 
    finalStateKey = false; 
    switchKey = false;
    initialStateKey = false;
    testKey = false;
    hasInvalidBlocks = false;
    previousState = "";

    // ワークスペースを取得
    var workSpace = Blockly.getMainWorkspace();

    // ワークスペース内のすべてのブロックを取得
    var allBlocks = workSpace.getAllBlocks();

    // 各ブロックをループして、typeが"firstDefinitionType"であるものの色を変更
    allBlocks.forEach(function(block) {
        if (block.type === "firstDefinitionType") {  // 特定のブロックタイプを確認
            block.setColour("#800080");  
        }
        if (block.type === "stateDefinition") {  // 特定のブロックタイプを確認
            block.setColour("#FF69B4");  
        }
    });

    for (let i = 0; i < variableNames.length; i++){
        variableNames[`variableKey${i}`] = "";
    }

    // 必要ならログやUIもリセット
    flushLog(logDiv); // 実行ログを出力する
    logDiv.innerHTML = "ここに実行結果が表示されます"; 
    // 「動き」に関する画像やログもリセット
    // logContainer.innerHTML = "ここに現在の「動き」が表示されます" // behaiviorLogをリセット
    // let imgElement = imgContainer.querySelector("img");
    // imgElement.src = "img/白画像.png"; // 画像も白画像に差し替える
    currentCondition();
}



// 「データの保存」ボタンを押下時に保存データのメニューを追加する関数
function createSaveItem() {
    logToTxt("「データの保存」ボタンが押されました");
    var inputValue = document.getElementById('saveNameInput').value; // 入力領域から保存名を取得
    var localStorageKeyList = [];
    var xmlData = Blockly.Xml.workspaceToDom(blockspace);
    var xmlText = Blockly.Xml.domToText(xmlData); // XMLを文字列として取得
    var blockTags = xmlText.replace(/<xml[^>]*?>/, '<xml>');

    // 既存のローカルストレージの中身を格納
    for (let i = 0; i < localStorage.length; i++) {
        localStorageKeyList.push(localStorage.key(i)); 
    };

    // ワークスペースに何もブロックがない時
    if(blockTags == "<xml></xml>"){
        alert("ブロックが配置されていません.\n保存機能はブロックを配置した際に利用できます.");
        logToTxt("ブロックが配置されていません.\n保存機能はブロックを配置した際に利用できます.");
    }
    // 保存名が入力されていない時
    else if(inputValue == ""){
        alert("「保存名」が入力されていません.\n「保存名」を入力してください.");
        logToTxt("「保存名」が入力されていません.\n「保存名」を入力してください.");
    }
    // すでに同じ保存名が存在する時
    else if(localStorageKeyList.includes(inputValue)){
        alert("同じ「保存名」が存在しています．\n別の保存名の入力してください.");
        logToTxt("同じ「保存名」が存在しています．\n別の保存名の入力してください.");
    }
    // ローカルストレージに保存
    else{
        addOptionToSelect(inputValue); // 「データの復元」のメニューに入力された保存名を追加
        inputValue = `${currentTask}:${inputValue}`; // 課題名とセットにする
        saveXmlData(inputValue); // 入力された情報をキーとしてローカルストレージに保存
        logToTxt("データ名「" +inputValue + "」が保存されました."); 
    };
    displayStyle("inputSaveNameContainer","saveNameInput"); // 保存後は入力領域を見えなくする
};



// 「データを読込」プルダウンメニューが選択されたときに実行される関数
function handleRestoreChange() {
    // 選択肢を変更したときに、最初の選択肢をデフォルトに戻す
    const selectedOption = event.target.options[event.target.selectedIndex]; // 選ばれた <option> を取得
    const selectedOptionId = selectedOption.id; // 選ばれた <option> の id を取得
    getXmlData(selectedOptionId); // ローカルストレージのキーと <option>のidは一致するので，idでローカルストレージのデータを取りだしワークスペースに適用する
    logToTxt("データ名「" + selectedOptionId + "」が復元されました．");
    restoreMenu.selectedIndex = 0;  // プルダウンメニューを最初の「データを復元」に戻す
}



// 「データの削除」ボタン押下時にデータの削除を行う関数
function deleteSaveItem() {
    var inputValue = document.getElementById('deleteNameInput').value; // 入力領域から保存名を取得
    var localStorageKeyList = []; // ローカルストレージのキー値を追加するリスト
    // ローカルストレージのキーをリストに追加
    for (let i = 0; i < localStorage.length; i++) {
        localStorageKeyList.push(localStorage.key(i)); 
    };
    
    // 入力された値がローカルストレージのキーと一致するかを確認し，存在すれば削除する
    if(localStorageKeyList.includes(inputValue)){
        logToTxt("「データの削除」ボタンが押されました");
        localStorage.removeItem(inputValue); // 該当のキーとデータを削除
        // データの復元ボタン内のキー値も削除
        for(let i = 0; i < restoreMenu.options.length; i++ ){
            let optionName = restoreMenu.options[i];
            if (optionName.id == inputValue){
                restoreMenu.removeChild(optionName);
                logToTxt("データ名「" +inputValue + "」が削除されました.");
                break;
            }
        }
    }
    else{
        logToTxt("データ名「" +inputValue + "」は存在しないため削除できません.");
        alert("データ名「" +inputValue + "」は存在しないため削除できません．");
    };

    displayStyle("inputdeleteNameContainer","deleteNameInput"); // 削除後は入力領域を見えなくする
}



// 「課題の選択」ボタンが押されたときにメニューを追加する関数
function handleTaskChange(){
    // 課題変更前にplantUMLの情報を取得
    logToTxt(plantUmlText);
    logToTxt(getXmlDataFromWorkSpace()); // xmlデータも取得
    logToTxt("課題が変更");
    logToTxt("");

    // 選択肢を変更したときに、最初の選択肢をデフォルトに戻す
    const selectedOption = event.target.options[event.target.selectedIndex]; // 選ばれた <option> を取得
    const selectedOptionId = selectedOption.text; // 選ばれた <option> の id を取得
    currentTask = selectedOptionId; // 現在のタスク名を変更

    // 実行ログを表示しなくする
    hideLogPanel();

    // イベントボタンの変更
    deleteEventButton(astahData[selectedOptionId].event); // 変更前の課題に含まれているイベントボタンを削除
    createEventButton(astahData[selectedOptionId].event); // 変更後の課題に含まれているイベントをボタンとして追加

    // ログデータの変更
    resetLogData(); // ログデータをリセット

    // ブロックおよびワークスペースの変更
    updateBlockElements(selectedOptionId); // 要求文に依存する要素の再定義
    let toolbox = addCategoryToBox(); // カテゴリボックスの変更
    defineCategoryBox(toolbox); // カテゴリボックスの再定義
    updateColorNumberList(); // カラーナンバーの再定義
    defineCategoryTypes(swichColorNumberList,transitionColorNumberList,stateColorNumberList,motionRulesColorNumberList,behaviorColourNumber_list,eventColourNumber_list,guardColourNumber_list,effectColourNumber_list,variableColourNumber_list);
    resetcomponent(swichColorNumberList,transitionColorNumberList,stateColorNumberList,motionRulesColorNumberList,behaviorColourNumber_list,eventColourNumber_list,guardColourNumber_list,effectColourNumber_list,variableColourNumber_list); 
    opaqueBlockChange();
    currentCondition(); // 現在の状態・変数を初期化

    // 保存したデータの表示変更
    initDeleteSaveItem(); // 前回の課題の保存メニューを削除
    initCreateSaveItem(); // 今回の課題の保存メニューを追加

    // チュートリアルの時だけ「ガイダンス」を表示する
    // toggleGuidanceButton(); // チュートリアルの時は「ガイダンス」ボタンを表示
    closeGuidance(); // ガイダンスパネルを閉じる 

    // データの復元
    getXmlData("previousDataKey");

    // taskSelect.selectedIndex = 0;  // プルダウンメニューを最初の「データを復元」に戻す
}


// ガイダンスボタンを押したときの処理を表す関数
function openGuidancePanel(){
    showAllGuidances(); // ガイダンスを全て表示する
    hideSpecificGuidance(); // 必要のないガイダンスを隠す
    applyCircleNumbers(); // ガイダンスに番号を後付けする
    const panel = document.getElementById("guidancePanel"); // ガイダンス用のパネルのidを取得
    panel.classList.toggle("open"); // トグルでパネルの表示・非表示を行う
}


// 「ログ取得」ボダンを押したときの処理を表す関数
function handleLogGet(){
    if (confirm("この操作は指示があるまで行わないでください．\n本当にログの取得を開始しますか？")) {
         if (confirm("この操作を行うと，関連するデータはすべて削除されます．\n本当に実行してもよろしいですか？")) {
            saveLogsToExcel(); // ログの出力を行う
            // console.log("ログ削除しました");
        } 
        else {
            // console.log("削除をキャンセルしました");
        }
    } 
    else {
        // console.log("削除をキャンセルしました");
    }
}   


// 「図に変換」ボタンが押されたときに実行される
function stmbpToPuml() {
    const container = document.getElementById("imageModel");
    skipModelConversion = false; // エラー発生時にtrueとなる変数
    undefinedStateNumber = 0; // 未定義の状態数を数える変数
    hasInitialStateDefined = false; // 初期状態が三回以上定義されていないか数える変数
    definedStateNamesInAction.length = 0; // 状態名を保持する変数を初期化する
    definedStateNamesInSwitch.length = 0; // 状態名を保持する変数を初期化する
    hasDuplicateStateInSwitch = false; // switch文における状態の重複を保持する変数
    hasDuplicateStateInAction = false; // Action文における状態の重複を保持する変数
    // container.innerHTML = ""; // 中身を差し替えるために以前の画像は削除する
    pbJson = [];
    const blocks = blockspace.getAllBlocks(); // 最上位ブロック（workspace上の一番上）を取得
    // let stateName = "";
    
    blocks.sort((a, b) => a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y); // Y座標順にソート（上にある順）

    // 初期状態がないとステートマシン図にならないので，最初に追加(myselfプロパティはfalseとする)

    pbJson.push({"state": "初期状態"});  //nameとinputValueをpbJsonに追加
    let target = pbJson.find(item => item.state == "初期状態");
    target.transition = []; // 初期状態内に[transition]が無ければ追加
    target.myself = {}; // 初期状態内に[myself]が無ければ追加
    target.myself["condition"] = "false"; // [transition]に対応するフィールドと要素を追加
    

    // 各ブロックが「状態を遷移を定義するブロック」か「状態の振る舞いを定義するブロック」かを確認する
    // 状態名を抽出して，その状態下の遷移と振る舞いをpbJsonに追加していく
    blocks.forEach(block => {
        let transitionCount = 0; //各状態における遷移の数を数える変数
        if (block.type == "firstDefinitionType"){
            target.myself["condition"] = "true"; // [transition]に対応するフィールドと要素を追加
        
        }
        // 状態の遷移を設定している場合
        else if (block.type == "switchIfType" || block.type == "switchElseIfType") {
            let stateName = exploreStateBlocks(block, "IF0"); // 状態名を取得する

            // 同じ状態名が複数回定義されているとき
            if (definedStateNamesInSwitch.includes(stateName.trim())) {
                hasDuplicateStateInSwitch = true;
                markInvalidInPbjson(stateName);
            } 
            else {
                definedStateNamesInSwitch.push(stateName); // このタイプのブロックに挿入された状態名を記録する
                recordClickedBlockAsJson(block,stateName) // クリックされたブロックをjsonに記録
                const directChildren = []; // if,elseとなるブロックの情報を格納
                const deeperChildren = []; // 2階層目のブロック(すなわちイベント，複数のガードとなっていた場合)の情報を格納
                let ifCount = 0;
                // ブロックの中にif,elseのブロックがないか探索する
                // inputListはブロックのif,do部分の情報を取得する，この場合ダミーの装飾？も含めて3つある
                block.inputList.forEach(input => {
                    const connected = input.connection?.targetBlock(); // 一番外のブロック情報を取得，その後このブロックと同じ階層のブロックを取得する
                    if (connected) {
                        // 一番外のブロックがイベントやガードにおけるif文であるか確認する
                        if(connected.type == "customControlsIfType" || connected.type == "guardIfType"){
                            let hasdeeperBlock = false;
                            connected.inputList.forEach(innerInput => {
                                const deeperBlock = innerInput.connection?.targetBlock(); // さらに1つ下のブロック 
                                // 二番目に外側のブロックがガードであるかを確認する
                                if (deeperBlock && deeperBlock.type == "guardIfType") {
                                    hasdeeperBlock = true;
                                    deeperChildren[ifCount] = [];
                                    deeperChildren[ifCount].push(connected);
                                    deeperChildren[ifCount].push(deeperBlock); // ガードブロックに関するブロックの情報を代入
                                    addNextBlocksRecursively(deeperBlock, deeperChildren[ifCount]); // 再帰的にelseブロック情報を代入する
                                }
                            });
                            // 入れ子になっていないとき
                            if(hasdeeperBlock == false){
                                directChildren.push(connected); // if文に関するブロックの情報を代入
                                addNextBlocksRecursively(connected, directChildren); // 再帰的にelseブロック情報を代入する
                            }
                            // 入れ子になっているとき
                            else{
                                const next = connected.getNextBlock();
                                if(next && next.type == "customControlsElseIfType"){
                                    hasNestedBlock(connected,deeperChildren,ifCount);
                                }
                            }
                        }
                    }
                });

                // if,elseになる条件式が存在しない場合
                if(directChildren.length == 0 && deeperChildren.length == 0){ 
                    exploreDoBlocks(block, "DO0", stateName, transitionCount); // 取得した状態時の振る舞い，遷移の情報を取得する
                }
                else if(directChildren.length != 0){
                    // if,elseの条件式分，遷移が存在するためその数だけtransitionに追加
                    directChildren.forEach(element => {
                        // 一番外側のブロックだけは個別に取得
                        let resultIf = exploreIfBlocks(element,"IF0"); // IF部分に含まれるブロック情報を取得
                        pbJsonPushDetail(stateName,element.type,resultIf,transitionCount); // pbJsonにブロックの情報を追加
                        exploreDoBlocks(element, "DO0", stateName, transitionCount); // 取得した状態時の振る舞い，遷移の情報を取得する
                        transitionCount += 1; // 遷移ごとにpbJsonのtransitionのリスト数を増やす
                        // exploreDoBlocks(element, "DO0", stateName, transitionCount); // 取得した状態時の振る舞い，遷移の情報を取得する
                        // transitionCount += 1; // 遷移ごとにpbJsonのtransitionのリスト数を増やす
                    })
                }
                // イベントとガードが複数ある場合
                else if(deeperChildren != 0){
                    deeperChildren.forEach(element => {
                        let resultIf = exploreIfBlocks(element[0],"IF0"); // イベントのIF部分を取得
                        if(element.length == 1){
                            pbJsonPushDetail(stateName,element[0].type,resultIf,transitionCount); // pbJsonにイベントブロックの情報を追加
                            exploreDoBlocks(element[0], "DO0", stateName, transitionCount); // 取得した状態時の振る舞い，遷移の情報を取得する
                        }
                        for (let i = 1; i < element.length; i++){
                            pbJsonPushDetail(stateName,element[0].type,resultIf,transitionCount); // pbJsonにイベントブロックの情報を追加
                            let resultGuard = exploreIfBlocks(element[i],"IF0"); // ガードのIF部分を取得
                            pbJsonPushDetail(stateName,element[i].type,resultGuard,transitionCount); // pbJsonにガードブロックの情報を追加
                            exploreDoBlocks(element[i], "DO0", stateName, transitionCount); // 取得した状態時の振る舞い，遷移の情報を取得する
                            transitionCount += 1; // 遷移ごとにpbJsonのtransitionのリスト数を増やす
                        }
                    })
                }
            }
        }
        // 状態の振る舞いを定義している場合
        else if (block.type == "stateActionType"){
            let stateName = exploreIfBlocks(block, "IF0"); // 状態名を取得する

            // 同じ状態名が複数回定義されているとき
            if (definedStateNamesInAction.includes(stateName.trim())) {
                hasDuplicateStateInAction = true;
                markInvalidInPbjson(stateName);
            } 
            else {
                stateName = exploreStateBlocks(block,"IF0");
                definedStateNamesInAction.push(stateName); // このタイプのブロックに挿入された状態名を記録する
                recordClickedBlockAsJson(block,stateName) // クリックされたブロックをjsonに記録
                exploreBehaviorBlocks(block, stateName, transitionCount); // 取得した状態時の振る舞い，遷移の情報を取得する
            }
        }
    });
    // console.log(pbJson);

    checkConvertModels(); // 次の状態が定義されていない場合は，ここで「nextState = 未定義」と追加
    postModelData();
};


// web画面にモデルの画像を出力する関数
function displayStateMachine(){
    var xmlData = Blockly.Xml.workspaceToDom(blockspace);
    var xmlText = Blockly.Xml.domToText(xmlData); // XMLを文字列として取得
    var blockTags = xmlText.replace(/<xml[^>]*?>/, '<xml>');
    // ブロックが配置されていたらサーバーから画像を作成して表示する
    if (blockTags != "<xml></xml>"){
           stmbpToPuml();
    }
    // ブロックがなかったら画像を削除する
    else{
        let container = document.getElementById("imageModel");
        let imgElement = container.querySelector("img");
        if (imgElement){
            imgElement.src = "img/白画像.png"; // 画像の削除
        }
    }
}

setInterval(displayStateMachine, 500);



// document.querySelector("#practice").addEventListener("click",testPractice);

// function testPractice(){
//     const id = document.getElementById("hidden");
//     id.style.display = "block";
// }



// 課題の復元時に利用(.xmlファイルをinputすれば可能)
// document.getElementById("xmlLoader").addEventListener("change", function(e) {
//   const file = e.target.files[0];
//   const reader = new FileReader();

//   reader.onload = function() {
//     var xmlData = reader.result;
//     const parser = new DOMParser(); // dpmに変換するパサー
//     const domData = parser.parseFromString(xmlData, 'text/xml'); // xmlデータをdomに変換
//     Blockly.Xml.appendDomToWorkspace(domData.documentElement, blockspace); // ワークスペースにデータを追加
//   };

//   reader.readAsText(file);
// });

