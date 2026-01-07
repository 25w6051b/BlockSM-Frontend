// ガイダンスごとの内容
const guidanceTexts = {
    guidance1: '<span class="center-target">[ 初めは『初期状態』とする ]</span><img src="img/initialStateDefinition.png"/> 初期状態は<strong>システムの開始点</strong>となる状態です。最初にこのブロックを置きましょう。',
    guidance2: '<span class="center-target">[ 今の状態が～のとき ]</span> <img src="img/stateTransitionDefinition.png"/> 状態ごとに<strong>イベント</strong>や<strong>条件</strong>、<strong>作用</strong>、<strong>次の状態</strong>を決めるブロックです。どの状態で使うかを決めて、『状態ブロック』と一緒に置きましょう。\nこのブロックは <strong>If–else if</strong> 構造になっており、『ではなく，今の状態が〜のとき』ブロックが else if に相当します。',
    guidance3: '<span class="center-target">[ ～という状態に変わる ]</span> <img src="img/nextStateDefinition.png"/> <strong>次の状態</strong>を指定するブロックです。『状態ブロック』と一緒に置きましょう。',
    guidance4: '<span class="center-target">[ もし～というイベントが起きたなら ]</span> <img src="img/eventDefinition.png"/> 状態が<strong>切り替わる</strong>きっかけとなる<strong>イベント</strong>が起きたかどうかを調べるためのブロックです。\n『イベント』ブロックから調べたいイベントを選び、そのイベントが起きたときに実行したい処理のブロックをこの中に繋いで使いましょう。\nこのブロックは <strong>If–else if</strong> 構造になっており、『ではなく～というイベントが起きたなら』ブロックが else if に相当します。',
    guidance5: '<span class="center-target">[ 状態が～のときの動きは ]</span> <img src="img/stateBehaviorDefinition.png"/> <strong>状態の中での動き</strong>を定義するブロックです。どの状態でどんな動きをするかを決めて、『状態ブロック』『動きのきまりブロック』『動きブロック』と一緒に置きましょう。\nこのブロックは<strong>クラス構造</strong>になっており、状態ごとの動きをメソッドとして表現しています。',
    guidance6: '<span class="center-target">[ もし～という条件を満たすなら ]</span> <img src="img/guardDefinition.png"/> 状態が<strong>切り替わる</strong>きっかけとなる<strong>条件</strong>を満たすかどうかを調べるためのブロックです。\n『条件』ブロックから調べたい条件を選び、その条件が成り立ったときに実行したい処理のブロックをこの中に繋いで使いましょう。このブロックは <strong>If–else if</strong> 構造になっており、『ではなく～という条件を満たすなら』ブロックが else if に相当します。\nまた、この条件ブロックは <strong>イベントが起きたときの処理</strong>と組み合わせて使うことができます。',
    guidance7: '<span class="center-target">[ ～という作用が起こる ]</span> <img src="img/effectDefinition.png"/> 状態が<strong>切り替わる</strong>ときに実行される処理を決めるためのブロックです。（同じ状態に戻る場合も、状態が切り替わったものとして扱われます。）\n『エフェクト』ブロックから実行したい処理を選び、状態が変わるタイミングで行いたい動きをこの中に繋いで使いましょう。\n処理には、変数の値を<strong>設定</strong>したり<strong>増減</strong>させたりすることもできます。',
    guidance8: '<span class="center-target">[ 変数 ]</span><img src="img/variableDefinition.png"/> 変数の値を<strong>設定</strong>したり<strong>増減</strong>したりするためのブロックです。\n<strong>『条件』ブロック</strong>と組み合わせて、変数の値をもとに状態を切り替える条件を決めたり、<strong>『作用』ブロック</strong>と組み合わせて、状態が切り替わるタイミングで値を変更する処理に使えます。',
}

// ガイダンス内容の表示を行う関数
function showGuidance(id) {
  const button = document.getElementById(id);
  const contentId = id + "-content";
  let content = document.getElementById(contentId);

  // なければ作成してボタンの直後に挿入
  if (!content) {
    content = document.createElement("div");
    content.id = contentId;
    content.className = "guidance-content";
    button.insertAdjacentElement("afterend", content);
  }

  // 毎回テキストを更新
  content.innerHTML = guidanceTexts[id];

  // 各ガイダンスのボタンが押されたときに内容を表示・非表示する
  const isOpen = content.classList.contains("open");
  content.classList.toggle("open");
  button.setAttribute("aria-expanded", (!isOpen).toString());
}


// 課題がチュートリアルのときにガイダンスボタンを隠す関数
// function toggleGuidanceButton() {
//   const button = document.getElementById("blockGuidance");
//   if(currentTask != "チュートリアル"){
//     button.style.display = "none";   // ボタンを非表示にする
//   }
//   else if(currentTask = "チュートリアル"){
//     button.style.display = "block";   // ボタンを表示する
//   }
// }

// ガイダンスパネルを閉じる関数(課題変更時に使用)
function closeGuidance(){
    const container = document.getElementById("guidancePanel");
    if (container) {
        container.classList.remove("open");
    }
}


// すべてのガイダンスを表示する関数
function showAllGuidances() {
  const buttons = document.querySelectorAll(".guidance-button");
  buttons.forEach(btn => btn.classList.remove("hidden"));
}



// 特定のガイダンスを隠す関数
function hideSpecificGuidance(){
  if (eventNames.length == 0){
    document.querySelector("#guidance4").classList.add("hidden");
  }
  if (guardNames.length == 0){
    document.querySelector("#guidance6").classList.add("hidden");
  }
  if (effectNames.length == 0 && variableNames.length == 0){
    document.querySelector("#guidance7").classList.add("hidden");
  }
  if (variableNames.length == 0){
    document.querySelector("#guidance8").classList.add("hidden");
  }
}


// ガイダンスに番号をつける関数
function applyCircleNumbers() {
  const circleNums = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"];
  const buttons = document.querySelectorAll(".guidance-button");

  let visibleIndex = 0; // hidden じゃない要素の番号カウンタ

  buttons.forEach(btn => {
    // hidden のときはスキップ
    if (btn.classList.contains("hidden")) {
      return;
    }

    // 既存の番号を消す（後から呼ばれたときのため）
    btn.textContent = btn.textContent.replace(/^[①-⑩]\s*/, "");

    // hidden じゃない要素にだけ番号を付ける
    btn.textContent = `${circleNums[visibleIndex]} ${btn.textContent}`;
    visibleIndex++;
  });
}


// ガイダンスパネルの幅を変える関数
function setupPanelResize(panelId, handleSelector, minWidth, maxWidth) {
  const panel = document.getElementById(panelId);
  const handle = panel.querySelector(handleSelector);

  let isResizing = false;

  // リサイズ開始
  handle.addEventListener("mousedown", () => {
    isResizing = true; // リサイズできるようフラグを立てる
  });

  // リサイズ中
  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return; // リサイズフラグがたっていないとき

    // マウスの位置からパネルの新しい横幅を計算
    const newWidth = window.innerWidth // 画面の横幅
                    - e.clientX; // マウスのx座標
    // 最大値と最小値の間であるとき
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      panel.style.width = newWidth + "px"; // リサイズする
    }
  });

  // リサイズ終了
  document.addEventListener("mouseup", () => {
    isResizing = false; // フラグを戻す
  });
}
