
// // 入場動作，実行活動，退場動作の処理を格納するリスト
// const behaviorNames = ["温風を送風する","送風を停止する"];
// // イベントを格納するリスト
// const eventNames = ["電源を入れる","電源を切る"];
// // ガードを格納するリスト
// const guardNames =  ["x == 0"];
// // エフェクトを格納するリスト
// const effectNames = []; 
// // 状態名を格納するリスト
// const stateNames = [];


// const behaviorNames = ["音楽を流す"];
// const eventNames = ["5秒経過する","10秒経過する","ボタンを押下する"];
// const guardNames = [];
// const effectNames = ["音楽を止める"]; 
// const stateNames = [];

// const behaviorNamesList = [];
// const eventNamesList = [];
// const guardNamesList = [];
// const effectNamesList = [];
// const variableNamesList = [];

// const jsonMap = new Map(); // jsonごとに要素を入れるmap関数

// // jsonファイルの数だけボタンと各要素の作成
// for (const [taskName,taskData] of Object.entries(astahData)){
//     // behaviorNamesList.push(taskData.behavior);
//     // eventNamesList.push(taskData.event);
//     // guardNamesList.push(taskData.guard);
//     // effectNamesList.push(taskData.effect);
//     // variableNamesList.push(taskData.variable);
//     jsonMap.set(taskName,taskData);
// }

behaviorNames = []
eventNames = []
guardNames = []
effectNames = []
variableNames = []

// 要求文に依存する要素の再定義を行う関数
function updateBlockElements(taskId){
    behaviorNames = astahData[taskId].behavior;
    effectNames = astahData[taskId].effect;
    variableNames = [] // 変数のリストを初期化
    separateEffect(); // エフェクトの要素を分離
    eventNames = astahData[taskId].event;
    guardNames = astahData[taskId].guard;
    createVariableList(); // 変数名のリストを定義
}

// astahData[3];
// const stateNames = [];


const switchColor = ["#800080","#C8A2D6"];
const transitionColor = ["#FFA500","#FFD699"];
const stateColor = ["#FF69B4","#FFCCE5"];
const motionRulesColor = ["blue","#B3D9FF"];
const behaviorColor = ["#00BFFF","#B3E0FF"];
const eventColor = ["red","#FFCCCC"];
const guardColor = ["green","#B3FFB3"];
const effectColor = ["#32CD32","#B3FFB3"];
const variableColor = ["#8B4513","#F8E5B4"]
const allblocksColor = [switchColor,transitionColor,stateColor,motionRulesColor,behaviorColor,eventColor,guardColor,effectColor,variableColor];

let switchTypes = ['firstDefinitionType','switchIfType','switchElseIfType','stateActionType','changeStateType'];
let transitionTypes = ['customControlsIfType','customControlsElseIfType','guardIfType','guardElseIfType','effectType'];
let stateTypes = ['initialStateType','finalStateType','stateDefinitionType'];
let motionRulesTypes = ['entryType','doContinuousType','doOnetimeType','exitType'];
// let eventTypes = ["completeEvent"];
let eventTypes = [];
let guardTypes = ["checkComputationType","logicalOperationsType","NegationType"];
let effectTypes = ["valueChangeType"];

let swichColorNumberList = new Array(switchTypes.length).fill(0);  
let transitionColorNumberList = new Array(transitionTypes.length).fill(0); 
let stateColorNumberList = new Array(stateTypes.length).fill(0);  
let motionRulesColorNumberList = new Array(motionRulesTypes.length).fill(0); 

