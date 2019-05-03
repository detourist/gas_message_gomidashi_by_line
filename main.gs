//【Ref】 http://kph4.blogspot.jp/2017/08/google-apps-scriptline.html

function messageGomidashi() {
  //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //デバッグモード
  const debug = false;
  
  //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //GASスクリプトプロパティ
  const scriptProperty = PropertiesService.getScriptProperties().getProperties();
  //LINE APIトークン
  const token = scriptProperty.LINE_TOKEN;
  
  //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //現在時刻
  const now = new Date();
  //今日
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  //明日
  date.setDate(date.getDate() + 1);
  if(debug) Logger.log(date);
  //明日の日付の月の1日
  const firstdate = new Date(date.getFullYear(), date.getMonth(), 1);
  if(debug) Logger.log(firstdate);
  
  //曜日を取得
  //数字を漢字に変換
  const wChars = ["日","月","火","水","木","金","土"];
  const weekChar = wChars[date.getDay()];
  
  //明日がその月の何週目かを計算
  //7day*24hour*60min*60sec*1000ms = 604800000ミリ秒
  const weekNum = Math.floor((date-firstdate)/604800000) + 1;
  
  //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //スプレッドシート
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("【Sheet】");
  const lastRow = sheet.getDataRange().getLastRow();

  //ゴミ出しテーブルを取得
  const items = sheet.getRange(2, 1, lastRow -1, 3).getValues();
  if(debug) Logger.log(items);

  //ゴミ出しテーブルの配列のうち、条件に一致するものをgarbages配列に転記
  //週が"0"またはweekNumを含み、かつ、曜日がweekCharを含む
  const garbages = [];
  for(var i = 0; i < items.length; i++){
    if( (items[i][0].indexOf("0") != -1 || items[i][0].indexOf(weekNum) != -1) && items[i][1].indexOf(weekChar) != -1 ){
      garbages.push(items[i][2]);
    }
  } 
  if(debug) Logger.log(garbages);
  
  //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //LINEメッセージを送信  
  if(garbages.length > 0){
    const message = "明日は"+ garbages.join("と") +"の日です。";
    const options = {};
    options.method = "post";
    options.headers = {"Authorization" : "Bearer "+ token};
    options.payload = "message=" + encodeURIComponent(message);
    
    UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
  }
  //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
}
