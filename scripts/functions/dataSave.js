
// ワークスペース内のデータを保存する関数
function saveXmlData(Key){
    var xmlData = Blockly.Xml.workspaceToDom(blockspace);
    var xmlText = Blockly.Xml.domToText(xmlData); // XMLを文字列として取得
    var blockTags = xmlText.replace(/<xml[^>]*?>/, '<xml>');

    if(blockTags != "<xml></xml>"){
        const finalKey = STORAGE_KEY + Key; 
        localStorage.setItem(finalKey, blockTags);
    }
}


// ワークスペース内のデータをxml形式で取得する関数
function getXmlDataFromWorkSpace(){
    var xmlData = Blockly.Xml.workspaceToDom(blockspace);
    var xmlText = Blockly.Xml.domToText(xmlData); // XMLを文字列として取得
    var blockTags = xmlText.replace(/<xml[^>]*?>/, '<xml>');
    return blockTags;
}

// 一定間隔ずつワークスペースの情報を保存する
setInterval(() => saveXmlData(`${currentTask}`+ ":previousDataKey"),1000);
// setInterval(() => initCreateSaveItem(),5000);

// ローカルストレージに保存されているデータを取得する関数
function getXmlData(Key){
    var xmlData = localStorage.getItem(`${STORAGE_KEY}${currentTask}:${Key}`); // キーと一致するデータをローカルストレージから取得
    const parser = new DOMParser(); // dpmに変換するパサー
    const domData = parser.parseFromString(xmlData, 'text/xml'); // xmlデータをdomに変換
    Blockly.Xml.appendDomToWorkspace(domData.documentElement, blockspace); // ワークスペースにデータを追加
    resetColor();
    initBlockKeyOnClick() // ブロックのdata情報をリセット
    // Blockly.Xml.clearWorkspaceAndLoadFromXmlであればワークスペース上のデータを消して書き換える
}


let saveOptionCount = 1;
let restoreMenu = document.getElementById("restoreMenu"); // 復元ボタンにアクセス



// web更新時に「データの復元」ボタンにメニューを追加する関数
function initCreateSaveItem(){
    for (let i = 0; i < localStorage.length; i++) {
        let localStorageKey = localStorage.key(i); 
        // localStorageKeyは[課題名,データ名]を持つのでそれぞれ取得する
        if(localStorageKey){
            // 接頭語を削る
            const pureKey = localStorageKey.replace(STORAGE_KEY, "");

            // 課題名とデータ名に分割
            const [task, dataName] = pureKey.split(":");

            if (task === currentTask) {
                addOptionToSelect(dataName);
            }
        }
    }
}



// データの復元メニューにユーザーが入力した保存項目を追加する関数
function addOptionToSelect(menuName){
    var additionalOption = document.createElement("option"); // optionタグを作成
    additionalOption.value = saveOptionCount; // valueを設定
    additionalOption.id = menuName; // idを設定(idはローカルストレージのkey名と同一とする)
    menuName = menuName.replace(/^"|"$/g, "");
    if (menuName == "previousDataKey"){
        additionalOption.textContent = "直前に保存したデータを読込";
    }
    else{
        additionalOption.textContent = "保存したデータ名：" + menuName; // テキスト名を設定
    }
    restoreMenu.appendChild(additionalOption); // データの復元メニューに追加
    saveOptionCount++; //value値を増やす
}



// データの復元メニューの保存項目を削除する関数
function initDeleteSaveItem(){
    while (restoreMenu.options.length > 1) {
        restoreMenu.remove(1); // 先頭(0番目)は残して，1番目以降を順に削除
    }
}


// displayをnoneとflexに切り替える関数
function displayStyle(containerId,inputId){
    const container = document.getElementById(containerId); // 「追加」ボタンのコンテナIDを取得
    const currentDisplay = window.getComputedStyle(container).display; // コンテナのdisplay値を取得
    // コンテナのdisplayがnoneかflexかを調べる
    if(currentDisplay == "none"){
        setDisplayState("flex",containerId,inputId); // noneならボタンがタップされたときに「追加」ボタンが見えるようにする
    }
    else{
        setDisplayState("none",containerId,inputId); // flexならボタンがタップされたときに「追加」ボタンが見えないようにする
    }
}


// displayとinputの値を変更する関数
function setDisplayState(value,containerId,inputId){
    const container = document.getElementById(containerId);
    const inputArea = document.getElementById(inputId);
    container.style.display = value;
    inputArea.value = '';
    inputArea.focus();
}


// dom形式をxml形式に変換する関数
function textToDom(xmlText) {
    const parser = new DOMParser();
    return parser.parseFromString(xmlText, 'application/xml');
}

