// 「動き」ブロックを絵として視覚化するためのファイル

// 「動き」の画像とログを表示する関数
function showMotion(statePhases,currentState){
    let imgElement = imgContainer.querySelector("img");
    let behaviorPhases = ""; // statePhasesごとに対応する枕詞を代入する変数

    // imgタグがなければ作って追加
    // if(!imgElement){
    //     imgElement = document.createElement('img');
    //     imgElement.src = "img/白画像.png";
    //     imgContainer.appendChild(imgElement);
    // }

    pbJson.forEach(item => {
        if (item.state == currentState){
            if(item.behavior){
                if(item.behavior[statePhases]){
                    imgElement.src = `img/${item.behavior[statePhases]}.png`; // statePhases(entryやdoなど)に対応する「動き」の画像を表示する
                    // statePhasesごとに対応する枕詞をbehaviorPhasesに代入する
                    if(statePhases == "entry"){
                        behaviorPhases = "初めに";
                    }
                    else if(statePhases == "do" && item.behavior.doOnetime == false){
                        behaviorPhases = "ずっと";
                    }
                    else if(statePhases == "do" && item.behavior.doOnetime == true){
                        behaviorPhases = "一度だけ";
                    }
                    else if(statePhases == "exit"){
                        behaviorPhases = "終わりに";
                    }
                    behaiviorActive(behaviorPhases + item.behavior[statePhases],logContainer) // ログを出力する
                }
            }
        }
    })
}

// 現在の状態にbehaviorが含まれているか調べる関数
function containsBehavior(state) {
    let hasBhavior = [false,false,false]; // 状態が「動き」を持っているか調べるリスト([entry,do,exit]に対応する)
    pbJson.forEach(item => {
        if (item.state == state){
            if(item.behavior){
                if(item.behavior.entry){
                hasBhavior[0] = true;
                }
                if(item.behavior.do){
                    hasBhavior[1] = true;
                }
                if(item.behavior.exit){
                    hasBhavior[2] = true;
                }
            }
        }
    })
    return hasBhavior;
}


// behaviorLog-areaにログを出力する関数
function behaiviorActive(message,logDiv) {
    logDiv.innerHTML = "ここに現在の「動き」が表示されます\n";
    const logEntry = document.createElement('div');  // 新しいdiv要素を作成+
    logEntry.classList.add('behaviorLog-area', 'activity');
    logEntry.textContent = message;  // メッセージを設定
    logDiv.appendChild(logEntry);                     // logDivに追加
}


// タイマーIDを格納する配列（グローバルに定義する）
let activeTimeouts = [];

//「動き」の画像とログを出力するための関数
function runMotionSequence(previousState,currentS,previousExit,currentEntry,delay){    
    clearAllTimeouts();
    Motionshow("exit",previousState);
    if (previousExit) {
        // 前回の状態のexitと現在の状態のentryがある場合は3秒後にentry、その後さらに3秒後にdoを実行
        if(currentEntry){
            const timeout1 = setTimeout(() => {
                showMotion("entry", currentS);
                const timeout2 = setTimeout(() => {showMotion("do", currentS);}, delay);
                activeTimeouts.push(timeout2); // 2個目のsetimeoutを保存
            }, delay);
            activeTimeouts.push(timeout1); // 1個目のsetimeoutを保存
        }
        // 前回の状態のexitはあるが現在の状態のentryがない場合は3秒後にdoを実行
        else{
            const timeout = setTimeout(() => {showMotion("do", currentS);}, delay);
            activeTimeouts.push(timeout);
        }
    } 
    else {
        // 前回の状態のexitがないがentryはある場合はすぐentry、その後3秒後にdoを実行
        if(currentEntry){
            showMotion("entry", currentS);
            const timeout = setTimeout(() => {showMotion("do", currentS);}, delay);
            activeTimeouts.push(timeout);
        }
        // 前回の状態のexitも今回の状態のentryもない場合はすぐにdoを実行
        else{
            showMotion("do", currentS);
        }
    }
}

// 
function clearAllTimeouts() {
    activeTimeouts.forEach(id => clearTimeout(id));
    activeTimeouts = []; // 初期化
}