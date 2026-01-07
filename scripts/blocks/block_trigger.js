function eventDefinision(colourNumber){
    let eventBlockList = []; // イベントブロックの設定情報をまとめるリスト
    // ブロックごとに設定を決める
    for (let i = 0; i < eventNames.length; i++){
        eventBlockList.push(
        {
            "type": `event${i}`, 
            "message0": eventNames[i],
            "output": "trigger",
            "colour": eventColor[colourNumber[i]],
        });
    }
    // eventBlockList.push(
    //     {
    //         "type": "completeEvent", 
    //         "message0": "状態の「動き」が終わる",
    //         "output": "trigger",
    //         "colour": eventColor[colourNumber[eventNames.length + 0]],
    //     }
    // )

    // ブロックごとにその処理を定義する必要があるのでeventの数だけ定義
    for (let i = 0; i < eventNames.length; i++) {
        javascript.javascriptGenerator.forBlock[`event${i}`] = eventActivity(i) // イベントごとにその処理を定義
    }
    
    return eventBlockList;
}

// イベントブロックが行う処理を定義する関数
// ただ，ブロックごとにfunction(block)を返さなければいけないので，returnではfunction(block)を返す　
function eventActivity(eventIndex){
    return function(block){

        // function(blosk)内の処理をここで定義する
        var code = `[false, "${eventNames[eventIndex]}"]`; // イベントの発生確認が取れたらtrue,取れなかったらfalseを返す

        // イベントの発生確認を行う条件式
        // eventKeyはイベント発生時(ボタン押下時)にtrueとなる
        if(eventNames[`eventKey${eventIndex}`] == true){
            code = `[true, "${eventNames[eventIndex]}"]`;
        }
        return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
    }
}


// javascript.javascriptGenerator.forBlock["completeEvent"] = function(block) {
//     // function(blosk)内の処理をここで定義する
//     var code = `[false, "状態の「動き」が終わる"]`; // イベントの発生確認が取れたらtrue,取れなかったらfalseを返す

//     // イベントの発生確認を行う条件式
//     // eventKeyはイベント発生時(ボタン押下時)にtrueとなる
//     if(completeEventKey == true){
//         code = `[true, "状態の「動き」が終わる"]`;
//     }
//     return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
// }


