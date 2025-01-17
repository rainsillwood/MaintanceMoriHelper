// ==UserScript==
// @name         MementoMori Guild Helper
// @namespace    https://suzunemaiki.moe/
// @updateURL    https://raw.githubusercontent.com/rainsillwood/MementoMoriGuildHelper/main/extend/GuildHelper.user.js
// @downloadURL  https://raw.githubusercontent.com/rainsillwood/MementoMoriGuildHelper/main/extend/GuildHelper.user.js
// @version      0.5
// @description  公会战小助手
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
const ModelName = 'Xiaomi 2203121C';
const OSVersion = 'Android OS 13 / API-33 (TKQ1.220829.002/V14.0.12.0.TLACNXM)';
const assetURL = 'https://raw.githubusercontent.com/rainsillwood/MementoMoriGuildHelper/main/assets/';
const authURL = 'https://prd1-auth.mememori-boi.com/api/auth/';
const LocalURL = 'https://mentemori.icu/';
let userURL = '';
const LanguageTable = {
  'static': {
    'title': {
      'jpn': 'メンテもりもり',
      'eng': 'Maintenance Mori',
      'chs': '维护多多',
      'cht': '维护多多',
    },
    'basic': {
      'jpn': '通常 ： ',
      'eng': 'Normal&ensp;:&ensp;',
      'cht': '通用功能 ： ',
      'chs': '通用功能 ： ',
    },
    'temple': {
      'jpn': '幻影の神殿',
      'eng': 'Temple',
      'cht': '幻影神殿',
      'chs': '幻影神殿',
    },
    'rankings': {
      'jpn': 'ランキング',
      'eng': 'Ranking',
      'cht': '排行榜',
      'chs': '排行榜',
    },
    'arena': {
      'jpn': 'バトリ',
      'eng': 'Battle League',
      'cht': '古競技場',
      'chs': '古竞技场',
    },
    'legend': {
      'jpn': 'レジェリ',
      'eng': 'Legend League',
      'cht': '巔峰競技場',
      'chs': '巅峰竞技场',
    },
    'localgvg': {
      'jpn': 'ギルバト',
      'eng': 'Guild Battle',
      'cht': '公會戰',
      'chs': '公会战',
    },
    'globalgvg': {
      'jpn': 'グラバト',
      'eng': 'Grand War',
      'cht': '跨服公會戰',
      'chs': '跨服公会战',
    },
    'battle_log': {
      'jpn': 'バトルレポート再生',
      'eng': 'Battle Log Viewer',
      'cht': '戰鬥記錄回放',
      'chs': '战斗记录回放',
    },
    'weekly': {
      'jpn': '週間 ： ',
      'eng': 'Weekly&ensp;:&ensp;',
      'cht': '每週特報 ： ',
      'chs': '每周特报 ： ',
    },
    'weekly_chara': {
      'jpn': 'キャラ育成',
      'eng': 'Character',
      'cht': '角色培育',
      'chs': '角色培育',
    },
    'weekly_boss': {
      'jpn': 'クエスト',
      'eng': 'Quest',
      'cht': '主線冒險',
      'chs': '幻影神殿',
    },
    'weekly_arena': {
      'jpn': 'バトリ',
      'eng': 'BL',
      'cht': '古競技場',
      'chs': '古竞技场',
    },
    'weekly_legend': {
      'jpn': '幻影の神殿',
      'eng': 'LL',
      'cht': '巔峰競技場',
      'chs': '巅峰竞技场',
    },
    'extend': {
      'jpn': '拡張 ： ',
      'eng': 'Extend&ensp;:&ensp;',
      'cht': '擴展功能 ： ',
      'chs': '扩展功能 ： ',
    },
    'dataconvert': {
      'jpn': 'データ変換',
      'eng': 'Data Convert',
      'cht': '數據轉換',
      'chs': '数据转换',
    },
    'battlehelper': {
      'jpn': '戦闘監視',
      'eng': 'Battle Helper',
      'cht': '戰鬥監控',
      'chs': '战斗监控',
    },
    'account': {
      'jpn': 'アカウント',
      'eng': 'Account:',
      'cht': '登錄狀態：',
      'chs': '登录状态：',
    },
    'noaccount': {
      'jpn': 'アカウントなし',
      'eng': 'No Account',
      'cht': '無賬號',
      'chs': '无账号',
    },
    'Region': {
      'jpn': 'サーバー',
      'eng': 'Region',
      'cht': '區域',
      'chs': '区域',
    },
    'Group': {
      'jpn': 'グループ',
      'eng': 'Group',
      'cht': '戰區',
      'chs': '战区',
    },
    'Class': {
      'jpn': 'クラス',
      'eng': 'Class',
      'cht': '級別',
      'chs': '级别',
    },
    'World': {
      'jpn': 'ワールド',
      'eng': 'World',
      'cht': '世界',
      'chs': '世界',
    },
    'Block': {
      'jpn': 'ブロック',
      'eng': 'Block',
      'cht': '組別',
      'chs': '组别',
    },
    'Local': {
      'jpn': 'Local',
      'eng': 'Local',
      'cht': '本地',
      'chs': '本地',
    },
    'Elite': {
      'jpn': 'Elite',
      'eng': 'Elite',
      'cht': '菁英級',
      'chs': '精英级',
    },
    'Expert': {
      'jpn': 'ブロック',
      'eng': 'Expert',
      'cht': '專家級',
      'chs': '专家级',
    },
    'Master': {
      'jpn': 'ブロック',
      'eng': 'Master',
      'cht': '大師級',
      'chs': '大师级',
    },
    'Asia': {
      'jpn': 'Asia',
      'eng': 'Asia',
      'cht': '亞服',
      'chs': '亚服',
    },
    'Japan': {
      'jpn': 'Japan',
      'eng': 'Japan',
      'cht': '日服',
      'chs': '日服',
    },
    'America': {
      'jpn': 'America',
      'eng': 'America',
      'cht': '美服',
      'chs': '美服',
    },
    'Europe': {
      'jpn': 'Europe',
      'eng': 'Europe',
      'cht': '歐服',
      'chs': '欧服',
    },
    'Korea': {
      'jpn': 'Korea',
      'eng': 'Korea',
      'cht': '韓服',
      'chs': '韩服',
    },
    'Global': {
      'jpn': 'Global',
      'eng': 'Global',
      'cht': '國際',
      'chs': '国际',
    },
    'HP': {
      'jpn': 'HP',
      'eng': 'HP',
      'cht': '生命',
      'chs': '生命',
    },
    'ワールド': {
      'jpn': 'ワールド',
      'eng': 'World ',
      'cht': '世界',
      'chs': '世界',
    },
    'レベル': {
      'jpn': 'レベル',
      'eng': 'Level ',
      'cht': '等級',
      'chs': '等级',
    },
    '幻影の神殿': {
      'jpn': '幻影の神殿',
      'eng': 'Temple of Illusions',
      'cht': '幻影神殿',
      'chs': '幻影神殿',
    },
    'サーバー': {
      'jpn': 'サーバー',
      'eng': 'Server',
      'cht': '区域',
      'chs': '区域',
    },
    '更新': {
      'jpn': '更新',
      'eng': 'Updated',
      'cht': '更新時間',
      'chs': '更新時間',
    },
    'プレイヤーランキング': {
      'jpn': 'プレイヤーランキング',
      'eng': 'Player Rankings',
      'cht': '玩家排行榜',
      'chs': '玩家排行榜',
    },
    '戦闘力': {
      'jpn': '戦闘力',
      'eng': 'Battle Power',
      'cht': '戰鬥力',
      'chs': '战斗力',
    },
    'プレイヤーランク': {
      'jpn': 'プレイヤーランク',
      'eng': 'Player Rank',
      'cht': '玩家等級',
      'chs': '玩家等级',
    },
    'メインクエスト': {
      'jpn': 'メインクエスト',
      'eng': 'Quest',
      'cht': '主線冒險',
      'chs': '主线冒险',
    },
    '無窮の塔': {
      'jpn': '無窮の塔',
      'eng': 'Tower',
      'cht': '無窮之塔',
      'chs': '无穷之塔',
    },
    '藍の塔': {
      'jpn': '藍の塔',
      'eng': 'Tower of Azure',
      'cht': '憂藍之塔',
      'chs': '忧蓝之塔',
    },
    '紅の塔': {
      'jpn': '紅の塔',
      'eng': 'Tower of Crimson',
      'cht': '葉紅之塔',
      'chs': '叶红之塔',
    },
    '翠の塔': {
      'jpn': '翠の塔',
      'eng': 'Tower of Emerald',
      'cht': '蒼翠之塔',
      'chs': '苍翠之塔',
    },
    '黄の塔': {
      'jpn': '黄の塔',
      'eng': 'Tower of Amber',
      'cht': '流金之塔',
      'chs': '流金之塔',
    },
    'ギルドランキング': {
      'jpn': 'ギルドランキング',
      'eng': 'Guild Rankings',
      'cht': '公會排行榜',
      'chs': '公会排行榜',
    },
    'ギルドレベル': {
      'jpn': 'ギルドレベル',
      'eng': 'Guild Level',
      'cht': '公會等級',
      'chs': '公会等级',
    },
    'ギルドストック': {
      'jpn': 'ギルドストック',
      'eng': 'Guild Stock',
      'cht': '公會積分',
      'chs': '公会积分',
    },
    'ギルド総戦闘力': {
      'jpn': 'ギルド総戦闘力',
      'eng': 'Battle Power',
      'cht': '公會總戰力',
      'chs': '公会总战力',
    },
    'プレイヤー名': {
      'jpn': 'プレイヤー名',
      'eng': 'Name ',
      'cht': '玩家名稱',
      'chs': '玩家名称',
    },
    '階': {
      'jpn': '階',
      'eng': 'Floor ',
      'cht': '層數',
      'chs': '层数',
    },
    'ランク': {
      'jpn': 'ランク',
      'eng': 'Rank ',
      'cht': '等級',
      'chs': '等级',
    },
    'クエスト': {
      'jpn': 'クエスト',
      'eng': 'Quest ',
      'cht': '關卡',
      'chs': '关卡',
    },
    'ギルド名': {
      'jpn': 'ギルド名',
      'eng': 'Name ',
      'cht': '公會名稱',
      'chs': '公会名称',
    },
    '人数': {
      'jpn': '人数',
      'eng': 'Members ',
      'cht': '人數',
      'chs': '人数',
    },
    'バトルリーグ': {
      'jpn': 'バトルリーグ',
      'eng': 'Battle League',
      'cht': '古競技場',
      'chs': '古竞技场',
    },
    'プレイヤー': {
      'jpn': 'プレイヤー',
      'eng': 'Player ',
      'cht': '玩家名稱',
      'chs': '玩家名称',
    },
    '枠１': {
      'jpn': '枠１',
      'eng': 'Slot 1 ',
      'cht': '欄１',
      'chs': '栏１',
    },
    '枠２': {
      'jpn': '枠２',
      'eng': 'Slot 2 ',
      'cht': '欄２',
      'chs': '栏２',
    },
    '枠３': {
      'jpn': '枠３',
      'eng': 'Slot 3 ',
      'cht': '欄３',
      'chs': '栏３',
    },
    '枠４': {
      'jpn': '枠４',
      'eng': 'Slot 4 ',
      'cht': '欄４',
      'chs': '栏４',
    },
    '枠５': {
      'jpn': '枠５',
      'eng': 'Slot 5 ',
      'cht': '欄５',
      'chs': '栏５',
    },
    '武具': {
      'jpn': '武具',
      'eng': 'Equipment ',
      'cht': '裝備',
      'chs': '装备',
    },
    '腕力': {
      'jpn': '腕力',
      'eng': 'STR',
      'cht': '力量',
      'chs': '力量',
    },
    '技力': {
      'jpn': '技力',
      'eng': 'DEX',
      'cht': '戰技',
      'chs': '战技',
    },
    '聖装': {
      'jpn': '聖装',
      'eng': 'Holy Effects',
      'cht': '聖装',
      'chs': '圣装',
    },
    '魔装': {
      'jpn': '魔装',
      'eng': 'Dark Effects',
      'cht': '魔装',
      'chs': '魔装',
    },
    '魔力': {
      'jpn': '魔力',
      'eng': 'MAG',
      'cht': '魔力',
      'chs': '魔力',
    },
    '耐久力': {
      'jpn': '耐久力',
      'eng': 'STA',
      'cht': '耐力',
      'chs': '耐力',
    },
    'キャラ': {
      'jpn': 'キャラ',
      'eng': 'Character',
      'cht': '角色名稱',
      'chs': '角色名称',
    },
    'Lv.': {
      'jpn': 'Lv.',
      'eng': 'Level',
      'cht': '等級',
      'chs': '等级',
    },
    '攻撃力': {
      'jpn': '攻撃力',
      'eng': 'ATK',
      'cht': '攻擊力',
      'chs': '攻击力',
    },
    '防御力': {
      'jpn': '防御力',
      'eng': 'DEF',
      'cht': '防御力',
      'chs': '防御力',
    },
    '防御貫通': {
      'jpn': '防御貫通',
      'eng': 'DEF Break',
      'cht': '防禦穿透',
      'chs': '防御穿透',
    },
    'スピード': {
      'jpn': 'スピード',
      'eng': 'SPD',
      'cht': '速度',
      'chs': '速度',
    },
    '物魔防御貫通': {
      'jpn': '物魔防御貫通',
      'eng': 'PM.DEF Break',
      'cht': '物魔防禦穿透',
      'chs': '物魔防御穿透',
    },
    '物理防御力': {
      'jpn': '物理防御力',
      'eng': 'P.DEF',
      'cht': '物理防御力',
      'chs': '物理防御力',
    },
    '魔法防御力': {
      'jpn': '魔法防御力',
      'eng': 'M.DEF',
      'cht': '魔法防御力',
      'chs': '魔法防御力',
    },
    '命中': {
      'jpn': '命中',
      'eng': 'ACC',
      'cht': '命中',
      'chs': '命中',
    },
    'クリティカル': {
      'jpn': 'クリティカル',
      'eng': 'CRIT',
      'cht': '暴擊',
      'chs': '暴击',
    },
    'クリダメ強化': {
      'jpn': 'クリダメ強化',
      'eng': 'CRIT DMG Boost',
      'cht': '暴擊傷害強化',
      'chs': '暴击伤害强化',
    },
    '魔法クリダメ緩和': {
      'jpn': '魔法クリダメ緩和',
      'eng': 'M.CRIT DMG Cut',
      'cht': '魔法暴擊傷害降低',
      'chs': '魔法暴击伤害降低',
    },
    '物理クリダメ緩和': {
      'jpn': '物理クリダメ緩和',
      'eng': 'P.CRIT DMG Cut',
      'cht': '物理暴擊傷害降低',
      'chs': '物理暴击伤害降低',
    },
    '弱体効果命中': {
      'jpn': '弱体効果命中',
      'eng': 'Debuff ACC',
      'cht': '弱化效果命中',
      'chs': '弱化效果命中',
    },
    '弱体効果耐性': {
      'jpn': '弱体効果耐性',
      'eng': 'Debuff RES',
      'cht': '弱化效果抗性',
      'chs': '弱化效果抗性',
    },
    'カウンタ': {
      'jpn': 'カウンタ',
      'eng': 'Counter',
      'cht': '傷害反彈',
      'chs': '伤害反弹',
    },
    'HPドレイン': {
      'jpn': 'HPドレイン',
      'eng': 'HP Drain',
      'cht': '吸血',
      'chs': '吸血',
    },
    '回避': {
      'jpn': '回避',
      'eng': 'EVD',
      'cht': '閃避',
      'chs': '闪避',
    },
    'クリティカル耐性': {
      'jpn': 'クリティカル耐性',
      'eng': 'CRIT RES',
      'cht': '暴擊抗性',
      'chs': '暴击抗性',
    },
    'グループ': {
      'jpn': 'グループ',
      'eng': 'Group',
      'cht': '戰區',
      'chs': '战区',
    },
    'レジェンドリーグ': {
      'jpn': 'レジェンドリーグ',
      'eng': 'Legend League',
      'cht': '巔峰競技場',
      'chs': '巅峰竞技场',
    },
    'ギルドバトル': {
      'jpn': 'ギルドバトル',
      'eng': 'Guild Battle',
      'cht': '公會戰',
      'chs': '公会战',
    },
    'クラス': {
      'jpn': 'クラス',
      'eng': 'Class',
      'cht': '級別',
      'chs': '级别',
    },
    'ブロック': {
      'jpn': 'ブロック',
      'eng': 'Block',
      'cht': '組別',
      'chs': '组别',
    },
    'グランドバトル': {
      'jpn': 'グランドバトル',
      'eng': 'Grand War',
      'cht': '跨服公會戰',
      'chs': '跨服公会战',
    },
    'バトルレポート再生': {
      'jpn': 'バトルレポート再生',
      'eng': 'Battle Log Viewer',
      'cht': '戰鬥記錄回放',
      'chs': '战斗记录回放',
    },
    '週間トピックス・属性別キャラ育成': {
      'jpn': '週間トピックス・属性別キャラ育成',
      'eng': 'Weekly Topics - Character Growth by Soul',
      'cht': '每週特報 - 角色培育',
      'chs': '每周特报 - 角色培育',
    },
    '天属性': {
      'jpn': '天属性',
      'eng': 'Radiance ',
      'cht': '天光',
      'chs': '天光',
    },
    '冥属性': {
      'jpn': '冥属性',
      'eng': 'Chaos ',
      'cht': '幽冥',
      'chs': '幽冥',
    },
    '藍属性': {
      'jpn': '藍属性',
      'eng': 'Azure ',
      'cht': '憂藍',
      'chs': '忧蓝',
    },
    '紅属性': {
      'jpn': '紅属性',
      'eng': 'Crimson ',
      'cht': '葉紅',
      'chs': '叶红',
    },
    '翠属性': {
      'jpn': '翠属性',
      'eng': 'Emerald ',
      'cht': '蒼翠',
      'chs': '苍翠',
    },
    '黄属性': {
      'jpn': '黄属性',
      'eng': 'Amber ',
      'cht': '流金',
      'chs': '流金',
    },
    '週間トピックス・バトルリーグ': {
      'jpn': '週間トピックス・バトルリーグ',
      'eng': 'Weekly Topics - Quest',
      'cht': '每週特報 - 主線冒險',
      'chs': '每周特报 - 主线冒险',
    },
    '章': {
      'jpn': '章',
      'eng': 'Chapter ',
      'cht': '領先章節',
      'chs': '领先章节',
    },
    '前線': {
      'jpn': '前線',
      'eng': 'Frontline ',
      'cht': '領先梯隊',
      'chs': '领先梯队',
    },
    '全体': {
      'jpn': '全体',
      'eng': 'Overall ',
      'cht': '全體玩家',
      'chs': '全体玩家',
    },
    '到達人数': {
      'jpn': '到達人数',
      'eng': 'Clear Count ',
      'cht': '到達人数',
      'chs': '到达人数',
    },
    '週間トピックス・バトルリーグ': {
      'jpn': '週間トピックス・バトルリーグ',
      'eng': 'Weekly Topics - Battle League',
      'cht': '每週特報 - 古競技場',
      'chs': '每周特报 - 古竞技场',
    },
    '30位以内': {
      'jpn': '30位以内',
      'eng': 'Top 30 ',
      'cht': '前30名',
      'chs': '前30名',
    },
    '全体': {
      'jpn': '全体',
      'eng': 'Overall ',
      'cht': '全體玩家',
      'chs': '全体玩家',
    },
    '連勝記録': {
      'jpn': '連勝記録',
      'eng': 'Consecutive Wins ·',
      'cht': '連勝記録',
      'chs': '连胜纪录',
    },
    '週間トピックス・レジェンドリーグ': {
      'jpn': '週間トピックス・レジェンドリーグ',
      'eng': 'Weekly Topics - Legend League',
      'cht': '每週特報 - 巅峰競技場',
      'chs': '每周特报 - 巅峰竞技场',
    },
    'ステータス': {
      'jpn': 'ステータス',
      'eng': 'Stats ',
      'cht': '狀態',
      'chs': '状态',
    },
  },
  'dynamic': {
    'jpn': {
      'Rank': 'ランク',
      'STR': '腕力',
      'MAG': '魔力',
      'DEX': '技力',
      'STA': '耐久力',
      'ATK': '攻撃力',
      'DEF': '防御力',
      'DEF Break': '防御貫通',
      'SPD': 'スピード',
      'PM.DEF Break': '物魔防御貫通',
      'P.DEF': '物理防御力',
      'M.DEF': '魔法防御力',
      'ACC': '命中',
      'EVD': '回避',
      'CRIT': 'クリティカル',
      'CRIT RES': 'クリティカル耐性',
      'CRIT DMG Boost': 'クリダメ強化',
      'P.CRIT DMG Cut': '物理クリダメ緩和',
      'M.CRIT DMG Cut': '魔法クリダメ緩和',
      'Debuff ACC': '弱体効果命中',
      'Debuff RES': '弱体効果耐性',
      'Counter': 'カウンタ',
      'HP Drain': 'HPドレイン',
      'Locked': '未加工',
      'None': '未装着',
      ' pts, ': ' ポイント ',
      ' streak': ' 連勝中',
      'EXP Orb': '経験珠',
      'Upgrade Water': '強化水',
      'Upgrade Panacea': '強化秘薬',
      'Kindling Orb': '潜在宝珠',
      'Rune Ticket': 'ルーンチケット',
      'Event': 'イベント',
      'All Worlds': 'すべて',
      ' Forces': '軍',
      ' Wins': '連勝',
    },
    'eng': {
      'Rank': 'Rank',
      'STR': 'STR',
      'MAG': 'MAG',
      'DEX': 'DEX',
      'STA': 'STA',
      'ATK': 'ATK',
      'DEF': 'DEF',
      'DEF Break': 'DEF Break',
      'SPD': 'SPD',
      'PM.DEF Break': 'PM.DEF Break',
      'P.DEF': 'P.DEF',
      'M.DEF': 'M.DEF',
      'ACC': 'ACC',
      'EVD': 'EVD',
      'CRIT': 'CRIT',
      'CRIT RES': 'CRIT RES',
      'CRIT DMG Boost': 'CRIT DMG Boost',
      'P.CRIT DMG Cut': 'P.CRIT DMG Cut',
      'M.CRIT DMG Cut': 'M.CRIT DMG Cut',
      'Debuff ACC': 'Debuff ACC',
      'Debuff RES': 'Debuff RES',
      'Counter': 'Counter',
      'HP Drain': 'HP Drain',
      'Locked': 'Locked',
      'None': 'None',
      ' pts, ': ' pts, ',
      ' streak': '  streak',
      'EXP Orb': 'EXP Orb',
      'Upgrade Water': 'Upgrade Water',
      'Upgrade Panacea': 'Upgrade Panacea',
      'Kindling Orb': 'Kindling Orb',
      'Rune Ticket': 'Rune Ticket',
      'Event': 'Event',
      'All Worlds': 'All Worlds',
      ' Forces': ' Forces',
      ' Wins': ' Wins',
    },
    'cht': {
      'Rank': '等级',
      'STR': '力量',
      'MAG': '魔力',
      'DEX': '戰技',
      'STA': '耐力',
      'ATK': '攻擊力',
      'DEF': '防禦力',
      'DEF Break': '防禦穿透',
      'SPD': '速度',
      'PM.DEF Break': '物魔防禦穿透',
      'P.DEF': '物理防禦力',
      'M.DEF': '魔法防禦力',
      'ACC': '命中',
      'EVD': '閃避',
      'CRIT': '暴擊',
      'CRIT RES': '暴擊抗性',
      'CRIT DMG Boost': '暴擊傷害強化',
      'P.CRIT DMG Cut': '物理暴擊傷害降低',
      'M.CRIT DMG Cut': '魔法暴擊傷害降低',
      'Debuff ACC': '弱化效果命中',
      'Debuff RES': '弱化效果抗性',
      'Counter': '傷害反彈',
      'HP Drain': '吸血',
      'Locked': '未加工',
      'None': '未裝備',
      ' pts, ': ' 積分, ',
      ' streak': '  連勝中',
      'EXP Orb': '經驗珠',
      'Upgrade Water': '強化水',
      'Upgrade Panacea': '強化秘藥',
      'Kindling Orb': '潛能寶珠',
      'Rune Ticket': '符石兌換券',
      'Event': '活動',
      'All Worlds': '所有世界',
      ' Forces': ' 軍',
      ' Wins': ' 連勝',
    },
    'chs': {
      'Rank': '等级',
      'STR': '力量',
      'MAG': '魔力',
      'DEX': '戰技',
      'STA': '耐力',
      'ATK': '攻擊力',
      'DEF': '防禦力',
      'DEF Break': '防禦穿透',
      'SPD': '速度',
      'PM.DEF Break': '物魔防禦穿透',
      'P.DEF': '物理防禦力',
      'M.DEF': '魔法防禦力',
      'ACC': '命中',
      'EVD': '閃避',
      'CRIT': '暴擊',
      'CRIT RES': '暴擊抗性',
      'CRIT DMG Boost': '暴擊傷害強化',
      'P.CRIT DMG Cut': '物理暴擊傷害降低',
      'M.CRIT DMG Cut': '魔法暴擊傷害降低',
      'Debuff ACC': '弱化效果命中',
      'Debuff RES': '弱化效果抗性',
      'Counter': '傷害反彈',
      'HP Drain': '吸血',
      'Locked': '未加工',
      'None': '未裝備',
      ' pts, ': ' 積分, ',
      ' streak': '  連勝中',
      'EXP Orb': '經驗珠',
      'Upgrade Water': '強化水',
      'Upgrade Panacea': '強化秘藥',
      'Kindling Orb': '潛能寶珠',
      'Rune Ticket': '符石兌換券',
      'Event': '活動',
      'All Worlds': '所有世界',
      ' Forces': ' 軍',
      ' Wins': ' 連勝',
    },
  },
  'local': {
    'jpn': ['ブラッセル', 'ウィスケルケー', 'モダーヴ', 'シメイ', 'グラベンスティン', 'カンブル', 'クインティヌス', 'ランベール', 'サンジャック', 'ミヒャエル', 'ナミュール', 'シャルルロア', 'アルゼット', 'エノー', 'ワーヴル', 'モンス', 'クリストフ', 'コルトレイク', 'イーペル', 'サルヴァトール', 'バーフ'],
    'eng': ['Brussell', 'Wissekerke', 'Modave', 'Chimay', 'Gravensteen', 'Cambre', 'Quentin', 'Lambert', 'Saint-Jacques', 'Michael', 'Namur', 'Charleroi', 'Alzette', 'Hainaut', 'Wavre', 'Mons', 'Christophe', 'Kortrijk', 'Ypres', 'Salvador', 'Bavo'],
    'cht': ['布魯塞爾', '維瑟克', '莫達沃', '希邁', '格拉文斯坦', '坎布爾', '昆汀', '朗博', '圣雅克', '米額爾', '那慕爾', '夏勒哇', '阿爾澤特', '埃諾', '瓦夫爾', '芒斯', '克里斯托夫', '克特雷特', '伊珀爾', '薩爾瓦多', '巴弗'],
    'chs': ['布魯塞爾', '維瑟克', '莫達沃', '希邁', '格拉文斯坦', '坎布爾', '昆汀', '朗博', '圣雅克', '米額爾', '那慕爾', '夏勒哇', '阿爾澤特', '埃諾', '瓦夫爾', '芒斯', '克里斯托夫', '克特雷特', '伊珀爾', '薩爾瓦多', '巴弗'],
  },
  'global': {
    'jpn': ['アイン', 'イエソド', 'マルクト', 'ケテル', 'テフォレト', 'クシェル', 'シトリ', 'トパズ', 'メラル', 'ペリド', 'ファリア', 'ラピス', 'ラリマル', 'マリン', 'アメト', 'ラベン', 'シルコン', 'オニキス', 'フロライト', 'ガネット', 'ルラ'],
    'eng': ['Ein', 'Yesod', 'Malkuth', 'Keter', 'Tiferet', 'Cushel', 'Citri', 'Toppaz', 'Meral', 'Perido', 'Pharia', 'Lapis', 'Larimal', 'Marin', 'Amest', 'Laven', 'Zircon', 'Onyx', 'Floryte', 'Ganette', 'Rula'],
    'cht': ['虛無神殿艾茵', '基礎之城耶索多', '王國之城瑪克托', '王冠之城凱特爾', '美麗之城堤法瑞', '庫修爾', '希托利', '托帕茲', '瑪羅', '貝利托', '法利雅', '拉畢斯', '拉利瑪', '瑪令', '雅梅特', '拉維', '瑟康', '奧尼克斯', '弗羅萊特', '葛涅特', '盧拉'],
    'chs': ['虛無神殿艾茵', '基礎之城耶索多', '王國之城瑪克托', '王冠之城凱特爾', '美麗之城堤法瑞', '庫修爾', '希托利', '托帕茲', '瑪羅', '貝利托', '法利雅', '拉畢斯', '拉利瑪', '瑪令', '雅梅特', '拉維', '瑟康', '奧尼克斯', '弗羅萊特', '葛涅特', '盧拉'],
  },
};
let language = '';
let MagicOnionHost = '';
let MagicOnionPort = '';
let AuthTokenOfMagicOnion = '';
let LogCastleList = [];
let ortegaaccesstoken = '';
let TextResource = {};
let ErrorCode = {};
let AppVersion = getStorage('AppVersion') ?? '';
let SocketGvG;
let LogCastleTimer;
let database;
const URLFunction = document.URL.replace(/https?\:\/\/.*?\/(.*?\.html)?(\?function=.*?)?(\?lang=.*?)?$/, '$1$2');
const URLLanguage = document.URL.replace(/https?\:\/\/.*?\/(.*?\.html)?(\?function=.*?)?(\?lang=.*?)?$/, '$3');
if (!URLLanguage) {
  language = 'eng';
} else {
  language = URLLanguage.replace('?lang=', '');
  language = LanguageTable.dynamic[language] ? language : 'jpn';
}
//清除元素
if (URLFunction.includes('?function=')) {
  while (document.body.childNodes.length > 4) {
    document.body.lastChild.remove();
  }
} else {
  unsafeWindow.m = LanguageTable.dynamic;
  let jalist = document.querySelectorAll('[data-ja]');
  for (let i = 0; i < jalist.length; i++) {
    dataja = jalist[i].getAttribute('data-ja');
    jalist[i].innerHTML = LanguageTable.static[dataja]?.[language] ?? jalist[i].innerHTML;
  }
  const HPNode = document.querySelector('#HP');
  HPNode && (HPNode.previousElementSibling.innerHTML = LanguageTable.static['HP'][language]);
  const CharacterNode = document.querySelector('#character');
  if (CharacterNode) {
    CharacterNode.addEventListener('change', () => {
      let DOM = Array.from(CharacterNode.querySelectorAll('span'));
      for (let i in DOM) {
        DOM[i].innerHTML = DOM[i].innerHTML.replace('HP', LanguageTable.static['HP'][language]);
      }
    });
  }
}
/*初始化所有页面*/
initPage();
//重构页面
switch (URLFunction) {
  case '?function=fileConverter': {
    fileConverter();
    break;
  }
  case '?function=gvgMapper': {
    gvgMapper();
    break;
  }
  default: {
  }
}
/*初始化功能*/
//初始化页面
async function initPage() {
  console.log('脚本运行中');
  document.querySelector('h1').innerHTML = LanguageTable.static['title'][language];
  document.querySelector('title').innerHTML = LanguageTable.static['title'][language];
  document.querySelector('style').appendChild(
    createElement(
      'text',
      `
            nav a{
              display: inline-block;
              min-width: 22px;
              text-align: center;
              padding: 5px 0px;
            }
        `
    )
  );
  //获取原导航栏
  const navDefault = document.querySelector('nav');
  //获取功能模块
  const divFunction = navDefault.childNodes[1];
  divFunction.innerHTML = '';
  divFunction.append(
    createElement('a', LanguageTable.static['basic'][language]),
    createElement('a', 'API', {
      'href': `${LocalURL}${URLLanguage}`,
    }),
    createElement('a', '|'),
    createElement('a', LanguageTable.static['temple'][language], {
      'href': `${LocalURL}temple.html${URLLanguage}`,
    }),
    createElement('a', '|'),
    createElement('a', LanguageTable.static['rankings'][language], {
      'href': `${LocalURL}rankings.html${URLLanguage}`,
    }),
    createElement('a', '|'),
    createElement('a', LanguageTable.static['arena'][language], {
      'href': `${LocalURL}arena.html${URLLanguage}`,
    }),
    createElement('a', '|'),
    createElement('a', LanguageTable.static['legend'][language], {
      'href': `${LocalURL}legend.html${URLLanguage}`,
    }),
    createElement('a', '|'),
    createElement('a', LanguageTable.static['localgvg'][language], {
      'href': `${LocalURL}localgvg.html${URLLanguage}`,
    }),
    createElement('a', '|'),
    createElement('a', LanguageTable.static['globalgvg'][language], {
      'href': `${LocalURL}globalgvg.html${URLLanguage}`,
    }),
    createElement('a', '|'),
    createElement('a', LanguageTable.static['battle_log'][language], {
      'href': `${LocalURL}battle_log.html${URLLanguage}`,
    }),
    createElement('br'),
    createElement('a', LanguageTable.static['weekly'][language], {}),
    createElement('a', LanguageTable.static['weekly_chara'][language], {
      'href': `${LocalURL}weekly_chara.html${URLLanguage}`,
    }),
    createElement('a', '|'),
    createElement('a', LanguageTable.static['weekly_boss'][language], {
      'href': `${LocalURL}weekly_boss.html${URLLanguage}`,
    }),
    createElement('a', '|'),
    createElement('a', LanguageTable.static['weekly_arena'][language], {
      'href': `${LocalURL}weekly_arena.html${URLLanguage}`,
    }),
    createElement('a', '|'),
    createElement('a', LanguageTable.static['weekly_legend'][language], {
      'href': `${LocalURL}weekly_legend.html${URLLanguage}`,
    })
  );
  //获取语言模块
  const divLocal = navDefault.childNodes[3];
  const nodeSwitch = [divLocal.querySelector('#switch-light'), divLocal.querySelector('#switch-dark')];
  divLocal.innerHTML = '';
  divLocal.append(
    nodeSwitch[0],
    createElement('a', '|'),
    nodeSwitch[1],
    createElement('br'),
    createElement('a', '🇬🇧', {
      href: `https://mentemori.icu/${URLFunction}?lang=eng`,
    }),
    createElement('a', '|'),
    createElement('a', '🇯🇵', {
      href: `https://mentemori.icu/${URLFunction}?lang=jpn`,
    }),
    createElement('a', '|'),
    createElement('a', '🇨🇳', {
      href: `https://mentemori.icu/${URLFunction}?lang=cht`,
    }) /*,
      createElement('a', '|'),
      createElement('a', '🇹🇼', {
        href: `https://mentemori.icu/${URLFunction}?lang=cht`,
      })*/
  );
  //初始化扩展导航栏
  const navExtend = navDefault.insertAdjacentElement('afterend', createElement('nav'));
  navDefault.insertAdjacentElement('afterend', createElement('hr'));
  //初始化功能模块
  const divExtend = navExtend.appendChild(createElement('div'));
  divExtend.append(
    createElement('a', LanguageTable.static['extend'][language]),
    //二进制文件转换功能
    createElement('a', LanguageTable.static['dataconvert'][language], {
      'href': `${LocalURL}?function=fileConverter${URLLanguage}`,
    }),
    createElement('a', '|'),
    //战斗布局功能
    createElement('a', LanguageTable.static['battlehelper'][language], {
      'href': `${LocalURL}?function=gvgMapper${URLLanguage}`,
    })
  );
  //初始化账号管理模块
  const divAccount = navExtend.appendChild(createElement('div', '', 'accountmanager'));
  divAccount.append(
    createElement('a', LanguageTable.static['account'][language]), //
    createElement('a', LanguageTable.static['noaccount'][language])
  );
}
//初始化选择栏
async function initSelect() {
  //空选项
  const NullOption = () => {
    let option = new Option('-'.repeat(100), -1);
    option.classList.add('default');
    return option;
  };
  openDB();
  ErrorCode = await getErrorCode();
  AppVersion = await getAppVersion();
  //选择栏样式
  document.querySelector('style').appendChild(
    createElement(
      'text',
      `
            #selectpanel {
              width: 640px;
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
              width: 520px;
            }
            #selectpanel button {
              width: 20%;
            }
            #selectpanel option {
              display: none;
            }
            #selectpanel option.default {
              display: inline;
            }`
    )
  );
  //获取世界分组
  const WorldGroup = await getWorldGroup();
  const RegionList = WorldGroup.RegionList;
  const GroupList = WorldGroup.GroupList;
  const ClassList = {
    '0': {
      'Name': LanguageTable.static['Local'][language],
      'Class': 'static',
    },
    '1': {
      'Name': LanguageTable.static['Elite'][language],
      'Class': 'dynamic',
    },
    '2': {
      'Name': LanguageTable.static['Expert'][language],
      'Class': 'dynamic',
    },
    '3': {
      'Name': LanguageTable.static['Master'][language],
      'Class': 'dynamic',
    },
  };
  const WorldList = WorldGroup.WorldList;
  const BlockList = {
    '0': {
      'Name': `${LanguageTable.static['Block'][language]} A`,
    },
    '1': {
      'Name': `${LanguageTable.static['Block'][language]} B`,
    },
    '2': {
      'Name': `${LanguageTable.static['Block'][language]} C`,
    },
    '3': {
      'Name': `${LanguageTable.static['Block'][language]} D`,
    },
  };
  //初始化选择区
  const divSelect = document.body.appendChild(createElement('div', '', 'selectpanel'));
  //区域选择
  const pRegion = divSelect.appendChild(createElement('p', `<a>${LanguageTable.static['Region'][language]}</a><a>:</a>`));
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
  const pGroup = divSelect.appendChild(createElement('p', `<a>${LanguageTable.static['Group'][language]}</a><a>:</a>`));
  const selectGroup = pGroup.appendChild(createElement('select', '', 'listGroup'));
  selectGroup.options.add(NullOption());
  for (let GroupId in GroupList) {
    const Group = GroupList[GroupId];
    if (Group.WorldList.length > 0) {
      const text = Group.WorldList.map((value) => {
        return WorldList[value].SName;
      });
      const option = new Option(`${Group.Name}(${text})`, GroupId);
      option.classList.add('R' + Group.Region);
      selectGroup.options.add(option);
    }
  }
  //等级选择
  const pClass = divSelect.appendChild(createElement('p', `<a>${LanguageTable.static['Class'][language]}</a><a>:</a>`));
  const selectClass = pClass.appendChild(createElement('select', '', 'listClass'));
  selectClass.options.add(NullOption());
  for (let ClassId in ClassList) {
    const Class = ClassList[ClassId];
    const option = new Option(Class.Name, ClassId);
    option.classList.add(Class.Class);
    selectClass.options.add(option);
  }
  //世界/块选择
  const pWorld = divSelect.appendChild(createElement('p', `<a>${LanguageTable.static['World'][language]}</a><a>:</a>`));
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
    document.querySelector('#styleGroup')?.remove();
    selectGroup.value = '-1';
    selectClass.value = '-1';
    selectWorld.value = '-1';
    document.head.appendChild(
      createElement(
        'style',
        `
            #listGroup > option.R${selectRegion.value} {
              display: inline;
            }`,
        'styleGroup'
      )
    );
    drawMap();
    fillGuilds();
  };
  selectGroup.onchange = () => {
    document.querySelector('#styleClass')?.remove();
    selectClass.value = '-1';
    selectWorld.value = '-1';
    document.head.appendChild(
      createElement(
        'style',
        `
            #listClass > .static
            ${selectGroup.value == 'N' + selectRegion.value ? '' : ',#listClass > .dynamic'} {
              display: inline;
            }`,
        'styleClass'
      )
    );
    drawMap();
    fillGuilds();
  };
  selectClass.onchange = () => {
    document.querySelector('#styleWorld')?.remove();
    selectWorld.value = '-1';
    document.head.appendChild(
      createElement(
        'style',
        `
            #listWorld > ${selectClass.value > 0 ? '.global' : '.G' + selectGroup.value} {
              display: inline;
            }`,
        'styleWorld'
      )
    );
    drawMap(selectClass.value);
    fillGuilds();
  };
  selectWorld.onchange = () => {
    setStorage('RegionId', selectRegion.value);
    setStorage('GroupId', selectGroup.value);
    setStorage('ClassId', selectClass.value);
    setStorage('WorldId', selectWorld.value);
    drawMap(selectClass.value);
    fillGuilds();
  };
}
/*主功能*/
//文件转换
function fileConverter() {
  let divData = document.body.appendChild(
    createElement('div', '', {
      style: 'width: 100%;display: flex;flex-direction: column;flex-wrap: nowrap;',
    })
  );
  let uploadButton = divData.appendChild(
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
        divData.appendChild(link);
        divData.appendChild(createElement('br'));
      };
      reader.onerror = function () {
        console.log(reader.error);
      };
    }
  };
  divData.append(createElement('br'));
}
//战斗布局
async function gvgMapper() {
  await initSelect();
  const RegionId = getStorage('RegionId');
  const GroupId = getStorage('GroupId');
  const ClassId = getStorage('ClassId');
  const WorldId = getStorage('WorldId');
  document.querySelector('style').appendChild(
    createElement(
      'text',
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
              }`
    )
  );
  const divSelect = document.querySelector('#selectpanel');
  //初始化读写功能组
  const pRequest = divSelect.appendChild(createElement('p'));
  //读取按钮
  const buttonGetLocal = pRequest.appendChild(createElement('button', `从上一次恢复`));
  //保存按钮
  const buttonSetLocal = pRequest.appendChild(createElement('button', `保存设置`));
  //初始化监听功能组
  const pConnect = divSelect.appendChild(createElement('p'));
  //开始监听按钮
  const buttonConnectServer = pConnect.appendChild(
    createElement('button', `从服务器获取`, {
      name: 'Connect',
    })
  );
  //关闭监听按钮
  const buttonDisconnectServer = pConnect.appendChild(
    createElement('button', `暂停同步`, {
      name: 'Disconnect',
      disabled: 'true',
    })
  );
  //初始化世界选择
  if (WorldId >= 0) {
    divSelect.querySelector('#listRegion').value = RegionId;
    divSelect.querySelector('#listGroup').value = GroupId;
    divSelect.querySelector('#listClass').value = ClassId;
    divSelect.querySelector('#listWorld').value = WorldId;
    document.head.append(
      createElement(
        'style',
        `
            #listGroup > option.R${RegionId} {
              display: inline;
            }`,
        'styleGroup'
      ),
      createElement(
        'style',
        `
            #listClass > .static
            ${GroupId == 'N' + RegionId ? '' : ',#listClass > .dynamic'} {
              display: inline;
            }`,
        'styleClass'
      ),
      createElement(
        'style',
        `
            #listWorld > ${ClassId > 0 ? '.global' : '.G' + GroupId} {
              display: inline;
            }`,
        'styleWorld'
      )
    );
  }
  //初始化地图
  if (ClassId >= 0) {
    drawMap(ClassId);
  }
  /* 功能设定 */
  //读取数据
  buttonGetLocal.onclick = async () => {
    if (WorldId < 0) {
      alert('未选择世界');
      return;
    }
    const Match = await getData('Match', `${GroupId}_${ClassId}_${WorldId}`);
    if (Match) {
      await fillMap(Match.Castles, Match.Guilds);
    } else {
      alert('没有该对战的城池信息，请从服务器获取');
    }
  };
  //保存数据
  buttonSetLocal.onclick = async () => {
    if (WorldId < 0) {
      alert('未选择世界');
      return;
    }
    let Match = {
      'Guid': `${GroupId}_${ClassId}_${WorldId}`,
      'Castles': [],
      'Guilds': [],
    };
    const GuildDataList = document.querySelectorAll('tr[id]');
    for (let i = 0; i < GuildDataList.length; i++) {
      const GuildNode = GuildDataList[i];
      const GuildId = GuildNode.id;
      const Guid = `${RegionId}_${GuildId}`;
      Match.Guilds.push(GuildId);
      let Guild = await getData('Guild', Guid);
      Guild.Color = document.querySelector(`#style${GuildId}`).sheet.rules[0].style.backgroundColor.replace(/rgba\((.*?), 0.5\)/, '$1');
      updateData('Guild', Guild);
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
    updateData('Match', Match);
  };
  //开始监听
  buttonConnectServer.onclick = () => {
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
    setStorage('ortegaaccesstoken', '');
  };
}
/*子功能*/
//登录账号
async function loginAccount() {
  console.log('检查状态');
  let _getUserData = await getUserData();
  if (!_getUserData.UserSyncData) {
    console.log('未登录，开始登陆');
    const RegionId = getStorage('RegionId');
    const WorldId = RegionId * 1000 + 1;
    ortegaaccesstoken = '';
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
    userURL = _getServerHost.ApiHost;
    MagicOnionHost = _getServerHost.MagicOnionHost;
    MagicOnionPort = _getServerHost.MagicOnionPort;
    const _loginPlayer = await loginPlayer(WorldData.PlayerId, WorldData.Password);
    AuthTokenOfMagicOnion = _loginPlayer.AuthTokenOfMagicOnion;
    _getUserData = await getUserData();
    setStorage('Accounts', JSON.stringify(Accounts));
  }
  console.log('已登陆');
  document.querySelector('#accountmanager>a:nth-child(2)').innerHTML = _getUserData?.UserSyncData.UserStatusDtoInfo.Name;
}
//战斗布局-绘制地图
function drawMap(ClassId) {
  document.querySelector('#gvgMapStyle')?.remove();
  document.querySelector('gvg-viewer')?.remove();
  document.querySelector('gvg-list')?.remove();
  document.querySelector('gvg-list')?.remove();
  document.body.append(createElement('gvg-list', '<h2>我方列表</h2><div></div>', 'friendList'));
  document.body.append(createElement('gvg-list', '<h2>敌方列表</h2><div></div>', 'enermyList'));
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
    let style = document.head.appendChild(
      createElement(
        'style',
        `
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
              background: rgb(255,127,127);
            }
            gvg-viewer {
              display: block;
              position: relative;
              width: 1280px;
              height: 1280px;
              font-family: sans-serif;
              background-size: cover;
              background-image: url(assets/${Class}gvg.png);
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
              'left': -82px;
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
              background-image: url(${assetURL}icon_gvg_party_offense_counter.png);
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
            }`,
        'gvgMapStyle'
      )
    );
    let viewer = document.body.appendChild(createElement('gvg-viewer'));
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
      const NodeCastleName = castleNode.appendChild(createElement('gvg-castle-name', LanguageTable[Class][language][CastleId - 1]));
      NodeCastleName.onclick = (e) => {
        let exist = e.target.parentNode.querySelector('gvg-castle-hint');
        let image = e.target.parentNode.querySelector('.gvg-castle-symbol');
        let hint = prompt('输入添加的提示,然后输入"|"(不带引号),再输入标识代码(A1:攻击1;A2:攻击2;D1:防御1;D2:防御2;F1:禁止;F2:旗帜)\n若标识代码为空则移除图标,其他代码则为你确认知道的图片名称,包含相对路径,路经确认:\nhttps://github.com/rainsillwood/MementoMoriGuildHelper/tree/main/assets', exist ? exist.innerHTML : '');
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
          image.src = `${assetURL}${imageName[hint[1]] ?? hint[1]}.png`;
        }
      };
      let kos = castleNode.appendChild(createElement('gvg-ko-count-container'));
      kos.classList.add('hidden');
      kos.append(createElement('gvg-ko-count', 0), createElement('gvg-ko-count-label'));
      style.append(
        createElement(
          'text',
          `
            gvg-viewer[${Class}] gvg-castle[castle-id='${CastleId}'] {
              left: ${castle.left};
              top: ${castle.top};
            }`
        )
      );
    }
  }
}
//战斗布局-填充地图
async function fillMap(CastleList, GuildList) {
  await updateServerData(GuildList);
  await fillGuilds(GuildList);
  for (let i = 0; i < CastleList.length; i++) {
    await changeCastle(CastleList[i]);
  }
}
//战斗布局-重置表格
async function fillGuilds(GuildList) {
  document.querySelector('#guilds1')?.remove();
  document.querySelector('#guilds2')?.remove();
  table2 = document.querySelector('#selectpanel').insertAdjacentElement('afterend', createElement('table', `<thead><tr><th>图</th><th>公会名称</th><th>友</th><th>中</th><th>敌</th></tr></thead>`, 'guilds2'));
  table1 = document.querySelector('#selectpanel').insertAdjacentElement('afterend', createElement('table', `<thead><tr><th>图</th><th>公会名称</th><th>友</th><th>中</th><th>敌</th></tr></thead>`, 'guilds1'));
  const RegionId = getStorage('RegionId');
  if (GuildList) {
    const tbody1 = table1.appendChild(createElement('tbody'));
    const tbody2 = table2.appendChild(createElement('tbody'));
    let count = 0;
    for (let i in GuildList) {
      const GuildId = GuildList[i];
      const Guid = `${RegionId}_${GuildId}`;
      const Guild = await getData('Guild', Guid);
      changeColor(GuildId, Guild.Color ?? '0,0,0');
      const divGuild = createElement('tr', '', GuildId);
      const aColor = divGuild.appendChild(createElement('td', '■', { class: ['GuildColor'] }));
      aColor.onclick = (e) => {
        const Color = prompt('请输入设定颜色，形式为R,G,B');
        changeColor(e.target.parentNode.id, Color);
      };
      divGuild.append(
        createElement('td', Guild.Name), //
        createElement('td', `<input type="radio" name="${GuildId}" value="friendly">`),
        createElement('td', `<input type="radio" name="${GuildId}" value="neutral" checked="true">`),
        createElement('td', `<input type="radio" name="${GuildId}" value="enermy">`)
      );
      if (count < GuildList.length / 2) {
        tbody1.append(divGuild);
      } else {
        tbody2.append(divGuild);
      }
      count++;
    }
  }
}
//战斗布局-更新数据
async function updateServerData(GuildList) {
  let PlayerDataList = [];
  for (let i = 0; i < GuildList.length; i++) {
    const Guid = `${getStorage('RegionId')}_${GuildList[i]}`;
    let Guild = (await getData('Guild', Guid)) ?? {
      'Guid': Guid,
      'GuildId': GuildList[i],
      'Color': '0, 0, 0',
      'Relation': 'neutral',
      'LastUpdate': new Date(),
    };
    if (Guild.LastUpdate < Today(4, 0, 0)) {
      const _searchGuildId = await searchGuildId(GuildList[i]);
      const GuildData = _searchGuildId?.SearchResult.GuildInfo;
      Guild.Name = GuildData.GuildOverView.GuildName;
      Guild.GuildLevel = GuildData.GuildLevel;
      Guild.LastUpdate = new Date();
      updateData('Guild', Guild);
      PlayerDataList = PlayerDataList.concat(_searchGuildId?.SearchResult.PlayerInfoList);
    }
  }
  for (let i = 0; i < PlayerDataList.length; i++) {
    const PlayerData = PlayerDataList[i];
    const Guid = `${getStorage('RegionId')}_${PlayerData.PlayerId}`;
    let Player = (await getData('Player', Guid)) ?? {
      'Guid': Guid,
      'PlayerId': PlayerData.PlayerId,
    };
    Player.Name = PlayerData.PlayerName;
    Player.Guild = PlayerData.GuildId;
    Player.Level = PlayerData.PlayerLevel;
    Player.BattlePower = PlayerData.BattlePower;
    updateData('Player', Player);
  }
  const Day = new Date() - 7 * 24 * 3600 * 1000;
  const DeckData = await getArray('Deck', { '<': Day }, 'LastUpdate');
  const CharacterData = await getArray('Character', { '<': Day }, 'LastUpdate');
  const BattleData = await getArray('Battle', { '<': Day }, 'LastUpdate');
  while (DeckData.length > 0 && CharacterData.length > 0 && BattleData.length > 0) {
    removeData('Deck', DeckData.shift()?.Guid);
    removeData('Character', CharacterData.shift()?.Guid);
    removeData('Battle', BattleData.shift()?.Guid);
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
  const DefenseGuild = await getData('Guild', `${getStorage('RegionId')}_${CastleData.GuildId}`);
  const OffenseGuild = await getData('Guild', `${getStorage('RegionId')}_${CastleData.AttackerGuildId}`);
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
            gvg-castle[defense='${GuildId}'] gvg-castle-icon {
              background-color: rgba(${Color}, 0.5);
            }

            gvg-castle[offense='${GuildId}'] gvg-attacker {
              background-color: rgba(${Color}, 0.625);
            }

            tr[id='${GuildId}'] td:nth-child(1) {
              color: rgba(${Color}, 1);
            }`,
      `style${GuildId}`
    )
  );
}
//战斗布局-修改公会
function changeGuild(target) {
  const trList = document.querySelectorAll('tbody > tr');
  const dialogGuild = document.body.appendChild(createElement('dialog', `<a>请选择公会：</a>`));
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
      castle: target.parentNode.parentNode.getAttribute('castle-id'),
      target: target.tagName,
    })
  );
  selectGuild.options.add(
    createElement('option', '', {
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
            const Time = Today(Math.floor(BattleData[1] / 100), BattleData[1] % 100, 0) - (Now > BattleTime ? 0 : 24 * 60 * 60 * 1000);
            let Battle = await getData('Battle', BattleData[0]);
            if (!Battle) {
              updateData('Battle', {
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
                  updateData('Character', Character);
                }
                updateData('Deck', Deck);
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
/*API函数*/
//获取option
function buildOption() {
  let option = {
    method: 'POST',
    headers: {
      'ortegaaccesstoken': ortegaaccesstoken, //获取
      'ortegaappversion': AppVersion, //跟随版本
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
//获取AppVersion
async function getAppVersion() {
  let option = buildOption();
  let result = await getDataUri(option);
  if (result?.ErrorCode) {
    const varjs = await sendGMRequest('https://mememori-game.com/apps/vars.js', {});
    if (!varjs) {
      console.log('获取var.js失败');
      alert('获取var.js失败，请重试');
      return;
    } else {
      const apkVersion = getVariable(varjs, 'apkVersion').split('.');
      let max = 20;
      for (let i = 0; i < max + 1; i++) {
        //版本号递增
        option.headers.ortegaappversion = `${apkVersion[0]}.${apkVersion[1]}.${apkVersion[2] * 1 + i}`;
        //最后一次手动请求版本号
        if (i == max) {
          option.headers.ortegaappversion = prompt('版本号不在正常范围内，请手动输入版本号', option.headers.ortegaappversion);
        }
        //请求getDataUri
        result = await getDataUri(option);
        if (result.AppAssetVersionInfo) {
          break;
        }
      }
    }
  }
  setStorage('AppVersion', result.AppAssetVersionInfo.Version);
  return result.AppAssetVersionInfo.Version;
}
//获取错误码
async function getErrorCode() {
  const buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/TextResourceZhTwMB`, { type: 'arraybuffer', msgpack: true });
  const TextResourceZhTwMB = await msgpack.decode(new Uint8Array(buffer));
  if (!TextResourceZhTwMB) return;
  let result = {};
  for (let i = 0; i < TextResourceZhTwMB.length; i++) {
    const TextResourceZhTw = TextResourceZhTwMB[i];
    if (TextResourceZhTw.StringKey.includes('ErrorMessage')) {
      result[TextResourceZhTw.StringKey.replace(/\[ErrorMessage(.*?)\]/, '$1') * 1] = TextResourceZhTw.Text;
    }
  }
  return result;
}
//获取世界组
async function getWorldGroup() {
  const buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/WorldGroupMB`, { type: 'arraybuffer' });
  const WorldGroupMB = await msgpack.decode(new Uint8Array(buffer));
  const RegionList = {
    jp: LanguageTable.static.Japan[language], //
    kr: LanguageTable.static.Korea[language],
    ap: LanguageTable.static.Asia[language],
    us: LanguageTable.static.America[language],
    eu: LanguageTable.static.Europe[language],
    gl: LanguageTable.static.Global[language],
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
          'Name': `${LanguageTable.static.Group[language]} NA`,
          'SName': `GNA`,
          'Region': RegionId,
          'WorldList': [],
        };
      }
      const GroupId = WorldGroupData.Id;
      let Group = WorldGroup.GroupList[GroupId];
      if (!Group) {
        Group = {
          'Name': `${LanguageTable.static.Group[language]} ${GroupId}`,
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
          'Name': `${LanguageTable.static.World[language]} ${WorldId % 1000}`,
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
//获取AuthToken
async function getAuthToken() {
  let jsonAuthTokenData = await sendGMRequest('https://list.moonheart.dev/d/public/mmtm/AddressableLocalAssets/ScriptableObjects/AuthToken/AuthTokenData.json?v=' + Date.now(), { type: 'json' });
  if (!jsonAuthTokenData) {
    console.log('获取AuthToken失败');
    alert('获取AuthToken失败，请重试');
  }
  return jsonAuthTokenData._authToken;
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
  let option = defaultOpting ?? buildOption();
  //随机ortegauuid
  option.headers.ortegauuid = crypto.randomUUID().replaceAll('-', '');
  //不设ortegaaccesstoken
  option.headers.ortegaaccesstoken = '';
  //生成包体
  const data = {
    CountryCode: 'TW',
    UserId: 0,
  };
  option.body = data;
  //发包
  let result = await sendRequest(authURL + 'getDataUri', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/createUser
async function createUser(AuthToken, AdverisementId, CountryCode, ortegauuid) {
  let option = buildOption();
  const data = {
    AdverisementId: AdverisementId,
    AppVersion: AppVersion,
    CountryCode: CountryCode,
    DeviceToken: '',
    DisplayLanguage: 4,
    ModelName: ModelName,
    OSVersion: OSVersion,
    SteamTicket: '',
    AuthToken: AuthToken,
  };
  option.body = data;
  option.headers.ortegauuid = ortegauuid;
  let result = await sendRequest(authURL + 'createUser', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/setUserSetting
async function setUserSetting() {
  let option = buildOption();
  const data = {
    UserSettingsType: 2,
    Value: 2,
    DeviceToken: '',
  };
  option.body = data;
  let result = await sendRequest(authURL + 'setUserSetting', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/createWorldPlayer
async function createWorldPlayer(WorldId) {
  let option = buildOption();
  const data = {
    WorldId: WorldId,
    Comment: `W${WorldId}的偵察姬器人`,
    Name: `御坂${WorldId}號`,
    DeepLinkId: 0,
    SteamTicket: null,
  };
  option.body = data;
  let result = await sendRequest(authURL + 'createWorldPlayer', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/getComebackUserData
async function getComebackUserData(FromUserId, UserId, Password, AuthToken) {
  let option = buildOption();
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
  let result = await sendRequest(authURL + 'getComebackUserData', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/comebackUser
async function comebackUser(FromUserId, OneTimeToken, UserId) {
  let option = buildOption();
  const data = {
    FromUserId: new Uint64BE(FromUserId.toString(), 10),
    OneTimeToken: OneTimeToken,
    ToUserId: new Uint64BE(UserId.toString(), 10),
    SteamTicket: null,
  };
  option.body = data;
  let result = await sendRequest(authURL + 'comebackUser', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/login
async function login(ClientKey, AdverisementId, UserId) {
  let option = buildOption();
  const data = {
    ClientKey: ClientKey,
    DeviceToken: '',
    AppVersion: AppVersion,
    OSVersion: OSVersion,
    ModelName: ModelName,
    AdverisementId: AdverisementId,
    UserId: new Uint64BE(UserId.toString(), 10),
    IsPushNotificationAllowed: false,
  };
  option.body = data;
  let result = await sendRequest(authURL + 'login', option);
  return result;
}
//https://prd1-auth.mememori-boi.com/api/auth/getServerHost
async function getServerHost(WorldId) {
  let option = buildOption();
  const data = {
    WorldId: WorldId,
  };
  option.body = data;
  let result = await sendRequest(authURL + 'getServerHost', option);
  return result;
}
//user/loginPlayer
async function loginPlayer(PlayerId, Password) {
  let option = buildOption();
  const data = {
    Password: Password,
    PlayerId: new Uint64BE(PlayerId.toString(), 10),
    ErrorLogInfoList: null,
    SteamTicket: null,
  };
  option.body = data;
  let result = await sendRequest(userURL + 'user/loginPlayer', option);
  return result;
}
//user/getUserData
async function getUserData() {
  let option = buildOption();
  const data = {};
  option.body = data;
  let result = await sendRequest(userURL + 'user/getUserData', option);
  return result;
}
//localGvg/getLocalGvgSceneTransitionData
async function getLocalGvgSceneTransitionData() {
  let option = buildOption();
  const data = {};
  option.body = data;
  let result = await sendRequest(userURL + 'localGvg/getLocalGvgSceneTransitionData', option);
  return result;
}
//localGvg/getLocalGvgCastleInfoDialogData
async function getLocalGvgCastleInfoDialogData(CastleId) {
  let option = buildOption();
  const data = {
    CastleId: CastleId,
  };
  option.body = data;
  let result = await sendRequest(userURL + 'localGvg/getLocalGvgCastleInfoDialogData', option);
  return result;
}
//guild/searchGuildId
async function searchGuildId(GuildId) {
  let option = buildOption();
  const data = {
    GuildId: new Uint64BE(GuildId.toString(), 10),
  };
  option.body = data;
  let result = await sendRequest(userURL + 'guild/searchGuildId', option);
  return result;
}
//character/getDetailsInfo
async function getDetailsInfo(PlayerId, arrayCharacterId) {
  let option = buildOption();
  const data = {
    DeckType: 1,
    TargetUserCharacterGuids: arrayCharacterId,
    TargetPlayerId: new Uint64BE(PlayerId.toString(), 10),
  };
  option.body = data;
  let result = await sendRequest(userURL + 'character/getDetailsInfo', option);
  return result;
}
//globalGvg/getGlobalGvgCastleInfoDialogData
async function getGlobalGvgCastleInfoDialogData(CastleId, MatchingNumber) {
  let option = buildOption();
  const data = {
    'CastleId': CastleId,
    'MatchingNumber': MatchingNumber,
  };
  option.body = data;
  let result = await sendRequest(userURL + 'globalGvg/getGlobalGvgCastleInfoDialogData', option);
  return result;
}
//globalGvg/getGlobalGvgGroupAll
async function getGlobalGvgGroupAll() {
  let option = buildOption();
  const data = {};
  option.body = data;
  let result = await sendRequest(userURL + 'globalGvg/getGlobalGvgGroupAll', option);
  return result;
}
//globalGvg/getGlobalGvgSceneTransitionData
async function getGlobalGvgSceneTransitionData(GlobalGvgGroupId, MatchingNumber) {
  let option = buildOption();
  const data = {
    'GlobalGvgGroupId': GlobalGvgGroupId,
    'MatchingNumber': MatchingNumber,
  };
  option.body = data;
  let result = await sendRequest(userURL + 'globalGvg/getGlobalGvgSceneTransitionData', option);
  return result;
}
/*工具函数*/
//请求函数
async function sendRequest(url, option) {
  let request = await sendGMRequest(url, option);
  if (request.ErrorCode && !url.includes(authURL) && !url.includes('getUserData') && !url.includes('loginPlayer')) {
    await loginAccount();
    request = await sendGMRequest(url, option);
  }
  return request;
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
        if (!headers.ortegaaccesstoken) {
          headers.ortegaaccesstoken = ortegaaccesstoken;
        }
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
              ortegaaccesstoken = token;
            }
            setStorage('AssetVersion', getHeader(response.responseHeaders, 'ortegamasterversion'));
            setStorage('MasterVersion', getHeader(response.responseHeaders, 'ortegamasterversion'));
            setStorage('utcnowtimestamp', getHeader(response.responseHeaders, 'ortegautcnowtimestamp'));
            data = await msgpack.decode(new Uint8Array(response.response));
            if (data.ErrorCode) {
              console.log(`${response.finalUrl.split('/').pop()}:${ErrorCode[data.ErrorCode]}`);
              document.querySelector('#accountmanager>a:nth-child(2)').innerHTML = '未登录';
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
        headers.ortegaaccesstoken = ortegaaccesstoken;
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
        ortegaaccesstoken = request.getResponseHeader('orteganextaccesstoken');
        setStorage('AssetVersion', request.getResponseHeader('assetversion'));
        setStorage('MasterVersion', request.getResponseHeader('masterversion'));
        setStorage('utcnowtimestamp', request.getResponseHeader('utcnowtimestamp'));
        let data;
        if (type == 'application/octet-stream') {
          data = await msgpack.decode(new Uint8Array(response));
          if (data.ErrorCode) {
            console.log(`${request.responseURL.split('/').pop()}:${ErrorCode[data.ErrorCode]}`);
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
    node.innerHTML = text;
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
async function openDB() {
  //创建打开请求,若存在则打开,否则创建
  let request = indexedDB.open('database', 1);
  //请求失败
  request.onerror = function (error) {
    console.error('数据库打开失败:' + error.target.errorCode);
  };
  //请求成功
  request.onsuccess = function (success) {
    console.log('数据库打开成功');
    database = request.result;
  };
  //更新数据库版本
  request.onupgradeneeded = function (upgrade) {
    console.log('数据库构建中');
    database = request.result;
    //表guilds是否存在,否则创建
    if (!database.objectStoreNames.contains('Match')) {
      let objectStore = database.createObjectStore('Match', {
        keyPath: 'Guid',
      });
    }
    //表guilds是否存在,否则创建
    if (!database.objectStoreNames.contains('Guild')) {
      let objectStore = database.createObjectStore('Guild', {
        keyPath: 'Guid',
      });
      objectStore.createIndex('GuildId', 'GuildId', {
        unique: false,
      });
      objectStore.createIndex('Name', 'Name', {
        unique: false,
      });
    }
    //表players是否存在,否则创建
    if (!database.objectStoreNames.contains('Player')) {
      let objectStore = database.createObjectStore('Player', {
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
    //表decks是否存在,否则创建
    if (!database.objectStoreNames.contains('Deck')) {
      let objectStore = database.createObjectStore('Deck', {
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
    //表characters是否存在,否则创建
    if (!database.objectStoreNames.contains('Character')) {
      let objectStore = database.createObjectStore('Character', {
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
    //表battles是否存在,否则创建
    if (!database.objectStoreNames.contains('Battle')) {
      let objectStore = database.createObjectStore('Battle', {
        keyPath: 'Guid',
      });
      objectStore.createIndex('LastUpdate', 'LastUpdate', {
        unique: false,
      });
    }
    console.log('数据库构建成功');
  };
}
//插入数据
async function insertData(table, data) {
  let transaction = database.transaction([table], 'readwrite');
  let objectStore = transaction.objectStore(table);
  let request = objectStore.add(data);
  request.onsuccess = function (success) {
    console.log('插入成功' + data.Guid);
  };
  request.onerror = function (error) {
    console.error('插入失败:' + data.Guid);
  };
}
//更新数据
async function updateData(table, data) {
  let transaction = database.transaction([table], 'readwrite');
  let objectStore = transaction.objectStore(table);
  let request = objectStore.put(data);
  request.onsuccess = function (sucess) {
    //console.log(`${table} 更新成功${data.Guid}`);
  };
  request.onerror = function (error) {
    console.error(`${table} 更新失败${data.Guid}`);
  };
}
//删除数据
async function removeData(table, key) {
  if (!key) return;
  let transaction = database.transaction([table], 'readwrite');
  let objectStore = transaction.objectStore(table);
  let request = objectStore.delete(key);
  request.onerror = function (error) {};
  request.onsuccess = function (success) {};
}
//获取数据
async function getData(table, index, key) {
  return new Promise(function (resolve, reject) {
    let transaction = database.transaction([table]);
    transaction.oncomplete = function (complete) {};
    transaction.onerror = function (error) {
      console.log('获取失败:' + index);
    };
    let objectStore = transaction.objectStore(table);
    let request;
    if (!key) {
      request = objectStore.get(index);
    } else {
      request = objectStore.index(key).get(index);
    }
    request.onerror = function (error) {
      console.log('请求失败:' + index);
      resolve(undefined);
    };
    request.onsuccess = function (success) {
      if (request.result) {
        resolve(request.result);
      } else {
        console.log('获取失败:' + index);
        resolve(undefined);
      }
    };
  });
}
//获取数据组,留空获取全部，{'>':,'>=':,'<':,'<=':}获取指定范围，字符串获取固定
async function getArray(table, index, key, isFuzzy) {
  return new Promise(function (resolve, reject) {
    let oArray = [];
    let transaction = database.transaction([table]);
    transaction.oncomplete = function (complete) {};
    transaction.onerror = function (error) {
      console.error('获取失败:' + index);
    };
    let objectStore = transaction.objectStore(table);
    let request;
    if ((index['>'] || index['>=']) && !index['<'] && !index['<=']) {
      request = objectStore.index(key).openCursor(IDBKeyRange.lowerBound(index['>='] ?? index['>'], !index['>=']));
    } else if (!index['>'] && !index['>='] && (index['<'] || index['<='])) {
      request = objectStore.index(key).openCursor(IDBKeyRange.upperBound(index['<='] ?? index['<'], !index['<=']));
    } else if ((index['>'] || index['>=']) && (index['<'] || index['<='])) {
      request = objectStore.index(key).openCursor(IDBKeyRange.bound(index['>='] ?? index['>'], index['<='] ?? index['<'], !index['>='], !index['<=']));
    } else if (!index) {
      request = objectStore.index(key).openCursor(IDBKeyRange.only(index));
    } else {
      request = objectStore.openCursor();
    }
    request.onsuccess = function (success) {
      let cursor = this.result;
      if (cursor) {
        oArray.push(cursor.value.value);
        cursor.continue();
      } else {
        resolve(oArray);
      }
    };
    request.onerror = function (error) {};
  });
}
