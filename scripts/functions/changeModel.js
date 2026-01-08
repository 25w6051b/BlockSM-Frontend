// 何の「状態」時についての情報かを確認する関数
function exploreStateBlocks(block,ifBlock){
    const input = block.getInput(ifBlock);
    let inputStateName = "未定義";
    if (input && input.connection) {
        const connected = input.connection.targetBlock();
        if (connected) {
            if(connected.type == "initialStateType"){
                inputStateName = "初期状態";
            }
            else if(connected.type == "stateDefinitionType"){
                let inputValue = connected.getFieldValue('STATE_NAME');
                if (inputValue != "") {
                    inputStateName = inputValue;
                }
            }
            else if(connected.type == "finalStateType"){
                inputStateName = "終了状態";
            }
        }
    }
    if (inputStateName == "未定義") {
        pbJson.push({
            state: inputStateName + `${undefinedStateNumber}`,
            transition: [],
            behavior: {},
            click: {}
        });
        inputStateName = inputStateName + `${undefinedStateNumber}`;
        undefinedStateNumber += 1;
    }
    else if (!pbJson.some(item => item.state === inputStateName)) {
        // 現在の状態名と一致しているかの判定
        if(currentState == inputStateName){
            pbJson.push({
                state: inputStateName,
                current: true, // 現在の状態と一致しているのでcurrentプロパティを追加
                transition: [],
                behavior: {},
                click: {}
            });
        }
        else{
            pbJson.push({
                state: inputStateName,
                transition: [],
                behavior: {},
                click: {}
            });
        }
    }
    // 二回以上状態が定義されることはできないので，定義されている場合は図に変換しないように制御する
    // else if (pbJson.some(item => item.state === inputStateName)) {
    //     // 初期状態は仕様上，必ず二回定義されるので3回目以降を見る
    //     if (inputStateName == "初期状態"){
    //         if(hasInitialStateDefined){
    //             hasDuplicateStateInSwitch = true;
    //             markInvalid(inputStateName);
    //         }
    //     }
    //     else{
    //         hasDuplicateStateInSwitch = true;
    //         markInvalid(inputStateName);
    //     }
    // }

    // 状態名がクリック時にjsonに記録
    if (input && input.connection) {
        const connected = input.connection.targetBlock();
        if(connected && connected.type == "stateDefinitionType"){
            let inputValue = connected.getFieldValue('STATE_NAME');
            // 未定義のときも同様に追加
            if (inputValue == "") {
                recordClickedBlockAsJson(connected,inputStateName); // クリックされていたらjsonに記録
            }
            else {
                recordClickedBlockAsJson(connected,inputValue); // クリックされていたらjsonに記録
            }
        }
    }

    // 三回初期状態が定義されているときは図として表示できないようにする 
    // 「初めは初期状態とする」ブロックと「今の状態が　初期状態　のとき」ブロックで二回は定義される
    if (inputStateName == "初期状態") {
        hasInitialStateDefined = true;
    }
    return inputStateName;
}


// ある状態時のIF部分の情報を返す関数
function exploreIfBlocks(block,ifBlock){
    const input = block.getInput(ifBlock); // IF部分のブロックにアクセス
    let result = ""; // IF部分に入る情報を代入(IF部分に何もなければ初期のまま返す)
    // 親ブロックにif部分が存在するかを確認する(基本的にこの関数を呼び出すのはifブロックを持つブロックであることが前提なので，あくまで呼び出し間違い時の処理)
    if (input && input.connection) {
        const connected = input.connection.targetBlock(); // ブロックの内容を取得
        if (connected) {
            // ブロックのタイプによって返す情報が異なるためif分で場合分けを行う
            if (connected.type == "initialStateType"){
                result = "初期状態"; 
            }
            else if (connected.type == "stateDefinitionType"){
                let inputValue = connected.getFieldValue('STATE_NAME'); // ユーザーによって入力されるためfield名を設定して取得
                if (inputValue == currentState && inputValue != ""){
                    result = inputValue + "#FF5555"
                }
                else if (inputValue == ""){
                    result = "未定義" + `${undefinedStateNumber}`
                    undefinedStateNumber += 1;
                }
                else{
                    result = inputValue;
                }
            }
            else if (connected.type == "finalStateType"){
                result = "終了状態";
            }
            else if (connected.type == "completeEvent"){
                result = "completeEvent";
            }
            else if (connected.type.match(/^event(\d+)$/)) {
                let inputValue = getNameByTypeIndex(connected.type,"event",eventNames); // どのイベントなのかを特定
                inputValue = setBlockAndParentClickedColor(block,connected,inputValue); // クリックされていたら色を変更する(親も含む)
                result = inputValue;
            }
            else if (connected.type.match(/^variable(\d+)$/)){
                let inputValue = getNameByTypeIndex(connected.type,"variable",variableNames);  // どの変数名なのかを特定
                inputValue = setChildBlockClickedColor(connected,inputValue); // クリックされていたら色を変更する(子のみ)
                result = inputValue;
            }
            else if (connected.type.match(/^effect(\d+)$/)){
                let inputValue = getNameByTypeIndex(connected.type,"effect",effectNames); // どのエフェクト名なのかを特定
                inputValue = setBlockAndParentClickedColor(block,connected,inputValue); // クリックされていたら色を変更する(親も含む)
                result = inputValue;
            }
            else if (connected.type == "checkComputationType"){
                // IF部分が3つあるため個別に取得
                let inputValueIf0 = exploreIfBlocks(connected,"IF0"); 
                let inputValueIf1 = connected.getFieldValue("IF1"); // 取得した値はVALUE+数字となる
                let inputValueIf2 = connected.getFieldValue("IF2") || "<color: red>未定義<color: black>";
                let computationList = ["==", "<", ">", "<=", ">="]; // 取得した値から該当する等号を取得
                let operator = computationList[parseInt(inputValueIf1.replace("VALUE", ""))];
                result = `${inputValueIf0} ${operator} ${inputValueIf2}`;
                result = setBlockAndParentClickedColor(block,connected,result); // クリックされていたら色を変更する(親も含む)
            }
            else if (connected.type == "logicalOperationsType"){
                // IF部分が3つあるため個別に取得
                let inputValueIf0 = exploreIfBlocks(connected,"IF0");
                let inputValueIf1 = connected.getFieldValue("IF1"); // 取得した値はVALUE+数字となる
                let inputValueIf2 = exploreIfBlocks(connected,"IF2");
                let computationList = ["かつ","または"]; // 取得した値から該当する等号を取得
                let operator = computationList[parseInt(inputValueIf1.replace("VALUE", ""))];
                result = `${inputValueIf0} ${operator} ${inputValueIf2}`;
                result = setBlockAndParentClickedColor(block,connected,result); // クリックされていたら色を変更する(親も含む)
            }
            else if (connected.type == "NegationType"){
                // IF部分が2つあるため個別に取得
                let inputValueIf0 = exploreIfBlocks(connected,"IF0");
                let inputValueIf1 = connected.getFieldValue("IF1") || "<color: red>未定義<color: black>";
                result = `${inputValueIf0} が ${inputValueIf1} ではない`;
                result = setBlockAndParentClickedColor(block,connected,result); // クリックされていたら色を変更する(親も含む)
            }
            else if (connected.type == "valueChangeType"){
                // IF部分が3つあるため個別に取得
                let inputValueIf0 = exploreIfBlocks(connected,"IF0");
                let inputValueIf1 = connected.getFieldValue("IF1"); // 取得した値はVALUE+数字となる
                let inputValueIf2 = connected.getFieldValue("IF2") || "<color: red>未定義<color: black>";
                let computationList = ["=", "+=", "-=", "*=", "/="]; // 取得した値から該当する等号を取得
                let operator = computationList[parseInt(inputValueIf1.replace("VALUE", ""))];
                result = `${inputValueIf0} ${operator} ${inputValueIf2}`;
                result = setBlockAndParentClickedColor(block,connected,result); // クリックされていたら色を変更する(親も含む)
            }
        } 
        // ここではif部分にブロックが挿入されていない場合に，エラーハンドリングを行う(具体的には赤色で未定義と表示させる)
        else {
            // 親ブロックのタイプがchageStateTypeのときは状態を表すため，plantUMLでは色の付け方に関する書き方が異なる
            if (block.type == "changeStateType"){
                result = "未定義" + `${undefinedStateNumber}`; // plantUMLの形はこの形式とする(赤色にするのはサーバー側で行う)
                undefinedStateNumber += 1;
            }
            else {
                result = "<color: red>未定義<color: black>" // plantUMLの形はこの形式とする(赤色で表示)
            }
            // skipModelConversion = true;
        }
    } 
    else {
        // console.log("exploreIfBlicks関数はif部分を持つブロックに対してのみ呼び出し可能です");
        // console.log("親ブロックの名前は" + block.type);
        // skipModelConversion = true;
    }
    // 値を入力されていない時のエラーハンドリング
    // if (result == ""){
    //     console.log("値が正しく入力されていません");
    //     // skipModelConversion = true;
    // }
    return result;
}


// ブロックのDo部分に含まれる情報を取得し，pbJsonに代入する関数
function exploreDoBlocks(block,DoBlock,stateName,index){
    const input = block.getInput(DoBlock); // ブロックの内側に接続されたブロックを取得
    // ブロックが存在するかの確認
    if (input && input.connection) {
        const connected = input.connection.targetBlock(); // ブロックの内容を取得
        // ブロックが存在した時
        if (connected) {
            recordClickedBlockWithId(connected,"changeStateType",stateName,index); // クリックされたブロックを記録
            let resultIf = exploreIfBlocks(connected,"IF0"); // IF部分に含まれるブロック情報を取得
            if(resultIf){
                pbJsonPushDetail(stateName,connected.type,resultIf,index); // pbJsonにブロックの情報を追加
            }   
            if(connected.type == "changeStateType"){
                const innerInput = connected.getInput("IF0"); 
                if (innerInput && innerInput.connection) {
                    const innerBlock = innerInput.connection.targetBlock(); 
                    recordClickedBlockWithId(innerBlock,"stateDefinitionType",stateName,index); // クリックされたブロックを記録   
                }
            }         
            exploreDoBlocks(connected,DoBlock,stateName,index); // 次のブロックを再帰的に探索
        } 
    } 
    else {
        // 下に連結されているブロック（next）を探索
        const nextBlock = block.getNextBlock(); // 同じ階層下に繋がってるブロックを取得
        if (nextBlock) {
            recordClickedBlockWithId(nextBlock,"changeStateType",stateName,index); // クリックされたブロックを記録
            let resultIf = exploreIfBlocks(nextBlock,"IF0"); // IF部分に含まれるブロック情報を取得
            if(resultIf){
                pbJsonPushDetail(stateName,nextBlock.type,resultIf,index); // pbJsonにブロックの情報を追加
            }
            if(nextBlock.type == "changeStateType"){
                const innerInput = nextBlock.getInput("IF0"); 
                if (innerInput && innerInput.connection) {
                    const innerBlock = innerInput.connection.targetBlock(); 
                    recordClickedBlockWithId(innerBlock,"stateDefinitionType",stateName,index); // クリックされたブロックを記録   
                }
            }     
            exploreDoBlocks(nextBlock,DoBlock,stateName,index); // 次のブロックを再帰的に探索
        }
    }

}


// 文字列の添え字を取得して，配列から特定の文字を抜き出す関数(対象はevent,effect,behavior,guard,variable)
function getNameByTypeIndex(text, blockType, namesArray) {
    // console.log(text,blockType);
    const regex = new RegExp(`^${blockType}(\\d+)$`); // 正規表現を動的に表すためにregexpを用いる
    let match = text.match(regex); // 文字列がマッチしてるかを確認
    if (match && match[1]) {
        let index = parseInt(match[1], 10); // 「文字列＋数字」となっているためその数字を抜き出す 抜き出す時はintに変換
        return namesArray[index];
    }
    else {
        console.warn(`"${text}" はパターン ^${blockType}(\\d+)$ にマッチしませんでした`);
        return null; // または -1, "" など用途に応じたデフォルト
    }
}



// // 状態の振る舞いをpbJsonに代入する関数
function exploreBehaviorBlocks(block,stateName,index){
    const input = block.getInput("DO0"); // ブロックの内側に接続されたブロックを取得
    // ブロックが存在するかの確認
    if (input && input.connection) {
        const connected = input.connection.targetBlock(); // ブロックの内容を取得
        // ブロックが存在した時
        if (connected) {
            // motionRulesブロックであるかの確認をする(振る舞いブロックは階層構造が異なるため)
           if (connected.type == "entryType" || connected.type == "doContinuousType" || connected.type == "doOnetimeType" || connected.type == "exitType"){
                recordClickedBlockAsJson(connected,stateName) // クリックされたブロックをjsonに記録
                childInput = connected.getInput("DO0"); // motionRulesに接続されているブロックの情報を取得
                if (childInput && childInput.connection) {
                    const childConnected = childInput.connection.targetBlock(); // ブロックの内容を取得
                    if (childConnected != null){
                        let inputValue = getNameByTypeIndex(childConnected.type,"behavior",behaviorNames); // 接続されたブロックの名称を取得
                        inputValue = setChildBlockClickedColor(childConnected,inputValue); // クリックされていたら色を変更する(子のみ)
                        pbJsonPushDetail(stateName, connected.type,inputValue,index); // pbJsonにブロックの情報を追加
                    }
                    else {
                        let inputValue = "<color: red>未定義<color: black>"; // 動きブロックが配置されていないため，「未定義」を追加
                        pbJsonPushDetail(stateName, connected.type,inputValue,index); // pbJsonにブロックの情報を追加
                        // skipModelConversion = true;
                    }
                    exploreBehaviorNextBlocks(connected,stateName,index);  // 次のブロックを再帰的に探索(ただし，振る舞いブロックは関数exploreBheaviorBlocksを用いる)
                }
           }
        } 
    }
}


// 再帰的に次のブロックを探す関数
function exploreBehaviorNextBlocks(block,stateName,index){
    const nextBlock = block.getNextBlock(); // 接続されている次のブロックを代入
    if(nextBlock){
        recordClickedBlockAsJson(nextBlock,stateName) // クリックされたブロックをjsonに記録
        childInput = nextBlock.getInput("DO0"); // 次ブロックの"DO0"要素を代入
        // "DO0"部分が存在するかを確認する
        if (childInput && childInput.connection) {
            const childBlock = childInput.connection.targetBlock(); // ブロックの中身を取得
            if (childBlock != null){
                let inputValue = getNameByTypeIndex(childBlock.type,"behavior",behaviorNames); // 接続されたブロックの名称を取得
                inputValue = setChildBlockClickedColor(childBlock,inputValue); // クリックされていたら色を変更する(子のみ)
                pbJsonPushDetail(stateName,nextBlock.type,inputValue,index); // pbJsonに追加
            }
            else {
                // console.log("動きブロックが設定されていません");
                let inputValue = "<color: red>未定義<color: black>"; // 動きブロックが配置されていないため，「未定義」を追加
                pbJsonPushDetail(stateName, nextBlock.type,inputValue,index); // pbJsonにブロックの情報を追加
            }
            exploreBehaviorNextBlocks(nextBlock,stateName,index); // 次のブロックを再帰的に探索
        }   
    }
}



// ある状態時の情報をpbjsonに追加する関数
function pbJsonPushDetail(stateName, parentType, detailValue,index) {
    const target = pbJson.find(item => item.state === stateName); // pbJsonに関数に入力された状態名があるかを確認
    // 親ブロックのタイプによってステートマシン図要素が異なるのでmapで列挙する
    const typeToKeyMap = new Map([
        ["customControlsIfType", { key: "event", category: "transition" }],
        ["customControlsElseIfType", { key: "event", category: "transition" }],
        ["guardIfType", { key: "guard", category: "transition" }],
        ["guardElseIfType", { key: "guard", category: "transition" }],
        ["effectType", { key: "effect", category: "transition" }],
        ["changeStateType", { key: "nextState", category: "transition" }],
        ["entryType", { key: "entry", category: "behavior" }],
        ["doContinuousType", { key: "do", category: "behavior" }],
        ["doOnetimeType", { key: "do", category: "behavior" }],
        ["exitType", { key: "exit", category: "behavior" }]
    ]);
    // pbJsonに状態名があるとき
    if (target) {
        const category = typeToKeyMap.get(parentType)?.category;
        const key = typeToKeyMap.get(parentType)?.key;
        // behaviorがカテゴリの時はそのままプロパティに代入する
        if(category == "behavior"){  
            target[category][key] = detailValue; // [deteals]に対応するタグと要素を追加
        }
        // transitionがカテゴリの場合，複数のプロパティを持つ可能性があるため(遷移は複数持つことがあり得るため)リストへの代入方法を使う
        else if(category == "transition"){
            if (!target.transition[index]) {
                target.transition[index] = {};
            };
            target.transition[index][key] = detailValue; // [deteals]に対応するタグと要素を追加
        }
    } else {
        console.warn(stateName + "は存在しません"); // 状態名が存在しない場合
    }
}


// サーバー側にブロックで作成したステートマシンのjsonデータを送る関数
function postModelData() {
    fetch ('http://localhost:8888/',{
        method : "POST", 
        headers : {
             'Content-Type': 'application/json'  // JSON送信のヘッダー設定
        },
        body : JSON.stringify(pbJson) // json形式で送る
    })
    // サーバーからの返答を受け取る
    .then (response =>{
        // サーバーとの接続はできても，それが404だったりエラーの時がある　その際にcatchに送る
        if (!response.ok){
             throw new Error('サーバーエラー: ' + response.status);
        }
        return response.json();  // レスポンスをテキストで取得 throwされたら返さないcatchへ飛ぶ
    })
    // 通信が成功し，404とかでもなければここで受け取ったデータを表示
    .then(data => {
        plantUmlText = data.plantUMLValue;
        findErrorNoteInPlantUML();
        const base64Image = data.base64Image;
        // const imgUrl = URL.createObjectURL(blob); // blobをURL化して画像として表示する
        const container = document.getElementById("imageModel"); // 画像を挿入したい場所の要素を取得
        const imageSrc = `data:image/svg+xml;base64,${base64Image}`;
        // 最初の <img> を取得して src だけ更新
        let imgElement = container.querySelector('img');
        
        if (imgElement) {
            // すでにある img の src を更新
            imgElement.src = imageSrc;
        } else {
            // img がなければ作って追加
            imgElement = document.createElement('img');
            imgElement.src = imageSrc;
            container.appendChild(imgElement);
        }
        // const imgElement = document.createElement('img');
        // imgElement.src = imgUrl;
        
        container.appendChild(imgElement);
    })
    // エラー時の処理
    .catch(error => {
        console.error('通信に失敗しました:', error);
    });
}



// transitionにnexStateが定義されているか調べる関数
function checkConvertModels() {
    // let result = true; // すべての状態においてtransitionが定義されていればtrue
    pbJson.forEach(stateObj => {
        const transitions = stateObj.transition;
        const state = stateObj.state; 
        // transitionが何も持たないこともあるので，その場合は無視する
        if (Array.isArray(transitions) && transitions.length > 0) {
            transitions.forEach(tr => {
                // 次の状態を持っていなければ無理やり次の状態を定義する(planatUMLの仕様上，次の状態が設定されていないとイベントなどを設定できないため)
                // ただし，初期状態の時は「次の状態を決めてください」という警告文が出るため，それ以外の状態のときのみ
                if (tr.nextState == undefined && state != "初期状態") {
                    tr.nextState = "未定義" + undefinedStateNumber;
                    undefinedStateNumber += 1;
                }
            });
        }
    });
    // return result;
}


// if,else文となっているブロック群(「もし～なら」や「ではなく～なら」ブロック群)を再帰的に取得する関数
function addNextBlocksRecursively(block, list) {
    const next = block.getNextBlock();
    if (next) {
        list.push(next);
        addNextBlocksRecursively(next, list); // 再帰的に続けて探索
    }
}

// 2つ目のイベントの中身を探す関数
function hasNestedBlock(connected,deeperChildren,ifCount){
    ifCount += 1;
    const next = connected.getNextBlock();
    if (next){
        deeperChildren[ifCount] = [];
        deeperChildren[ifCount].push(next); 
        next.inputList.forEach(innerInput => {
            const deeperBlock = innerInput.connection?.targetBlock(); // さらに1つ下のブロック 
            // 二番目に外側のブロックがガードであるかを確認する
            if (deeperBlock && deeperBlock.type == "guardIfType") {
                deeperChildren[ifCount].push(deeperBlock); // ガードブロックに関するブロックの情報を代入
                addNextBlocksRecursively(deeperBlock, deeperChildren[ifCount]); // 再帰的にelseブロック情報を代入する
            }
        })
        hasNestedBlock(next,deeperChildren,ifCount);
    }
}


const errorDefinitions = [
    {
        id: "InitialStateDefinitionError",
        pattern: /InitialStateDefinitionError/,
        message: "図の変換エラー：初めは「初期状態」としてください"
    },
    {
        id: "InitialStateTransitionError",
        pattern: /InitialStateTransitionError/,
        message: "図の変換エラー：「初期状態」の次の状態を決めてください"
    },
    {
        id: "stateNameNamingError",
        pattern: /stateNameNamingError/,
        message: "図の変換エラー：状態名が命名規則に従っていません"
    },
    {
        id: "InvalidStateTransitionError",
        pattern: /InvalidStateTransitionError/,
        message: "図の変換エラー：初期状態からの遷移が複数あります"
    },
    {
        id: "DuplicateStateDefinitionError",
        pattern: /DuplicateStateDefinitionError/,
        message: "図の変換エラー：同じ状態が複数定義されています"
    },
    {
        id: "InitialStateEventError",
        pattern: /InitialStateEventError/,
        message: "図の変換エラー：「初期状態」には「イベント」を設定できません"
    },
    {
        id: "InitialStateConditionError",
        pattern: /InitialStateConditionError/,
        message: "図の変換エラー：「初期状態」には「条件」を設定できません"
    }
];

let lastLoggedErrorId = null; // 最後に出したエラーIDだけ持つ

function findErrorNoteInPlantUML() {
    // 今回検出されたエラー（なければ null）
    let currentError = null;

    for (const error of errorDefinitions) {
        if (error.pattern.test(plantUmlText)) {
            currentError = error;
            break; // 最初に見つかったエラーだけ処理
        }
    }

    // エラーが見つからなかった場合
    if (!currentError) {
        lastLoggedErrorId = null;
        return;
    }

    // 前回と違うエラーならログ出力
    if (lastLoggedErrorId !== currentError.id) {
        logToTxt(currentError.message);
        lastLoggedErrorId = currentError.id;
    }
}

// // plantUMLにおいてノートに出力したエラーをログとして残す関数
// function findErrorNoteInPlantUML(){
//     // 初期状態が定義されていないときのエラー
//     if (/InitialStateDefinitionError/.test(plantUmlText) ){
//         // 一度エラーログを取ったら，もう一度別のログに変わるまでログの取得はしない
//         if(lastDefLogged == false){
//             logToTxt("図の変換エラー：初めは「初期状態」としてください");
//             lastDefLogged = true;
//             lastTransLogged = false;
//         }
//     }
//     // 初期状態からの遷移が定義されていないときのエラー
//     else if (/InitialStateTransitionError/.test(plantUmlText)){
//         if(lastTransLogged == false){
//             logToTxt("図の変換エラー：「初期状態」の次の状態を決めてください");
//             lastDefLogged = false;
//             lastTransLogged = true;
//         }
//     }
//     // 状態名が命名規則に従っていないときのエラー
//     else if (/stateNameNamingError/.test(plantUmlText)){

//     }
//     // 初期状態からの遷移が複数あるときのエラー
//     else if (/InvalidStateTransitionError/.test(plantUmlText)){

//     }
//     // 状態が複数定義されているときのエラー
//     else if (/DuplicateStateDefinitionError/.test(plantUmlText)){

//     }
//     else{
//         lastDefLogged = false;
//         lastTransLogged = false;
//     }
// }


// ブロックがクリックされたことを記録する関数
function setBlockKeyOnClick(block){
    block.data = "touched"; // クリックされたブロックだけプロパティを保持
}


// ブロックがクリックされたことを初期化する関数
function initBlockKeyOnClick(){
    blockspace.getAllBlocks().forEach(b => {
        b.data = "";
      });
}



// ブロックがクリックされてたら色を変える関数(親ブロックも含む)
function setBlockAndParentClickedColor(block,connected,inputValue){
    // 親ブロックか子ブロックがクリックされているかを確認する関数
    if (connected.data == "touched" || block.data == "touched"){
        inputValue = `<color: orange>${inputValue}<color: black>`;
    }
    return inputValue
}

// ブロックがクリックされてたら色を変える関数(子ブロックのみ)
function setChildBlockClickedColor(connected,inputValue){
    if (connected.data == "touched"){
        inputValue = `<color: orange>${inputValue}<color: black>`;
    }
    return inputValue
}

// 二回以上定義された状態をはじく関数
function markInvalid(stateName) {
    const target = pbJson.find(item => item.state === stateName);
    if (target) {
        target.invalid = { condition: "true" };
    }
}

// 二回以上定義されたActionブロックをはじく関数
function markInvalidInPbjson(stateName) {
    const target = pbJson.find(
        item => item.state === stateName
    );
    if (target) {
        target.invalid = { condition: "true" };
    }
}



// クリックされたブロックをjsonに記録する関数
function recordClickedBlockAsJson(connected,stateName){
    if (connected.data == "touched"){
        const target = pbJson.find(item => item.state === stateName); // pbJsonに関数に入力された状態名があるかを確認
        if(target){
            target.click = {type:connected.type};
        }
    }
}


// クリックされたブロックをjsonに記録する関数(遷移の番号付き)
function recordClickedBlockWithId(connected,blockType,stateName,index){
    if(connected && connected.type == blockType && connected.data == "touched"){
        const target = pbJson.find(item => item.state === stateName); // pbJsonに関数に入力された状態名があるかを確認
        target.click = {type:connected.type,number:index};
    }
}
