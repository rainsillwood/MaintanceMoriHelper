// ==UserScript==
// @name         Maintenance Mori Helper
// @namespace    https://suzunemaiki.moe/
// @updateURL    https://raw.githubusercontent.com/rainsillwood/MaintenanceMoriHelper/main/dist/MaintenanceMoriHelper.user.js
// @downloadURL  https://raw.githubusercontent.com/rainsillwood/MaintenanceMoriHelper/main/dist/MaintenanceMoriHelper.user.js
// @version      1.08
// @description  Maintenance Mori优化
// @author       SuzuneMaiki
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mememori-game.com
// @match        http*://mentemori.icu/*
// @match        http*://*.mememori-boi.com/*
// @connect      mentemori.icu
// @connect      mememori-boi.com
// @connect      cdn-mememori.akamaized.net
// @connect      mememori-game.com
// @connect      moonheart.dev
// @connect      githubusercontent.com
// @grant        GM_xmlhttpRequest
// @require      https://raw.githubusercontent.com/kawanet/msgpack-lite/master/dist/msgpack.min.js
// @require      https://raw.githubusercontent.com/kawanet/int64-buffer/master/dist/int64-buffer.min.js
// @run-at       document-start
// ==/UserScript==

'use strict';
console.log('脚本运行中');
//增加冻结层
document.querySelector('style').append(`
#loading {
  width: 100%;
  height: 100%;
  font-size: xx-large;
  position: fixed;
  left: 0px;
  top: 0px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2147483647;
  opacity: 0.8;
}
  `);
const FreezeNode = createElement('div', '<h1>Loading......</h1>', 'loading');
document.body.insertAdjacentElement('afterbegin', FreezeNode);
/*全局对象*/
//静态常量
const GlobalConstant = {
  //机型信息
  'ModelName': 'Xiaomi 2203121C',
  'GlobalConstant': 'Android OS 13 / API-33 (TKQ1.220829.002/V14.0.12.0.TLACNXM)',
  //服务器url
  'assetURL': 'https://raw.githubusercontent.com/rainsillwood/MaintanceMoriHelper/main/assets/',
  'authURL': 'https://prd1-auth.mememori-boi.com/api/auth/',
  'LocalURL': 'https://mentemori.icu/',
  'AppVersion': '',
};
//翻译表-人工维护
const LanguageTable = {
  'Region': {
    'JaJp': 'サーバー',
    'EnUs': 'Server',
    'KoKr': 'Server',
    'ZhTw': '區域',
    'ZhCn': '区域',
  },
  'Class': {
    'JaJp': 'クラス',
    'EnUs': 'Class',
    'KoKr': 'Class',
    'ZhTw': '級別',
    'ZhCn': '级别',
  },
  'Block': {
    'JaJp': 'ブロック',
    'EnUs': 'Block',
    'KoKr': 'Block',
    'ZhTw': '組別',
    'ZhCn': '组别',
  },
  'Local': {
    'JaJp': 'Local',
    'EnUs': 'Local',
    'KoKr': 'Local',
    'ZhTw': '本地',
    'ZhCn': '本地',
  },
  'title': {
    'JaJp': 'メンテもりもり',
    'EnUs': 'Maintenance Mori',
    'KoKr': 'Maintenance Mori',
    'ZhCn': '维护多多',
    'ZhTw': '维护多多',
  },
  'basic': {
    'JaJp': '通常 ： ',
    'EnUs': 'Normal&ensp;:&ensp;',
    'KoKr': 'Normal&ensp;:&ensp;',
    'ZhTw': '通用功能 ： ',
    'ZhCn': '通用功能 ： ',
  },
  'weekly': {
    'JaJp': '週間 ： ',
    'EnUs': 'Weekly&ensp;:&ensp;',
    'KoKr': 'Weekly&ensp;:&ensp;',
    'ZhTw': '每周特報 ： ',
    'ZhCn': '每周特报 ： ',
  },
  'extend': {
    'JaJp': '拡張 ： ',
    'EnUs': 'Extend&ensp;:&ensp;',
    'KoKr': 'Extend&ensp;:&ensp;',
    'ZhTw': '擴展功能 ： ',
    'ZhCn': '扩展功能 ： ',
  },
  'hidden': {
    'JaJp': 'Hidden ： ',
    'EnUs': 'Hidden&ensp;:&ensp;',
    'KoKr': 'Hidden&ensp;:&ensp;',
    'ZhTw': '隱藏功能 ： ',
    'ZhCn': '隐藏功能 ： ',
  },
  'dataconvert': {
    'JaJp': 'データ変換',
    'EnUs': 'Data Convert',
    'KoKr': 'Data Convert',
    'ZhTw': '數據轉換',
    'ZhCn': '数据转换',
  },
  'battlehelper': {
    'JaJp': '戦闘監視',
    'EnUs': 'Battle Helper',
    'KoKr': 'Battle Helper',
    'ZhTw': '戰鬥監控',
    'ZhCn': '战斗监控',
  },
  'account': {
    'JaJp': 'Account:',
    'EnUs': 'Account:',
    'KoKr': 'Account:',
    'ZhTw': '登錄狀態：',
    'ZhCn': '登录状态：',
  },
  'noaccount': {
    'JaJp': 'No Account',
    'EnUs': 'No Account',
    'KoKr': 'No Account',
    'ZhTw': '無賬號',
    'ZhCn': '无账号',
  },
  'Locked': {
    'JaJp': '未加工',
    'EnUs': 'Locked',
    'KoKr': 'Locked',
    'ZhTw': '未加工',
    'ZhCn': '未加工',
  },
  ' Forces': {
    'JaJp': '軍',
    'EnUs': ' Forces',
    'KoKr': ' Forces',
    'ZhTw': '軍',
    'ZhCn': '军',
  },
  'Enermy': {
    'JaJp': '敵',
    'EnUs': 'EN',
    'KoKr': 'EN',
    'ZhTw': '敵',
    'ZhCn': '敌',
  },
  'Neutral': {
    'JaJp': '中',
    'EnUs': 'NT',
    'KoKr': 'NT',
    'ZhTw': '中',
    'ZhCn': '中',
  },
  'Friendly': {
    'JaJp': '友',
    'EnUs': 'FR',
    'KoKr': 'FR',
    'ZhTw': '友',
    'ZhCn': '友',
  },
  'All Worlds': {
    'JaJp': 'すべて',
    'EnUs': 'All Worlds',
    'KoKr': 'All Worlds',
    'ZhTw': '所有世界',
    'ZhCn': '所有世界',
  },
  'Updated': {
    'JaJp': '更新',
    'EnUs': 'Updated',
    'KoKr': 'Updated',
    'ZhTw': '更新時間',
    'ZhCn': '更新時間',
  },
  'Chapter ': {
    'JaJp': '章',
    'EnUs': 'Chapter ',
    'KoKr': 'Chapter ',
    'ZhTw': '領先章節',
    'ZhCn': '领先章节',
  },
  'Slot 1': {
    'JaJp': '枠１',
    'EnUs': 'Slot 1 ',
    'KoKr': 'Slot 1 ',
    'ZhTw': '欄１',
    'ZhCn': '栏１',
  },
  'Slot 2': {
    'JaJp': '枠２',
    'EnUs': 'Slot 2 ',
    'KoKr': 'Slot 2 ',
    'ZhTw': '欄２',
    'ZhCn': '栏２',
  },
  'Slot 3': {
    'JaJp': '枠３',
    'EnUs': 'Slot 3 ',
    'KoKr': 'Slot 3 ',
    'ZhTw': '欄３',
    'ZhCn': '栏３',
  },
  'Slot 4': {
    'JaJp': '枠４',
    'EnUs': 'Slot 4 ',
    'KoKr': 'Slot 4 ',
    'ZhTw': '欄４',
    'ZhCn': '栏４',
  },
  'Slot 5': {
    'JaJp': '枠５',
    'EnUs': 'Slot 5 ',
    'KoKr': 'Slot 5 ',
    'ZhTw': '欄５',
    'ZhCn': '栏５',
  },
  'Search ID': {
    'JaJp': '検索ID',
    'EnUs': 'Search ID',
    'KoKr': 'Search ID',
    'ZhTw': '查詢ID',
    'ZhCn': '查询ID',
  },
  'Details': {
    'JaJp': '詳細',
    'EnUs': 'Details',
    'KoKr': 'Details',
    'ZhTw': '查詢條件',
    'ZhCn': '查询条件',
  },
  'FromServer': {
    'JaJp': 'Get from server',
    'EnUs': 'Get from server',
    'KoKr': 'Get from server',
    'ZhTw': '自伺服器獲取',
    'ZhCn': '从服务器获取',
  },
  'SaveDatabase': {
    'JaJp': 'Get from database',
    'EnUs': 'Get from database',
    'KoKr': 'Get from database',
    'ZhTw': '保存到數據庫',
    'ZhCn': '保存到数据库',
  },
  'ReadDatabase': {
    'JaJp': 'Get from database',
    'EnUs': 'Get from database',
    'KoKr': 'Get from database',
    'ZhTw': '自數據庫獲取',
    'ZhCn': '从数据库获取',
  },
  'StartUpdate': {
    'JaJp': 'Start attaching to server',
    'EnUs': 'Start attaching to server',
    'KoKr': 'Start attaching to server',
    'ZhTw': '開始監聽伺服器',
    'ZhCn': '开始监听服务器',
  },
  'CloseUpdate': {
    'JaJp': 'Close attaching',
    'EnUs': 'Close attaching',
    'KoKr': 'Close attaching',
    'ZhTw': '關閉監聽',
    'ZhCn': '关闭监听',
  },
  'Containfixed': {
    'JaJp': '(Contains fixed)',
    'EnUs': '(Contains fixed)',
    'KoKr': '(Contains fixed)',
    'ZhTw': '（包含確定）',
    'ZhCn': '（包含确定）',
  },
};
//URL信息
const GlobalURLList = getURLList();
//自动跳转功能
if (!GlobalURLList.lang) {
  let url = JSON.parse(JSON.stringify(GlobalURLList));
  url.lang = getStorage('Language') ?? 'EnUs';
  if (['arena', 'temple', 'legend', 'clearlist'].includes(GlobalURLList.page)) {
    url.function = GlobalURLList.page;
    delete url.page;
  }
  window.location.href = getURL(url);
  return;
}
//变量
const GlobalVariable = {
  'userURL': '',
  'MagicOnionHost': '',
  'MagicOnionPort': '',
  'AuthTokenOfMagicOnion': '',
  'ortegaaccesstoken': '',
  'orteganextaccesstoken': '',
  'ortegauuid': '',
};
//清除缓存
if (getStorage('ScriptVersion') * 1 < 1.01) {
  localStorage.clear();
  indexedDB.deleteDatabase('database');
}
//公共对象
let SocketGvG;
const DataBase = {
  'Static': {
    'version': 1,
  },
  'Record': {
    'version': 1,
  },
};
await openDB('Static');
await openDB('Record');
setStorage('ScriptVersion', 1.06);
setStorage('lang', '["en","en","en","en","en","en","en"]');
//需要从游戏资源获取翻译列表
const LanguageTableM = {
  'Rank': 'CommonPlayerRankLabel',
  'STR': 'BaseParameterTypeMuscle',
  'MAG': 'BaseParameterTypeIntelligence',
  'DEX': 'BaseParameterTypeEnergy',
  'STA': 'BaseParameterTypeHealth',
  'ATK': 'BattleParameterTypeAttackPower',
  'DEF': 'BattleParameterTypeDefense',
  'DEF Break': 'BattleParameterTypeDefensePenetration',
  'SPD': 'BattleParameterTypeSpeed',
  'PM.DEF Break': 'BattleParameterTypeDamageEnhance',
  'P.DEF': 'BattleParameterTypePhysicalDamageRelax',
  'M.DEF': 'BattleParameterTypeMagicDamageRelax',
  'ACC': 'BattleParameterTypeHit',
  'EVD': 'BattleParameterTypeAvoidance',
  'CRIT': 'BattleParameterTypeCritical',
  'CRIT RES': 'BattleParameterTypeCriticalResist',
  'CRIT DMG Boost': 'BattleParameterTypeCriticalDamageEnhance',
  'P.CRIT DMG Cut': 'BattleParameterTypePhysicalCriticalDamageRelax',
  'M.CRIT DMG Cut': 'BattleParameterTypeMagicCriticalDamageRelax',
  'Debuff ACC': 'BattleParameterTypeDebuffHit',
  'Debuff RES': 'BattleParameterTypeDebuffResist',
  'Counter': 'BattleParameterTypeDamageReflect',
  'HP Drain': 'BattleParameterTypeHpDrain',
  'None': 'CommonNotEquippingLabel',
  ' pts, ': 'GlovalPvpPoint',
  ' streak': 'GlobalPvpConsecutiveVictoryLabel',
  'EXP Orb': 'ItemName10',
  'Upgrade Water': 'ItemName12',
  'Upgrade Panacea': 'ItemName13',
  'Kindling Orb': 'ItemName11',
  'Rune Ticket': 'ItemName43',
  'Event': 'PlayerEventPolicyLabel',
  ' Wins': 'WeeklyTopicsLeagueContinueWinCountFormat',
};
//从翻译表获取翻译列表
const LanguageTableJ = ['Locked', 'All Worlds', ' Forces'];
//注入翻译
const functionLanguage = unsafeWindow._m;
unsafeWindow._m = function (...args) {
  //内联翻译表
  let langList = JSON.parse(getStorage('LanguageTable'));
  unsafeWindow.m[GlobalURLList.lang] = langList || {};
  return functionLanguage.call(this, ...args);
};
//动态常量
GlobalConstant.AppVersion = await getAppVersion();
const TextResource = await getTextResource();
const ErrorCode = getErrorCode();
//data-ja翻译表
const LanguageJa = {
  'メンテもりもり': LanguageTable['title'][GlobalURLList.lang],
  'ワールド': TextResource['TitleWarningListWorld'],
  'レベル': TextResource['CommonPlayerRankLabel'],
  '幻影の神殿': TextResource['CommonHeaderLocalRaidLabel'],
  'サーバー': LanguageTable['Region'][GlobalURLList.lang],
  '更新': LanguageTable['Updated'][GlobalURLList.lang],
  'プレイヤーランキング': TextResource['RankingGroupTypePlayer'],
  '戦闘力': TextResource['CommonBattlePowerLabel'],
  'プレイヤーランク': TextResource['PlayerRankingTypePlayerRank'],
  'メインクエスト': TextResource['PlayerRankingTypeStage'],
  '無窮の塔': TextResource['PlayerRankingTypeTowerBattle'],
  '藍の塔': TextResource['ElementTowerRankingTypeBlue'],
  '紅の塔': TextResource['ElementTowerRankingTypeRed'],
  '翠の塔': TextResource['ElementTowerRankingTypeGreen'],
  '黄の塔': TextResource['ElementTowerRankingTypeYellow'],
  'ギルドランキング': TextResource['RankingGroupTypeGuild'],
  'ギルドレベル': TextResource['GuildRankingTypeLevel'],
  'ギルドストック': TextResource['GuildRankingTypeStock'],
  'ギルド総戦闘力': TextResource['GuildRankingTypeBattlePower'],
  'プレイヤー名': TextResource['CommonPlayerNameLabel'],
  '階': TextResource['RankingTowerBattleLabel'],
  'ランク': TextResource['CommonPlayerRankLabel'],
  'クエスト': TextResource['RankingStageLabel'],
  'ギルド名': TextResource['GuildName'],
  '人数': TextResource['MemberNumber'],
  'バトルリーグ': TextResource['CommonHeaderLocalPvpLabel'],
  'プレイヤー': TextResource['CommonPlayerNameLabel'],
  '枠１': LanguageTable['Slot 1'][GlobalURLList.lang],
  '枠２': LanguageTable['Slot 2'][GlobalURLList.lang],
  '枠３': LanguageTable['Slot 3'][GlobalURLList.lang],
  '枠４': LanguageTable['Slot 4'][GlobalURLList.lang],
  '枠５': LanguageTable['Slot 5'][GlobalURLList.lang],
  '武具': TextResource['CommonEquipmentLabel'],
  '腕力': TextResource['BaseParameterTypeMuscle'],
  '技力': TextResource['BaseParameterTypeEnergy'],
  '聖装': TextResource['EquipmentAscendSortLegendLv'],
  '魔装': TextResource['EquipmentAscendSortMatchlessLv'],
  '魔力': TextResource['BaseParameterTypeIntelligence'],
  '耐久力': TextResource['BaseParameterTypeHealth'],
  'キャラ': TextResource['CommonHeaderCharacterListLabel'],
  'Lv.': TextResource['CommonLevelWithDot'],
  '攻撃力': TextResource['BattleParameterTypeAttackPower'],
  '防御力': TextResource['BattleParameterTypeDefense'],
  '防御貫通': TextResource['BattleParameterTypeDefensePenetration'],
  'スピード': TextResource['BattleParameterTypeSpeed'],
  '物魔防御貫通': TextResource['BattleParameterTypeDamageEnhance'],
  '物理防御力': TextResource['BattleParameterTypePhysicalDamageRelax'],
  '魔法防御力': TextResource['BattleParameterTypeMagicDamageRelax'],
  '命中': TextResource['BattleParameterTypeHit'],
  'クリティカル': TextResource['BattleParameterTypeCritical'],
  'クリダメ強化': TextResource['BattleParameterTypeCriticalDamageEnhance'],
  '魔法クリダメ緩和': TextResource['BattleParameterTypeMagicCriticalDamageRelax'],
  '物理クリダメ緩和': TextResource['BattleParameterTypePhysicalCriticalDamageRelax'],
  '弱体効果命中': TextResource['BattleParameterTypeDebuffHit'],
  '弱体効果耐性': TextResource['BattleParameterTypeDebuffResist'],
  'カウンタ': TextResource['BattleParameterTypeDamageReflect'],
  'HPドレイン': TextResource['BattleParameterTypeHpDrain'],
  '回避': TextResource['BattleParameterTypeAvoidance'],
  'クリティカル耐性': TextResource['BattleParameterTypeCriticalResist'],
  'グループ': TextResource['ChatTabSvS'],
  'レジェンドリーグ': TextResource['CommonHeaderGlobalPvpLabel'],
  'ギルドバトル': TextResource['CommonHeaderGvgLabel'],
  'クラス': LanguageTable['Class'][GlobalURLList.lang],
  'ブロック': LanguageTable['Block'][GlobalURLList.lang],
  'グランドバトル': TextResource['CommonHeaderGlobalGvgLabel'],
  'バトルレポート再生': TextResource['BattleReportTitle'] + TextResource['CommonPlayLabel'],
  '週間トピックス・属性別キャラ育成': `${TextResource['WeeklyTopicsDialogTitle']}・${TextResource['WeeklyTopicsTopCharacterHeadline']}`,
  '天属性': TextResource['ElementTypeLight'],
  '冥属性': TextResource['ElementTypeDark'],
  '藍属性': TextResource['ElementTypeBlue'],
  '紅属性': TextResource['ElementTypeRed'],
  '翠属性': TextResource['ElementTypeGreen'],
  '黄属性': TextResource['ElementTypeYellow'],
  '週間トピックス・バトルリーグ': `${TextResource['WeeklyTopicsDialogTitle']}・${TextResource['WeeklyTopicsTopQuestHeadline']}`,
  '章': LanguageTable['Chapter '][GlobalURLList.lang],
  '前線': TextResource['WeeklyTopicsQuestCharacterUsageRateLabelTop']?.replace('{0}', ' '),
  '全体': TextResource['WeeklyTopicsQuestCharacterUsageRateLabelAll'],
  '到達人数': TextResource['WeeklyTopicsQuestFrontLineLabelFormat']?.replace('{0}', ' '),
  '週間トピックス・バトルリーグ': `${TextResource['WeeklyTopicsDialogTitle']}・${TextResource['CommonHeaderLocalPvpLabel']}`,
  '30位以内': TextResource['WeeklyTopicsLeagueCharacterUsageRateLabelTop'],
  '全体': TextResource['WeeklyTopicsLeagueCharacterUsageRateLabelAll'],
  '連勝記録': TextResource['WeeklyTopicsLeagueContinueWinLabel']?.replace('{0}', ''),
  '週間トピックス・レジェンドリーグ': `${TextResource['WeeklyTopicsDialogTitle']}・${TextResource['CommonHeaderGlobalPvpLabel']}`,
  'ステータス': TextResource['CommonBaseParameterLabel'],
  'グランドマスター': TextResource['GvgGroupLevelNameGoldenLabel'],
  'エキスパートクラス': TextResource['GvgGroupLevelNameSilverLabel'],
  'エリートクラス': TextResource['GvgGroupLevelNameBronzeLabel'],
  'ブロックＡ': TextResource['GvgGroup1NameLabel'],
  'ブロックＢ': TextResource['GvgGroup2NameLabel'],
  'ブロックＣ': TextResource['GvgGroup3NameLabel'],
  'ブロックＤ': TextResource['GvgGroup4NameLabel'],
  '検索ID': LanguageTable['Search ID'][GlobalURLList.lang],
  '詳細': LanguageTable['Details'][GlobalURLList.lang],
  'クリアパーティ': TextResource['AutoBattleQuestButtonClearParty'],
};
//初始化所有页面
initPage();
console.log('载入完成');
/*常量函数*/
//分解URL
function getURLList() {
  let URLList = {
    'page': '',
    'function': '',
    'lang': '',
  };
  const URLArray = document.URL.replace(/^.*?mentemori\.icu\//, '')
    .replaceAll('?', '&')
    .split('&');
  for (let i = 0; i < URLArray.length; i++) {
    let text = URLArray[i];
    if (!text) continue;
    if (text.includes('.html')) {
      URLList.page = text.replace('.html', '');
    } else {
      let list = text.split('=');
      if (list[0] == 'lang') {
        const LanguageList = ['EnUs', 'JaJp', 'ZhCn', 'ZhTw', 'KoKr'];
        if (LanguageList.includes(text.replace('lang=', ''))) {
          URLList.lang = text.replace('lang=', '');
        }
      } else {
        URLList[list[0]] = list[1];
      }
    }
  }
  return URLList;
}
//获取错误码
function getErrorCode() {
  if (!TextResource) return;
  let result = {};
  for (let i in TextResource) {
    if (i.includes('ErrorMessage')) {
      result[i.replace(/^ErrorMessage(.*?)$/, '$1') * 1] = TextResource[i];
    }
  }
  return result;
}
//组合url
function getURL(urllist, modifier) {
  let URLString = GlobalConstant.LocalURL;
  for (let i in modifier) {
    urllist[i] = modifier[i];
  }
  if (!!urllist.page) {
    URLString = URLString + urllist.page + '.html';
  }
  URLString = URLString + '?';
  for (let i in urllist) {
    if (i != 'page' && !!urllist[i]) {
      URLString = URLString + i + '=' + urllist[i] + '&';
    }
  }
  URLString = URLString.slice(0, -1);
  return URLString;
}
/*初始化功能*/
//初始化页面
async function initPage() {
  //原有功能进行翻译
  initTranslator();
  //本地化标题
  document.querySelector('title').innerHTML = LanguageTable['title'][GlobalURLList.lang];
  //追加导航栏格式
  document.querySelector('style').append(`
  nav a{
    display: inline-block;
    min-width: 22px;
    text-align: center;
    padding: 5px 0px;
  }
    `);
  //获取原导航栏
  const navDefault = document.querySelector('nav');
  //获取功能模块并本地化
  const divFunction = navDefault.childNodes[1];
  divFunction.innerHTML = '';
  divFunction.append(
    createElement('a', LanguageTable['basic'][GlobalURLList.lang]),
    createElement('a', 'API', {
      'href': getURL({ 'lang': GlobalURLList.lang }),
      'title': 'API',
    }),
    createElement('a', '|'),
    createElement('a', TextResource['CommonHeaderLocalRaidLabel'], {
      'href': getURL({ 'function': 'temple', 'lang': GlobalURLList.lang }),
      'title': 'temple',
    }),
    createElement('a', '|'),
    createElement('a', TextResource['RankingMenuTitle'], {
      'href': getURL({ 'page': 'rankings', 'lang': GlobalURLList.lang }),
      'title': 'rankings',
    }),
    createElement('a', '|'),
    createElement('a', TextResource['CommonHeaderLocalPvpLabel'], {
      'href': getURL({ 'function': 'arena', 'lang': GlobalURLList.lang }),
      'title': 'arena',
    }),
    createElement('a', '|'),
    createElement('a', TextResource['CommonHeaderGlobalPvpLabel'], {
      'href': getURL({ 'function': 'legend', 'lang': GlobalURLList.lang }),
      'title': 'legend',
    }),
    createElement('a', '|'),
    createElement('a', TextResource['CommonHeaderGvgLabel'], {
      'href': getURL({ 'page': 'localgvg', 'lang': GlobalURLList.lang }),
      'title': 'localgvg',
    }),
    createElement('a', '|'),
    createElement('a', TextResource['CommonHeaderGlobalGvgLabel'], {
      'href': getURL({ 'page': 'globalgvg', 'lang': GlobalURLList.lang }),
      'title': 'globalgvg',
    }),
    createElement('br'),
    createElement('a', LanguageTable['weekly'][GlobalURLList.lang], {}),
    createElement('a', TextResource['WeeklyTopicsTopCharacterHeadline'], {
      'href': getURL({ 'page': 'weekly_chara', 'lang': GlobalURLList.lang }),
      'title': 'weekly_chara',
    }),
    createElement('a', '|'),
    createElement('a', TextResource['WeeklyTopicsTopQuestHeadline'], {
      'href': getURL({ 'page': 'weekly_boss', 'lang': GlobalURLList.lang }),
      'title': 'weekly_boss',
    }),
    createElement('a', '|'),
    createElement('a', TextResource['CommonHeaderLocalPvpLabel'], {
      'href': getURL({ 'page': 'weekly_arena', 'lang': GlobalURLList.lang }),
      'title': 'weekly_arena',
    }),
    createElement('a', '|'),
    createElement('a', TextResource['CommonHeaderGlobalPvpLabel'], {
      'href': getURL({ 'page': 'weekly_legend', 'lang': GlobalURLList.lang }),
      'title': 'weekly_legend',
    }),
    createElement('br'),
    createElement('a', LanguageTable['hidden'][GlobalURLList.lang], {}),
    createElement('a', TextResource['BattleReportTitle'] + TextResource['CommonPlayLabel'], {
      'href': getURL({ 'page': 'battle_log', 'lang': GlobalURLList.lang }),
      'title': 'battle_log',
    }),
    createElement('a', '|'),
    createElement('a', TextResource['BattleClearPartyTitle'], {
      'href': getURL({ 'function': 'clearlist', 'lang': GlobalURLList.lang }),
      'title': 'clearlist',
    })
  );
  //获取语言账号模块
  const divLocal = navDefault.childNodes[3];
  const nodeSwitch = [divLocal.querySelector('#switch-light'), divLocal.querySelector('#switch-dark')];
  const nodeRefresh = createElement('a', '🔄');
  nodeRefresh.onclick = async () => {
    FreezeNode.classList.remove('hidden');
    await getTextResource(true);
    await getCharacter(true);
    await getEquipment(true);
    await getEquipmentSet(true);
    await getReinforcement(true);
    await getMatchless(true);
    await getLegend(true);
    await getSphere(true);
    await getEquipmentSkill(true);
    await getEquipmentExclusive(true);
    await getSkill(true);
    await getItem(true);
    await getLocalRaidQuest(true);
    window.location.href = document.URL;
  };
  const nodeClear = createElement('a', '🗑️');
  nodeClear.onclick = () => {
    FreezeNode.classList.remove('hidden');
    localStorage.clear();
    indexedDB.deleteDatabase('Static');
    indexedDB.deleteDatabase('Record');
    window.location.href = document.URL;
  };
  divLocal.innerHTML = '';
  let URLList = getURLList();
  divLocal.append(
    nodeSwitch[0],
    createElement('a', '|'),
    nodeSwitch[1],
    createElement('a', '　'),
    createElement('a', '　'),
    createElement('a', '　'),
    nodeRefresh,
    createElement('a', '|'),
    nodeClear,
    createElement('br'),
    createElement('a', '🇬🇧', {
      'href': getURL(URLList, { 'lang': 'EnUs' }),
      'title': 'EnUs',
    }),
    createElement('a', '|'),
    createElement('a', '🇯🇵', {
      'href': getURL(URLList, { 'lang': 'JaJp' }),
      'title': 'JaJp',
    }),
    createElement('a', '|'),
    createElement('a', '🇨🇳', {
      'href': getURL(URLList, { 'lang': 'ZhCn' }),
      'title': 'ZhCn',
    }),
    createElement('a', '|'),
    createElement('a', '🇭🇰', {
      'href': getURL(URLList, { 'lang': 'ZhTw' }),
      'title': 'ZhTw',
    }),
    createElement('a', '|'),
    createElement('a', '🇰🇷', {
      'href': getURL(URLList, { 'lang': 'KoKr' }),
      'title': 'KoKr',
    }),
    //ArEg;DeDe;EsMx;FrFr;IdId;PtBr;RuRu;ThTh;ViVn;
    createElement('br'),
    createElement('a', LanguageTable['account'][GlobalURLList.lang]),
    createElement('a', LanguageTable['noaccount'][GlobalURLList.lang])
  );
  //初始化扩展导航栏
  const navExtend = navDefault.insertAdjacentElement('afterend', createElement('nav'));
  navDefault.insertAdjacentElement('afterend', createElement('hr'));
  //初始化功能模块
  const divExtend = navExtend.appendChild(createElement('div'));
  divExtend.append(
    createElement('a', LanguageTable['extend'][GlobalURLList.lang]),
    //二进制文件转换功能
    createElement('a', LanguageTable['dataconvert'][GlobalURLList.lang], {
      'href': getURL({ 'function': 'fileConverter', 'lang': GlobalURLList.lang }),
      'title': 'fileConverter',
    }),
    createElement('a', '|'),
    //战斗布局功能
    createElement('a', LanguageTable['battlehelper'][GlobalURLList.lang], {
      'href': getURL({ 'function': 'gvgMapper', 'lang': GlobalURLList.lang }),
      'title': 'gvgMapper',
    })
  );
  //取消超链接
  document.querySelector(`[title="${GlobalURLList.function}"]`)?.removeAttribute('href');
  document.querySelector(`[title="${GlobalURLList.page}"]`)?.removeAttribute('href');
  document.querySelector(`[title="${GlobalURLList.lang}"]`)?.removeAttribute('href');
  //初始化账号管理模块
  const divAccount = navExtend.appendChild(createElement('div', '', 'accountmanager'));
  divAccount.append();
  //重构页面
  switch (GlobalURLList.function) {
    case 'fileConverter': {
      fileConverter();
      break;
    }
    case 'gvgMapper': {
      await gvgMapper();
      break;
    }
    case 'temple': {
      await temple();
      break;
    }
    case 'arena': {
      await arena();
      break;
    }
    case 'legend': {
      await arena();
      break;
    }
    case 'clearlist': {
      await clearlist();
      break;
    }
    default: {
    }
  }
  FreezeNode.classList.add('hidden');
}
//初始化选择栏
async function initSelect(addRegion = true, addGroup = true, addClass = true, addWorld = true) {
  //空选项
  const NullOption = () => {
    let option = new Option('-'.repeat(100), -1);
    option.classList.add('default');
    return option;
  };
  //获取世界分组
  const WorldGroup = await getWorldGroup();
  const RegionList = WorldGroup.RegionList;
  const GroupList = WorldGroup.GroupList;
  const ClassList = {
    '0': {
      'Name': LanguageTable['Local'][GlobalURLList.lang],
      'Class': 'static',
    },
    '1': {
      'Name': TextResource['GvgGroupLevelNameBronzeLabel'],
      'Class': 'dynamic',
    },
    '2': {
      'Name': TextResource['GvgGroupLevelNameSilverLabel'],
      'Class': 'dynamic',
    },
    '3': {
      'Name': TextResource['GvgGroupLevelNameGoldenLabel'],
      'Class': 'dynamic',
    },
  };
  const WorldList = WorldGroup.WorldList;
  const BlockList = {
    '0': {
      'Name': TextResource['GvgGroup1NameLabel'],
    },
    '1': {
      'Name': TextResource['GvgGroup2NameLabel'],
    },
    '2': {
      'Name': TextResource['GvgGroup3NameLabel'],
    },
    '3': {
      'Name': TextResource['GvgGroup4NameLabel'],
    },
  };
  //初始化选择区
  const divSelect = document.body.appendChild(createElement('div', '', 'selectpanel'));
  //选择栏样式
  document.querySelector('style').append(`
  #selectpanel {
    width: 700px;
    display: inline-block;
    vertical-align: top;
  }
  #selectpanel > p {
    text-align: center;
  }
  #selectpanel a {
    display: inline-block;
  }
  #selectpanel a:nth-child(1) {
    width: 75px;
    text-align: left;
  }
  #selectpanel a:nth-child(2) {
    width: 25px;
  }
  #selectpanel select {
    width: calc(100% - 120px);
  }
  #selectpanel button {
    width: 20%;
  }
  #selectpanel option {
    display: none;
  }
  #selectpanel option.default {
    display: inline;
  }
    `);
  //区域选择
  const pRegion = divSelect.appendChild(createElement('p', `<a>${LanguageTable['Region'][GlobalURLList.lang]}</a><a>:</a>`));
  if (!addRegion) {
    pRegion.style = 'display:none';
  }
  const selectRegion = pRegion.appendChild(createElement('select', '', 'listRegion'));
  selectRegion.options.add(NullOption());
  for (let RegionId in RegionList) {
    const Region = RegionList[RegionId];
    const option = new Option(Region.Name, RegionId);
    if (Region.GroupList.length > 0) {
      option.classList.add('default');
      selectRegion.options.add(option);
    }
  }
  //群组选择
  const pGroup = divSelect.appendChild(createElement('p', `<a>${TextResource['ChatTabSvS']}</a><a>:</a>`));
  if (!addGroup) {
    pGroup.style = 'display:none';
  }
  const selectGroup = pGroup.appendChild(createElement('select', '', 'listGroup'));
  selectGroup.options.add(NullOption());
  for (let GroupId in GroupList) {
    const Group = GroupList[GroupId];
    if (Group.WorldList.length > 0) {
      const text = Group.WorldList.map((value) => {
        return WorldList[value].SName;
      });
      const option = new Option(`${Group.Name}(${text})`, GroupId);
      if (GroupId[0] == 'N') {
        option.classList.add('GN');
      }
      option.classList.add('R' + Group.Region);
      selectGroup.options.add(option);
    }
  }
  //等级选择
  const pClass = divSelect.appendChild(createElement('p', `<a>${LanguageTable['Class'][GlobalURLList.lang]}</a><a>:</a>`));
  if (!addClass) {
    pClass.style = 'display:none';
  }
  const selectClass = pClass.appendChild(createElement('select', '', 'listClass'));
  selectClass.options.add(NullOption());
  for (let ClassId in ClassList) {
    const Class = ClassList[ClassId];
    const option = new Option(Class.Name, ClassId);
    option.classList.add(Class.Class);
    selectClass.options.add(option);
  }
  //世界/块选择
  const pWorld = divSelect.appendChild(createElement('p', `<a>${TextResource['TitleWarningListWorld']}</a><a>:</a>`));
  if (!addWorld) {
    pWorld.style = 'display:none';
  }
  const selectWorld = pWorld.appendChild(createElement('select', '', 'listWorld'));
  selectWorld.options.add(NullOption());
  for (let BlockId in BlockList) {
    const Block = BlockList[BlockId];
    const option = new Option(Block.Name, BlockId);
    option.classList.add('global');
    selectWorld.options.add(option);
  }
  for (let WorldId in WorldList) {
    const World = WorldList[WorldId];
    const option = new Option(World.Name, WorldId);
    option.classList.add('G' + World.Group);
    selectWorld.options.add(option);
  }
  //插入分割线
  document.body.append(createElement('hr'));
  /*按钮功能*/
  selectRegion.onchange = () => {
    selectGroup.value = -1;
    selectClass.value = -1;
    selectWorld.value = -1;
    changeSelect(selectRegion.value, -1, -1, -1);
  };
  selectGroup.onchange = () => {
    selectClass.value = -1;
    selectWorld.value = -1;
    changeSelect(selectRegion.value, selectGroup.value, -1, -1);
  };
  selectClass.onchange = () => {
    selectWorld.value = -1;
    changeSelect(selectRegion.value, selectGroup.value, selectClass.value, -1);
  };
  selectWorld.onchange = () => {
    changeSelect(selectRegion.value, selectGroup.value, selectClass.value, selectWorld.value);
  };
}
//初始化选择栏内容
function changeSelect(RegionId, GroupId, ClassId, WorldId) {
  let divSelect = document.querySelector('#selectpanel');
  divSelect.querySelector('style')?.remove();
  divSelect.append(
    createElement(
      'style',
      `
  #listGroup > option.R${RegionId} {
    display: inline;
  }
  #listClass > option.static
  ${GroupId == 'N' + RegionId ? '' : ',#listClass > option.dynamic'} {
    display: inline;
  }
  #listWorld > ${ClassId > 0 ? 'option.global' : 'option.G' + GroupId} {
    display: inline;
  }
  #listGroup > option.GN {
    display: ${ClassId == -1 ? 'none' : 'inline'};
  }
        `
    )
  );
  setStorage(GlobalURLList.function + 'RegionId', RegionId);
  setStorage(GlobalURLList.function + 'GroupId', GroupId);
  setStorage(GlobalURLList.function + 'ClassId', ClassId);
  setStorage(GlobalURLList.function + 'WorldId', WorldId);
}
//初始化内容
function initContent() {
  document.querySelector('style').append(`
  thead > tr {
    background: #aaf !important;
  }
  tbody > :nth-child(1) {
    background: #e8e8e8;
  }
  tbody {
    font-size: small;
    font-weight: normal;
  }
    `);
  while (document.body.childNodes.length > 7) {
    document.body.lastChild.remove();
  }
}
//初始化翻译
function initTranslator() {
  //替换含data-ja的标签，需人工维护
  let jalist = [];
  jalist[0] = document.querySelectorAll('[data-ja]');
  let template = document.querySelectorAll('template');
  for (let i = 0; i < template.length; i++) {
    jalist[i + 1] = template[i].content.querySelectorAll('[data-ja]');
  }
  for (let i = 0; i < jalist.length; i++) {
    for (let j = 0; j < jalist[i].length; j++) {
      dataja = jalist[i][j].getAttribute('data-ja');
      jalist[i][j].innerHTML = LanguageJa[dataja] ?? jalist[i][j].innerHTML + '|' + dataja;
    }
  }
  //替换HP
  const HPNode = document.querySelector('#HP');
  if (HPNode) {
    HPNode.parentElement.childNodes[0].innerHTML = TextResource['BattleParameterTypeHp'];
  }
  const gvgNode = document.querySelector('gvg-wrapper');
  if (gvgNode) {
    const map = gvgNode.querySelector('gvg-viewer').getAttributeNames()[0];
    const castleList = gvgNode.querySelectorAll('gvg-castle');
    for (let i = 0; i < castleList.length; i++) {
      const castleid = castleList[i].getAttribute('castle-id');
      castleList[i].querySelector('gvg-castle-name').innerHTML = TextResource[`${map.charAt(0).toUpperCase()}${map.slice(1)}GvgCastleName${castleid}`];
    }
  }
}
/*主功能*/
//文件转换
function fileConverter() {
  initContent();
  let nodeData = document.body.appendChild(
    createElement('div', '', {
      style: 'width: 100%;display: flex;flex-direction: column;flex-wrap: nowrap;',
    })
  );
  let uploadButton = nodeData.appendChild(
    createElement('input', '', {
      type: 'file',
      multiple: 'multiple',
    })
  );
  uploadButton.onchange = function () {
    for (let i = 0; i < this.files.length; i++) {
      let file = this.files[i];
      let filename = file.name;
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        let buffer = reader.result;
        let view = new Uint8Array(buffer);
        let data = await msgpack.decode(view);
        let file = new Blob([JSON.stringify(data)], { type: 'text/plain' });
        let link = createElement('a', filename + '.json');
        let url = window.URL.createObjectURL(file);
        link.href = url;
        link.download = filename + '.json';
        nodeData.appendChild(link);
        nodeData.appendChild(createElement('br'));
      };
      reader.onerror = function () {
        console.log(reader.error);
      };
    }
  };
  nodeData.append(createElement('br'));
}
//战斗布局
async function gvgMapper() {
  initContent();
  await initSelect();
  document.querySelector('style').append(`
  #guilds {
    display: inline-block;
    width: calc(100% - 820px);
    text-align: center;
  }
  gvg-list {
    display: block;
    position: fixed;
    top: 5%;
    width: 200px;
    height: 95%;
  }
  gvg-list#enermyList {
    left: calc(50% + 650px);
  }
  gvg-list#friendList {
    right: calc(50% + 650px);
  }
  gvg-list > h2 {
    text-align: center;
    margin: 0px;
  }
  gvg-list > div {
    height: calc(100% - 28px);
    overflow-y: scroll;
    scrollbar-width: thin;
    background: rgb(255, 127, 127);
  }
  data {
    display: block;
    width: 100%;
  }
    `);
  const divSelect = document.querySelector('#selectpanel');
  //插入公会列表面板
  divSelect.insertAdjacentElement('afterend', createElement('div', '', 'guilds'));
  /*初始化读写功能组*/
  const pRequest = divSelect.appendChild(createElement('p'));
  //读取按钮
  const buttonGetLocal = pRequest.appendChild(createElement('button', LanguageTable['ReadDatabase'][GlobalURLList.lang]));
  //保存按钮
  const buttonSetLocal = pRequest.appendChild(createElement('button', LanguageTable['SaveDatabase'][GlobalURLList.lang]));
  /*初始化监听功能组*/
  const pConnect = divSelect.appendChild(createElement('p'));
  //从服务器获取按钮
  const buttonGetServer = pConnect.appendChild(
    createElement('button', LanguageTable['FromServer'][GlobalURLList.lang], {
      name: 'Get',
    })
  );
  /*/开始监听按钮
    const buttonConnectServer = pConnect.appendChild(
      createElement('button', LanguageTable['StartUpdate'][GlobalURLList.lang], {
        name: 'Connect',
        disabled: 'true',
      })
    );
    //关闭监听按钮
    const buttonDisconnectServer = pConnect.appendChild(
      createElement('button', LanguageTable['CloseUpdate'][GlobalURLList.lang], {
        name: 'Disconnect',
        disabled: 'true',
      })
    );*/
  /*初始化数据栏*/
  document.body.append(createElement('data', ''));
  /*初始化世界选择*/
  let CacheRegionId = getStorage(GlobalURLList.function + 'RegionId');
  let CacheGroupId = getStorage(GlobalURLList.function + 'GroupId');
  let CacheClassId = getStorage(GlobalURLList.function + 'ClassId');
  let CacheWorldId = getStorage(GlobalURLList.function + 'WorldId');
  if (CacheWorldId >= 0) {
    document.querySelector('#listRegion').value = CacheRegionId;
    document.querySelector('#listGroup').value = CacheGroupId;
    document.querySelector('#listClass').value = CacheClassId;
    document.querySelector('#listWorld').value = CacheWorldId;
    changeSelect(CacheRegionId, CacheGroupId, CacheClassId, CacheWorldId);
  }
  /* 功能设定 */
  //读取数据
  buttonGetLocal.onclick = async () => {
    drawMap();
    await fillGuilds();
    const RegionId = getStorage(GlobalURLList.function + 'RegionId');
    const GroupId = getStorage(GlobalURLList.function + 'GroupId');
    const ClassId = getStorage(GlobalURLList.function + 'ClassId');
    const WorldId = getStorage(GlobalURLList.function + 'WorldId');
    if (WorldId < 0) {
      alert('未选择世界');
      return;
    }
    const Match = await getData(DataBase.Record.db, 'Match', `${GroupId}_${ClassId}_${WorldId}`);
    if (Match) {
      document.querySelector('gvg-viewer').setAttribute('guid', Match.guid);
      document.querySelector('gvg-viewer').setAttribute('region', RegionId);
      await fillMap(Match.Castles, Match.Guilds);
    } else {
      alert('没有该对战的城池信息，请从服务器获取');
    }
  };
  //保存数据
  buttonSetLocal.onclick = async () => {
    const MatchGuid = document.querySelector('gvg-viewer').getAttribute('guid');
    const RegionId = document.querySelector('gvg-viewer').getAttribute('region');
    let Match = {
      'Guid': MatchGuid,
      'Rigion': RegionId,
      'Castles': [],
      'Guilds': [],
    };
    const GuildDataList = document.querySelectorAll('tr[id]');
    for (let i = 0; i < GuildDataList.length; i++) {
      const GuildNode = GuildDataList[i];
      const GuildGuid = GuildNode.id;
      Match.Guilds.push(GuildGuid);
      let Guild = await getData(DataBase.Record.db, 'Guild', GuildGuid);
      Guild.Color = document.querySelector(`#style${GuildGuid}`).sheet.rules[0].style.backgroundColor.replace(/rgba\((.*?), 0.5\)/, '$1');
      updateData(DataBase.Record.db, 'Guild', Guild);
    }
    const CastleDataList = document.querySelectorAll('gvg-castle');
    for (let i = 0; i < CastleDataList.length; i++) {
      const CastleData = CastleDataList[i];
      const CastleId = CastleData.getAttribute('castle-id');
      let Castle = {
        'CastleId': CastleId,
        'GuildId': CastleData.getAttribute('defense'),
        'AttackerGuildId': CastleData.getAttribute('offense'),
        'AttackPartyCount': CastleData.querySelector('gvg-status-icon-offense').innerHTML,
        'DefensePartyCount': CastleData.querySelector('gvg-status-icon-defense').innerHTML,
        'LastWinPartyKnockOutCount': CastleData.querySelector('gvg-ko-count').innerHTML,
      };
      switch (CastleData.querySelector('gvg-status').getAttribute('state')) {
        case 'common': {
          Castle.GvgCastleState = 0;
          break;
        }
        case 'active': {
          Castle.GvgCastleState = 1;
          break;
        }
        case 'counter': {
          Castle.GvgCastleState = 3;
          break;
        }
        default: {
          Castle.GvgCastleState = 0;
        }
      }
      Match.Castles.push(Castle);
    }
    updateData(DataBase.Record.db, 'Match', Match);
  };
  //从服务器获取
  buttonGetServer.onclick = async () => {
    const RegionId = getStorage(GlobalURLList.function + 'RegionId');
    const GroupId = getStorage(GlobalURLList.function + 'GroupId');
    const ClassId = getStorage(GlobalURLList.function + 'ClassId');
    const WorldId = getStorage(GlobalURLList.function + 'WorldId');
    //从服务器获取战斗信息
    const _getGuildWar = await getGuildWar(ClassId, WorldId, GroupId);
    const MatchInfo = _getGuildWar?.data;
    if (MatchInfo) {
      //初始化页面
      drawMap();
      await fillGuilds();
      //从数据库获取战斗信息
      let Match = await getData(DataBase.Record.db, 'Match', `${GroupId}_${ClassId}_${WorldId}`);
      //若无信息则新建
      if (!Match) {
        Match = {
          'Guid': `${GroupId}_${ClassId}_${WorldId}`,
          'Region': RegionId,
          'LastUpdate': new Date(),
        };
      }
      //清除公会并写入
      Match.Guilds = [];
      for (let i in MatchInfo.guilds) {
        let GuildName = MatchInfo.guilds[i];
        let GuildId = i;
        //从数据库获取公会信息
        let Guild = await getData(DataBase.Record.db, 'Guild', `${RegionId}_${GuildId}`);
        //若无则新建
        if (!Guild) {
          Guild = {
            'Guid': `${RegionId}_${GuildId}`,
            'GuildId': GuildId,
            'Color': `${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)}`,
            'Relation': 0,
          };
        }
        //更新公会信息
        Guild.Name = GuildName;
        Guild.LastUpdate = new Date();
        //写入公会ID
        Match.Guilds.push(Guild.Guid);
        //更新数据库公会信息
        updateData(DataBase.Record.db, 'Guild', Guild);
      }
      //清除城池并写入
      Match.Castles = [];
      //序列化城池信息
      for (let i = 0; i < MatchInfo.castles.length; i++) {
        let castle = MatchInfo.castles[i];
        castle.GuildId = `${RegionId}_${castle.GuildId}`;
        castle.AttackerGuildId = `${RegionId}_${castle.AttackerGuildId}`;
        Match.Castles.push(castle);
      }
      //更新数据库战斗信息
      //updateData('Match', Match);
      //填充城池信息
      document.querySelector('gvg-viewer').setAttribute('guid', Match.Guid);
      document.querySelector('gvg-viewer').setAttribute('region', RegionId);
      await fillMap(Match.Castles, Match.Guilds);
    } else {
      alert('无法获取战斗信息');
    }
  };
  /*/开始监听
    buttonConnectServer.onclick = () => {
      const RegionId = getStorage(GlobalURLList.function + 'RegionId');
      const GroupId = getStorage(GlobalURLList.function + 'GroupId');
      const ClassId = getStorage(GlobalURLList.function + 'ClassId');
      const WorldId = getStorage(GlobalURLList.function + 'WorldId');
      if (WorldId == -1) {
        alert('未选择世界');
        return;
      }
      SocketGvG = new WebSocket('wss://api.mentemori.icu/gvg');
      SocketGvG.binaryType = 'arraybuffer';
      SocketGvG.onopen = async () => {
        buttonConnectServer.setAttribute('disabled', 'true');
        buttonDisconnectServer.removeAttribute('disabled');
        await loginAccount();
        const StreamID = {
          WorldId: (ClassId == 0) * WorldId, //
          ClassId: ClassId * 1,
          GroupId: (ClassId != 0) * GroupId,
          BlockId: (ClassId != 0) * WorldId,
          CastleId: 0,
        };
        const _getGuildWar = await getGuildWar(StreamID.ClassId, StreamID.WorldId, StreamID.GroupId);
        let Match = _getGuildWar?.data;
        if (Match) {
          let GuildList = [];
          for (let i in Match.guilds) {
            GuildList.push(i);
          }
          await fillMap(Match.castles, GuildList);
          sendData(SocketGvG, StreamID);
          LogCastleList = { 1: 50, 2: 50, 3: 50, 4: 50, 5: 50, 6: 50, 7: 50, 8: 50, 9: 50, 10: 50, 11: 50, 12: 50, 13: 50, 14: 50, 15: 50, 16: 50, 17: 50, 18: 50, 19: 50, 20: 50, 21: 50 };
          LogCastle();
        } else {
          alert('无法获取战斗信息');
          SocketGvG.close(1000, 'User Stop');
        }
      };
      SocketGvG.onmessage = async (e) => {
        const view = new DataView(e.data);
        let index = 0;
        while (index < view.byteLength) {
          let data = getStreamId(view, index);
          const StreamId = data.value;
          index = data.offset;
          switch (StreamId.CastleId) {
            case 0: {
              data = getGuild(view, index, StreamId.WorldId);
              const Guild = data.value;
              break;
            }
            case 31: {
              data = getPlayer(view, index, StreamId.WorldId);
              let Player = data.value;
              console.log(Player);
              break;
            }
            case 30: {
              data = getAttacker(view, index, StreamId.WorldId);
              let Attacker = data.value;
              console.log(Attacker);
              break;
            }
            case 29: {
              break;
            }
            case 28: {
              data = getLastLoginTime(view, index, StreamId.WorldId);
              let LastLoginTime = data.value;
              console.log(LastLoginTime);
              break;
            }
            case 27: {
              break;
            }
            case 26: {
              break;
            }
            case 25: {
              break;
            }
            case 24: {
              break;
            }
            case 23: {
              break;
            }
            case 22: {
              break;
            }
            default: {
              data = getCastle(view, index, StreamId.WorldId);
              let Castle = data.value;
              Castle.CastleId = StreamId.CastleId;
              changeCastle(Castle);
              const Now = new Date();
              const Time = (Now.getHours() * 60 + Now.getMinutes()) * 60 + Now.getSeconds();
              if (Time >= 74700 && Time <= 78300) {
                LogCastleList[StreamId.CastleId]++;
              }
              break;
            }
          }
          index = data.offset;
        }
      };
      SocketGvG.error = (e) => {
        console.log('WebSocket error');
      };
      SocketGvG.onclose = (e) => {
        if (e.code == 1000) {
          console.log('Connection closed, User Stop');
          buttonDisconnectServer.setAttribute('disabled', 'true');
          buttonConnectServer.removeAttribute('disabled');
        } else {
          console.log('Connection closed, retrying in 5s');
          setTimeout(() => {
            buttonConnectServer.removeAttribute('disabled');
            buttonConnectServer.click();
          }, 5000);
        }
      };
    };
    //关闭监听
    buttonDisconnectServer.onclick = () => {
      SocketGvG.close(1000, 'User Stop');
    };*/
}
/*优化功能*/
//优化神殿
async function temple() {
  //初始化页面
  initContent();
  //初始化选择栏
  await initSelect(true, true, false, false);
  let CacheRegionId = getStorage(GlobalURLList.function + 'RegionId');
  let CacheGroupId = getStorage(GlobalURLList.function + 'GroupId');
  const [selectRegion, selectGroup] = [document.querySelector('#listRegion'), document.querySelector('#listGroup')];
  if (CacheGroupId != '-1') {
    selectRegion.value = CacheRegionId;
    selectGroup.value = CacheGroupId;
    changeSelect(CacheRegionId, CacheGroupId, 0, -1);
  }
  selectGroup.addEventListener('change', fillTemple);
  //初始化显示选项
  let cacheCheckList = !getStorage('TempleCheckList') ? [true, true, true, true, true, true] : JSON.parse(getStorage('TempleCheckList'));
  let selectItem = document.querySelector('#selectpanel').appendChild(createElement('p', ''));
  selectItem.append(
    createElement('a', ''),
    createElement('a', ''),
    createElement('input', '', { 'type': 'checkbox', 'name': 'items' }), //
    createElement('a', TextResource['ItemName5']),
    createElement('input', '', { 'type': 'checkbox', 'name': 'items' }),
    createElement('a', TextResource['ItemName10']),
    createElement('input', '', { 'type': 'checkbox', 'name': 'items' }),
    createElement('a', TextResource['ItemName12']),
    createElement('input', '', { 'type': 'checkbox', 'name': 'items' }),
    createElement('a', TextResource['ItemName13']),
    createElement('input', '', { 'type': 'checkbox', 'name': 'items' }),
    createElement('a', TextResource['ItemName11']),
    createElement('input', '', { 'type': 'checkbox', 'name': 'items' }),
    createElement('a', TextResource['ItemName43'])
  );
  let listCheckBox = document.querySelectorAll('[name="items"]');
  for (let i = 0; i < listCheckBox.length; i++) {
    listCheckBox[i].checked = cacheCheckList[i];
    listCheckBox[i].onchange = changeTempleDisplay;
  }
  //插入标题
  document.body.appendChild(createElement('h2', TextResource['CommonHeaderLocalRaidLabel']));
  //插入数据节点
  document.head.querySelector('style').append(`
  data {
    display: block;
    width: 100%;
  }
    `);
  document.body.appendChild(createElement('data', ''));
  //插入数据
  await fillTemple();
  changeTempleDisplay();
}
//优化竞技场
async function arena() {
  const type = GlobalURLList.function;
  //清除内容
  initContent();
  //初始化选择栏，
  await initSelect(true, true, false, type == 'arena' ? true : false);
  //插入标题
  document.body.appendChild(createElement('h2', type == 'arena' ? TextResource['CommonHeaderLocalPvpLabel'] : TextResource['CommonHeaderGlobalPvpLabel']));
  //插入数据栏
  document.body.appendChild(createElement('data', ''));
  document.querySelector('style').append(`
  data {
    display: flex;
    position: relative;
    width: 100%;
    padding: 0px;
    justify-content: space-between;
  }
    `);
  //获取缓存
  let CacheRegionId = getStorage(GlobalURLList.function + 'RegionId');
  let CacheGroupId = getStorage(GlobalURLList.function + 'GroupId');
  let CacheWorldId = getStorage(GlobalURLList.function + 'WorldId');
  //写入缓存
  const [selectRegion, selectGroup, selectClass, selectWorld] = [document.querySelector('#listRegion'), document.querySelector('#listGroup'), document.querySelector('#listClass'), document.querySelector('#listWorld')];
  if ((type == 'legend' && CacheGroupId != '-1') || (type == 'arena' && CacheWorldId != '-1')) {
    selectRegion.value = CacheRegionId;
    selectGroup.value = CacheGroupId;
    selectClass.value = type == 'arena' ? 0 : -1;
    selectWorld.value = CacheWorldId;
    changeSelect(CacheRegionId, CacheGroupId, selectClass.value, CacheWorldId);
    selectGroup.onchange = () => {
      selectWorld.value = -1;
      changeSelect(selectRegion.value, selectGroup.value, selectClass.value, -1);
    };
    document.querySelector(`#list${type == 'arena' ? 'World' : 'Group'}`).addEventListener('change', fillTeam);
    await fillTeam();
  }
}
//优化通关阵容
async function clearlist() {
  const Id = GlobalURLList.id;
  //清除内容
  initContent();
  //初始化Token栏
  document.body.append(
    createElement(
      'p',
      `
      <a>${TextResource['GuildMemberRecruitSearchTab']}GUID</a>
      <input type="text" size="36" name="guid">
      <input type="button" value="${TextResource['GuildMemberRecruitSearchTab']}" name="clearparty">
      `
    ),
    createElement(
      'p',
      `
      <a>${TextResource['GuildMemberRecruitSearchOption']}</a>
      <a name="payload"></a>
      `
    ),
    createElement('hr', ''),
    createElement('h2', TextResource['BattleClearPartyTitle']),
    createElement('data', '')
  );
  document.querySelector('style').append(`
  data {
    display: flex;
    position: relative;
    width: 100%;
    padding: 0px;
    justify-content: space-between;
  }
    `);
  //插入功能
  document.querySelector('input[type="button"][name="clearparty"]').onclick = fillTeam;
  if (Id) {
    document.querySelector('input[type="text"][name="guid"]').value = Id;
    await fillTeam();
  }
}
/*子功能*/
//登录账号
async function loginAccount() {
  console.log('检查状态');
  let _getUserData = await getUserData();
  if (!_getUserData.UserSyncData) {
    console.log('未登录，开始登陆');
    const RegionId = getStorage(GlobalURLList.function + 'RegionId');
    const WorldId = RegionId * 1000 + 1;
    GlobalVariable.ortegaaccesstoken = '';
    const RegionList = {
      1: 'JP', //日本
      2: 'KR', //韩国
      3: 'TW', //台湾省，HK(香港区)/MO(澳门区)
      4: 'US', //美国，CA(加拿大)/PM(圣皮埃尔和密克隆)
      5: 'GB' /*英国，IS(冰岛)/IE(爱尔兰)/AZ(阿塞拜疆)/AL(阿尔巴尼亚)/AM(亚美尼亚)/
                          AD(安道尔)/IT(意大利)/UA(乌克兰)/EE(爱沙尼亚)/AT(奥地利)/
                          AX(奥兰)/GG(根西)/MK(北马其顿)/GR(希腊)/GL(格陵兰)/
                          HR(克罗地亚)/SM(圣马力诺)/GI(直布罗陀)/JE(泽西)/GE(格鲁吉亚)/
                          CH(瑞士)/SE(瑞典)/SJ(斯瓦尔巴和扬马延)/ES(西班牙)/SK(斯洛伐克)/
                          SI(斯洛文尼亚)/RS(塞尔维亚)/CZ(捷克)/DK(丹麦)/DE(德国)/
                          NO(挪威)/VA(梵蒂冈)/HU(匈牙利)/FI(芬兰)/FO(法罗群岛)/
                          FR(法国)/BG(保加利亚)/BY(白俄罗斯)/PL(波兰)/BA(波黑)/
                          PT(葡萄牙)/IM(马恩岛)/MC(摩纳哥)/MD(摩尔多瓦)/ME(黑山)/
                          LV(拉脱维亚)/LT(立陶宛)/LI(列支敦士登)/RO(罗马尼亚)/LU(卢森堡)*/,
      6: 'CN', //所有不在上面的
    };
    const CountryCode = RegionList[RegionId];
    let Accounts = JSON.parse(getStorage('Accounts') ?? '{}');
    let Account = Accounts[RegionId];
    //若Account不存在
    if (!Account) {
      const AuthToken = await getAuthToken();
      const ortegauuid = crypto.randomUUID().replaceAll('-', '');
      const AdverisementId = crypto.randomUUID();
      const _createUser = await createUser(AuthToken, AdverisementId, CountryCode, ortegauuid);
      Account = {};
      Account.AdverisementId = AdverisementId;
      Account.ortegauuid = ortegauuid;
      setStorage('ortegauuid', ortegauuid);
      let UserId = prompt('请输入引继码，若使用临时账号请留空或点取消\n警告：本工具使用时会多次进行账号操作，及易被判定为违规，建议使用临时账号！');
      //若不使用引继码
      if (!UserId) {
        Account.UserId = _createUser.UserId;
        Account.ClientKey = _createUser.ClientKey;
      }
      //若使用引继码
      else {
        Account.UserId = UserId;
        const FromUserId = _createUser.UserId;
        const Password = prompt('请输入引继码，若使用临时账号请留空');
        const _getComebackUserData = await getComebackUserData(FromUserId, UserId, Password, AuthToken);
        const _comebackUser = await comebackUser(FromUserId, _getComebackUserData.OneTimeToken, UserId);
        Account.ClientKey = _comebackUser.ClientKey;
      }
      Accounts[RegionId] = Account;
    } else {
      setStorage('ortegauuid', Account.ortegauuid);
    }
    const _login = await login(Account.ClientKey, Account.AdverisementId, Account.UserId);
    const PlayerDataInfoList = _login.PlayerDataInfoList;
    let WorldData;
    for (let i = 0; i < PlayerDataInfoList.length; i++) {
      const PlayerData = PlayerDataInfoList[i];
      if (PlayerData.WorldId == WorldId) {
        WorldData = {
          PlayerId: PlayerData.PlayerId,
          Password: PlayerData.Password,
        };
      }
    }
    if (!WorldData) {
      const _createWorldPlayer = await createWorldPlayer(WorldId);
      WorldData = {
        PlayerId: _createWorldPlayer.PlayerId,
        Password: _createWorldPlayer.Password,
      };
    }
    const _getServerHost = await getServerHost(WorldId);
    GlobalVariable.userURL = _getServerHost.ApiHost;
    GlobalVariable.MagicOnionHost = _getServerHost.MagicOnionHost;
    GlobalVariable.MagicOnionPort = _getServerHost.MagicOnionPort;
    const _loginPlayer = await loginPlayer(WorldData.PlayerId, WorldData.Password);
    GlobalVariable.AuthTokenOfMagicOnion = _loginPlayer.AuthTokenOfMagicOnion;
    _getUserData = await getUserData();
    setStorage('Accounts', JSON.stringify(Accounts));
  }
  console.log('已登陆');
  document.querySelector('#accountmanager>a:nth-child(2)').innerHTML = _getUserData?.UserSyncData.UserStatusDtoInfo.Name;
}
//战斗布局-绘制地图
function drawMap() {
  const ClassId = getStorage(GlobalURLList.function + 'ClassId');
  let nodeData = document.querySelector('data');
  nodeData.innerHTML = '';
  document.querySelector('gvg-list')?.remove();
  document.querySelector('gvg-list')?.remove();
  //document.body.append(createElement('gvg-list', '<h2>我方列表</h2><div></div>', 'friendList'));
  //document.body.append(createElement('gvg-list', '<h2>敌方列表</h2><div></div>', 'enermyList'));
  if (ClassId) {
    const castleList = {
      'local': {
        '1': {
          'left': '640px',
          'top': '560px',
          'type': 'temple',
        },
        '2': {
          'left': '858px',
          'top': '514px',
          'type': 'castle',
        },
        '3': {
          'left': '741px',
          'top': '699px',
          'type': 'castle',
        },
        '4': {
          'left': '422px',
          'top': '695px',
          'type': 'castle',
        },
        '5': {
          'left': '470px',
          'top': '433px',
          'type': 'castle',
        },
        '6': {
          'left': '708px',
          'top': '360px',
          'type': 'church',
        },
        '7': {
          'left': '1000px',
          'top': '280px',
          'type': 'church',
        },
        '8': {
          'left': '1145px',
          'top': '391px',
          'type': 'church',
        },
        '9': {
          'left': '1089px',
          'top': '600px',
          'type': 'church',
        },
        '10': {
          'left': '945px',
          'top': '690px',
          'type': 'church',
        },
        '11': {
          'left': '815px',
          'top': '171px',
          'type': 'church',
        },
        '12': {
          'left': '828px',
          'top': '872px',
          'type': 'church',
        },
        '13': {
          'left': '761px',
          'top': '1092px',
          'type': 'church',
        },
        '14': {
          'left': '646px',
          'top': '969px',
          'type': 'church',
        },
        '15': {
          'left': '560px',
          'top': '807px',
          'type': 'church',
        },
        '16': {
          'left': '435px',
          'top': '1008px',
          'type': 'church',
        },
        '17': {
          'left': '261px',
          'top': '734px',
          'type': 'church',
        },
        '18': {
          'left': '186px',
          'top': '549px',
          'type': 'church',
        },
        '19': {
          'left': '258px',
          'top': '367px',
          'type': 'church',
        },
        '20': {
          'left': '358px',
          'top': '219px',
          'type': 'church',
        },
        '21': {
          'left': '563px',
          'top': '177px',
          'type': 'church',
        },
      },
      'global': {
        '1': {
          'left': '640px',
          'top': '560px',
          'type': 'temple',
        },
        '2': {
          'left': '803px',
          'top': '503px',
          'type': 'castle',
        },
        '3': {
          'left': '747px',
          'top': '718px',
          'type': 'castle',
        },
        '4': {
          'left': '418px',
          'top': '725px',
          'type': 'castle',
        },
        '5': {
          'left': '484px',
          'top': '439px',
          'type': 'castle',
        },
        '6': {
          'left': '691px',
          'top': '265px',
          'type': 'church',
        },
        '7': {
          'left': '986px',
          'top': '301px',
          'type': 'church',
        },
        '8': {
          'left': '1144px',
          'top': '402px',
          'type': 'church',
        },
        '9': {
          'left': '1107px',
          'top': '567px',
          'type': 'church',
        },
        '10': {
          'left': '958px',
          'top': '627px',
          'type': 'church',
        },
        '11': {
          'left': '891px',
          'top': '177px',
          'type': 'church',
        },
        '12': {
          'left': '906px',
          'top': '884px',
          'type': 'church',
        },
        '13': {
          'left': '743px',
          'top': '1131px',
          'type': 'church',
        },
        '14': {
          'left': '520px',
          'top': '1007px',
          'type': 'church',
        },
        '15': {
          'left': '560px',
          'top': '851px',
          'type': 'church',
        },
        '16': {
          'left': '309px',
          'top': '985px',
          'type': 'church',
        },
        '17': {
          'left': '250px',
          'top': '728px',
          'type': 'church',
        },
        '18': {
          'left': '112px',
          'top': '602px',
          'type': 'church',
        },
        '19': {
          'left': '260px',
          'top': '420px',
          'type': 'church',
        },
        '20': {
          'left': '198px',
          'top': '259px',
          'type': 'church',
        },
        '21': {
          'left': '495px',
          'top': '158px',
          'type': 'church',
        },
      },
    };
    const Class = ClassId == 0 ? 'local' : 'global';
    const image = Class == 'local' ? 'base_ribbon_01' : 'base_metal';
    let style = nodeData.appendChild(
      createElement(
        'style',
        `
  gvg-viewer {
    display: block;
    position: relative;
    width: 1280px;
    height: 1280px;
    font-family: sans-serif;
    background-size: cover;
    background-image: url(assets/${Class}gvg.png);
    padding: 0px;
    margin: auto;
  }
  gvg-castle {
    display: block;
    position: absolute;
    user-select: none;
  }
  gvg-status {
    width: 164px;
    height: 50px;
    display: block;
    position: absolute;
    left: -82px;
    right: -82px;
    bottom: 43px;
  }
  gvg-attacker {
    display: block;
    width: 165px;
    position: absolute;
    text-align: center;
    font-size: 16px;
    opacity: 0.8;
  }
  gvg-status-icon-defense,
  gvg-status-icon-offense {
    display: block;
    width: 32px;
    height: 33px;
    position: absolute;
    text-align: center;
    line-height: 37px;
    font-size: 12px;
    color: #fff;
    background-size: cover;
  }
  gvg-status-icon-defense {
    background-image: url(assets/icon_gvg_party_defense.png);
  }
  gvg-status-icon-offense {
    background-image: url(assets/icon_gvg_party_offense.png);
  }
  gvg-status-bar-offense,
  gvg-status-bar-defense {
    display: block;
    width: 90px;
    height: 20px;
    padding: 0 10px;
    position: absolute;
    font-size: 9px;
    color: #fff;
    background-size: cover;
  }
  gvg-status[state="common"] > gvg-attacker {
    display: none;
  }
  gvg-status[state="common"] > gvg-status-icon-defense {
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
  }
  gvg-status[state="common"] > gvg-status-icon-offense {
    display: none;
  }
  gvg-status[state="common"] > gvg-status-bar-defense {
    width: 131px;
    height: 12px;
    margin: auto;
    left: 0;
    right: 0;
    top: 35px;
    text-align: center;
    line-height: 12px;
    background-image: url(assets/base_s_08_blue.png);
  }
  gvg-status[state="common"] > gvg-status-bar-offense {
    display: none;
  }
  gvg-status[state="active"] > gvg-status-icon-defense {
    right: 0;
    bottom: 0;
  }
  gvg-status[state="active"] > gvg-status-icon-offense {
    left: 0;
    bottom: 0;
  }
  gvg-status[state="active"] > gvg-status-bar-defense {
    right: 25px;
    bottom: 0;
    text-align: right;
    line-height: 24px;
    background-image: url(assets/base_s_09_blue.png);
  }
  gvg-status[state="active"] > gvg-status-bar-offense {
    left: 25px;
    bottom: 10px;
    text-align: left;
    line-height: 16px;
    background-image: url(assets/base_s_09_red.png);
  }
  gvg-status[state="counter"] > gvg-status-icon-defense {
    left: 0;
    bottom: 0;
    background-image: url(${GlobalConstant.assetURL}icon_gvg_party_offense_counter.png);
  }
  gvg-status[state="counter"] > gvg-status-icon-offense {
    right: 0;
    bottom: 0;
    background-image: url(assets/icon_gvg_party_defense.png);
  }
  gvg-status[state="counter"] > gvg-status-bar-defense {
    left: 25px;
    bottom: 10px;
    text-align: left;
    line-height: 16px;
    background-image: url(assets/base_s_09_red.png);
  }
  gvg-status[state="counter"] > gvg-status-bar-offense {
    right: 25px;
    bottom: 0;
    text-align: right;
    line-height: 24px;
    background-image: url(assets/base_s_09_blue.png);
  }
  gvg-ko-count-container {
    position: absolute;
    width: 76px;
    left: -38px;
    top: -19px;
    display: block;
    color: #eee;
    text-shadow: red 0 0 30px red 0 0 5px;
  }
  gvg-ko-count {
    display: block;
    font-size: 26px;
    text-align: center;
    width: 100%;
  }
  gvg-ko-count-label:after {
    content: 'KOs';
    font-size: 14px;
    position: absolute;
    display: block;
    text-align: center;
    width: 100%;
    height: 14px;
    top: 26px;
    left: 0;
  }
  gvg-castle-icon {
    display: block;
    position: absolute;
    background-size: cover;
  }
  gvg-castle[church] > gvg-castle-icon {
    left: -28px;
    right: -28px;
    bottom: -25px;
    width: 56px;
    height: 50px;
    background-image: url(assets/Castle_0_0.png);
  }
  gvg-castle[castle] > gvg-castle-icon {
    left: -31px;
    right: -31px;
    bottom: -33px;
    width: 62px;
    height: 67px;
    background-image: url(assets/Castle_0_1.png);
  }
  gvg-castle[temple] > gvg-castle-icon {
    left: -39px;
    right: -39px;
    bottom: -40px;
    width: 78px;
    height: 80px;
    background-image: url(assets/Castle_0_2.png);
  }
  gvg-castle-name {
    display: block;
    position: absolute;
    background-size: cover;
    width: 140px;
    height: 26px;
    font-size: 9px;
    text-align: center;
  }
  gvg-castle-name {
    background-image: url(assets/${image}.png);
    width: 140px;
    height: 26px;
    left: -70px;
    right: -70px;
    color: ${Class == 'local' ? '#473d3b' : 'white'};
    line-height: 33px;
  }
  gvg-castle[church] > gvg-castle-name {
    bottom: -45px;
  }
  gvg-castle[castle] > gvg-castle-name {
    bottom: -50px;
  }
  gvg-castle[temple] > gvg-castle-name {
    bottom: -58px;
  }
  gvg-castle[temple] > .gvg-castle-symbol {
    left: -70px;
    bottom: -58px;
    width: 33px;
    height: 29px;
    position: absolute;
    display: block;
  }
  gvg-castle[castle] > .gvg-castle-symbol {
    left: -70px;
    bottom: -50px;
    width: 33px;
    height: 29px;
    position: absolute;
    display: block;
  }
  gvg-castle[church] > .gvg-castle-symbol {
    left: -70px;
    bottom: -45px;
    width: 33px;
    height: 29px;
    position: absolute;
    display: block;
  }
  gvg-castle-hint {
    left: -70px;
    right: -70px;
    background: rgba(32, 32, 32, 0.5);
    width: 140px;
    color: white;
    position: absolute;
    display: block;
    font-size: 10px;
    text-align: center;
    word-break: break-word;
  }
  gvg-castle[temple] > gvg-castle-hint {
    top: 58px;
  }
  gvg-castle[castle] > gvg-castle-hint {
    top: 50px;
  }
  gvg-castle[church] > gvg-castle-hint {
    top: 45px;
  }
          `
      )
    );
    let viewer = nodeData.appendChild(createElement('gvg-viewer'));
    viewer.setAttribute(Class, '');
    for (let CastleId in castleList[Class]) {
      let castle = castleList[Class][CastleId];
      let castleNode = viewer.appendChild(createElement('gvg-castle', '', { 'castle-id': CastleId }));
      castleNode.setAttribute(castle.type, 'true');
      let status = castleNode.appendChild(
        createElement('gvg-status', '', {
          state: 'common',
        })
      );
      const NodeOffense = status.appendChild(createElement('gvg-status-bar-offense'));
      NodeOffense.onclick = (e) => {
        changeGuild(e.target);
      };
      const NodeDefense = status.appendChild(createElement('gvg-status-bar-defense'));
      NodeDefense.onclick = (e) => {
        changeGuild(e.target);
      };
      //隐藏进攻方
      const IconOffense = status.appendChild(createElement('gvg-status-icon-offense', 0));
      IconOffense.onclick = (e) => {
        e.target.parentNode.setAttribute('state', 'common');
      };
      //显示进攻方
      const IconDefense = status.appendChild(createElement('gvg-status-icon-defense', 0));
      IconDefense.onclick = (e) => {
        e.target.parentNode.setAttribute('state', 'active');
      };
      //反攻形态
      const NodeAttacker = status.appendChild(createElement('gvg-attacker', '⚔️'));
      NodeAttacker.onclick = (e) => {
        e.target.parentNode.setAttribute('state', 'counter');
      };
      castleNode.append(createElement('gvg-castle-icon'));
      //增加提示
      const NodeCastleName = castleNode.appendChild(createElement('gvg-castle-name', TextResource[`${Class.charAt(0).toUpperCase()}${Class.slice(1)}GvgCastleName${CastleId}`]));
      NodeCastleName.onclick = (e) => {
        let exist = e.target.parentNode.querySelector('gvg-castle-hint');
        let image = e.target.parentNode.querySelector('.gvg-castle-symbol');
        let hint = prompt('输入添加的提示,然后输入"|"(不带引号),再输入标识代码(A1:攻击1;A2:攻击2;D1:防御1;D2:防御2;F1:禁止;F2:旗帜)\n若标识代码为空则移除图标,其他代码则为你确认知道的图片名称,包含相对路径,路经确认:\nhttps://github.com/rainsillwood/MaintanceMoriHelper/tree/main/assets', exist ? exist.innerHTML : '');
        if (hint == '' || hint == undefined) {
          exist.remove();
          return;
        }
        hint = hint.split('|');
        if (!exist) {
          exist = e.target.parentNode.appendChild(createElement('gvg-castle-hint', hint[0]));
        } else {
          exist.innerHTML = hint[0];
        }
        if (image) {
          image.remove();
        }
        if (hint[1]) {
          image = e.target.parentNode.appendChild(createElement('img'));
          image.classList.add('gvg-castle-symbol');
          const imageName = {
            A1: 'icon_gvg_marker_1',
            A2: 'icon_gvg_marker_2',
            D1: 'icon_gvg_marker_3',
            D2: 'icon_gvg_marker_4',
            F1: 'icon_gvg_marker_5',
            F2: 'icon_gvg_marker_6',
          };
          image.src = `${GlobalConstant.assetURL}${imageName[hint[1]] ?? hint[1]}.png`;
        }
      };
      let kos = castleNode.appendChild(createElement('gvg-ko-count-container'));
      kos.classList.add('hidden');
      kos.append(createElement('gvg-ko-count', 0), createElement('gvg-ko-count-label'));
      style.append(`
  gvg-viewer[${Class}] gvg-castle[castle-id="${CastleId}"] {
    left: ${castle.left};
    top: ${castle.top};
  }
        `);
    }
  }
}
//战斗布局-填充地图
async function fillMap(CastleList, GuildList) {
  //await updateServerData(GuildList);
  await fillGuilds(GuildList);
  for (let i = 0; i < CastleList.length; i++) {
    await changeCastle(CastleList[i]);
  }
}
//战斗布局-重置表格
async function fillGuilds(GuildList) {
  FreezeNode.classList.remove('hidden');
  let divGuildList = document.querySelector('#guilds');
  divGuildList.innerHTML = '';
  divGuildList.appendChild(
    createElement(
      'style',
      `
  th,
  td {
    height: 24px;
    border: 1px solid black;
    text-align: center;
  }
  table {
    width: 300px;
    border-collapse: collapse;
    display: inline-table;
    vertical-align: top;
  }
  #guilds1 {
    margin-left: 20px;
  }
  #guilds2 {
    margin-right: 20px;
  }
  tr > * {
    width: 25px;
  }
  tr > :nth-child(2) {
    width: calc(100% - 25px);
  }
      `
    )
  );
  let textTable = `
      <thead>
        <tr>
          <th>■</th>
          <th>${TextResource['GuildName']}</th>
          <th>${LanguageTable['Friendly'][GlobalURLList.lang]}</th>
          <th>${LanguageTable['Neutral'][GlobalURLList.lang]}</th>
          <th>${LanguageTable['Enermy'][GlobalURLList.lang]}</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
  divGuildList.appendChild(createElement('table', textTable));
  divGuildList.appendChild(createElement('table', textTable));
  if (GuildList) {
    let listTable = divGuildList.querySelectorAll('table');
    let count = 0;
    for (let i = 0; i < GuildList.length; i++) {
      const Guid = GuildList[i];
      const Guild = await getData(DataBase.Record.db, 'Guild', Guid);
      changeColor(Guid, Guild.Color);
      let nodeGuild = createElement('tr', '', Guid);
      let nodeColor = nodeGuild.appendChild(createElement('td', '■', { class: ['GuildColor'] }));
      nodeColor.onclick = (e) => {
        const Color = prompt('请输入设定颜色，形式为R,G,B');
        changeColor(e.target.parentNode.id, Color);
      };
      nodeGuild.append(
        createElement('td', Guild.Name), //
        createElement('td', `<input type="radio" name="${Guid}" value="friendly"${Guild.Relation > 0 ? ' checked="true"' : ''}>`),
        createElement('td', `<input type="radio" name="${Guid}" value="neutral"${Guild.Relation == 0 ? ' checked="true"' : ''}>`),
        createElement('td', `<input type="radio" name="${Guid}" value="enermy"${Guild.Relation < 0 ? ' checked="true"' : ''}>`)
      );
      listTable[count < GuildList.length / 2 ? 0 : 1].querySelector('tbody').append(nodeGuild);
      count++;
    }
  }
  FreezeNode.classList.add('hidden');
}
//战斗布局-更新数据
async function updateServerData(GuildList) {
  let PlayerDataList = [];
  for (let i = 0; i < GuildList.length; i++) {
    const Guid = `${getStorage(GlobalURLList.function + 'RegionId')}_${GuildList[i]}`;
    let Guild = (await getData(DataBase.Record.db, 'Guild', Guid)) ?? {
      'Guid': Guid,
      'GuildId': GuildList[i],
      'Color': '0, 0, 0',
      'Relation': 'neutral',
      'LastUpdate': 0,
    };
    if (Guild.LastUpdate < Today(4, 0, 0)) {
      const _searchGuildId = await searchGuildId(GuildList[i]);
      const GuildData = _searchGuildId?.SearchResult.GuildInfo;
      Guild.Name = GuildData.GuildOverView.GuildName;
      Guild.GuildLevel = GuildData.GuildLevel;
      Guild.LastUpdate = new Date();
      updateData(DataBase.Record.db, 'Guild', Guild);
      PlayerDataList = PlayerDataList.concat(_searchGuildId?.SearchResult.PlayerInfoList);
    }
  }
  for (let i = 0; i < PlayerDataList.length; i++) {
    const PlayerData = PlayerDataList[i];
    const Guid = `${getStorage(GlobalURLList.function + 'RegionId')}_${PlayerData.PlayerId}`;
    let Player = (await getData(DataBase.Record.db, 'Player', Guid)) ?? {
      'Guid': Guid,
      'PlayerId': PlayerData.PlayerId,
    };
    Player.Name = PlayerData.PlayerName;
    Player.Guild = PlayerData.GuildId;
    Player.Level = PlayerData.PlayerLevel;
    Player.BattlePower = PlayerData.BattlePower;
    updateData(DataBase.Record.db, 'Player', Player);
  }
  const Day = new Date() - 7 * 24 * 3600 * 1000;
  const DeckData = await getArray(DataBase.Record.db, 'Deck', { '<': Day }, 'LastUpdate');
  const CharacterData = await getArray(DataBase.Record.db, 'Character', { '<': Day }, 'LastUpdate');
  const BattleData = await getArray(DataBase.Record.db, 'Battle', { '<': Day }, 'LastUpdate');
  while (DeckData.length > 0 && CharacterData.length > 0 && BattleData.length > 0) {
    removeData(DataBase.Record.db, 'Deck', DeckData.shift()?.Guid);
    removeData(DataBase.Record.db, 'Character', CharacterData.shift()?.Guid);
    removeData(DataBase.Record.db, 'Battle', BattleData.shift()?.Guid);
  }
}
//战斗布局-修改城池
async function changeCastle(CastleData) {
  if (CastleData.GvgCastleState == 2) {
    CastleData.GuildId = CastleData.AttackerGuildId;
  }
  if (CastleData.GvgCastleState % 2 == 0) {
    CastleData.AttackerGuildId = 0;
  }
  const DefenseGuild = await getData(DataBase.Record.db, 'Guild', CastleData.GuildId);
  const OffenseGuild = await getData(DataBase.Record.db, 'Guild', CastleData.AttackerGuildId);
  const CastleNode = document.querySelector(`gvg-castle[castle-id="${CastleData.CastleId}"]`);
  CastleNode.setAttribute('defense', CastleData.GuildId);
  CastleNode.setAttribute('offense', CastleData.AttackerGuildId);
  CastleNode.querySelector('gvg-status-bar-defense').innerHTML = DefenseGuild?.Name ?? '';
  CastleNode.querySelector('gvg-status-bar-offense').innerHTML = OffenseGuild?.Name ?? '';
  CastleNode.querySelector('gvg-status-icon-defense').innerHTML = CastleData.DefensePartyCount;
  CastleNode.querySelector('gvg-status-icon-offense').innerHTML = CastleData.AttackPartyCount;
  if (CastleData.GvgCastleState == 1) {
    CastleNode.querySelector('gvg-status').setAttribute('state', 'active');
  } else if (CastleData.GvgCastleState == 3) {
    CastleNode.querySelector('gvg-status').setAttribute('state', 'counter');
  } else {
    CastleNode.querySelector('gvg-status').setAttribute('state', 'common');
  }
  CastleNode.querySelector('gvg-ko-count').innerHTML = CastleData.LastWinPartyKnockOutCount;
}
//战斗布局-修改颜色
function changeColor(GuildId, Color) {
  document.querySelector(`#style${GuildId}`)?.remove();
  document.head.append(
    createElement(
      'style',
      `
  gvg-castle[defense="${GuildId}"] gvg-castle-icon {
    background-color: rgba(${Color}, 0.5);
  }
  gvg-castle[offense="${GuildId}"] gvg-attacker {
    background-color: rgba(${Color}, 0.625);
  }
  tr[id="${GuildId}"] td:nth-child(1) {
    color: rgba(${Color}, 1);
  }
        `,
      `style${GuildId}`
    )
  );
}
//战斗布局-修改公会
function changeGuild(target) {
  const Class = getStorage(GlobalURLList.function + 'ClassId') == 0 ? 'Local' : 'Global';
  const trList = document.querySelectorAll('tbody > tr');
  const dialogGuild = document.body.appendChild(createElement('dialog', `<a>请选择公会：</a>`));
  const CastleID = target.parentNode.parentNode.getAttribute('castle-id');
  dialogGuild.onclose = (e) => {
    const select = e.target.querySelector('select');
    const castle = document.querySelector(`gvg-castle[castle-id="${select.getAttribute('castle')}"]`);
    const target = select.getAttribute('target');
    castle.setAttribute(target.split('-').pop(), select.value);
    castle.querySelector(target).innerHTML = select.selectedOptions[0].innerHTML;
    dialogGuild.remove();
  };
  const selectGuild = dialogGuild.appendChild(
    createElement('select', '', {
      castle: CastleID,
      target: target.tagName,
    })
  );
  selectGuild.options.add(
    createElement('option', TextResource[`${Class}GvgNpcGuildName${CastleID}`], {
      value: '0',
    })
  );
  for (let i = 0; i < trList.length; i++) {
    const tr = trList[i];
    selectGuild.options.add(
      createElement('option', tr.childNodes[1].innerHTML, {
        value: tr.id,
      })
    );
  }
  selectGuild.value = target.parentNode.parentNode.getAttribute(target.tagName.replace('GVG-STATUS-BAR-', ''));
  dialogGuild.showModal();
}
//战斗布局-获取城池信息
function LogCastle() {
  LogCastleTimer = setTimeout(async function LogCastleQuest() {
    for (let CastleId in LogCastleList) {
      if (LogCastleList[CastleId] > 0) {
        const _getLocalGvgCastleInfoDialogData = await getLocalGvgCastleInfoDialogData(CastleId * 1);
        if (_getLocalGvgCastleInfoDialogData.CastleBattleHistoryInfos) {
          const Now = new Date();
          const BattleTime = Today(20, 45, 0);
          for (let i = 0; i < _getLocalGvgCastleInfoDialogData.CastleBattleHistoryInfos.length; i++) {
            const BattleData = _getLocalGvgCastleInfoDialogData.CastleBattleHistoryInfos[i];
            const Time = new Date(Today(Math.floor(BattleData[1] / 100), BattleData[1] % 100, 0) - (Now > BattleTime ? 0 : 24 * 60 * 60 * 1000));
            let Battle = await getData(DataBase.Record.db, 'Battle', BattleData[0]);
            if (!Battle) {
              updateData(DataBase.Record.db, 'Battle', {
                'Guid': BattleData[0],
                'LastUpdate': Time,
              });
              const DeckDataList = [BattleData[2][0], BattleData[3][0]];
              for (let j in DeckDataList) {
                const DeckData = DeckDataList[j];
                let Deck = {
                  'Guid': `${Time.toLocaleDateString().replaceAll('/', '_')}_${DeckData[6]}`,
                  'DeckId': DeckData[6],
                  'PlayerId': DeckData[2],
                  'Content': [],
                  'LastUpdate': Time,
                };
                for (let k in DeckData[1]) {
                  const CharacterData = DeckData[1][k];
                  let Character = {
                    'Guid': CharacterData.UserCharacterInfo.Guid,
                    'CharacterId': CharacterData.UserCharacterInfo.CharacterId,
                    'PlayerId': CharacterData.UserCharacterInfo.PlayerId,
                    'Level': CharacterData.UserCharacterInfo.Level,
                    'SubLevel': CharacterData.UserCharacterInfo.SubLevel,
                    'BattlePower': CharacterData.BattlePower,
                    'LastUpdate': Time,
                  };
                  Deck.Content.push(Character.Guid);
                  updateData(DataBase.Record.db, 'Character', Character);
                }
                updateData(DataBase.Record.db, 'Deck', Deck);
              }
            }
          }
          LogCastleList[CastleId] = 0;
        }
      }
    }
    LogCastleTimer = setTimeout(LogCastleQuest, 100);
  }, 100);
}
//战斗布局-更新战力监控面板
function updateBattlePanel() {
  const divFrined = document.querySelector('gvg-list#friendList>div');
  const divEnermy = document.querySelector('gvg-list#enermyList>div');
  const trFrined = document.querySelectorAll('');
}
//优化神殿-获取信息
async function fillTemple() {
  FreezeNode.classList.remove('hidden');
  const ItemList = await getItem();
  //初始化数据节点
  let nodeData = document.querySelector('data');
  nodeData.innerHTML = '';
  nodeData.append(
    createElement(
      'style',
      `
  table {
    display: inline-block;
    vertical-align: top;
  }
  th > div {
    text-align: left;
    word-break: keep-all;
  }
  thead th {
    text-align: center;
  }
  tbody th {
    width: 140px;
  }
  tbody img {
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }
  tbody > tr > :nth-child(1) {
    width: 330px;
    text-align: left;
  }
  tbody > tr > :nth-child(1) > div {
    display: inline-block;
    vertical-align: middle;
    width: 215px;
  }
  tbody > tr > :nth-child(1) img {
    width: 110px;
    height: 68px;
  }
  div[name="banner"] {
    width: 110px !important;
  }
  div[name="desc"] {
    font-size: x-large;
  }
      `
    )
  );
  const GroupId = getStorage(GlobalURLList.function + 'GroupId');
  if (GroupId != -1) {
    const nodesWorld = document.querySelectorAll(`.G${GroupId}`);
    for (let i = 0; i < nodesWorld.length; i++) {
      let WorldId = nodesWorld[i].value;
      const QuestInfoBuffer = await sendGMRequest(`https://api.mentemori.icu/${WorldId}/temple/latest`, {});
      const QuestArray = JSON.parse(QuestInfoBuffer)?.data.quest_ids;
      const LocalRaidQuestList = await getLocalRaidQuest();
      let table = nodeData.appendChild(
        createElement(
          'table',
          `
              <thead>
                <tr>
                  <th colspan="4">
                    <h3>${TextResource['TitleWarningListWorld']}:W${WorldId % 100}</h3>
                  </th>
                </tr>
                <tr>
                  <th name="LocalRaidLevel"></th>
                  <th>${TextResource['CommonFirstRewardLabel']}${LanguageTable['Containfixed'][GlobalURLList.lang]}</th>
                  <th>${TextResource['CommonFixedRewardLabel']}</th>
                  <th>${TextResource['LocalRaidQuestEventRewardLabel']}</th>
                </tr>
              </thead>
            `,
          WorldId
        )
      );
      let nodeTbody = table.appendChild(createElement('tbody', ''));
      for (let j = QuestArray.length - 1; j >= 0; j--) {
        const QuestGuid = QuestArray[j];
        let Quest = QuestGuid > 999999 ? LocalRaidQuestList[8000000000 + (QuestGuid % 100000000)] : LocalRaidQuestList[QuestGuid * 1];
        let QuestBannerId = QuestGuid > 999999 ? QuestGuid.toString().slice(0, -8) + Quest.LocalRaidBannerId.toString().slice(-1) : Quest.LocalRaidBannerId.toString();
        let QuestNameId = `LocalRaidName${QuestGuid > 999999 ? 107 + QuestGuid.toString().slice(0, -8) / 10 : Quest.LocalRaidBannerId}`;
        if (j == 0) {
          table.querySelector('th[name="LocalRaidLevel"]').innerHTML = TextResource['LocalRaidTrainingLevelFormat'].replace('{0}', Quest.LocalRaidLevel);
        }
        let nodeTr = nodeTbody.appendChild(
          createElement(
            'tr',
            `
            <th>
              <div name="banner">
                <img src="${GlobalConstant.assetURL}Banner/LocalRaid/RQB_${'0'.repeat(6 - QuestBannerId.length)}${QuestBannerId}.png">
              </div>
              <div name="desc">
                <div>${TextResource[QuestNameId]}</div>
                <div>${'☆'.repeat(Quest.Level > 5 ? 5 : Quest.Level)}${'★'.repeat(Quest.Level > 5 ? Quest.Level - 5 : 0)}</div>
              </div>
            </th>
            <th name="first"></th>
            <th name="fixed"></th>
            <th name="event"></th>
            `,
            { 'banner': QuestBannerId }
          )
        );
        for (let k = Quest.FixedBattleReward.length - 1; k >= 0; k--) {
          const FixedBattleReward = Quest.FixedBattleReward[k];
          const FirstBattleReward = Quest.FirstBattleReward[k];
          let isCoin = FixedBattleReward.ItemId == 1 && FixedBattleReward.ItemType == 3 ? 'coin' : '';
          const ItemId = FirstBattleReward.ItemType == 50 ? `${(QuestGuid.toString().slice(0, -8) * 3) / 10 - 1}@50` : `${FirstBattleReward.ItemId}@${FirstBattleReward.ItemType}`;
          const Item = ItemList[ItemId];
          const IconId = Item.IconId.toString();
          const Icon = `${GlobalConstant.assetURL}Icon/Item/Item_${'0'.repeat(4 - IconId.length)}${IconId}.png`;
          for (const l of ['first', 'fixed', 'event']) {
            nodeTr.querySelector(`th[name="${l}"]`)?.appendChild(
              createElement(
                'div',
                `
                  <img src="${Icon}" alt="${TextResource[Item.NameKey.slice(1, -1)]}">
                  <a>×${
                    (l == 'first' ? FirstBattleReward.ItemCount : 0) + //仅初次
                    (l != 'event' ? FixedBattleReward.ItemCount : 0) + //初次与固定
                    (l == 'event' ? Math.ceil(FixedBattleReward.ItemCount * 0.1) : 0) //仅增
                  }</a>
                  `,
                { 'item': isCoin }
              )
            );
          }
        }
      }
    }
  }
  FreezeNode.classList.add('hidden');
}
//优化神殿-改变高亮
function changeTempleDisplay() {
  document.querySelector('#styleItem')?.remove();
  let listCheckBox = document.querySelectorAll('[name="items"]');
  let checkList = [];
  for (let i = 0; i < listCheckBox.length; i++) {
    checkList.push(listCheckBox[i].checked);
  }
  document.head.appendChild(
    createElement(
      'style',
      `
  div[item="coin"] {
    display: ${checkList[0] ? 'block' : 'none'};
  }
  tr[banner="${checkList[1] ? '1' : '0'}"] {
    background-color: rgb(128, 255, 255);
  }
  tr[banner="${checkList[2] ? '2' : '0'}"] {
    background-color: rgb(128, 255, 128);
  }
  tr[banner="${checkList[3] ? '3' : '0'}"] {
    background-color: rgb(255, 128, 128);
  }
  tr[banner="${checkList[4] ? '4' : '0'}"] {
    background-color: rgb(255, 128, 255);
  }
  tr[banner="${checkList[5] ? '5' : '0'}"] {
    background-color: rgb(255, 255, 128);
  }
        `,
      'styleItem'
    )
  );
  setStorage('TempleCheckList', JSON.stringify(checkList));
}
//优化竞技场-获取信息
async function fillTeam() {
  FreezeNode.classList.remove('hidden');
  const CharacterList = await getCharacter();
  const EquipmentList = await getEquipment();
  const EquipmentSetList = await getEquipmentSet();
  const Reinforcement = await getReinforcement();
  const MatchlessList = await getMatchless();
  const LegendList = await getLegend();
  const SphereList = await getSphere();
  const EquipmenSkillList = await getEquipmentSkill();
  const EquipmentExclusiveList = await getEquipmentExclusive();
  const SkillList = await getSkill();
  const CharacterRarity = {
    '1': { 'rarity': 'N', 'plus': false, 'star': 0 },
    '2': { 'rarity': 'R', 'plus': false, 'star': 0 },
    '4': { 'rarity': 'R', 'plus': true, 'star': 0 },
    '8': { 'rarity': 'SR', 'plus': false, 'star': 0 },
    '16': { 'rarity': 'SR', 'plus': true, 'star': 0 },
    '32': { 'rarity': 'SSR', 'plus': false, 'star': 0 },
    '64': { 'rarity': 'SSR', 'plus': true, 'star': 0 },
    '128': { 'rarity': 'UR', 'plus': false, 'star': 0 },
    '256': { 'rarity': 'UR', 'plus': true, 'star': 0 },
    '512': { 'rarity': 'LR', 'plus': false, 'star': 0 },
    '1024': { 'rarity': 'LR', 'plus': false, 'star': 1 },
    '2048': { 'rarity': 'LR', 'plus': false, 'star': 2 },
    '4096': { 'rarity': 'LR', 'plus': false, 'star': 3 },
    '8192': { 'rarity': 'LR', 'plus': false, 'star': 4 },
    '16384': { 'rarity': 'LR', 'plus': false, 'star': 5 },
    '32768': { 'rarity': 'LR', 'plus': false, 'star': 6 },
    '65536': { 'rarity': 'LR', 'plus': false, 'star': 7 },
    '131072': { 'rarity': 'LR', 'plus': false, 'star': 8 },
    '262144': { 'rarity': 'LR', 'plus': false, 'star': 9 },
    '524288': { 'rarity': 'LR', 'plus': false, 'star': 10 },
  };
  const EquipmenRarity = {
    '1': { 'rarity': 'D' },
    '2': { 'rarity': 'C' },
    '4': { 'rarity': 'B' },
    '8': { 'rarity': 'A' },
    '16': { 'rarity': 'S' },
    '32': { 'rarity': 'R' },
    '64': { 'rarity': 'SR' },
    '128': { 'rarity': 'SSR' },
    '256': { 'rarity': 'UR' },
    '512': { 'rarity': 'LR' },
  };
  //初始化数据栏
  let nodeData = document.querySelector('data');
  nodeData.innerHTML = '';
  nodeData.append(
    createElement(
      'style',
      `
table {
  display: inline-table;
  vertical-align: top;
}
tbody tr > :nth-child(1) {
  width: 20px;
}
th[name="player"] {
  position: relative;
  width: 150px;
  text-align: left;
}
th[name='player'] > [name='world'] {
  position: absolute;
  right: 0px;
  top: 0px;
  font-size: x-large;
}
th[name='player'] > div[name="point"] {
  display: flex;
  justify-content: space-between;
}
th character {
  display: block;
  width: 79px;
}
icon {
  display: inline-block;
  position: relative;
  width: 138px;
  height: 138px;
}
character icon {
  zoom: 50%;
}
icon > img {
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 128px;
  height: 128px;
  background-color: grey;
  background-size: cover;
}
rarity {
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 138px;
  height: 138px;
  background-size: cover;
}
[rarity="N"] > icon > rarity {
  background-image: url('assets/char_frame_n.png');
}
[rarity="R"] > icon > rarity {
  background-image: url('assets/char_frame_r.png');
}
[rarity="SR"] > icon > rarity {
  background-image: url('assets/char_frame_sr.png');
}
[rarity="SSR"] > icon > rarity {
  background-image: url('assets/char_frame_ssr.png');
}
[rarity="UR"] > icon > rarity {
  background-image: url('assets/char_frame_ur.png');
}
[rarity="LR"] > icon > rarity {
  background-image: url('assets/char_frame_lr.png');
}
[rarity="S"] > icon > rarity {
  background-image: url('${GlobalConstant.assetURL}/frame_common_s.png');
}
[rarity="A"] > icon > rarity {
  background-image: url('${GlobalConstant.assetURL}/frame_common_a.png');
}
[rarity="B"] > icon > rarity {
  background-image: url('${GlobalConstant.assetURL}/frame_common_b.png');
}
[rarity="C"] > icon > rarity {
  background-image: url('${GlobalConstant.assetURL}/frame_common_c.png');
}
[rarity="D"] > icon > rarity {
  background-image: url('${GlobalConstant.assetURL}/frame_common_d.png');
}
decoration {
  display: none;
  position: absolute;
  right: 1px;
  bottom: 1px;
  width: 37px;
  height: 37px;
}
[plus="true"] decoration {
  display: block;
}
[rarity="R"] decoration {
  background-image: url('${GlobalConstant.assetURL}/frame_decoration_rplus.png');
}
[rarity="SR"] decoration {
  background-image: url('${GlobalConstant.assetURL}/frame_decoration_srplus.png');
}
[rarity="SSR"] decoration {
  background-image: url('${GlobalConstant.assetURL}/frame_decoration_srplus.png');
}
[rarity="UR"] decoration {
  background-image: url('${GlobalConstant.assetURL}/frame_decoration_srplus.png');
}
icon > level {
  display: block;
  position: absolute;
  font-size: x-large;
  font-weight: normal;
  text-shadow: 2px 0 black, -2px 0 black, 0 2px black, 0 -2px black, 2px 2px black, -2px -2px black, 2px -2px black, -2px 2px black;
}
character > icon > level {
  right: 10px;
  top: 5px;
  color: powderblue;
}
stars {
  position: absolute;
  width: 100px;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  text-align: left;
}
stars > * {
  display: inline-block;
  height: 20px;
  width: 20px;
  background-size: cover;
}
[star="0"] stars > * {
  display: none;
}
[star="1"] stars > :nth-child(n + 1) {
  display: none;
}
[star="2"] stars > :nth-child(n + 2) {
  display: none;
}
[star="3"] stars > :nth-child(n + 3) {
  display: none;
}
[star="4"] stars > :last-child {
  display: none;
}
star {
  background-image: url('${GlobalConstant.assetURL}/icon_rarity_plus_star_1.png');
}
[star="6"] stars > :first-child {
  background-image: url('${GlobalConstant.assetURL}/icon_rarity_plus_star_2.png');
}
[star="7"] stars > :nth-child(-n + 2) {
  background-image: url('${GlobalConstant.assetURL}/icon_rarity_plus_star_2.png');
}
[star="8"] stars > :nth-child(-n + 3) {
  background-image: url('${GlobalConstant.assetURL}/icon_rarity_plus_star_2.png');
}
[star="9"] stars > :nth-child(-n + 4) {
  background-image: url('${GlobalConstant.assetURL}/icon_rarity_plus_star_2.png');
}
[star="10"] stars > * {
  background-image: url('${GlobalConstant.assetURL}/icon_rarity_plus_star_2.png');
}
element {
  display: block;
  position: absolute;
  left: 5px;
  top: 5px;
  width: 32px;
  height: 32px;
  background-size: cover;
}
[element="1"] element {
  background-image: url('${GlobalConstant.assetURL}/icon_element_1.png');
}
[element="2"] element {
  background-image: url('${GlobalConstant.assetURL}/icon_element_2.png');
}
[element="3"] element {
  background-image: url('${GlobalConstant.assetURL}/icon_element_3.png');
}
[element="4"] element {
  background-image: url('${GlobalConstant.assetURL}/icon_element_4.png');
}
[element="5"] element {
  background-image: url('${GlobalConstant.assetURL}/icon_element_5.png');
}
[element="6"] element {
  background-image: url('${GlobalConstant.assetURL}/icon_element_6.png');
}
[element="1"] {
  background-color: #8080ff;
}
[element="2"] {
  background-color: #ff8080;
}
[element="3"] {
  background-color: #80ff80;
}
[element="4"] {
  background-color: #ffff80;
}
[element="5"] {
  background-color: #ffffff;
}
[element="6"] {
  background-color: #000000;
  color: white;
}
th[selected] character {
  background-color: #80ffff !important;
  color: black !important;
  outline: 4px #ff80ff solid;
}
tr[selected] {
  position: sticky;
  top: 1vh;
  bottom: 1vh;
  z-index: 100;
  outline: 4px #ff80ff solid;
}
info {
  display: inline-flex;
  justify-content: space-between;
  position: sticky;
  width: calc(100% - 600px);
  height: 100vh;
  top: 0vh;
  margin-left: 10px;
}
info > div[name="equipment"] {
  display: inline-grid;
  grid-template-rows: 33% 33% 33%;
  grid-template-columns: 49.5% 49.5%;
  grid-auto-flow: column;
  width: 66%;
  height: 100%;
  gap: 0.5% 1%;
}
equipment {
  display: block;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  border-width: 2px;
  border-style: solid;
  overflow-y: scroll;
  scrollbar-width: none;
}
[rarity="D"] {
  border-color: #805500;
}
[rarity="C"] {
  border-color: #808080;
}
[rarity="B"] {
  border-color: #808000;
}
[rarity="A"] {
  border-color: #550080;
}
[rarity="S"] {
  border-color: #800000;
}
[rarity="R"]{
  border-color: #c0c0c0;
}
[rarity="SR"]{
  border-color: #c0c000;
}
[rarity="SSR"]{
  border-color: #8000c0;
}
[rarity="UR"]{
  border-color: #c00000;
}
[rarity="LR"] {
  border-color: #404040;
}
equipment > icon {
  zoom: 50%;
}
equipment > icon > level {
  left: 10px;
  top: 5px;
  color: white;
}
reinforcement {
  display: block;
  position: absolute;
  right: 10px;
  bottom: 5px;
  color: palegoldenrod;
  font-size: x-large;
  font-weight: normal;
  text-shadow: 2px 0 black, -2px 0 black, 0 2px black, 0 -2px black, 2px 2px black, -2px -2px black, 2px -2px black, -2px 2px black;
}
desc {
  display: inline-block;
  vertical-align: top;
}
equipment desc {
  width: calc(100% - 74px);
}
character desc {
  width: calc(100% - 143px);
  margin-left: 5px;
}
madel {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-size: cover;
  vertical-align: top;
}
[quality="1"] madel {
  background-image: url('${GlobalConstant.assetURL}/icon_equipment_medal_1.png');
}
[quality="2"] madel {
  background-image: url('${GlobalConstant.assetURL}/icon_equipment_medal_2.png');
}
[quality="3"] madel {
  background-image: url('${GlobalConstant.assetURL}/icon_equipment_medal_3.png');
}
[quality="4"] madel {
  background-image: url('${GlobalConstant.assetURL}/icon_equipment_medal_4.png');
}
raritydesc {
  display: inline-block;
  color: #805500;
  font-size: 18px;
  width: 56px;
  vertical-align: top;
  text-align: center;
}
[rarity="C"] raritydesc {
  color: #808080;
}
[rarity="B"] raritydesc {
  color: #808000;
}
[rarity="A"] raritydesc {
  color: #550080;
}
[rarity="S"] raritydesc {
  color: #800000;
}
[rarity="R"] raritydesc{
  color: #c0c0c0;
}
[rarity="SR"] raritydesc{
  color: #c0c000;
}
[rarity="SSR"] raritydesc{
  color: #8000c0;
}
[rarity="UR"] raritydesc{
  color: #c00000;
}
[rarity="LR"] raritydesc {
  color: #404040;
}
equipment desc name {
  display: inline-block;
  width: calc(100% - 80px);
  font-size: 18px;
}
setname {
  display: block;
}
equipment desc setname {
  display: inline-block;
  font-size: 16px;
}
equipment > desc > :nth-child(1) {
  height: 46px;
}
category {
  display: inline-block;
  width: 21px;
  height: 21px;
  background-size: cover;
  vertical-align: bottom;
  margin: 0px 5px;
}
category[category="1_0"] {
  background-image: url('${GlobalConstant.assetURL}/icon_equipment_weapon_sniper_01.png');
}
category[category="1_1"] {
  background-image: url('${GlobalConstant.assetURL}/icon_equipment_weapon_warrior_01.png');
}
category[category="1_2"] {
  background-image: url('${GlobalConstant.assetURL}/icon_equipment_weapon_sorcerer_01.png');
}
category[category="2_0"] {
  background-image: url('${GlobalConstant.assetURL}/icon_equipment_sub_01.png');
}
category[category="3_0"] {
  background-image: url('${GlobalConstant.assetURL}/icon_equipment_gauntlet_01.png');
}
category[category="4_0"] {
  background-image: url('${GlobalConstant.assetURL}/icon_equipment_helmet_01.png');
}
category[category="5_0"] {
  background-image: url('${GlobalConstant.assetURL}/icon_equipment_armor_01.png');
}
category[category="6_0"] {
  background-image: url('${GlobalConstant.assetURL}/icon_equipment_shoes_01.png');
}
parameter_type {
  width: 100%;
  display: block;
  font-size: medium;
}
parameter_subtype {
  width: 100%;
  display: block;
  font-size: small;
}
parameter_set {
  width: 100%;
  display: block;
  font-size: x-small;
}
treasure {
  display: inline-block;
  width: 25%;
  margin-left: 5px;
}
parameter {
  display: inline-flex;
  width: calc(50% - 10px);
  margin: 0px 5px;
  justify-content: space-between;
}
parameter > * {
  display: inline-block;
}
parameter_set[type="sphere"] icon {
  zoom: 25%;
}
sphere {
  display: inline-block;
  width: 25%;
  vertical-align: top;
  text-align: center;
  font-size: xx-small;
}
sphere level {
  font-size: xx-large;
  color: white;
}
sphere name {
  display: block;
}
info > div[name="character"] {
  display: inline-block;
  width: 33%;
  height: calc(100% - 4px);
  overflow-y: scroll;
  scrollbar-width: thin;
  border-width: 2px;
  border-style: solid;
}
div[name="character"] character {
  display: block;
  width: 100%;
  background: none;
  color: black;
}
div[name="character"] icon {
  zoom: 75%;
}
job {
  display: inline-block;
  width: 24px;
  height: 24px;
  vertical-align: bottom;
  background-size: cover;
  margin-right: 5px;
}
[job="1"] job {
  background-image: url('${GlobalConstant.assetURL}/icon_job_warrior.png');
}
[job="2"] job {
  background-image: url('${GlobalConstant.assetURL}/icon_job_sniper.png');
}
[job="4"] job {
  background-image: url('${GlobalConstant.assetURL}/icon_job_sorcerer.png');
}
lore {
  display: block;
  width: 100%;
  font-size: small;
  height: 34px;
}
bp {
  display: block;
  width: 100%;
}
parameter_set[type="exclusive"] p {
  margin-left: 5px;
}
parameter_set[type="exclusive"] effect {
  color: grey;
}
skilllevel {
  display: inline-block;
  color: grey;
}
skill {
  display: inline;
  color: grey;
}
unlocked {
  display: inline;
  color: red !important;
}
parameter_set[type="exclusive"] > div {
  margin-bottom: 2px;
}
parameter_set[type="exclusive"][unlock] effect,
parameter_set[type="exclusive"][unlock][rarity="SSR"] [order="SSR"] *,
parameter_set[type="exclusive"][unlock][rarity="UR"] [order="SSR"] *,
parameter_set[type="exclusive"][unlock][rarity="UR"] [order="UR"] *,
parameter_set[type="exclusive"][unlock][rarity="LR"] [order="SSR"] *,
parameter_set[type="exclusive"][unlock][rarity="LR"] [order="UR"] *,
parameter_set[type="exclusive"][unlock][rarity="LR"] [order="LR"] * {
  color: black;
}
parameter_set[type="exclusive"][rarity="SSR"] [order="SSR"] unlocked,
parameter_set[type="exclusive"][rarity="UR"] [order="SSR"] unlocked,
parameter_set[type="exclusive"][rarity="UR"] [order="UR"] unlocked,
parameter_set[type="exclusive"][rarity="LR"] [order="SSR"] unlocked,
parameter_set[type="exclusive"][rarity="LR"] [order="UR"] unlocked,
parameter_set[type="exclusive"][rarity="LR"] [order="LR"] unlocked {
  display: none;
}
effect {
  display: inline-flex;
  width: 75%;
  margin: 0px 5px;
  justify-content: space-between;
}
effect > * {
  display: inline-block;
}
parameter_set[type="set"] div {
  color: grey;
}
parameter_set[type="set"] > div {
  margin-bottom: 2px;
}
parameter_set[type="set"] > [count="2"] > div[require="2"],
parameter_set[type="set"] > [count="3"] > div[require="2"],
parameter_set[type="set"] > [count="4"] > div[require="2"],
parameter_set[type="set"] > [count="5"] > div[require="2"],
parameter_set[type="set"] > [count="6"] > div[require="2"],
parameter_set[type="set"] > [count="4"] > div[require="4"],
parameter_set[type="set"] > [count="5"] > div[require="4"],
parameter_set[type="set"] > [count="6"] > div[require="4"],
parameter_set[type="set"] > [count="6"] > div[require="6"] {
  color: black;
}
parameter_set[type="potential"] > div {
  margin-bottom: 2px;
}
parameter[main] {
  visibility: hidden;
}
parameter_set[type="potential"][job="1"] [order="1"] parameter[main],
parameter_set[type="potential"][job="2"] [order="2"] parameter[main],
parameter_set[type="potential"][job="4"] [order="3"] parameter[main] {
  visibility: visible;
}
parameter_set[type="skill"] {
  margin-bottom: 5px;
}
parameter_set[type="skill"] skills {
  display: flex;
  justify-content: space-between;
}
parameter_set[type="skill"] icon {
  width: 100px;
  height: 100px;
  zoom: 60%;
}
parameter_set[type="skill"] icon img {
  height: 100px;
  width: 100px;
}
parameter_set[type="skill"] icon level {
  display: flex;
  justify-content: center;
  align-items: end;
  height: 100%;
  width: 100%;
  font-size: xx-large;
  color: white;
}
parameter_set[type="skill"] icon[level="0"] level {
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
}
parameter_set[type="skill"] > div[type="icon"] {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 5px 0px;
}
parameter_set[type="skill"] icon[selected] {
  outline: aqua 8px solid;
}
parameter_set[type="skill"] [order] a {
  display: inline-block;
}
parameter_set[type="skill"] div[order] {
  display: none;
}
parameter_set[type="skill"] div[order][selected] {
  display: block;
}
parameter_set[type="skill"] div[order] > :nth-child(1) {
  font-size: small;
}
parameter_set[type="skill"] div[order] > :nth-child(2) > :nth-child(1) {
  width: 40%;
}
parameter_set[type="skill"] div[order] > div[unlock] > * {
  color: black;
}
parameter_set[type="skill"] div[order] > div[unlock] > unlocked {
  display: none;
}
      `
    )
  );
  let searchURL;
  switch (GlobalURLList.function) {
    case 'arena': {
      const WorldId = getStorage('arenaWorldId');
      if (!WorldId) return;
      searchURL = `https://api.mentemori.icu/${WorldId}/arena/latest`;
      break;
    }
    case 'legend': {
      const GroupId = getStorage('legendGroupId');
      if (!GroupId) return;
      searchURL = `https://api.mentemori.icu/wg/${GroupId}/legend/latest`;
      break;
    }
    case 'clearlist': {
      let guid = document.querySelector('input[type="text"][name="guid"]').value;
      searchURL = `https://static.mentemori.icu/clear-info/${guid}.json`;
      break;
    }
    default: {
      searchURL = '';
    }
  }
  let nodeTable = nodeData.appendChild(
    createElement(
      'table',
      `
        <thead>
          <tr>
            <th>No.</th>
            <th>${TextResource['CommonPlayerNameLabel']}</th>
            <th>${LanguageTable['Slot 1'][GlobalURLList.lang]}</th>
            <th>${LanguageTable['Slot 2'][GlobalURLList.lang]}</th>
            <th>${LanguageTable['Slot 3'][GlobalURLList.lang]}</th>
            <th>${LanguageTable['Slot 4'][GlobalURLList.lang]}</th>
            <th>${LanguageTable['Slot 5'][GlobalURLList.lang]}</th>
          </tr>
        </thead>
        `
    )
  );
  let nodePanel = nodeData.appendChild(createElement('info', ''));
  const TeamInfoBuffer = await sendGMRequest(searchURL, {});
  const TeamInfo = JSON.parse(TeamInfoBuffer);
  const TeamList = TeamInfo.result || TeamInfo.data;
  if (!TeamList) return;
  if (TeamInfo.payload) {
    document.querySelector('a[name="payload"]').innerHTML = JSON.stringify(TeamInfo.payload);
  }
  let nodeTbody = nodeTable.appendChild(createElement('tbody', ''));
  for (let i = 0; i < TeamList.length; i++) {
    const Player = TeamList[i];
    let nodeTr = nodeTbody.appendChild(
      createElement(
        'tr',
        `
          <th>
            <div>${i + 1}</div>
            <div name="record"></div>
          </th>
          <th name="player">
            <div name="level"></div>
            <div>${Player.PlayerName}</div>
            <div name="world"></div>
            <div name="BattlePower"></div>
            <div name="time"></div>
            <div name="point">
              <a></a>
              <a></a>
            </div>
          </th>
          `
      )
    );
    let nodePlayer = nodeTr.querySelector('th[name="player"]');
    const RegionList = { '1': '🇯🇵', '2': '🇰🇷', '3': '🇨🇳', '4': '🇺🇸', '5': '🇪🇺', '6': '🇺🇳' };
    switch (GlobalURLList.function) {
      case 'arena': {
        nodePlayer.querySelector('[name="level"]').innerHTML = TextResource['CommonPlayerRankFormat'].replace('{0}', Player.PlayerLevel);
        break;
      }
      case 'legend': {
        nodePlayer.querySelector('[name="level"]').innerHTML = TextResource['CommonPlayerRankFormat'].replace('{0}', Player.PlayerLevel);
        nodePlayer.querySelector('[name="world"]').innerHTML = `W${Player.PlayerId?.toString().slice(-2)}`;
        nodePlayer.querySelector('[name="point"] > :nth-child(1)').innerHTML = TextResource['GlobalPvpPointFormatWithLabel'].replace('{0}', Player.CurrentPoint);
        nodePlayer.querySelector('[name="point"] > :nth-child(2)').innerHTML = TextResource['GlobalPvpConsecutiveVictoryLabel'].replace('{0}', Player.ConsecutiveVictoryCount);
        break;
      }
      case 'clearlist': {
        nodePlayer.querySelector('[name="level"]').innerHTML = TextResource['CommonPlayerRankFormat'].replace('{0}', Player.Rank);
        nodePlayer.querySelector('[name="world"]').innerHTML = `${RegionList[Player.WorldId.toString().slice(0, 1)]}W${Player.PlayerId?.toString().slice(-2)}`;
        nodePlayer.querySelector('[name="BattlePower"]').innerHTML = `${TextResource['CommonPlayerRankLabel']}:${Player.DeckBattlePower}`;
        nodePlayer.querySelector('[name="time"]').innerHTML = new Date(Player.ClearTimestamp).toLocaleString().split(' ');
        nodeTr.querySelector('[name="record"]').innerHTML = Player.BattleToken ? `<a href="${getURL({ 'page': 'battle_log', 'lang': GlobalURLList.lang, 'token': Player.BattleToken })}">▶️</a>` : '';
        break;
      }
      default: {
        break;
      }
    }
    let totalBattlePower = 0;
    for (let j = 0; j < 5; j++) {
      const CharacterInfo = Player.UserCharacterInfoList?.[j] || Player.ClearPartyCharacterInfos?.[j];
      let nodeCharacter = nodeTr.appendChild(createElement('th', ''));
      if (!CharacterInfo) {
        continue;
      }
      const CharacterId = CharacterInfo.CharacterId;
      const CharacterIcon = `${'0'.repeat(6 - CharacterId.toString().length)}${CharacterId}`;
      const Character = CharacterList[CharacterId];
      totalBattlePower += CharacterInfo.BattlePower;
      let attributeCharacterInfo = CharacterRarity[CharacterInfo.RarityFlags.toString()];
      attributeCharacterInfo.element = Character.ElementType;
      attributeCharacterInfo.job = Character.JobFlags;
      nodeCharacter.append(
        createElement(
          'character',
          `
            <icon>
              <img src="${GlobalConstant.assetURL}CharacterIcon/CHR_${CharacterIcon}/CHR_${CharacterIcon}_00_s.png">
              <rarity></rarity>
              <decoration></decoration>
              <stars>
                <star></star>
                <star></star>
                <star></star>
                <star></star>
                <star></star>
              </stars>
              <element></element>
              <level>${TextResource['CommonLevelWithDot']}${CharacterInfo.Level}</level>
            </icon>
            <div>
              <div class="hidden">${Character.Name2Key ? TextResource[Character.Name2Key.slice(1, -1)] : '　'}</div>
              <div>${TextResource[Character.NameKey.slice(1, -1)]}</div>
            </div>
            `,
          attributeCharacterInfo
        )
      );
      nodeCharacter.onclick = (e) => {
        let listClean = document.querySelectorAll('[selected]');
        let countEquipmenSet = {};
        for (let i of listClean) {
          i.removeAttribute('selected');
        }
        let nodeTh = getFather(e.target, 'TH');
        let nodeTr = nodeTh.parentNode;
        nodeTh.setAttribute('selected', '');
        nodeTr.setAttribute('selected', '');
        nodePanel.innerHTML = '<div name="equipment"></div>';
        const EquipmenOrder = [
          {
            'type': {
              '0': 'sniper',
              '1': 'warrior',
              '2': 'sorcerer',
            },
            'name': TextResource['EquipmentSlotTypeWeapon'],
          },
          {
            'type': 'sub',
            'name': TextResource['EquipmentSlotTypeSub'],
          },
          {
            'type': 'gauntlet',
            'name': TextResource['EquipmentSlotTypeGauntlet'],
          },
          {
            'type': 'helmet',
            'name': TextResource['EquipmentSlotTypeHelmet'],
          },
          {
            'type': 'armor',
            'name': TextResource['EquipmentSlotTypeArmor'],
          },
          {
            'type': 'shoes',
            'name': TextResource['EquipmentSlotTypeShoes'],
          },
        ];
        for (let i = 0; i < 6; i++) {
          const Type = EquipmenOrder[i].type;
          const Slot = i + 1;
          nodePanel.querySelector('div[name="equipment"]').append(
            createElement(
              'equipment',
              `
                <icon>
                  <img src="${GlobalConstant.assetURL}Icon/Equipment/icon_equipment_${Slot == 1 ? 'weapon' : Type}${Slot == 1 ? '_' + Type[Character.JobFlags] : ''}_02.png">
                  <rarity></rarity>
                  <level></level>
                  <reinforcement></reinforcement>
                </icon>
                <desc>
                  <div>
                    <raritydesc></raritydesc>
                    <madel></madel>
                    <name>${EquipmenOrder[i].name}</name>
                  </div>
                  <div>
                    <category category="${Slot}_${Slot == 1 ? Character.JobFlags : '0'}"></category>
                    <setname></setname>
                  </div>
                </desc>
                <parameters>
                  <parameter_set type="base">
                    <parameter_type>${TextResource['CharacterEquipmentBasicEffect']}</parameter_type>
                    <parameter>
                      <parameter_name></parameter_name>
                      <parameter_value></parameter_value>
                    </parameter>
                  </parameter_set>
                  <parameter_set type="addition">
                    <parameter_type>${TextResource['CharacterEquipmentAdditionalEffect']}</parameter_type>
                    <div>
                      <parameter order="1">
                        <parameter_name>${TextResource['BaseParameterTypeMuscle']}</parameter_name>
                        <parameter_value></parameter_value>
                      </parameter>
                      <parameter order="2">
                      <parameter_name>${TextResource['BaseParameterTypeIntelligence']}</parameter_name>
                      <parameter_value></parameter_value>
                      </parameter>
                    </div>
                    <div>
                      <parameter order="3">
                      <parameter_name>${TextResource['BaseParameterTypeEnergy']}</parameter_name>
                      <parameter_value></parameter_value>
                      </parameter>
                      <parameter order="4">
                      <parameter_name>${TextResource['BaseParameterTypeHealth']}</parameter_name>
                        <parameter_value></parameter_value>
                      </parameter>
                    </div>
                  </parameter_set>
                  <parameter_set type="treasure">
                    <parameter_type>${TextResource['EquipmentSacredTreasureBonusLabel']}</parameter_type>
                    <div order="1">
                      <treasure>${TextResource['CommonLegendaryLevelLabel']}
                        <level></level>
                      </treasure>
                      <parameter>
                        <parameter_name></parameter_name>
                        <parameter_value></parameter_value>
                      </parameter>
                    </div>
                    <div order="2">
                      <treasure>${TextResource['CommonMatchlessLevelLabel']}
                        <level></level>
                      </treasure>
                      <parameter>
                        <parameter_name></parameter_name>
                        <parameter_value></parameter_value>
                      </parameter>
                    </div>
                  </parameter_set>
                  <parameter_set type="sphere">
                    <parameter_type>${TextResource['CommonSphereLabel']}</parameter_type>
                    <sphere order="1">
                      <icon>
                        <img src="${GlobalConstant.assetURL}icon_lock.png">
                        <rarity></rarity>
                        <level></level>
                      </icon>
                      <name>${TextResource['MissionLockedButton']}</name>
                      <div><parameter_value>　</parameter_value></div>
                    </sphere>
                    <sphere order="2">
                      <icon>
                        <img src="${GlobalConstant.assetURL}icon_lock.png">
                        <rarity></rarity>
                        <level></level>
                      </icon>
                      <name>${TextResource['MissionLockedButton']}</name>
                      <div><parameter_value>　</parameter_value></div>
                    </sphere>
                    <sphere order="3">
                      <icon>
                        <img src="${GlobalConstant.assetURL}icon_lock.png">
                        <rarity></rarity>
                        <level></level>
                      </icon>
                      <name>${TextResource['MissionLockedButton']}</name>
                      <div><parameter_value>　</parameter_value></div>
                    </sphere>
                    <sphere order="4">
                      <icon>
                        <img src="${GlobalConstant.assetURL}icon_lock.png">
                        <rarity></rarity>
                        <level></level>
                      </icon>
                      <name>${TextResource['MissionLockedButton']}</name>
                      <div><parameter_value>　</parameter_value></div>
                    </sphere>
                  </parameter_set>
                </parameters>
                `,
              {
                'slot': Slot,
              }
            )
          );
        }
        let nodeCharacterInfo = nodePanel.appendChild(createElement('div', '', { 'name': 'character' }));
        let nodecharacter = nodeCharacterInfo.appendChild(nodeTh.querySelector('character').cloneNode(true));
        nodeCharacterInfo.setAttribute('rarity', nodecharacter.getAttribute('rarity'));
        nodecharacter.querySelector('div').remove();
        nodecharacter.querySelector('level').remove();
        nodecharacter.appendChild(
          createElement(
            'desc',
            `
              <div>
                <raritydesc>${CharacterRarity[CharacterInfo.RarityFlags].rarity}${CharacterRarity[CharacterInfo.RarityFlags].star > 0 ? '+' + CharacterRarity[CharacterInfo.RarityFlags].star : ''}</raritydesc>
                <job></job>
                <level>${TextResource['CommonLevelWithDot']}${CharacterInfo.Level}</level>
              </div>
              <lore>${Character.Name2Key ? TextResource[Character.Name2Key.slice(1, -1)] : '　'}</lore>
              <div>
                <name>${TextResource[Character.NameKey.slice(1, -1)]}</name>
              </div>
              <bp>🗡️${getNumber(CharacterInfo.BattlePower)}</bp>
              `
          )
        );
        nodeCharacterInfo.appendChild(
          createElement(
            'parameters',
            `
              <parameter_set type="skill">
              </parameter_set>
              <parameter_set type="exclusive">
                <parameter_type>${TextResource['CharacterEquipmentExclusiveEffect']}</parameter_type>
                <parameter_subtype>${TextResource['CharacterEquipmentExclusiveSkillEffect']}</parameter_subtype>
                <div order="SSR">
                  <skilllevel>${TextResource['DialogCharacterSkillLockSkillLevelFormat'].replace('{0}', '1')}</skilllevel>
                  <skill></skill>
                  <unlocked>${TextResource['EquipmentExclusiveSkillReleaseConditionFormat'].replace('{0}', 'SSR')}</unlocked>
                </div>
                <div order="UR">
                  <skilllevel>${TextResource['DialogCharacterSkillLockSkillLevelFormat'].replace('{0}', '2')}</skilllevel>
                  <skill></skill>
                  <unlocked>${TextResource['EquipmentExclusiveSkillReleaseConditionFormat'].replace('{0}', 'UR')}</unlocked>
                </div>
                <div order="LR">
                  <skilllevel>${TextResource['DialogCharacterSkillLockSkillLevelFormat'].replace('{0}', '3')}</skilllevel>
                  <skill></skill>
                  <unlocked>${TextResource['EquipmentExclusiveSkillReleaseConditionFormat'].replace('{0}', 'LR')}</unlocked>
                </div>
                <parameter_subtype>${TextResource['CharacterEquipmentExclusivePassiveEffect']}</parameter_subtype>
                <div type="parameter"></div>
              </parameter_set>
              <parameter_set type="set">
                <parameter_type>${TextResource['CharacterEquipmentSeriesEffect']}</parameter_type>
              </parameter_set>
              <parameter_set type="common">
                <parameter_type>${TextResource['CommonStatusLabel']}</parameter_type>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeAttackPower']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.AttackPower)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeHp']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.HP)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeSpeed']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.Speed)}</parameter_value>
                </parameter>
                <parameter></parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeDefensePenetration']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.DefensePenetration)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeDefense']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.Defense)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeDamageEnhance']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.DamageEnhance)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypePhysicalDamageRelax']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.PhysicalDamageRelax)}</parameter_value>
                </parameter>
                <parameter></parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeMagicDamageRelax']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.MagicDamageRelax)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeHit']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.Hit)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeAvoidance']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.Avoidance)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeCritical']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.Critical)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeCriticalResist']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.CriticalResist)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeCriticalDamageEnhance']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.CriticalDamageEnhance)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypePhysicalCriticalDamageRelax']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.PhysicalCriticalDamageRelax)}</parameter_value>
                </parameter>
                <parameter></parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeMagicCriticalDamageRelax']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.MagicCriticalDamageRelax)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeDebuffHit']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.DebuffHit)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeDebuffResist']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.DebuffResist)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeHpDrain']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.HpDrain)}</parameter_value>
                </parameter>
                <parameter>
                  <parameter_name>${TextResource['BattleParameterTypeDamageReflect']}</parameter_name>
                  <parameter_value>${getNumber(CharacterInfo.BattleParameter.DamageReflect)}</parameter_value>
                </parameter>
              </parameter_set>
              <parameter_set type="potential" job="${nodecharacter.getAttribute('job')}">
                <parameter_type>${TextResource['CommonPotentialParameterLabel']}</parameter_type>
                <div order="1">
                  <parameter>
                    <parameter_name>${TextResource['BaseParameterTypeMuscle']}</parameter_name>
                    <parameter_value>${getNumber(CharacterInfo.BaseParameter.Muscle)}</parameter_value>
                  </parameter>
                  <parameter main="">
                    <parameter_name>${TextResource['BattleParameterTypeAttackPower']}</parameter_name>
                    <parameter_value>${getNumber(CharacterInfo.BaseParameter.Muscle)}</parameter_value>
                  </parameter>
                  <parameter>
                    <parameter_name>${TextResource['BattleParameterTypePhysicalDamageRelax']}</parameter_name>
                    <parameter_value>${getNumber(CharacterInfo.BaseParameter.Muscle)}</parameter_value>
                  </parameter>
                  <parameter>
                    <parameter_name>${TextResource['BattleParameterTypeHit']}</parameter_name>
                    <parameter_value>${getNumber(Math.round(CharacterInfo.BaseParameter.Muscle / 2))}</parameter_value>
                  </parameter>
                </div>
                <div order="2">
                  <parameter>
                    <parameter_name>${TextResource['BaseParameterTypeEnergy']}</parameter_name>
                    <parameter_value>${getNumber(CharacterInfo.BaseParameter.Energy)}</parameter_value>
                  </parameter>
                  <parameter main="">
                    <parameter_name>${TextResource['BattleParameterTypeAttackPower']}</parameter_name>
                    <parameter_value>${getNumber(CharacterInfo.BaseParameter.Energy)}</parameter_value>
                  </parameter>
                  <parameter>
                    <parameter_name>${TextResource['BattleParameterTypeAvoidance']}</parameter_name>
                    <parameter_value>${getNumber(Math.round(CharacterInfo.BaseParameter.Energy / 2))}</parameter_value>
                  </parameter>
                  <parameter>
                    <parameter_name>${TextResource['BattleParameterTypeCritical']}</parameter_name>
                    <parameter_value>${getNumber(Math.round(CharacterInfo.BaseParameter.Energy / 2))}</parameter_value>
                  </parameter>
                </div>
                <div order="3">
                  <parameter>
                    <parameter_name>${TextResource['BaseParameterTypeIntelligence']}</parameter_name>
                    <parameter_value>${getNumber(CharacterInfo.BaseParameter.Intelligence)}</parameter_value>
                  </parameter>
                  <parameter main="">
                    <parameter_name>${TextResource['BattleParameterTypeAttackPower']}</parameter_name>
                    <parameter_value>${getNumber(CharacterInfo.BaseParameter.Intelligence)}</parameter_value>
                  </parameter>
                  <parameter>
                    <parameter_name>${TextResource['BattleParameterTypeMagicDamageRelax']}</parameter_name>
                    <parameter_value>${getNumber(CharacterInfo.BaseParameter.Intelligence)}</parameter_value>
                  </parameter>
                  <parameter>
                    <parameter_name>${TextResource['BattleParameterTypeDebuffHit']}</parameter_name>
                    <parameter_value>${getNumber(Math.round(CharacterInfo.BaseParameter.Intelligence / 2))}</parameter_value>
                  </parameter>
                </div>
                <div>
                  <parameter>
                    <parameter_name>${TextResource['BaseParameterTypeHealth']}</parameter_name>
                    <parameter_value>${getNumber(CharacterInfo.BaseParameter.Health)}</parameter_value>
                  </parameter>
                  <parameter main=""></parameter>
                  <parameter>
                    <parameter_name>${TextResource['BattleParameterTypeHp']}</parameter_name>
                    <parameter_value>${getNumber(CharacterInfo.BaseParameter.Health)}</parameter_value>
                  </parameter>
                  <parameter>
                    <parameter_name>${TextResource['BattleParameterTypeCriticalResist']}</parameter_name>
                    <parameter_value>${getNumber(Math.round(CharacterInfo.BaseParameter.Health / 2))}</parameter_value>
                  </parameter>
                </div>
              </parameter_set>
            `
          )
        );
        let SkillArray = (!Character.ActiveSkillIds ? [] : Character.ActiveSkillIds).concat(!Character.PassiveSkillIds ? [] : Character.PassiveSkillIds);
        let nodeSkill = nodeCharacterInfo.querySelector('parameter_set[type="skill"]');
        let nodeSkillIcons = nodeSkill.appendChild(createElement('div', '', { 'type': 'icon' }));
        let nodeSkillInfos = nodeSkill.appendChild(createElement('div'));
        for (let i = 0; i < SkillArray.length; i++) {
          const Skill = SkillList[SkillArray[i]];
          let skillType = Skill.ActiveSkillInfos ? 'Active' : 'Passive';
          let nodeSkillIcon = nodeSkillIcons.appendChild(
            createElement(
              'icon',
              `
              <img src="${GlobalConstant.assetURL}Icon/Skill/CSK_${'0'.repeat(9 - Skill.Id.toString().length)}${Skill.Id}.png">
              <level></level>
              `,
              { 'order': i + 1 }
            )
          );
          let nodeSkillInfo = nodeSkillInfos.appendChild(
            createElement(
              'div',
              `
              <div>${TextResource[Skill.NameKey.slice(1, -1)]}</div>
              <div>
                <a>${TextResource['SkillCategory' + skillType]}</a>
                <a>⏳ ${Skill.SkillMaxCoolTime == undefined ? '-' : TextResource['CommonTurnFormat'].replace('{0}', Skill.SkillMaxCoolTime)}</a>
              </div>
              <hr>
              `,
              { 'order': i }
            )
          );
          if (i == 0) {
            nodeSkillIcon.setAttribute('selected', '');
            nodeSkillInfo.setAttribute('selected', '');
          }
          nodeSkillIcon.onclick = (e) => {
            let listClean = nodeSkill.querySelectorAll('[selected]');
            for (let j of listClean) {
              j.removeAttribute('selected');
            }
            nodeSkillIcon.setAttribute('selected', '');
            nodeSkillInfo.setAttribute('selected', '');
          };
          for (let j = 0; j < Skill[`${skillType}SkillInfos`].length; j++) {
            const SkillInfo = Skill[`${skillType}SkillInfos`][j];
            let nodeSkillEffect = nodeSkillInfo.appendChild(
              createElement(
                'div',
                `
                <skilllevel>${j == 0 ? '' : TextResource['DialogCharacterSkillLockSkillLevelFormat'].replace('{0}', j + 1)}</skilllevel>
                <skill>${TextResource[SkillInfo.DescriptionKey.slice(1, -1)]}</skill>
                <unlocked>${j == 0 ? '' : TextResource['DialogCharacterSkillLockSkillDescriptionFormat'].replace('{0}', '').replace('<color=#BE5742>', '').replace('{1}', SkillInfo.CharacterLevel)}</unlocked>
                `
              )
            );
            if (j == 0) {
              if (SkillInfo.CharacterLevel > CharacterInfo.Level) {
                nodeSkillIcon.querySelector('level').innerHTML = TextResource['SkillReleaseLevelFormat'].replaceAll('{0}', SkillInfo.CharacterLevel);
                nodeSkillIcon.setAttribute('level', 0);
                nodeSkillInfo.setAttribute('level', 0);
              }
              nodeSkillInfo.append(createElement('hr'));
            }
            if (SkillInfo.EquipmentRarityFlags > 0) {
              nodeSkillEffect.setAttribute('class', 'hidden');
            } else if (SkillInfo.CharacterLevel <= CharacterInfo.Level) {
              nodeSkillIcon.querySelector('level').innerHTML = TextResource['CommonLevelFormat'].replaceAll('{0}', j + 1);
              nodeSkillIcon.setAttribute('level', j + 1);
              nodeSkillInfo.setAttribute('level', j + 1);
              nodeSkillEffect.setAttribute('unlock', '');
            }
          }
        }
        for (let i = 0; i < CharacterInfo.UserEquipmentDtoInfos.length; i++) {
          const EquipmentInfo = CharacterInfo.UserEquipmentDtoInfos[i];
          const EquipmentId = EquipmentInfo.EquipmentId;
          const Equipment = EquipmentList[EquipmentId];
          const Slot = Equipment.SlotType;
          const EquipmentSetId = Equipment.EquipmentSetId;
          const EquipmentSet = EquipmentSetList[EquipmentSetId];
          let nodeEquipment = nodePanel.querySelector(`equipment[slot="${Slot}"]`);
          nodeEquipment.setAttribute('rarity', EquipmenRarity[Equipment.RarityFlags].rarity);
          nodeEquipment.querySelector('img').setAttribute('src', `${GlobalConstant.assetURL}Icon/Equipment/EQP_${'0'.repeat(6 - Equipment.IconId.toString().length)}${Equipment.IconId}.png`);
          nodeEquipment.querySelector('level').innerHTML = TextResource['CommonLevelLabel'] + Equipment.EquipmentLv;
          nodeEquipment.querySelector('reinforcement').innerHTML = EquipmentInfo.ReinforcementLv == 0 ? '' : TextResource['CommonPlusLabel'] + EquipmentInfo.ReinforcementLv;
          nodeEquipment.querySelector('raritydesc').innerHTML = EquipmenRarity[Equipment.RarityFlags].rarity;
          nodeEquipment.setAttribute('quality', Equipment.QualityLv);
          nodeEquipment.querySelector('name').innerHTML = TextResource[Equipment.NameKey.slice(1, -1)];
          let parameterBase = getParameter(Equipment.BattleParameterChangeInfo);
          nodeEquipment.querySelector('parameter_set[type="base"] parameter_name').innerHTML = TextResource[parameterBase.name];
          nodeEquipment.querySelector('parameter_set[type="base"] parameter_value').innerHTML = getNumber(Math.round(parameterBase.value * Reinforcement[EquipmentInfo.ReinforcementLv]));
          nodeEquipment.querySelector('parameter_set[type="addition"] parameter[order="1"] parameter_value').innerHTML = getNumber(EquipmentInfo.AdditionalParameterMuscle);
          nodeEquipment.querySelector('parameter_set[type="addition"] parameter[order="2"] parameter_value').innerHTML = getNumber(EquipmentInfo.AdditionalParameterIntelligence);
          nodeEquipment.querySelector('parameter_set[type="addition"] parameter[order="3"] parameter_value').innerHTML = getNumber(EquipmentInfo.AdditionalParameterEnergy);
          nodeEquipment.querySelector('parameter_set[type="addition"] parameter[order="4"] parameter_value').innerHTML = getNumber(EquipmentInfo.AdditionalParameterHealth);
          const [LegendLv, MatchlessLv] = [EquipmentInfo.LegendSacredTreasureLv, EquipmentInfo.MatchlessSacredTreasureLv];
          let [parameterLegend, parameterMatchless] = [getParameter(LegendList[LegendLv][Slot]), getParameter(MatchlessList[MatchlessLv][Slot])];
          nodeEquipment.querySelector('parameter_set[type="treasure"] div[order="1"] level').innerHTML = LegendLv;
          nodeEquipment.querySelector('parameter_set[type="treasure"] div[order="1"] parameter_name').innerHTML = TextResource[parameterLegend.name];
          nodeEquipment.querySelector('parameter_set[type="treasure"] div[order="1"] parameter_value').innerHTML = getNumber(parameterLegend.value);
          nodeEquipment.querySelector('parameter_set[type="treasure"] div[order="2"] level').innerHTML = MatchlessLv;
          nodeEquipment.querySelector('parameter_set[type="treasure"] div[order="2"] parameter_name').innerHTML = TextResource[parameterMatchless.name];
          nodeEquipment.querySelector('parameter_set[type="treasure"] div[order="2"] parameter_value').innerHTML = getNumber(parameterMatchless.value);
          for (let j = 1; j < 5; j++) {
            let nodeSphere = nodeEquipment.querySelector(`parameter_set[type="sphere"] sphere[order="${j}"]`);
            if (j <= EquipmentInfo.SphereUnlockedCount) {
              const SphereId = EquipmentInfo[`SphereId${j}`];
              if (SphereId == 0) {
                nodeSphere.querySelector('img').setAttribute('src', '');
                nodeSphere.querySelector('name').innerHTML = TextResource['CommonNotEquippingLabel'];
              } else {
                const Sphere = SphereList[SphereId];
                nodeSphere.setAttribute('rarity', EquipmenRarity[Sphere.RarityFlags].rarity);
                nodeSphere.querySelector('img').setAttribute('src', `${GlobalConstant.assetURL}Icon/Sphere/SPH_${'0'.repeat(2 - Sphere.CategoryId.toString().length)}${Sphere.CategoryId}0${Sphere.SphereType}.png`);
                nodeSphere.querySelector('level').innerHTML = TextResource['CommonLevelFormat'].replace('{0}', Sphere.Lv);
                nodeSphere.querySelector('name').innerHTML = TextResource[Sphere.NameKey.slice(1, -1)];
                let parameterSphere = Sphere.BaseParameterChangeInfo ? getParameter(Sphere.BaseParameterChangeInfo) : getParameter(Sphere.BattleParameterChangeInfo);
                nodeSphere.querySelector('parameter_value').innerHTML = getNumber(parameterSphere.value);
              }
            }
          }
          const EquipmentExclusive = EquipmentExclusiveList[Equipment.ExclusiveEffectId];
          if (EquipmentExclusive) {
            if (EquipmentExclusive.CharacterId == Character.Id) {
              nodeCharacterInfo.querySelector('parameter_set[type="exclusive"]').setAttribute('unlock', '');
            }
            let ExclusiveList = (EquipmentExclusive.BaseParameterChangeInfoList ? EquipmentExclusive.BaseParameterChangeInfoList : []).concat(EquipmentExclusive.BattleParameterChangeInfoList ? EquipmentExclusive.BattleParameterChangeInfoList : []);
            for (let k = 0; k < ExclusiveList.length; k++) {
              let nodeExclusive = nodeCharacterInfo.querySelector('parameter_set[type="exclusive"] [type="parameter"]');
              let parameterExclusive = getParameter(ExclusiveList[k]);
              nodeExclusive.append(
                createElement(
                  'div',
                  `
                    <effect>
                      <effect_name>${TextResource[parameterExclusive.name]}</effect_name>
                      <effect_value>${getNumber(parameterExclusive.value)}</effect_value>
                    </effect>
                    `
                )
              );
            }
          }
          const EquipmentSkill = EquipmenSkillList[Equipment.EquipmentExclusiveSkillDescriptionId];
          if (EquipmentSkill) {
            nodeCharacterInfo.querySelector('parameter_set[type="exclusive"]').setAttribute('rarity', EquipmenRarity[Equipment.RarityFlags].rarity);
            nodeCharacterInfo.querySelector('parameter_set[type="exclusive"] [order="SSR"] skill').innerHTML = TextResource[EquipmentSkill.Description1Key.slice(1, -1)];
            nodeCharacterInfo.querySelector('parameter_set[type="exclusive"] [order="UR"] skill').innerHTML = TextResource[EquipmentSkill.Description2Key.slice(1, -1)];
            nodeCharacterInfo.querySelector('parameter_set[type="exclusive"] [order="LR"] skill').innerHTML = TextResource[EquipmentSkill.Description3Key.slice(1, -1)];
          }
          if (EquipmentSet) {
            const EquipmentSetName = TextResource[EquipmentSet.NameKey.slice(1, -1)];
            nodeEquipment.querySelector('desc setname').innerHTML = EquipmentSet ? EquipmentSetName : '';
            countEquipmenSet[EquipmentSetId] = !countEquipmenSet[EquipmentSetId] ? 1 : countEquipmenSet[EquipmentSetId] + 1;
          }
        }
        for (let i in countEquipmenSet) {
          const EquipmenSet = EquipmentSetList[i];
          if (countEquipmenSet[i] > 1) {
            let nodeEquipmenSets = nodeCharacterInfo.querySelector('parameter_set[type="set"]');
            nodeEquipmenSets.append(createElement('parameter_subtype', TextResource[EquipmenSet.NameKey.slice(1, -1)]));
            let nodeEquipmenSet = nodeEquipmenSets.appendChild(
              createElement(
                'div',
                `
                  `,
                { 'count': countEquipmenSet[i] }
              )
            );
            for (let j = 0; j < EquipmenSet.EffectList.length; j++) {
              const Set = EquipmenSet.EffectList[j];
              let parameterSet = getParameter(Set.BaseParameterChangeInfo ? Set.BaseParameterChangeInfo : Set.BattleParameterChangeInfo);
              nodeEquipmenSet.appendChild(
                createElement(
                  'div',
                  `
                  <treasure>${TextResource['EquipmentSet'].replace('{0}', Set.RequiredEquipmentCount)}</treasure>
                  <parameter>
                    <parameter_name>${TextResource[parameterSet.name]}</parameter_name>
                    <parameter_value>${getNumber(parameterSet.value)}</parameter_value>
                  </parameter>
                  `,
                  { 'require': Set.RequiredEquipmentCount }
                )
              );
            }
          }
        }
      };
    }
    nodeTr.querySelector('[name="BattlePower"]').innerHTML = `${TextResource['CommonBattlePowerLabel']}: ${getNumber(totalBattlePower)}`;
  }
  FreezeNode.classList.add('hidden');
}
//获取加成信息
function getParameter(ParameterChangeInfo) {
  const ParameterType = {
    'Base': {
      '1': 'BaseParameterTypeMuscle',
      '2': 'BaseParameterTypeEnergy',
      '3': 'BaseParameterTypeIntelligence',
      '4': 'BaseParameterTypeHealth',
    },
    'Battle': {
      '1': 'BattleParameterTypeHp',
      '2': 'BattleParameterTypeAttackPower',
      '3': 'BattleParameterTypePhysicalDamageRelax',
      '4': 'BattleParameterTypeMagicDamageRelax',
      '5': 'BattleParameterTypeHit',
      '6': 'BattleParameterTypeAvoidance',
      '7': 'BattleParameterTypeCritical',
      '8': 'BattleParameterTypeCriticalResist',
      '9': 'BattleParameterTypeCriticalDamageEnhance',
      '10': 'BattleParameterTypePhysicalCriticalDamageRelax',
      '11': 'BattleParameterTypeMagicCriticalDamageRelax',
      '12': 'BattleParameterTypeDefensePenetration',
      '13': 'BattleParameterTypeDefense',
      '14': 'BattleParameterTypeDamageEnhance',
      '15': 'BattleParameterTypeDebuffHit',
      '16': 'BattleParameterTypeDebuffResist',
      '17': 'BattleParameterTypeDamageReflect',
      '18': 'BattleParameterTypeHpDrain',
      '19': 'BattleParameterTypeSpeed',
    },
  };
  let paraType = ParameterChangeInfo.BaseParameterType ? 'Base' : 'Battle';
  let Parameter = {
    'name': ParameterType[paraType][ParameterChangeInfo[`${paraType}ParameterType`]],
    'value': ParameterChangeInfo.ChangeParameterType == 1 ? ParameterChangeInfo.Value : `${ParameterChangeInfo.Value / 100}%`,
  };
  return Parameter;
}
function getNumber(number) {
  if (isNaN(number)) {
    return number;
  } else {
    return new Intl.NumberFormat('en-US').format(number);
  }
}
/*API函数*/
//获取option
function buildOption(appVersion) {
  let option = {
    method: 'POST',
    headers: {
      'ortegaaccesstoken': '', //获取
      'ortegaappversion': appVersion, //跟随版本
      'ortegadevicetype': 2, //固定为2
      'ortegauuid': getStorage('ortegauuid'), //随机uuid，登录后绑定账号
      //'Host':'*.mememori-boi.com', //自动
      'Content-Type': 'application/json; charset=UTF-8', //固定
      'Accept-Encoding': 'gzip', //固定
      'User-Agent': 'BestHTTP/2 v2.3.0', //固定
      //'Content-Length':399, //自动
    },
    type: 'arraybuffer',
    msgpack: true,
    //body: null, //消息体
  };
  return option;
}
//获取AuthToken
async function getAuthToken() {
  let jsonAuthTokenData = await sendGMRequest('https://list.moonheart.dev/d/public/mmtm/AddressableLocalAssets/ScriptableObjects/AuthToken/AuthTokenData.json?v=' + Date.now(), { type: 'json' });
  if (!jsonAuthTokenData) {
    console.log('获取AuthToken失败');
    alert('获取AuthToken失败，请重试');
  }
  return jsonAuthTokenData._authToken;
}
//获取AppVersion
async function getAppVersion() {
  const MaxTry = 50;
  for (let i = 0; i < MaxTry; i++) {
    const VarsJS = await sendGMRequest('https://mememori-game.com/apps/vars.js', {});
    if (!VarsJS) {
      console.log('获取var.js失败');
      await sleep(50);
      continue;
    } else {
      let result;
      const apkVersion = getVariable(VarsJS, 'apkVersion').split('.');
      const Option = buildOption('');
      for (let i = 0; i <= MaxTry; i++) {
        //版本号递增
        Option.headers.ortegaappversion = `${apkVersion[0]}.${apkVersion[1]}.${apkVersion[2] * 1 + i}`;
        //最后一次手动请求版本号
        if (i == MaxTry) {
          Option.headers.ortegaappversion = prompt('版本号不在正常范围内，请手动输入版本号', Option.headers.ortegaappversion);
        }
        //请求getDataUri
        result = await getDataUri(Option);
        if (!result.AppAssetVersionInfo) {
          console.log(`获取版本${Option.headers.ortegaappversion}失败`);
          await sleep(50);
          continue;
        } else {
          return result.AppAssetVersionInfo.Version;
        }
      }
      break;
    }
  }
  alert('获取版本号失败，请刷新页面重试');
}
//获取本地化文件
async function getTextResource(force = false) {
  const Type = 'TextResource';
  let DataList = {};
  if (GlobalConstant.AppVersion != getStorage(`version${Type}`) || GlobalURLList.lang != getStorage('Language') || force) {
    const Buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/${Type}${GlobalURLList.lang}MB`, { type: 'arraybuffer', msgpack: true });
    const DataMB = await msgpack.decode(new Uint8Array(Buffer));
    if (!DataMB) return;
    for (let i = 0; i < DataMB.length; i++) {
      const CacheData = DataMB[i];
      let Data = {
        'Guid': CacheData.StringKey.replace(/\[(.*?)\]/, '$1'),
        'Value': CacheData.Text,
      };
      await updateData(DataBase.Static.db, Type, Data);
      DataList[Data.Guid] = Data.Value;
    }
    let cacheLanguageTable = {};
    for (let j in LanguageTableM) {
      cacheLanguageTable[j] = DataList[LanguageTableM[j]].replace('{0}', '');
    }
    for (let j of LanguageTableJ) {
      cacheLanguageTable[j] = LanguageTable[j][GlobalURLList.lang];
    }
    setStorage(`LanguageTable`, JSON.stringify(cacheLanguageTable));
    setStorage(`version${Type}`, GlobalConstant.AppVersion);
    setStorage('Language', GlobalURLList.lang);
  } else {
    const DataDB = await getArray(DataBase.Static.db, Type, {}, 'Guid');
    for (let i = 0; i < DataDB.length; i++) {
      DataList[DataDB[i].Guid] = DataDB[i].Value;
    }
  }
  return DataList;
}
//获取人物信息
async function getCharacter(force = false) {
  const Type = 'Character';
  let DataList = {};
  if (getStorage(`version${Type}`) != GlobalConstant.AppVersion || force) {
    const Buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/${Type}MB`, { type: 'arraybuffer', msgpack: true });
    const DataMB = await msgpack.decode(new Uint8Array(Buffer));
    if (!DataMB) return;
    for (let i = 0; i < DataMB.length; i++) {
      let Data = DataMB[i];
      Data.Guid = Data.Id;
      await updateData(DataBase.Static.db, Type, Data);
      DataList[Data.Guid] = Data;
    }
    setStorage(`version${Type}`, GlobalConstant.AppVersion);
  } else {
    const DataDB = await getArray(DataBase.Static.db, Type, {}, 'Guid');
    for (let i = 0; i < DataDB.length; i++) {
      DataList[DataDB[i].Guid] = DataDB[i];
    }
  }
  return DataList;
}
//获取装备信息
async function getEquipment(force = false) {
  const Type = 'Equipment';
  let DataList = {};
  if (getStorage(`version${Type}`) != GlobalConstant.AppVersion || force) {
    const Buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/${Type}MB`, { type: 'arraybuffer', msgpack: true });
    const DataMB = await msgpack.decode(new Uint8Array(Buffer));
    if (!DataMB) return;
    for (let i = 0; i < DataMB.length; i++) {
      let Data = DataMB[i];
      Data.Guid = Data.Id;
      await updateData(DataBase.Static.db, Type, Data);
      DataList[Data.Guid] = Data;
    }
    setStorage(`version${Type}`, GlobalConstant.AppVersion);
  } else {
    const DataDB = await getArray(DataBase.Static.db, Type, {}, 'Guid');
    for (let i = 0; i < DataDB.length; i++) {
      DataList[DataDB[i].Guid] = DataDB[i];
    }
  }
  return DataList;
}
//获取套装信息
async function getEquipmentSet(force = false) {
  const Type = 'EquipmentSet';
  let DataList = {};
  if (getStorage(`version${Type}`) != GlobalConstant.AppVersion || force) {
    const Buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/${Type}MB`, { type: 'arraybuffer', msgpack: true });
    const DataMB = await msgpack.decode(new Uint8Array(Buffer));
    if (!DataMB) return;
    for (let i = 0; i < DataMB.length; i++) {
      let Data = DataMB[i];
      Data.Guid = Data.Id;
      await updateData(DataBase.Static.db, Type, Data);
      DataList[Data.Guid] = Data;
    }
    setStorage(`version${Type}`, GlobalConstant.AppVersion);
  } else {
    const DataDB = await getArray(DataBase.Static.db, Type, {}, 'Guid');
    for (let i = 0; i < DataDB.length; i++) {
      DataList[DataDB[i].Guid] = DataDB[i];
    }
  }
  return DataList;
}
//获取强化信息
async function getReinforcement(force = false) {
  const Type = 'EquipmentReinforcementParameter';
  let DataList = {};
  if (GlobalConstant.AppVersion != getStorage(`version${Type}`) || force) {
    const Buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/${Type}MB`, { type: 'arraybuffer', msgpack: true });
    const DataMB = await msgpack.decode(new Uint8Array(Buffer));
    if (!DataMB) return;
    for (let i = 0; i < DataMB.length; i++) {
      const CacheData = DataMB[i];
      let Data = {
        'Guid': CacheData.Id,
        'Value': CacheData.ReinforcementCoefficient,
      };
      await updateData(DataBase.Static.db, Type, Data);
      DataList[Data.Guid] = Data.Value;
    }
    setStorage(`version${Type}`, GlobalConstant.AppVersion);
  } else {
    const DataDB = await getArray(DataBase.Static.db, Type, {}, 'Guid');
    for (let i = 0; i < DataDB.length; i++) {
      DataList[DataDB[i].Guid] = DataDB[i].Value;
    }
  }
  return DataList;
}
//获取魔装信息
async function getMatchless(force = false) {
  const Type = 'EquipmentMatchlessSacredTreasure';
  let DataList = {};
  if (GlobalConstant.AppVersion != getStorage(`version${Type}`) || force) {
    const Buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/${Type}MB`, { type: 'arraybuffer', msgpack: true });
    const DataMB = await msgpack.decode(new Uint8Array(Buffer));
    if (!DataMB) return;
    for (let i = 0; i < DataMB.length; i++) {
      const CacheData = DataMB[i];
      let Data = {
        'Guid': CacheData.Lv,
        '1': {
          'BattleParameterType': 2,
          'ChangeParameterType': 1,
          'Value': CacheData.WeaponAttackPower,
        },
        '2': {
          'BattleParameterType': 3,
          'ChangeParameterType': 1,
          'Value': CacheData.SubPhysicalDamageRelax,
        },
        '3': {
          'BattleParameterType': 4,
          'ChangeParameterType': 1,
          'Value': CacheData.GauntletMagicDamageRelax,
        },
        '4': {
          'BattleParameterType': 7,
          'ChangeParameterType': 1,
          'Value': CacheData.HelmetCritical,
        },
        '5': {
          'BattleParameterType': 12,
          'ChangeParameterType': 1,
          'Value': CacheData.ArmorDefensePenetration,
        },
        '6': {
          'BattleParameterType': 1,
          'ChangeParameterType': 1,
          'Value': CacheData.ShoesHp,
        },
        'RequiredTotalExp': CacheData.RequiredTotalExp,
      };
      await updateData(DataBase.Static.db, Type, Data);
      DataList[Data.Guid] = Data;
    }
    setStorage(`version${Type}`, GlobalConstant.AppVersion);
  } else {
    const DataDB = await getArray(DataBase.Static.db, Type, {}, 'Guid');
    for (let i = 0; i < DataDB.length; i++) {
      DataList[DataDB[i].Guid] = DataDB[i];
    }
  }
  return DataList;
}
//获取圣装信息
async function getLegend(force = false) {
  const Type = 'EquipmentLegendSacredTreasure';
  let DataList = {};
  if (GlobalConstant.AppVersion != getStorage(`version${Type}`) || force) {
    const Buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/${Type}MB`, { type: 'arraybuffer', msgpack: true });
    const DataMB = await msgpack.decode(new Uint8Array(Buffer));
    if (!DataMB) return;
    for (let i = 0; i < DataMB.length; i++) {
      const CacheData = DataMB[i];
      let Data = {
        'Guid': CacheData.Lv,
        '1': {
          'BattleParameterType': 2,
          'ChangeParameterType': 2,
          'Value': CacheData.WeaponAttackPowerPercent,
        },
        '2': {
          'BattleParameterType': 5,
          'ChangeParameterType': 2,
          'Value': CacheData.SubHitPercent,
        },
        '3': {
          'BattleParameterType': 9,
          'ChangeParameterType': 2,
          'Value': CacheData.GauntletCriticalDamagePercent,
        },
        '4': {
          'BattleParameterType': 10,
          'ChangeParameterType': 2,
          'Value': CacheData.HelmetPhysicalCriticalDamageRelaxPercent,
        },
        '5': {
          'BattleParameterType': 11,
          'ChangeParameterType': 2,
          'Value': CacheData.ArmorMagicCriticalDamageRelaxPercent,
        },
        '6': {
          'BattleParameterType': 18,
          'ChangeParameterType': 2,
          'Value': CacheData.ShoesHpDrainPercent,
        },
        'RequiredTotalExp': CacheData.RequiredTotalExp,
      };
      await updateData(DataBase.Static.db, Type, Data);
      DataList[Data.Guid] = Data;
    }
    setStorage(`version${Type}`, GlobalConstant.AppVersion);
  } else {
    const DataDB = await getArray(DataBase.Static.db, Type, {}, 'Guid');
    for (let i = 0; i < DataDB.length; i++) {
      DataList[DataDB[i].Guid] = DataDB[i];
    }
  }
  return DataList;
}
//获取符石信息
async function getSphere(force = false) {
  const Type = 'Sphere';
  let DataList = {};
  if (getStorage(`version${Type}`) != GlobalConstant.AppVersion || force) {
    const Buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/${Type}MB`, { type: 'arraybuffer', msgpack: true });
    const DataMB = await msgpack.decode(new Uint8Array(Buffer));
    if (!DataMB) return;
    for (let i = 0; i < DataMB.length; i++) {
      let Data = DataMB[i];
      Data.Guid = Data.Id;
      await updateData(DataBase.Static.db, Type, Data);
      DataList[Data.Guid] = Data;
    }
    setStorage(`version${Type}`, GlobalConstant.AppVersion);
  } else {
    const DataDB = await getArray(DataBase.Static.db, Type, {}, 'Guid');
    for (let i = 0; i < DataDB.length; i++) {
      DataList[DataDB[i].Guid] = DataDB[i];
    }
  }
  return DataList;
}
//获取装备技能信息
async function getEquipmentSkill(force = false) {
  const Type = 'EquipmentExclusiveSkillDescription';
  let DataList = {};
  if (getStorage(`version${Type}`) != GlobalConstant.AppVersion || force) {
    const Buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/${Type}MB`, { type: 'arraybuffer', msgpack: true });
    const DataMB = await msgpack.decode(new Uint8Array(Buffer));
    if (!DataMB) return;
    for (let i = 0; i < DataMB.length; i++) {
      let Data = DataMB[i];
      Data.Guid = Data.Id;
      await updateData(DataBase.Static.db, Type, Data);
      DataList[Data.Guid] = Data;
    }
    setStorage(`version${Type}`, GlobalConstant.AppVersion);
  } else {
    const DataDB = await getArray(DataBase.Static.db, Type, {}, 'Guid');
    for (let i = 0; i < DataDB.length; i++) {
      DataList[DataDB[i].Guid] = DataDB[i];
    }
  }
  return DataList;
}
//获取装备特效信息
async function getEquipmentExclusive(force = false) {
  const Type = 'EquipmentExclusiveEffect';
  let DataList = {};
  if (getStorage(`version${Type}`) != GlobalConstant.AppVersion || force) {
    const Buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/${Type}MB`, { type: 'arraybuffer', msgpack: true });
    const DataMB = await msgpack.decode(new Uint8Array(Buffer));
    if (!DataMB) return;
    for (let i = 0; i < DataMB.length; i++) {
      let Data = DataMB[i];
      Data.Guid = Data.Id;
      await updateData(DataBase.Static.db, Type, Data);
      DataList[Data.Guid] = Data;
    }
    setStorage(`version${Type}`, GlobalConstant.AppVersion);
  } else {
    const DataDB = await getArray(DataBase.Static.db, Type, {}, 'Guid');
    for (let i = 0; i < DataDB.length; i++) {
      DataList[DataDB[i].Guid] = DataDB[i];
    }
  }
  return DataList;
}
//获取装备技能信息
async function getSkill(force = false) {
  const Type = 'Skill';
  let DataList = {};
  if (getStorage(`version${Type}`) != GlobalConstant.AppVersion || force) {
    for (let i of ['Active', 'Passive']) {
      const Buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/${i}${Type}MB`, { type: 'arraybuffer', msgpack: true });
      const DataMB = await msgpack.decode(new Uint8Array(Buffer));
      if (!DataMB) return;
      for (let j = 0; j < DataMB.length; j++) {
        let Data = DataMB[j];
        Data.Guid = Data.Id;
        await updateData(DataBase.Static.db, Type, Data);
        DataList[Data.Guid] = Data;
      }
      setStorage(`version${Type}`, GlobalConstant.AppVersion);
    }
  } else {
    const DataDB = await getArray(DataBase.Static.db, Type, {}, 'Guid');
    for (let i = 0; i < DataDB.length; i++) {
      DataList[DataDB[i].Guid] = DataDB[i];
    }
  }
  return DataList;
}
//获取物品信息
async function getItem(force = false) {
  const Type = 'Item';
  let DataList = {};
  if (getStorage(`version${Type}`) != GlobalConstant.AppVersion || force) {
    for (let i of ['Item', 'TreasureChest']) {
      const Buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/${i}MB`, { type: 'arraybuffer', msgpack: true });
      const DataMB = await msgpack.decode(new Uint8Array(Buffer));
      if (!DataMB) return;
      for (let j = 0; j < DataMB.length; j++) {
        let ItemType, ItemId;
        let Data = DataMB[j];
        switch (i) {
          case 'Item': {
            ItemId = Data.ItemId;
            ItemType = Data.ItemType;
            break;
          }
          case 'TreasureChest': {
            ItemId = Data.Id;
            ItemType = 17;
            break;
          }
          default: {
            ItemType = Data.ItemType;
          }
        }
        Data.Guid = `${ItemId}@${ItemType}`;
        await updateData(DataBase.Static.db, Type, Data);
        DataList[Data.Guid] = Data;
      }
      setStorage(`version${Type}`, GlobalConstant.AppVersion);
    }
  } else {
    const DataDB = await getArray(DataBase.Static.db, Type, {}, 'Guid');
    for (let i = 0; i < DataDB.length; i++) {
      DataList[DataDB[i].Guid] = DataDB[i];
    }
  }
  return DataList;
}
//获取神殿信息
async function getLocalRaidQuest(force = false) {
  let test = await getData(DataBase.Static.db, 'Raid', 100101);
  let LocalRaidQuestList = {};
  if (!test || force) {
    const json = await sendGMRequest(`https://raw.githubusercontent.com/moonheart/mementomori-masterbook/master/Master/LocalRaidQuestMB.json`, {});
    if (!json) {
      alert('获取神殿信息失败，请重试！');
      return;
    }
    const LocalRaidQuestMB = JSON.parse(json);
    for (let i = 0; i < LocalRaidQuestMB.length; i++) {
      const QuestMB = LocalRaidQuestMB[i];
      let Quest = {
        'Guid': QuestMB.Id,
        'LocalRaidBannerId': QuestMB.LocalRaidBannerId,
        'Level': QuestMB.Level,
        'LocalRaidLevel': QuestMB.LocalRaidLevel == 0 ? QuestMB.Id.toString().slice(-5, -2) * 1 : QuestMB.LocalRaidLevel,
        'Enermy': QuestMB.LocalRaidEnemyIds,
        'FixedBattleReward': QuestMB.FixedBattleRewards,
        'FirstBattleReward': QuestMB.FirstBattleRewards,
      };
      await updateData(DataBase.Static.db, 'Raid', Quest);
      LocalRaidQuestList[QuestMB.Id] = Quest;
    }
  } else {
    const LocalRaidQuestDB = await getArray(DataBase.Static.db, 'Raid', {}, 'Guid');
    for (let i = 0; i < LocalRaidQuestDB.length; i++) {
      const Quest = LocalRaidQuestDB[i];
      LocalRaidQuestList[Quest.Guid] = Quest;
    }
  }
  return LocalRaidQuestList;
}
//获取世界组
async function getWorldGroup() {
  const buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/WorldGroupMB`, { type: 'arraybuffer' });
  const WorldGroupMB = await msgpack.decode(new Uint8Array(buffer));
  const RegionList = {
    jp: TextResource['TimeServerName1'], //
    kr: TextResource['TimeServerName2'],
    ap: TextResource['TimeServerName3'],
    us: TextResource['TimeServerName4'],
    eu: TextResource['TimeServerName5'],
    gl: TextResource['TimeServerName6'],
  };
  const RegionIdList = { jp: 1, kr: 2, ap: 3, us: 4, eu: 5, gl: 6 };
  let WorldGroup = {
    RegionList: {},
    GroupList: {},
    WorldList: {},
  };
  for (let i = 0; i < WorldGroupMB.length; i++) {
    const WorldGroupData = WorldGroupMB[i];
    if (new Date(WorldGroupData.EndTime) > new Date()) {
      const RegionMemo = WorldGroupData.Memo;
      const RegionId = RegionIdList[RegionMemo];
      const WorldIdList = WorldGroupData.WorldIdList;
      let Region = WorldGroup.RegionList[RegionId];
      if (!Region) {
        Region = {
          'Name': RegionList[RegionMemo],
          'SName': RegionMemo,
          'WorldList': [],
          'GroupList': [`N${RegionId}`],
        };
        WorldGroup.RegionList[RegionId] = Region;
        WorldGroup.GroupList[`N${RegionId}`] = {
          'Name': `${TextResource['ChatTabSvS']} NA`,
          'SName': `GNA`,
          'Region': RegionId,
          'WorldList': [],
        };
      }
      const GroupId = WorldGroupData.Id;
      let Group = WorldGroup.GroupList[GroupId];
      if (!Group) {
        Group = {
          'Name': `${TextResource['ChatTabSvS']} ${GroupId}`,
          'SName': `G${GroupId}`,
          'Region': RegionId,
          'WorldList': [],
        };
        WorldGroup.GroupList[GroupId] = Group;
      }
      Region.GroupList.push(GroupId);
      for (let j = 0; j < WorldIdList.length; j++) {
        const WorldId = WorldIdList[j];
        Region.WorldList.push(WorldId);
        WorldGroup.WorldList[WorldId] = {
          'Name': `${TextResource['TitleWarningListWorld']} ${WorldId % 1000}`,
          'SName': `W${WorldId % 1000}`,
          'Region': RegionId,
          'Group': GroupId,
        };
        Region.WorldList.push(WorldId);
        Group.WorldList.push(WorldId);
      }
    }
  }
  const _getDataUri = await getDataUri();
  for (let i = 0; i < _getDataUri.WorldInfos.length; i++) {
    const WorldData = _getDataUri.WorldInfos[i];
    const GameServerId = WorldData.GameServerId;
    const RegionId = Math.floor(GameServerId / 10) ? Math.floor(GameServerId / 10) : 1;
    const WorldId = WorldData.Id;
    let Region = WorldGroup.RegionList[RegionId];
    Region.WorldList.push(WorldId);
    let World = WorldGroup.WorldList[WorldId];
    if (World) {
      World.GameServerId = GameServerId;
    } else {
      const GroupId = `N${RegionId}`;
      WorldGroup.GroupList[GroupId].WorldList.push(WorldId);
      WorldGroup.WorldList[WorldId] = {
        Name: `World ${WorldId % 1000}`,
        SName: `W${WorldId % 1000}`,
        Region: RegionId,
        Group: GroupId,
        GameServerId: GameServerId,
      };
    }
  }
  return WorldGroup;
}
//获取gvg信息
async function getGuildWar(ClassId, WorldId, GroupId) {
  let request;
  if (ClassId == 0) {
    request = await sendRequest(`https://api.mentemori.icu/${WorldId}/localgvg/latest`);
  } else {
    request = await sendRequest(`https://api.mentemori.icu/wg/${GroupId}/globalgvg/${ClassId}/${WorldId}/latest`);
  }
  return JSON.parse(request);
}
//https://prd1-auth.mememori-boi.com/api/auth/getDataUri
async function getDataUri(defaultOpting) {
  //生成配置
  let option = defaultOpting ?? buildOption(GlobalConstant.AppVersion);
  //随机ortegauuid
  option.headers.ortegauuid = crypto.randomUUID().replaceAll('-', '');
  //生成包体
  const data = {
    CountryCode: 'TW',
    UserId: 0,
  };
  option.body = data;
  //发包
  let result = await sendRequest(GlobalConstant.authURL + 'getDataUri', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/createUser
async function createUser(AuthToken, AdverisementId, CountryCode, ortegauuid) {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    AdverisementId: AdverisementId,
    AppVersion: GlobalConstant.AppVersion,
    CountryCode: CountryCode,
    DeviceToken: '',
    DisplayLanguage: 4,
    ModelName: GlobalConstant.ModelName,
    OSVersion: GlobalConstant.OSVersion,
    SteamTicket: '',
    AuthToken: AuthToken,
  };
  option.body = data;
  option.headers.ortegauuid = ortegauuid;
  let result = await sendRequest(GlobalConstant.authURL + 'createUser', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/setUserSetting
async function setUserSetting() {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    UserSettingsType: 2,
    Value: 2,
    DeviceToken: '',
  };
  option.body = data;
  let result = await sendRequest(GlobalConstant.authURL + 'setUserSetting', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/createWorldPlayer
async function createWorldPlayer(WorldId) {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    WorldId: WorldId,
    Comment: `W${WorldId}的偵察姬器人`,
    Name: `御坂${WorldId}號`,
    DeepLinkId: 0,
    SteamTicket: null,
  };
  option.body = data;
  let result = await sendRequest(GlobalConstant.authURL + 'createWorldPlayer', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/getComebackUserData
async function getComebackUserData(FromUserId, UserId, Password, AuthToken) {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    AppleIdToken: null,
    FromUserId: new Uint64BE(FromUserId.toString(), 10),
    GoogleAuthorizationCode: null,
    Password: Password,
    SnsType: 1,
    TwitterAccessToken: null,
    TwitterAccessTokenSecret: null,
    UserId: new Uint64BE(UserId.toString(), 10),
    AuthToken: AuthToken,
  };
  option.body = data;
  let result = await sendRequest(GlobalConstant.authURL + 'getComebackUserData', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/comebackUser
async function comebackUser(FromUserId, OneTimeToken, UserId) {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    FromUserId: new Uint64BE(FromUserId.toString(), 10),
    OneTimeToken: OneTimeToken,
    ToUserId: new Uint64BE(UserId.toString(), 10),
    SteamTicket: null,
  };
  option.body = data;
  let result = await sendRequest(GlobalConstant.authURL + 'comebackUser', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/login
async function login(ClientKey, AdverisementId, UserId) {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    ClientKey: ClientKey,
    DeviceToken: '',
    AppVersion: GlobalConstant.AppVersion,
    OSVersion: GlobalConstant.OSVersion,
    ModelName: GlobalConstant.ModelName,
    AdverisementId: AdverisementId,
    UserId: new Uint64BE(UserId.toString(), 10),
    IsPushNotificationAllowed: false,
  };
  option.body = data;
  let result = await sendRequest(GlobalConstant.authURL + 'login', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/getServerHost
async function getServerHost(WorldId) {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    WorldId: WorldId,
  };
  option.body = data;
  let result = await sendRequest(GlobalConstant.authURL + 'getServerHost', option);
  return result;
}
//user/loginPlayer
async function loginPlayer(PlayerId, Password) {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    Password: Password,
    PlayerId: new Uint64BE(PlayerId.toString(), 10),
    ErrorLogInfoList: null,
    SteamTicket: null,
  };
  option.body = data;
  let result = await sendRequest(GlobalVariable.userURL + 'user/loginPlayer', option);
  return result;
}
//user/getUserData
async function getUserData() {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {};
  option.body = data;
  let result = await sendRequest(GlobalVariable.userURL + 'user/getUserData', option);
  return result;
}
//localGvg/getLocalGvgSceneTransitionData
async function getLocalGvgSceneTransitionData() {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {};
  option.body = data;
  let result = await sendRequest(GlobalVariable.userURL + 'localGvg/getLocalGvgSceneTransitionData', option);
  return result;
}
//localGvg/getLocalGvgCastleInfoDialogData
async function getLocalGvgCastleInfoDialogData(CastleId) {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    CastleId: CastleId,
  };
  option.body = data;
  let result = await sendRequest(GlobalVariable.userURL + 'localGvg/getLocalGvgCastleInfoDialogData', option);
  return result;
}
//guild/searchGuildId
async function searchGuildId(GuildId) {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    GuildId: new Uint64BE(GuildId.toString(), 10),
  };
  option.body = data;
  let result = await sendRequest(GlobalVariable.userURL + 'guild/searchGuildId', option);
  return result;
}
//character/getDetailsInfo
async function getDetailsInfo(PlayerId, arrayCharacterId) {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    DeckType: 1,
    TargetUserCharacterGuids: arrayCharacterId,
    TargetPlayerId: new Uint64BE(PlayerId.toString(), 10),
  };
  option.body = data;
  let result = await sendRequest(GlobalVariable.userURL + 'character/getDetailsInfo', option);
  return result;
}
//globalGvg/getGlobalGvgCastleInfoDialogData
async function getGlobalGvgCastleInfoDialogData(CastleId, MatchingNumber) {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    'CastleId': CastleId,
    'MatchingNumber': MatchingNumber,
  };
  option.body = data;
  let result = await sendRequest(GlobalVariable.userURL + 'globalGvg/getGlobalGvgCastleInfoDialogData', option);
  return result;
}
//globalGvg/getGlobalGvgGroupAll
async function getGlobalGvgGroupAll() {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {};
  option.body = data;
  let result = await sendRequest(GlobalVariable.userURL + 'globalGvg/getGlobalGvgGroupAll', option);
  return result;
}
//globalGvg/getGlobalGvgSceneTransitionData
async function getGlobalGvgSceneTransitionData(GlobalGvgGroupId, MatchingNumber) {
  let option = buildOption(GlobalConstant.AppVersion);
  const data = {
    'GlobalGvgGroupId': GlobalGvgGroupId,
    'MatchingNumber': MatchingNumber,
  };
  option.body = data;
  let result = await sendRequest(GlobalVariable.userURL + 'globalGvg/getGlobalGvgSceneTransitionData', option);
  return result;
}
/*工具函数*/
//请求函数
async function sendRequest(url, option) {
  for (let i = 0; i < 600; i++) {
    if (GlobalVariable.ortegaaccesstoken == GlobalVariable.orteganextaccesstoken && GlobalVariable.orteganextaccesstoken != '') {
      await sleep(50);
    } else {
      const request = await sendGMRequest(url, option);
      if (request.ErrorCode && !(url.includes(GlobalConstant.authURL) || url.includes('getUserData') || url.includes('loginPlayer'))) {
        console.log('登陆超时');
        alert('登录超时，请重新登录');
        return;
      }
      return request;
    }
  }
  console.log('请求超时');
  alert('请求超时，请重试');
  return;
}
//跨域请求函数
async function sendGMRequest(url, option = {}) {
  return new Promise((resolve) => {
    let method = option.method ?? 'GET';
    let headers = option.headers ?? {};
    let data;
    let binary = false;
    if (option.body) {
      if (option.msgpack) {
        //每次重新生成uuid
        if (!headers.ortegauuid) {
          headers.ortegauuid = crypto.randomUUID().replaceAll('-', '');
        }
        headers.ortegaaccesstoken = GlobalVariable.orteganextaccesstoken;
        GlobalVariable.ortegaaccesstoken = GlobalVariable.orteganextaccesstoken;
        data = new Blob([msgpack.encode(option.body)]);
        binary = true;
      } else {
        data = option.body;
      }
    }
    let responseType = option.type ?? null;
    GM_xmlhttpRequest({
      method: method,
      url: url,
      headers: headers,
      data: data,
      responseType: responseType,
      onload: async (response) => {
        if (response.readyState == 4) {
          let type = getHeader(response.responseHeaders, 'content-type');
          let data;
          if (type == 'application/octet-stream') {
            let token = getHeader(response.responseHeaders, 'orteganextaccesstoken');
            if (token != undefined && token != '' && token != null) {
              GlobalVariable.orteganextaccesstoken = token;
            }
            setStorage('AssetVersion', getHeader(response.responseHeaders, 'ortegamasterversion'));
            setStorage('MasterVersion', getHeader(response.responseHeaders, 'ortegamasterversion'));
            setStorage('utcnowtimestamp', getHeader(response.responseHeaders, 'ortegautcnowtimestamp'));
            data = await msgpack.decode(new Uint8Array(response.response));
            if (data.ErrorCode) {
              console.log(`${response.finalUrl.split('/').pop()}:${GlobalConstant.ErrorCode?.[data.ErrorCode]}`);
              document.querySelector('#accountmanager>a:nth-child(2)')?.replaceChildren().insertAdjacentText('beforeend', '未登录');
            } else {
              console.log(`${response.finalUrl.split('/').pop()}:获取成功`);
            }
          } else {
            data = response.response;
          }
          resolve(data);
        }
      },
      onerror: function () {
        console.log('Request failed');
      },
    });
    //*/
  });
}
//一般请求函数
async function sendXMLRequest(url, option = {}) {
  return new Promise((resolve) => {
    let method = option.method ?? 'GET';
    let headers = option.headers ?? {};
    let data;
    if (option.body) {
      if (option.msgpack) {
        //每次重新生成uuid
        if (!headers.ortegauuid) {
          headers.ortegauuid = crypto.randomUUID().replaceAll('-', '');
        }
        headers.ortegaaccesstoken = GlobalVariable.orteganextaccesstoken;
        data = msgpack.encode(option.body);
      } else {
        data = option.body;
      }
    }
    let responseType = option.type ?? null;
    let request = new XMLHttpRequest();
    request.open(method, url);
    request.responseType = responseType;
    for (let i in headers) {
      request.setRequestHeader(i, headers[i]);
    }
    request.send(data);
    request.onload = async function () {
      if (request.status != 200) {
        // 分析响应的 HTTP 状态
        console.log(`Error ${request.status}: ${request.statusText}`); // 例如 404: Not Found
      } else {
        // 显示结果
        const response = request.response;
        console.log(`Done, got ${response.length} bytes`); // response 是服务器响应
        const type = request.getResponseHeader('content-type');
        GlobalVariable.orteganextaccesstoken = request.getResponseHeader('orteganextaccesstoken');
        setStorage('AssetVersion', request.getResponseHeader('assetversion'));
        setStorage('MasterVersion', request.getResponseHeader('masterversion'));
        setStorage('utcnowtimestamp', request.getResponseHeader('utcnowtimestamp'));
        let data;
        if (type == 'application/octet-stream') {
          data = await msgpack.decode(new Uint8Array(response));
          if (data.ErrorCode) {
            console.log(`${request.responseURL.split('/').pop()}:${GlobalConstant.ErrorCode[data.ErrorCode]}`);
          } else {
            console.log(`${request.responseURL.split('/').pop()}:获取成功`);
          }
        } else {
          data = response;
        }
        resolve(data);
      }
      request.onprogress = function (event) {
        if (event.lengthComputable) {
          console.log(`Received ${event.loaded} of ${event.total} bytes`);
        } else {
          console.log(`Received ${event.loaded} bytes`); // 没有 Content-Length
        }
      };
      request.onerror = function () {
        console.log('Request failed');
      };
    };
  });
}
//新建DOM
function createElement(type, text = '', option) {
  let node;
  if (type == 'text') {
    node = document.createTextNode(text);
  } else {
    node = document.createElement(type);
    node.innerHTML = text.toString().replaceAll(/\n */g, '');
  }
  if (option?.constructor === String) {
    node.id = option;
  } else if (option?.constructor === Object) {
    for (let i in option) {
      switch (i) {
        case 'class': {
          for (let j = 0; j < option[i].length; j++) {
            node.classList.add(option[i][j]);
          }
        }
        default: {
          node.setAttribute(i, option[i]);
        }
      }
    }
  }
  return node;
}
//获取父元素
function getFather(target, lable) {
  if (target.tagName == lable) return target;
  let father = target.parentNode;
  if (!father) return;
  if (father.tagName != lable) {
    father = getFather(target.parentNode, lable);
  }
  return father;
}
//获取消息头
function getHeader(headers, key) {
  let reg = new RegExp(`${key}:( ?)(?<token>.*?)\\r\\n`, 'i');
  let match = reg.exec(headers);
  let result;
  if (match) {
    result = match.groups.token;
  }
  return result;
}
//获取代码定义
function getVariable(script, variable) {
  let reg = new RegExp(`${variable} *?= *('|"|\`)?(?<value>.*?)('|"|\`)? *(;)?(\\n|\\r)`);
  let match = reg.exec(script);
  if (match) {
    return match.groups.value;
  }
}
//获取存储对象
function getStorage(key) {
  return localStorage.getItem(key);
}
//设置存储对象
function setStorage(key, value) {
  localStorage.removeItem(key);
  if (value != null && value != undefined) {
    localStorage.setItem(key, value);
  }
  return value;
}
//获得今日日期
function Today(hour, minute, second) {
  let Now = new Date();
  Now.setHours(hour);
  Now.setMinutes(minute);
  Now.setSeconds(second);
  Now.setMilliseconds(0);
  return Now;
}
//延迟
function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
/*Websocket流函数*/
//组合StreamID
function getStreamId(buffer, index) {
  let Int32 = buffer.getUint32(index, true);
  return {
    value: {
      WorldId: Int32 >>> 19,
      GroupId: (Int32 >>> 8) & 255,
      Class: (Int32 >>> 16) & 7,
      Block: (Int32 >>> 5) & 7,
      CastleId: 31 & Int32,
    },
    offset: index + 4,
  };
}
function getGuild(view, index, WorldId) {
  const GuildId = view.getUint32(index, true);
  const GuildNameLength = view.getUint8(index + 4, true);
  return {
    value: {
      GuildId: 1000 * GuildId + (WorldId % 1000),
      GuildName: new TextDecoder('utf-8').decode(new Uint8Array(view.buffer, index + 5, GuildNameLength)),
    },
    offset: index + 5 + GuildNameLength,
  };
}
function getCastle(view, index, WorldId) {
  return {
    value: {
      GuildId: 1000 * view.getUint32(index, true) + +(WorldId % 1000),
      AttackerGuildId: 1000 * view.getUint32(index + 4, true) + +(WorldId % 1000),
      AttackPartyCount: view.getUint16(index + 14, true),
      DefensePartyCount: view.getUint16(index + 12, true),
      GvgCastleState: view.getUint8(index + 16, true),
      UtcFallenTimeStamp: 1000 * view.getUint32(index + 8, true),
      LastWinPartyKnockOutCount: view.getUint16(index + 18, true),
    },
    offset: index + 20,
  };
}
function getPlayer(view, index, WorldId) {
  const PlayerId = view.getUint32(index, true);
  const GuildId = view.getUint32(index + 4, true);
  const PlayerNameLength = view.getUint8(index + 8, true);
  return {
    value: {
      PlayerId: 1000 * PlayerId + (WorldId % 1000),
      GuildId: 1000 * GuildId + (WorldId % 1000),
      PlayerName: new TextDecoder('utf-8').decode(new Uint8Array(view.buffer, index + 16, PlayerNameLength)),
    },
    offset: index + 16 + PlayerNameLength,
  };
}
function getAttacker(view, index, WorldId) {
  const PlayerId = view.getUint32(index, true);
  const CharacterId = view.getUint16(index + 4, true);
  const CastleId = view.getUint16(index + 6, true);
  return {
    value: {
      PlayerId: 1000 * PlayerId + (WorldId % 1000),
      CharacterId: CharacterId,
      CastleId: 31 & CastleId,
      DeployCount: (CastleId >> 5) & 3,
    },
    offset: index + 8,
  };
}
function getLastLoginTime(view, index, WorldId) {
  return {
    value: {
      PlayerId: 1000 * view.getUint32(index, true) + (WorldId % 1000),
      LastLoginTime: view.getUint32(index + 4, true),
    },
    offset: index + 16,
  };
}
function checkSameWorld(StraemA, StreamB) {
  const isLocalA = 0 == StraemA.GroupId && 0 == StraemA.Class && 0 == StraemA.Block;
  const isLocalB = 0 == StreamB.GroupId && 0 == StreamB.Class && 0 == StreamB.Block;
  return isLocalA || isLocalB ? StraemA.WorldId == StreamB.WorldId : StraemA.GroupId == StreamB.GroupId && StraemA.Class == StreamB.Class && StraemA.Block == StreamB.Block;
}
function sendData(socket, MatchInfo) {
  let buffer = new ArrayBuffer(4);
  let view = new DataView(buffer);
  let data = (MatchInfo.WorldId << 19) | (MatchInfo.ClassId << 16) | (MatchInfo.GroupId << 8) | (MatchInfo.BlockId << 5) | MatchInfo.CastleId;
  view.setUint32(0, data, true);
  socket.send(buffer);
}
/*数据库函数*/
//打开数据库
async function openDB(dbName) {
  //创建打开请求,若存在则打开,否则创建
  let version = DataBase[dbName].version;
  let request = await indexedDB.open(dbName, version);
  //请求失败
  request.onerror = function (error) {
    console.error(`数据库${dbName}:${version}打开失败:` + error.target.errorCode);
  };
  //请求成功
  request.onsuccess = function (success) {
    console.log(`数据库${dbName}:${version}打开成功`);
    DataBase[dbName].db = request.result;
  };
  //更新数据库版本
  request.onupgradeneeded = function (upgrade) {
    console.log(`数据库${dbName}:${version}构建中`);
    DataBase[dbName].db = request.result;
    let db = DataBase[dbName].db;
    switch (dbName) {
      case 'Record': {
        //表Match是否存在,否则创建
        if (!db.objectStoreNames.contains('Match')) {
          let objectStore = db.createObjectStore('Match', {
            keyPath: 'Guid',
          });
        }
        //表Guild是否存在,否则创建
        if (!db.objectStoreNames.contains('Guild')) {
          let objectStore = db.createObjectStore('Guild', {
            keyPath: 'Guid',
          });
          objectStore.createIndex('GuildId', 'GuildId', {
            unique: false,
          });
          objectStore.createIndex('Name', 'Name', {
            unique: false,
          });
        }
        //表Player是否存在,否则创建
        if (!db.objectStoreNames.contains('Player')) {
          let objectStore = db.createObjectStore('Player', {
            keyPath: 'Guid',
          });
          objectStore.createIndex('PlayerId', 'PlayerId', {
            unique: false,
          });
          objectStore.createIndex('Name', 'Name', {
            unique: false,
          });
          objectStore.createIndex('Guild', 'Guild', {
            unique: false,
          });
          objectStore.createIndex('Level', 'Level', {
            unique: false,
          });
        }
        //表Deck是否存在,否则创建
        if (!db.objectStoreNames.contains('Deck')) {
          let objectStore = db.createObjectStore('Deck', {
            keyPath: 'Guid',
          });
          objectStore.createIndex('DeckId', 'DeckId', {
            unique: false,
          });
          objectStore.createIndex('Player', 'Player', {
            unique: false,
          });
          objectStore.createIndex('LastUpdate', 'LastUpdate', {
            unique: false,
          });
        }
        //表Character是否存在,否则创建
        if (!db.objectStoreNames.contains('Character')) {
          let objectStore = db.createObjectStore('Character', {
            keyPath: 'Guid',
          });
          objectStore.createIndex('CharacterId', 'CharacterId', {
            unique: false,
          });
          objectStore.createIndex('Player', 'Player', {
            unique: false,
          });
          objectStore.createIndex('Level', 'Level', {
            unique: false,
          });
          objectStore.createIndex('SubLevel', 'SubLevel', {
            unique: false,
          });
          objectStore.createIndex('BattlePower', 'BattlePower', {
            unique: false,
          });
          objectStore.createIndex('LastUpdate', 'LastUpdate', {
            unique: false,
          });
        }
        //表Battle是否存在,否则创建
        if (!db.objectStoreNames.contains('Battle')) {
          let objectStore = db.createObjectStore('Battle', {
            keyPath: 'Guid',
          });
          objectStore.createIndex('LastUpdate', 'LastUpdate', {
            unique: false,
          });
        }
        break;
      }
      case 'Static': {
        //表TextResource是否存在,否则创建
        if (!db.objectStoreNames.contains('TextResource')) {
          let objectStore = db.createObjectStore('TextResource', {
            keyPath: 'Guid',
          });
        }
        //表Character是否存在,否则创建
        if (!db.objectStoreNames.contains('Character')) {
          let objectStore = db.createObjectStore('Character', {
            keyPath: 'Guid',
          });
        }
        //表Equipment是否存在,否则创建
        if (!db.objectStoreNames.contains('Equipment')) {
          let objectStore = db.createObjectStore('Equipment', {
            keyPath: 'Guid',
          });
        }
        //表EquipmentSet是否存在,否则创建
        if (!db.objectStoreNames.contains('EquipmentSet')) {
          let objectStore = db.createObjectStore('EquipmentSet', {
            keyPath: 'Guid',
          });
        }
        //表 Reinforcement 是否存在,否则创建
        if (!db.objectStoreNames.contains('EquipmentReinforcementParameter')) {
          let objectStore = db.createObjectStore('EquipmentReinforcementParameter', {
            keyPath: 'Guid',
          });
        }
        //表 Matchless 是否存在,否则创建
        if (!db.objectStoreNames.contains('EquipmentMatchlessSacredTreasure')) {
          let objectStore = db.createObjectStore('EquipmentMatchlessSacredTreasure', {
            keyPath: 'Guid',
          });
        }
        //表 Legend 是否存在,否则创建
        if (!db.objectStoreNames.contains('EquipmentLegendSacredTreasure')) {
          let objectStore = db.createObjectStore('EquipmentLegendSacredTreasure', {
            keyPath: 'Guid',
          });
        }
        //表 Sphere 是否存在,否则创建
        if (!db.objectStoreNames.contains('Sphere')) {
          let objectStore = db.createObjectStore('Sphere', {
            keyPath: 'Guid',
          });
        }
        //表 EquipmentSkill 是否存在,否则创建
        if (!db.objectStoreNames.contains('EquipmentExclusiveSkillDescription')) {
          let objectStore = db.createObjectStore('EquipmentExclusiveSkillDescription', {
            keyPath: 'Guid',
          });
        }
        //表 EquipmentExclusive 是否存在,否则创建
        if (!db.objectStoreNames.contains('EquipmentExclusiveEffect')) {
          let objectStore = db.createObjectStore('EquipmentExclusiveEffect', {
            keyPath: 'Guid',
          });
        }
        //表 Skill 是否存在,否则创建
        if (!db.objectStoreNames.contains('Skill')) {
          let objectStore = db.createObjectStore('Skill', {
            keyPath: 'Guid',
          });
        }
        //表Equipment是否存在,否则创建
        if (!db.objectStoreNames.contains('Item')) {
          let objectStore = db.createObjectStore('Item', {
            keyPath: 'Guid',
          });
        }
        //表Raid是否存在,否则创建
        if (!db.objectStoreNames.contains('Raid')) {
          let objectStore = db.createObjectStore('Raid', {
            keyPath: 'Guid',
          });
        }
        break;
      }
      default: {
        break;
      }
    }
    console.log(`数据库${dbName}:${version}构建成功`);
  };
}
//插入数据
async function insertData(db, table, data) {
  let transaction = db.transaction([table], 'readwrite');
  let objectStore = transaction.objectStore(table);
  let request = objectStore.add(data);
  request.onsuccess = function (success) {
    console.log(`${table} 插入成功:${data.Guid}`);
  };
  request.onerror = function (error) {
    console.error(`${table} 插入失败:${data.Guid}`);
  };
}
//更新数据
async function updateData(db, table, data) {
  let transaction = db.transaction([table], 'readwrite');
  let objectStore = transaction.objectStore(table);
  let request = objectStore.put(data);
  request.onsuccess = function (sucess) {
    console.log(`${table} 更新成功:${data.Guid}`);
  };
  request.onerror = function (error) {
    console.error(`${table} 更新失败:${data.Guid}`);
  };
}
//删除数据
async function removeData(db, table, key) {
  if (!key) return;
  let transaction = db.transaction([table], 'readwrite');
  let objectStore = transaction.objectStore(table);
  let request = objectStore.delete(key);
  request.onerror = function (error) {};
  request.onsuccess = function (success) {};
}
//获取数据
async function getData(db, table, index, key) {
  return new Promise(function (resolve, reject) {
    let transaction = db.transaction([table]);
    transaction.oncomplete = function (complete) {};
    transaction.onerror = function (error) {
      console.log(`${table} 获取失败:${index}`);
    };
    let objectStore = transaction.objectStore(table);
    let request;
    if (!key) {
      request = objectStore.get(index);
    } else {
      request = objectStore.index(key).get(index);
    }
    request.onerror = function (error) {
      console.log(`${table} 请求失败:${index}`);
      resolve(undefined);
    };
    request.onsuccess = function (success) {
      if (request.result) {
        resolve(request.result);
      } else {
        console.log(`${table} 获取失败:${index}`);
        resolve(undefined);
      }
    };
  });
}
//获取数据组,留空获取全部，{'>':,'>=':,'<':,'<=':}获取指定范围，字符串获取固定
async function getArray(db, table, index = {}, key) {
  return new Promise(function (resolve, reject) {
    let oArray = [];
    let transaction = db.transaction([table]);
    transaction.oncomplete = function (complete) {};
    transaction.onerror = function (error) {
      console.error(`${table} 获取失败:${index}`);
    };
    let objectStore = transaction.objectStore(table);
    let request;
    if ((index['>'] || index['>=']) && !index['<'] && !index['<=']) {
      request = objectStore.index(key).openCursor(IDBKeyRange.lowerBound(index['>='] ?? index['>'], !index['>=']));
    } else if (!index['>'] && !index['>='] && (index['<'] || index['<='])) {
      request = objectStore.index(key).openCursor(IDBKeyRange.upperBound(index['<='] ?? index['<'], !index['<=']));
    } else if ((index['>'] || index['>=']) && (index['<'] || index['<='])) {
      request = objectStore.index(key).openCursor(IDBKeyRange.bound(index['>='] ?? index['>'], index['<='] ?? index['<'], !index['>='], !index['<=']));
    } else if (index['==']) {
      request = objectStore.index(key).openCursor(IDBKeyRange.only(index['==']));
    } else {
      request = objectStore.openCursor();
    }
    request.onsuccess = function (success) {
      let cursor = this.result;
      if (cursor) {
        oArray.push(cursor.value);
        cursor.continue();
      } else {
        resolve(oArray);
      }
    };
    request.onerror = function (error) {};
  });
}
