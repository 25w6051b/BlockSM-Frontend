// 課題ごとのログを保持するオブジェクトを動的に生成
// const taskLogs = {};
// for(const taskName of Object.keys(astahData)){
//     taskLogs[taskName] = [];
// }

let db;

// indexedDBに接続する関数
function initDB() {
  const request = indexedDB.open("LogDatabase", 1);

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore("logs", { keyPath: "id", autoIncrement: true });
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("IndexedDB ready");
  };

  request.onerror = function () {
    console.error("IndexedDB error");
  };
}

initDB(); // ページを開くたびにデータベースに接続

// ログを追加する関数
function logToTxt(message) {
  const timestamp = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }); // 日本時間を取得

  const tx = db.transaction("logs", "readwrite"); // 保存処理の開始を合図する「readwrite」で書き込み可能とする
  const store = tx.objectStore("logs"); // ストアテーブルを取得

  // ログを追加
  store.add({
    uniqueKey: STORAGE_KEY,
    task: currentTask,   // グローバル変数をそのまま使う
    timestamp: timestamp,
    message: message
  });

  tx.onerror = () => console.error("ログ保存失敗:", message); // 失敗時にエラーログを出す
}


// IndexedDBから全ログを取得する関数
function getAllLogsFromDB(callback) {
  const tx = db.transaction("logs", "readonly"); // 読み出し処理の開始を合図する「readonly」で読み取り専用とする
  const store = tx.objectStore("logs"); // ストアテーブルを取得

  const request = store.getAll(); // 全レコードを取得するリクエストを送る

  // 成功時
  request.onsuccess = () => callback(request.result); // リクエストの結果を取得
  // 失敗時
  request.onerror = () => console.error("ログ取得失敗");
}



//　Excelに出力する関数
function saveLogsToExcel() {
    // まず plantUML と XML を保存
    logToTxt(plantUmlText);
    logToTxt(getXmlDataFromWorkSpace());

    // DB から全ログを取得
    // ログが取れたらこの関数が実行される(callback関数が引数だから)
    getAllLogsFromDB((allLogs) => {

        // 課題ごとにグループ化
        const grouped = {};
        for (const log of allLogs) {
            if (!grouped[log.task]) grouped[log.task] = [];
            grouped[log.task].push([log.timestamp, log.message]);
        }

        // Excel 作成
        const workBook = XLSX.utils.book_new();

        for (const [taskName, logs] of Object.entries(grouped)) {
            const sheetData = [["timeStamp", "Message"], ...logs];
            const workSheet = XLSX.utils.aoa_to_sheet(sheetData);
            XLSX.utils.book_append_sheet(workBook, workSheet, taskName);
        }

        const xlsxBinary = XLSX.write(workBook, { bookType: "xlsx", type: "array" });

        const xmlFiles = createAllTaskXmlFiles(); // ここで課題名:XML文字列を取得 
        const zip = new JSZip(); // zipの作成

        // 課題ごとにxmlファイルとしてzipに追加 
        for (const taskName in xmlFiles) {
           zip.file(`${taskName}.xml`, xmlFiles[taskName]); 
        } 
        
        // Excel も zip に追加
        zip.file("tasks.xlsx", xlsxBinary);
        

        zip.generateAsync({ type: "blob" }).then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "export.zip";
            link.click();

            blockspace.clear(); // ワークスペースのブロック情報を消す
            clearAllLogs(); // 保存後はすべてのデータを消す
            clearAllLocalStorage() // 保存後はローカルストレージも消す
        }); 
    });
}


// すべての課題に対してxmlデータをまとめる関数
function createAllTaskXmlFiles() {
    const taskNames = Object.keys(astahData); // 課題名一覧
    const xmlFiles = {}; // { 課題名: XML文字列 }

    taskNames.forEach(taskName => {
        const xmlContent = createXmlForTask(taskName);
        if (xmlContent) {
            xmlFiles[taskName] = xmlContent;
        }
    });

    return xmlFiles;
}


// 課題ごとにxmlファイルを作成する関数
function createXmlForTask(taskName) {
    const key = `BlockSMWorkspace_${taskName}:previousDataKey`;
    const data = localStorage.getItem(key);

    if (!data) {
        console.warn(`データが見つかりません: ${key}`);
        return null;
    }

    return data;
}



// 課題を全て消す関数
function clearAllLogs() {
  const tx = db.transaction("logs", "readwrite");
  const store = tx.objectStore("logs");
  const request = store.openCursor();

  request.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      if (cursor.value.uniqueKey === STORAGE_KEY) {
        cursor.delete();
      }
      cursor.continue();
    }
  };
}

// ローカルストレージのキーを全て消す関数
function clearAllLocalStorage() {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key.startsWith(STORAGE_KEY)) {
          localStorage.removeItem(key);
      }
    }
}


// function logToTxt(message){
//     const timeStamp = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
//     if(!taskLogs[currentTask]){  
//         // 万が一 astahData にない課題名が来た場合は新しく作る
//         taskLogs[currentTask] = [];
//     }
//     // console.log(message)
//     taskLogs[currentTask].push([timeStamp, message]);
// }

// Excelとして保存する関数
// function saveLogsToExcel(){
//     logToTxt(plantUmlText); // plantUML記述でデータを保存
//     logToTxt(getXmlDataFromWorkSpace()) // xmlデータも取得
//     const workBook = XLSX.utils.book_new(); // 空のExcelファイルを作成

//     // 課題ごとのログをシートに保存
//     for(const [taskName, logs] of Object.entries(taskLogs)){
//         const sheetData = [["timeStamp", "Message"], ...logs]; // ログのデータをひな型にはめる
//         const workSheet = XLSX.utils.aoa_to_sheet(sheetData); // ログのデータをシートに保存
//         XLSX.utils.book_append_sheet(workBook, workSheet, taskName); // シートに変換
//     }

//     XLSX.writeFile(workBook, "tasks.xlsx"); // エクセルファイルの作成
// }












// 入力が "???" なら空文字にする関数
function normalizeQuestionMarks(value) {
  if (value === "???" || value === "") {
    return "空文字";
  }
  return value;
}



function resolveBlockName(block,blockType){
    let result = "";
    const blockTypeMap  = new Map([
        ["firstDefinitionType","初めは「初期状態」とする"],
        ["switchIfType","今の状態が～のとき"],
        ["switchElseIfType","ではなく，今の状態が～のとき"],
        ["stateActionType","状態が～のときの動きは"],
        ["changeStateType","～という状態に変わる"],
        ["customControlsIfType","もし～というイベントが起きたなら"],
        ["customControlsElseIfType","ではなく～というイベントが起きたなら"],
        ["guardIfType","もし～という条件を満たすなら"],
        ["guardElseIfType","ではなく～という条件を満たすなら"],
        ["effectType","～という作用が起こる"],
        ["initialStateType","初期状態"],
        ["finalStateType","終了状態"],
        // ["stateDefinitionType",{key:""}],
        ["entryType","初めに～"],
        ["doContinuousType","ずっと～"],
        ["doOnetimeType","一度だけ～"],
        ["exitType","終わりに～"],
        // ["completeEvent","状態の「動き」が終わる"],
        // ["checkComputationType",{key:""}],
        // ["logicalOperationsType",{key:""}],
        // ["NegationType",{key:""}],
        // ["valueChangeType",{key:""}]
    ]);

    readBlockList = ["stateDefinitionType","checkComputationType","logicalOperationsType","NegationType","valueChangeType"];
    properNounList = ["event","guard","effect","behavior","variable"];

    if(blockTypeMap.has(blockType)){
        result = blockTypeMap.get(blockType);
    }
    else if(readBlockList.some(keyWord => keyWord.includes(blockType))){
        result = "readBlock";
    }
    else if(properNounList.some(keyWord => blockType.includes(keyWord))){
        result = "properNoun";
    }
    // console.log(result);
}


let lastViewportLogTime = 0;
const VIEWPORT_LOG_INTERVAL = 1000; // 500ms に1回だけログを取る

// viewport_changeを一度だけ取得する関数
function logViewportChange() {
  const now = Date.now();
  if (now - lastViewportLogTime > VIEWPORT_LOG_INTERVAL) {
    logToTxt("ビューポート");
    lastViewportLogTime = now;
  }
}


let lastDragLogTime = 0;
const DRAG_LOG_INTERVAL = 300; // 100ms以内の連続ドラッグは無視

// dragを一度だけ取得する関数
function logDrag(eventName) {
  const now = Date.now();
  if (now - lastDragLogTime > DRAG_LOG_INTERVAL) {
    logToTxt(eventName);
    lastDragLogTime = now;
  }
}
