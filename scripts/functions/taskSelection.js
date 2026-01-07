let taskSelect = document.getElementById("taskSelect");

// 課題の数だけメニューに追加
function taskManage(){
    for(const [taskName,taskData] of Object.entries(astahData)){
        taskAddOption(taskName);
    }
}


// 「課題の選択」ボタンに各課題のメニューを追加する関数
function taskAddOption(taskName){
    var additionalOption = document.createElement("option"); // optionタグを作成
    additionalOption.id = taskName; // idを設定
    additionalOption.textContent = taskName; // テキスト名を設定
    taskSelect.appendChild(additionalOption); // 「課題の選択」メニューに追加
}

taskManage();