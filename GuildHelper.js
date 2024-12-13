// ==UserScript==
// @name         MementoMori Guild Helper
// @namespace    https://suzunemaiki.moe/
// @version      0.1
// @description  公会战小助手
// @author       SuzuneMaiki
// @match        http*://mentemori.icu/*
// @match        http*://*.mememori-boi.com/*
// @connect      mememori-boi.com
// @connect      cdn-mememori.akamaized.net
// @connect      mememori-game.com
// @connect      moonheart.dev
// @require      https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mentemori.icu
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(async function () {
  'use strict';
  //S: Server. 1 = Japan, 2 = Korea, 3 = Asia, 4 = North America, 5 = Europe, 6 = Global
  //WWW: World number. For example, W10 is 010
  const WorldId = 3019;
  const ErrorCode = getErrorCode();
  const reginList = { 'jp': 0, 'kr': 1, 'ap': 2, 'us': 3, 'eu': 4, 'gl': 5 };
  const CountryCode = 'TW';
  const ModelName = 'Xiaomi 2203121C';
  const OSVersion = 'Android OS 13 / API-33 (TKQ1.220829.002/V14.0.12.0.TLACNXM)';
  const authURL = 'https://prd1-auth.mememori-boi.com/api/auth/';
  let userURL = 'https://prd1-ap2-api.mememori-boi.com/api/';
  let MagicOnionHost = 'prd1-ap2-onion.mememori-boi.com';
  let MagicOnionPort = 443;
  let Account = getStorage('Account');
  let WorldList = [];
  let latestOption = await buildOption();
  let Masterversion = 0;
  const WorldGroup = await getWorldGroup();
  const AppVersion = getStorage('AppVersion');
  initPage();
  //const account = getStorage('Account') ? getStorage('Account') : await createUser();
  switch (document.URL) {
    case 'https://mentemori.icu/?function=powerAttacher': {
      powerAttacher();
      break;
    }
    case 'https://mentemori.icu/?function=fileConverter': {
      fileConverter();
      break;
    }
    case 'https://mentemori.icu/?function=gvgMapper': {
      gvgMapper();
      break;
    }
    case 'https://mentemori.icu/localgvg.html': {
      gvgHint('local');
      break;
    }
    case 'https://mentemori.icu/globalgvg.html': {
      gvgHint('global');
      break;
    }
  }
  //主功能
  //初始化页面
  function initPage() {
    console.log('脚本运行中');
    //添加导航栏
    let nav = createElement('nav');
    let div = createElement('div');
    //二进制文件转换功能
    let converter = createElement('a', '数据转换');
    converter.href = '/?function=fileConverter';
    //战斗布局功能
    let mapper = createElement('a', '战斗布局');
    mapper.href = '/?function=gvgMapper';
    //战力侦查功能
    let power = createElement('a', '战力侦查');
    power.href = '/?function=powerAttacher';
    //账号管理
    let accountmanager = createElement('div');
    let accountlogger = createElement('a');
    if (Account) {
      accountlogger.innerHTML = `${Account.Name} 未登录`;
    } else {
      accountlogger.innerHTML = `无账号`;
    }
    //accountlogger.onclick = loginAccount;
    let accountcleaner = createElement('a', '清除账号');
    accountcleaner.onclick = () => {
      let confirm = prompt('真的要清除账号吗，请输入：确认清除');
      if (confirm == '确认清除') {
        setStorage('Account');
        setStorage('ortegaaccesstoken');
      }
    };
    /*/增加中文
    let localnav = document.body.childNodes[2];
    let zh = createElement('a', 'ZH');
    zh.href = '?lang=zh';
    localnav.childNodes[3].childNodes[3].appendChild(createElement('text', ' | '));
    localnav.childNodes[3].childNodes[3].appendChild(zh);*/
    //写入元素
    accountmanager.appendChild(createElement('a', '登录状态:'));
    accountmanager.appendChild(accountlogger);
    div.appendChild(converter);
    div.appendChild(createElement('text', ' | '));
    div.appendChild(mapper);
    div.appendChild(createElement('text', ' | '));
    div.appendChild(power);
    nav.appendChild(div);
    nav.appendChild(accountmanager);
    document.body.insertBefore(nav, document.body.childNodes[1]);
    document.body.insertBefore(createElement('hr'), document.body.childNodes[1]);
    //服务器选择
    let region = createElement('select');
    region.id = 'region';
    let group = createElement('select');
    group.id = 'group';
    let grade = createElement('select');
    grade.id = 'grade';
    let server = createElement('select');
    server.id = 'server';
  }
  //战力侦查
  async function powerAttacher() {
    //清除元素
    while (document.body.childNodes.length > 6) {
      document.body.lastChild.remove();
    }
    //设置敌我颜色
    let colorFriend = ['lightgreen', 'skyblue', 'aliceblue', 'thistle'];
    let colorEnermy = ['lightcoral', 'lightpink', 'lightsalmon', 'wheat'];
    //添加style
    let style = createElement('style');
    style.appendChild(createElement('text', '.innerdiv{border:solid}'));
    style.appendChild(createElement('text', '.nodePlayer{border:groove gray;width:55%}'));
    style.appendChild(createElement('text', '.nodePlayer>a{width:30%;height:100%;display:inline-block;text-align:center;}'));
    style.appendChild(createElement('text', '[relation="none"]{display:none}'));
    for (let i = 0; i < 16; i++) {
      style.appendChild(createElement('text', '[relation="enermy' + i + '"]{background-color:' + colorEnermy[i] + ';align-self:flex-end}'));
      style.appendChild(createElement('text', '[relation="friend' + i + '"]{background-color:' + colorFriend[i] + ';align-self:flex-start}'));
    }
    document.head.appendChild(style);
    /*/初始化数据区域
    let divData = createElement('div');
    divData.setAttribute('style', 'width:100%;display:flex;flex-direction:row;flex-wrap: nowrap');
    //初始化公会列表
    let nodeGuildList = createElement('div');
    nodeGuildList.setAttribute('style', 'width:350px;');
    nodeGuildList.classList.add('innerdiv');
    let requestGuild = await XMLRequest('https://api.mentemori.icu/' + WorldId + '/guild_ranking/latest');
    let guildRanking = JSON.parse(requestGuild.body);
    let guildList = guildRanking.data.rankings.stock;
    nodeGuildList.appendChild(createElement('a', '我方|中立|敌方|序号·公会名称|显示中立'));
    let checkbox = createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'showMiddle';
    checkbox.onchange = function () {
      changeNode();
    };
    nodeGuildList.appendChild(checkbox);
    nodeGuildList.appendChild(createElement('hr'));
    for (let i = 0; i < guildList.length; i++) {
      let nodeGuild = createElement('div');
      nodeGuild.appendChild(createElement('text', '|'));
      for (let j in { friend: 1, middle: 1, enermy: 1 }) {
        let radio = createElement('input');
        radio.type = 'radio';
        radio.name = guildList[i].id;
        radio.value = j;
        if (j == 'middle') {
          radio.checked = true;
        }
        radio.onchange = function () {
          changeNode();
        };
        nodeGuild.appendChild(radio);
        nodeGuild.appendChild(createElement('text', '||'));
      }
      nodeGuild.appendChild(createElement('text', [i] + '·' + guildList[i].name));
      nodeGuildList.appendChild(nodeGuild);
    }
    //获取高战列表
    let nodePlayerList = createElement('div');
    nodePlayerList.setAttribute('style', 'width:calc(100% - 350px);display:flex;flex-direction:column;fflex-wrap:wrap;align-items:center');
    nodePlayerList.classList.add('innerdiv');
    let requestPlayer = await XMLRequest('https://api.mentemori.icu/' + WorldId + '/player_ranking/latest');
    let playerRanking = JSON.parse(requestPlayer.body);
    let playerList = playerRanking.data.player_info;
    for (let i in playerList) {
      let nodePlayer = createElement('div');
      nodePlayer.classList.add('nodePlayer');
      nodePlayer.setAttribute('guild', playerList[i].guild_id);
      nodePlayer.setAttribute('relation', 'none');
      nodePlayer.id = playerList[i].id;
      let nodeName = createElement('a', playerList[i].name);
      let nodePower = createElement('a', playerList[i].bp);
      let nodeGuild = createElement('a', playerList[i].guild_name);
      nodePlayer.appendChild(nodeName);
      nodePlayer.appendChild(nodePower);
      nodePlayer.appendChild(nodeGuild);
      nodePlayerList.appendChild(nodePlayer);
    }
    divData.appendChild(nodeGuildList);
    divData.appendChild(nodePlayerList);
    document.body.appendChild(divData);*/
  }
  //文件转换
  function fileConverter() {
    //清除元素
    while (document.body.childNodes.length > 6) {
      document.body.lastChild.remove();
    }
    let divData = createElement('div');
    divData.setAttribute('style', 'width:100%;display:flex;flex-direction:column;flex-wrap: nowrap');
    let uploadButton = createElement('input');
    uploadButton.type = 'file';
    uploadButton.multiple = 'multiple';
    uploadButton.onchange = function () {
      for (let i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        let filename = file.name;
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function () {
          let buffer = reader.result;
          let view = new Uint8Array(buffer);
          let data = msgpack.decode(view);
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
    divData.appendChild(uploadButton);
    divData.appendChild(createElement('br'));
    document.body.appendChild(divData);
    /*
    let dataLogin = await login();
    let dataCastal = await getLocalGvgCastleInfoDialogData(1);
    let guild = await searchGuildId(0xb722d4da43);
    console.log(dataCastal);
    console.log(guild);
    */
  }
  //战斗布局
  function gvgMapper() {
    //清除元素
    while (document.body.childNodes.length > 6) {
      document.body.lastChild.remove();
    }
    const castalList = {
      'local': {
        '1': {
          'left': '640px',
          'top': '560px',
          'type': 'temple',
          'name': 'Brussell',
        },
        '2': {
          'left': '858px',
          'top': '514px',
          'type': 'castle',
          'name': 'Wissekerke',
        },
        '3': {
          'left': '741px',
          'top': '699px',
          'type': 'castle',
          'name': 'Modave',
        },
        '4': {
          'left': '422px',
          'top': '695px',
          'type': 'castle',
          'name': 'Chimay',
        },
        '5': {
          'left': '470px',
          'top': '433px',
          'type': 'castle',
          'name': 'Gravensteen',
        },
        '6': {
          'left': '708px',
          'top': '360px',
          'type': 'church',
          'name': 'Cambre',
        },
        '7': {
          'left': '1000px',
          'top': '280px',
          'type': 'church',
          'name': 'Quentin',
        },
        '8': {
          'left': '1145px',
          'top': '391px',
          'type': 'church',
          'name': 'Lambert',
        },
        '9': {
          'left': '1089px',
          'top': '600px',
          'type': 'church',
          'name': 'Saint-Jacques',
        },
        '10': {
          'left': '945px',
          'top': '690px',
          'type': 'church',
          'name': 'Michael',
        },
        '11': {
          'left': '815px',
          'top': '171px',
          'type': 'church',
          'name': 'Namur',
        },
        '12': {
          'left': '828px',
          'top': '872px',
          'type': 'church',
          'name': 'Charleroi',
        },
        '13': {
          'left': '761px',
          'top': '1092px',
          'type': 'church',
          'name': 'Alzette',
        },
        '14': {
          'left': '646px',
          'top': '969px',
          'type': 'church',
          'name': 'Hainaut',
        },
        '15': {
          'left': '560px',
          'top': '807px',
          'type': 'church',
          'name': 'Wavre',
        },
        '16': {
          'left': '435px',
          'top': '1008px',
          'type': 'church',
          'name': 'Mons',
        },
        '17': {
          'left': '261px',
          'top': '734px',
          'type': 'church',
          'name': 'Christophe',
        },
        '18': {
          'left': '186px',
          'top': '549px',
          'type': 'church',
          'name': 'Kortrijk',
        },
        '19': {
          'left': '258px',
          'top': '367px',
          'type': 'church',
          'name': 'Ypres',
        },
        '20': {
          'left': '358px',
          'top': '219px',
          'type': 'church',
          'name': 'Salvador',
        },
        '21': {
          'left': '563px',
          'top': '177px',
          'type': 'church',
          'name': 'Bavo',
        },
      },
      'global': {
        '1': {
          'left': '640px',
          'top': '560px',
          'type': 'temple',
          'name': 'Ein',
        },
        '2': {
          'left': '803px',
          'top': '503px',
          'type': 'castle',
          'name': 'Yesod',
        },
        '3': {
          'left': '747px',
          'top': '718px',
          'type': 'castle',
          'name': 'Malkuth',
        },
        '4': {
          'left': '418px',
          'top': '725px',
          'type': 'castle',
          'name': 'Keter',
        },
        '5': {
          'left': '484px',
          'top': '439px',
          'type': 'castle',
          'name': 'Tiferet',
        },
        '6': {
          'left': '691px',
          'top': '265px',
          'type': 'church',
          'name': 'Cushel',
        },
        '7': {
          'left': '986px',
          'top': '301px',
          'type': 'church',
          'name': 'Citri',
        },
        '8': {
          'left': '1144px',
          'top': '402px',
          'type': 'church',
          'name': 'Toppaz',
        },
        '9': {
          'left': '1107px',
          'top': '567px',
          'type': 'church',
          'name': 'Meral',
        },
        '10': {
          'left': '958px',
          'top': '627px',
          'type': 'church',
          'name': 'Perido',
        },
        '11': {
          'left': '891px',
          'top': '177px',
          'type': 'church',
          'name': 'Pharia',
        },
        '12': {
          'left': '906px',
          'top': '884px',
          'type': 'church',
          'name': 'Lapis',
        },
        '13': {
          'left': '743px',
          'top': '1131px',
          'type': 'church',
          'name': 'Larimal',
        },
        '14': {
          'left': '520px',
          'top': '1007px',
          'type': 'church',
          'name': 'Marin',
        },
        '15': {
          'left': '560px',
          'top': '851px',
          'type': 'church',
          'name': 'Amest',
        },
        '16': {
          'left': '309px',
          'top': '985px',
          'type': 'church',
          'name': 'Laven',
        },
        '17': {
          'left': '250px',
          'top': '728px',
          'type': 'church',
          'name': 'Zircon',
        },
        '18': {
          'left': '112px',
          'top': '602px',
          'type': 'church',
          'name': 'Onyx',
        },
        '19': {
          'left': '260px',
          'top': '420px',
          'type': 'church',
          'name': 'Floryte',
        },
        '20': {
          'left': '198px',
          'top': '259px',
          'type': 'church',
          'name': 'Ganette',
        },
        '21': {
          'left': '495px',
          'top': '158px',
          'type': 'church',
          'name': 'Rula',
        },
      },
    };
    let style = createElement('style');
    let grade = 'local';
    let image = grade == 'local' ? 'base_ribbon_01' : 'base_metal';
    style.appendChild(createElement('text', `gvg-status{width:164px;height:50px;position:relative;display:block}`));
    style.appendChild(createElement('text', `gvg-status-icon-defense,gvg-status-icon-offense{display:block;width:32px;height:33px;text-align:center;line-height:37px;background-size:cover;color:#fff;font-size:12px}`));
    style.appendChild(createElement('text', `gvg-status-icon-defense{background-image:url(assets/icon_gvg_party_defense.png)}`));
    style.appendChild(createElement('text', `gvg-status-icon-offense{background-image:url(assets/icon_gvg_party_offense.png)}`));
    style.appendChild(createElement('text', `gvg-status[active]>gvg-status-bar-defense,gvg-status[active]>gvg-status-bar-offense{display:block;width:90px;height:20px;padding:0 10px;background-size:cover;color:#fff;font-size:9px}`));
    style.appendChild(createElement('text', `gvg-status-bar-offense{background-image:url(assets/base_s_09_red.png);text-align:left;line-height:16px}`));
    style.appendChild(createElement('text', `gvg-status-bar-defense{background-image:url(assets/base_s_09_blue.png);text-align:right;line-height:24px}`));
    style.appendChild(createElement('text', `gvg-status[neutral]>gvg-status-icon-defense{position:absolute;left:0;right:0;top:0;margin:auto}`));
    style.appendChild(createElement('text', `gvg-status[neutral]>gvg-status-icon-offense{display:none}`));
    style.appendChild(createElement('text', `gvg-status[neutral]>gvg-status-bar-defense{display:block;width:131px;height:12px;text-align:center;line-height:12px;background-image:url(assets/base_s_08_blue.png);background-size:cover;color:#fff;font-size:9px;position:absolute;left:0;right:0;top:35px;margin:auto}`));
    style.appendChild(createElement('text', `gvg-status[neutral]>gvg-status-bar-offense{display:none}`));
    style.appendChild(createElement('text', `gvg-status[active]>gvg-status-bar-offense {position:absolute;left:25px;bottom:10px }`));
    style.appendChild(createElement('text', `gvg-status[active]>gvg-status-bar-defense {position:absolute;right:25px;bottom:0 }`));
    style.appendChild(createElement('text', `gvg-status[active]>gvg-status-icon-offense {position:absolute;left:0;bottom:0 }`));
    style.appendChild(createElement('text', `gvg-status[active]>gvg-status-icon-defense {position:absolute;right:0;bottom:0 }`));
    style.appendChild(createElement('text', `gvg-castle>gvg-status{position:absolute;left:-82px;right:-82px;bottom:43px}`));
    style.appendChild(createElement('text', `gvg-castle-icon{display:block;background-size:cover}`));
    style.appendChild(createElement('text', `gvg-castle-name{display:block;background-size:cover;width:140px;height:26px;font-size:9px;text-align:center}`));
    style.appendChild(createElement('text', `gvg-castle>gvg-castle-icon{position:absolute}`));
    style.appendChild(createElement('text', `gvg-castle>gvg-castle-name{position:absolute}`));
    style.appendChild(createElement('text', `gvg-castle{display:block;position:absolute;user-select:none}`));
    style.appendChild(createElement('text', `gvg-viewer{display:block;position:relative;width:1280px;height:1280px;font-family:sans-serif;background-size:cover}`));
    style.appendChild(createElement('text', `gvg-ko-count-container{position:absolute;width:76px;left:-38px;top:-19px;display:block;color:#eee;text-shadow:red 0 0 30px,red 0 0 5px}`));
    style.appendChild(createElement('text', `gvg-ko-count{display:block;font-size:26px;text-align:center;width:100%}`));
    style.appendChild(createElement('text', `gvg-ko-count-label:after{content:'KOs';font-size:14px;position:absolute;display:block;text-align:center;width:100%;height:14px;top:26px;left:0}`));
    style.appendChild(createElement('text', `gvg-viewer[${grade}] gvg-castle[church]>gvg-castle-icon{position:absolute;left:-28px;right:-28px;bottom:-25px;width:56px;height:50px;background-image:url(assets/Castle_0_0.png)}`));
    style.appendChild(createElement('text', `gvg-viewer[${grade}] gvg-castle[castle]>gvg-castle-icon{position:absolute;left:-31px;right:-31px;bottom:-33px;width:62px;height:67px;background-image:url(assets/Castle_0_1.png)}`));
    style.appendChild(createElement('text', `gvg-viewer[${grade}] gvg-castle[temple]>gvg-castle-icon{position:absolute;left:-39px;right:-39px;bottom:-40px;width:78px;height:80px;background-image:url(assets/Castle_0_2.png)}`));
    style.appendChild(createElement('text', `gvg-viewer[${grade}] gvg-castle-name{background-image:url(assets/${image}.png);width:140px;height:26px;color:${grade == 'local' ? '#473d3b' : 'white'};line-height:33px}`));
    style.appendChild(createElement('text', `gvg-viewer[${grade}] gvg-castle>gvg-castle-name{left:-70px;right:-70px}`));
    style.appendChild(createElement('text', `gvg-viewer[${grade}] gvg-castle[church]>gvg-castle-name{bottom:-45px}`));
    style.appendChild(createElement('text', `gvg-viewer[${grade}] gvg-castle[castle]>gvg-castle-name{bottom:-50px}`));
    style.appendChild(createElement('text', `gvg-viewer[${grade}] gvg-castle[temple]>gvg-castle-name{bottom:-58px}`));
    style.appendChild(createElement('text', `gvg-viewer[${grade}]{background-image:url(assets/${grade}gvg.png)}`));
    let viewer = createElement('gvg-viewer');
    viewer.setAttribute(grade, '');
    for (let i in castalList[grade]) {
      let castal = castalList[grade][i];
      let castleNode = createElement('gvg-castle');
      castleNode.setAttribute('castle-id', i);
      castleNode.setAttribute(castal.type, 'true');
      let status = createElement('gvg-status');
      status.setAttribute('neutral', '');
      status.appendChild(createElement('gvg-status-bar-offense'));
      status.appendChild(createElement('gvg-status-bar-defense'));
      status.appendChild(createElement('gvg-status-icon-offense', 0));
      status.appendChild(createElement('gvg-status-icon-defense', 0));
      castleNode.appendChild(status);
      castleNode.appendChild(createElement('gvg-castle-icon'));
      castleNode.appendChild(createElement('gvg-castle-name', castal.name));
      let kos = createElement('gvg-ko-count-container');
      kos.classList.add('hidden');
      kos.appendChild(createElement('gvg-ko-count', 0));
      kos.appendChild(createElement('gvg-ko-count-label'));
      castleNode.appendChild(kos);
      viewer.appendChild(castleNode);
      style.appendChild(createElement('text', `gvg-viewer[${grade}] gvg-castle[castle-id="${i}"]{left:${castal.left};top:${castal.top}}`));
    }
    document.head.appendChild(style);
    document.body.appendChild(viewer);
    gvgHint(grade);
  }
  //登录账号
  async function loginAccount() {
    setStorage('ortegaaccesstoken', '');
    ErrorCode = await getErrorCode();
    const ortegauuid = crypto.randomUUID().replaceAll('-', '');
    const AdverisementId = crypto.randomUUID();
    latestOption = await buildOption(ortegauuid);
    const AuthToken = await getAuthToken();
    const _getDataUri = await getDataUri();
    const _createUser = await createUser(AuthToken, AdverisementId, ortegauuid);
    const _setUserSetting = await setUserSetting();
    const _createWorldPlayer = await createWorldPlayer();
    /*
    userURL = _createWorldPlayer.ApiHost;
    MagicOnionHost = _createWorldPlayer.MagicOnionHost;
    MagicOnionPort = _createWorldPlayer.MagicOnionPort;
    const _loginPlayer = loginPlayer(_createWorldPlayer.PlayerId, _createWorldPlayer.Password);
    */
  }
  //Guild Battle/Grand War增加提示功能
  function gvgHint(grade) {
    let style = createElement('style');
    style.appendChild(createElement('text', 'gvg-castle-hint{left:-70px;right:-70px;background:rgba(192, 128, 128, 0.5);width:140px;height:20px;color: blue;position: absolute;display: block;font-size: 10px;text-align: center;}'));
    style.appendChild(createElement('text', `gvg-viewer[${grade}] gvg-castle[temple] >gvg-castle-hint{bottom:${-80}px}`));
    style.appendChild(createElement('text', `gvg-viewer[${grade}] gvg-castle[castle] >gvg-castle-hint{bottom:${-75}px}`));
    style.appendChild(createElement('text', `gvg-viewer[${grade}] gvg-castle[church] >gvg-castle-hint{bottom:${-67}px}`));
    document.head.appendChild(style);
    let listCastal = document.getElementsByTagName('gvg-castle');
    for (let i = 0; i < listCastal.length; i++) {
      let castal = listCastal[i];
      //增加备注
      castal.getElementsByTagName('gvg-castle-name')[0].onclick = addHint;
      castal.getElementsByTagName('gvg-status-bar-defense')[0].onclick = changeDefense;
      castal.getElementsByTagName('gvg-status-bar-offense')[0].onclick = changeOffense;
      castal.getElementsByTagName('gvg-status-icon-defense')[0].onclick = showOffense;
      castal.getElementsByTagName('gvg-status-icon-offense')[0].onclick = hideOffense;
      castal.getElementsByTagName('gvg-castle-icon')[0].onclick = changeColor;
    }
  }
  //子功能
  //战斗布局-增加提示
  function addHint() {
    let exist = this.parentNode.getElementsByTagName('gvg-castle-hint')[0];
    let hint = prompt('输入添加的提示', exist ? exist.innerHTML : '');
    if (hint == '' || hint == undefined) {
      exist.remove();
      return;
    }
    if (!exist) {
      exist = createElement('gvg-castle-hint', hint);
      this.parentNode.appendChild(exist);
    } else {
      exist.innerHTML = hint;
    }
  }
  //战斗布局-改变防守方
  function changeDefense() {
    let hint = prompt('输入防御公会', this.innerHTML);
    if (hint == '' || hint == undefined) {
      return;
    } else {
      this.innerHTML = hint;
    }
  }
  //战斗布局-改变进攻方
  function changeOffense() {
    let hint = prompt('输入进攻公会', this.innerHTML);
    if (hint == '' || hint == undefined) {
      return;
    } else {
      this.innerHTML = hint;
    }
  }
  //战斗布局-显示进攻方
  function showOffense() {
    this.parentNode.removeAttribute('neutral');
    this.parentNode.setAttribute('active', '');
  }
  //战斗布局-隐藏进攻方
  function hideOffense() {
    this.parentNode.removeAttribute('active');
    this.parentNode.setAttribute('neutral', '');
  }
  //战斗布局-改变势力颜色
  function changeColor() {
    let color = prompt('输入颜色:R(0-255),G(0-255),B(0-255),A(0-1)', this.innerHTML).split(',');
    if (color) {
      this.setAttribute('style', `background-color: rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
    }
  }
  //登录账号-生成默认最新配置
  async function buildOption(ortegauuid) {
    let option = {
      method: 'POST',
      headers: {
        'ortegaaccesstoken': '', //从cookie获取
        //'ortegaappversion': apkVersion, //跟随版本
        'ortegadevicetype': 2, //固定为2
        //'ortegauuid': ortegauuid, //随机uuid，登录后绑定账号
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
    const apkVersion = getStorage('AppVersion') ? getStorage('AppVersion') : await getapkVersion();
    let version = apkVersion.split('.');
    for (let i = 0; i < 11; i++) {
      //版本号递增
      version[2] = version[2] * 1 + i;
      option.headers.ortegaappversion = version.join('.');
      //最后一次手动请求版本号
      if (i == 10) {
        option.headers.ortegaappversion = prompt('版本号不在正常范围内，请手动输入版本号', option.headers.ortegaappversion);
      }
      option.headers.ortegauuid = crypto.randomUUID().replaceAll('-', '');
      //请求getDataUri
      let result = await getDataUri(option);
      //版本正确
      if (!result.ErrorCode) {
        //存储版本号
        setStorage('AppVersion', option.headers.ortegaappversion);
        option.headers.ortegauuid = ortegauuid;
        //删除配置中的包体
        delete option.body;
        //生成世界列表
        const WorldInfos = result.WorldInfos;
        for (let i = 0; i < WorldInfos.length; i++) {
          const WorldInfo = WorldInfos[i];
          const Region = WorldInfo.GameServerId < 20 ? 0 : WorldInfo.GameServerId / 10 - 1;
          WorldList.push({
            'Id': WorldInfo.Id,
            'Region': Region,
            'GameServerId': WorldInfo.GameServerId,
          });
        }
        //返回配置
        return JSON.stringify(option);
      }
    }
  }
  //登录账号-获取登录信息

  //API函数
  //获取错误码
  async function getErrorCode() {
    const buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('masterversion')}/TextResourceZhTwMB`, { type: 'arraybuffer', msgpack: true });
    const TextResourceZhTwMB = msgpack.decode(new Uint8Array(buffer));
    if (!TextResourceZhTwMB) return;
    let result = {};
    for (let i = 0; i < TextResourceZhTwMB.length; i++) {
      const TextResource = TextResourceZhTwMB[i];
      if (TextResource.StringKey.includes('ErrorMessage')) {
        result[TextResource.StringKey.replace(/\[ErrorMessage(.*?)\]/, '$1') * 1] = TextResource.Text;
      }
    }
    return result;
  }
  //获取错误码
  async function getWorldGroup() {
    const buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('masterversion')}/WorldGroupMB`, { type: 'arraybuffer', msgpack: true });
    const WorldGroupMB = msgpack.decode(new Uint8Array(buffer));
    if (!WorldGroupMB) return;
    let result = {};
    for (let i = 0; i < WorldGroupMB.length; i++) {
      const WorldGroup = WorldGroupMB[i];
      if (result.Memo) {
        result.Memo.push({
          'Id': WorldGroup.Id,
          WorldIdList: WorldGroup.WorldIdList,
        });
      } else {
        result.Memo = [];
      }
    }
    return result;
  }
  //获取apkversion
  async function getapkVersion() {
    let varjs = await sendGMRequest('https://mememori-game.com/apps/vars.js', {});
    if (!varjs) {
      console.log('获取var.js失败');
      alert('获取var.js失败，请重试');
    }
    return getVariable(varjs, 'apkVersion');
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
  //https://prd1-auth.mememori-boi.com/api/auth/getDataUri
  async function getDataUri(defaultOpting) {
    //生成配置
    let option = defaultOpting ? defaultOpting : JSON.parse(latestOption);
    //生成包体
    const data = {
      CountryCode: CountryCode,
      UserId: 0,
    };
    option.body = data;
    //发包
    let result = await sendRequest(authURL + 'getDataUri', option);
    return result;
  }
  //https://prd1-auth.mememori-boi.com/api/auth/createUser
  async function createUser(AuthToken, AdverisementId, ortegauuid) {
    let option = JSON.parse(latestOption);
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
    let option = JSON.parse(latestOption);
    const data = {
      'UserSettingsType': 2,
      'Value': 2,
      'DeviceToken': '',
    };
    option.body = data;
    let result = await sendRequest(authURL + 'setUserSetting', option);
    return result;
  }
  //https://prd1-auth.mememori-boi.com/api/auth/createWorldPlayer
  async function createWorldPlayer() {
    let option = JSON.parse(latestOption);
    const data = {
      'WorldId': WorldId,
      'Comment': '侦查员一号',
      'Name': '侦查员一号',
      'DeepLinkId': 0,
      'SteamTicket': null,
    };
    option.body = data;
    let result = await sendRequest(authURL + 'createWorldPlayer', option);
    return result;
  }
  //https://prd1-auth.mememori-boi.com/api/auth/getComebackUserData
  async function getComebackUserData(FromUserId, UserId, Password, AuthToken) {
    let option = JSON.parse(latestOption);
    const data = {
      'AppleIdToken': null,
      'FromUserId': FromUserId,
      'GoogleAuthorizationCode': null,
      'Password': Password,
      'SnsType': 1,
      'TwitterAccessToken': null,
      'TwitterAccessTokenSecret': null,
      'UserId': UserId,
      'AuthToken': AuthToken,
    };
    option.body = data;
    let result = await sendRequest(authURL + 'getComebackUserData', option);
    return result;
  }
  //https://prd1-auth.mememori-boi.com/api/auth/comebackUser
  async function comebackUser(FromUserId, OneTimeToken, UserId) {
    let option = JSON.parse(latestOption);
    const data = {
      FromUserId: FromUserId,
      OneTimeToken: OneTimeToken,
      ToUserId: UserId,
      SteamTicket: null,
    };
    option.body = data;
    let result = await sendRequest(authURL + 'comebackUser', option);
    return result;
  }
  //https://prd1-auth.mememori-boi.com/api/auth/login
  async function login(ClientKey, AdverisementId, UserId) {
    let option = JSON.parse(latestOption);
    const data = {
      ClientKey: ClientKey,
      DeviceToken: '',
      AppVersion: option.headers.ortegaappversion,
      OSVersion: OSVersion,
      ModelName: ModelName,
      AdverisementId: AdverisementId,
      UserId: UserId,
      IsPushNotificationAllowed: false,
    };
    option.body = data;
    let result = await sendRequest(authURL + 'login', option);
    return result;
  }
  //https://prd1-auth.mememori-boi.com/api/auth/getServerHost
  async function getServerHost(WorldId) {
    let option = JSON.parse(latestOption);
    const data = {
      WorldId: WorldId,
    };
    option.body = data;
    let result = await sendRequest(authURL + 'getServerHost', option);
    return result;
  }
  //https://prd1-ap2-api.mememori-boi.com/api/user/loginPlayer
  async function loginPlayer(PlayerId, Password) {
    let option = JSON.parse(latestOption);
    const data = {
      Password: Password,
      PlayerId: PlayerId,
      ErrorLogInfoList: null,
      SteamTicket: null,
    };
    option.body = data;
    let result = await sendRequest(userURL + 'user/loginPlayer', option);
    return result;
  }
  //https://prd1-ap2-api.mememori-boi.com/api/user/getUserData
  async function getUserData() {
    let option = JSON.parse(latestOption);
    const data = {};
    option.body = data;
    let result = await sendRequest(userURL + 'user/getUserData', option);
    return result;
  }
  //工具函数
  async function sendRequest(url, option = {}) {
    let request = await sendGMRequest(url, option);
    return request;
  }
  //跨域请求函数
  async function sendGMRequest(url, option = {}) {
    return new Promise((resolve) => {
      let method = option.method ? option.method : 'GET';
      let headers = option.headers ? option.headers : {};
      let data;
      if (option.body) {
        if (option.msgpack) {
          //每次重新生成uuid
          if (!headers.ortegauuid) {
            headers.ortegauuid = crypto.randomUUID().replaceAll('-', '');
          }
          headers.ortegaaccesstoken = getStorage('ortegaaccesstoken');
          data = msgpack.encode(option.body);
        } else {
          data = option.body;
        }
      }
      let responseType = option.type ? option.type : null;
      GM_xmlhttpRequest({
        method: method,
        url: url,
        headers: headers,
        data: data,
        responseType: responseType,
        onload: (response) => {
          let token = getHeader(response.responseHeaders, 'orteganextaccesstoken');
          let type = getHeader(response.responseHeaders, 'content-type');
          if (token) {
            setStorage('ortegaaccesstoken', token);
          }
          let data;
          if (type == 'application/octet-stream') {
            data = msgpack.decode(new Uint8Array(response.response));
            if (data.ErrorCode) {
              console.log(`${response.finalUrl.split('/').pop()}:${ErrorCode[data.ErrorCode]}`);
            } else {
              console.log(`${response.finalUrl.split('/').pop()}:获取成功`);
            }
          } else {
            data = response.response;
          }
          resolve(data);
        },
        onerror: function () {
          console.log('Request failed');
        },
      });
      //*/
    });
  }
  async function sendXMLRequest(url, option = {}) {
    return new Promise((resolve) => {
      let method = option.method ? option.method : 'GET';
      let headers = option.headers ? option.headers : {};
      let data;
      if (option.body) {
        if (option.msgpack) {
          //每次重新生成uuid
          if (!headers.ortegauuid) {
            headers.ortegauuid = crypto.randomUUID().replaceAll('-', '');
          }
          headers.ortegaaccesstoken = getStorage('ortegaaccesstoken');
          data = msgpack.encode(option.body);
        } else {
          data = option.body;
        }
      }
      let responseType = option.type ? option.type : null;
      let request = new XMLHttpRequest();
      request.open(method, url);
      request.responseType = responseType;
      for (let i in headers) {
        request.setRequestHeader(i, headers[i]);
      }
      request.send(data);
      request.onload = function () {
        if (request.status != 200) {
          // 分析响应的 HTTP 状态
          console.log(`Error ${request.status}: ${request.statusText}`); // 例如 404: Not Found
        } else {
          // 显示结果
          const response = request.response;
          console.log(`Done, got ${response.length} bytes`); // response 是服务器响应
          const type = request.getResponseHeader('content-type');
          setStorage('ortegaaccesstoken', request.getResponseHeader('orteganextaccesstoken'));
          setStorage('assetversion', request.getResponseHeader('assetversion'));
          setStorage('masterversion', request.getResponseHeader('masterversion'));
          setStorage('utcnowtimestamp', request.getResponseHeader('utcnowtimestamp'));
          let data;
          if (type == 'application/octet-stream') {
            data = msgpack.decode(new Uint8Array(response));
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
  //改变颜色
  function changeNode() {
    let showMiddle = document.getElementById('showMiddle').checked;
    let radioList = document.querySelectorAll('[type="radio"]');
    let guildList = {
      enermy: [],
      friend: [],
      middle: [],
    };
    for (let i = 0; i < radioList.length; i++) {
      if (radioList[i].checked == true) {
        guildList[radioList[i].value].push(radioList[i].name);
      }
    }
    let playerList = document.getElementsByClassName('nodePlayer');
    for (let i = 0; i < playerList.length; i++) {
      let player = playerList[i];
      let playerGuild = player.getAttribute('guild');
      let indexFriendGuild = guildList.friend.indexOf(playerGuild);
      let indexEnermyGuild = guildList.enermy.indexOf(playerGuild);
      if (indexFriendGuild > -1) {
        player.setAttribute('relation', 'friend' + indexFriendGuild);
      } else if (indexEnermyGuild > -1) {
        player.setAttribute('relation', 'enermy' + indexEnermyGuild);
      } else {
        if (showMiddle) {
          player.setAttribute('relation', 'middle');
        } else {
          player.setAttribute('relation', 'none');
        }
      }
    }
  }
  //新建DOM
  function createElement(type, text = '') {
    let node;
    if (type == 'text') {
      node = document.createTextNode(text);
    } else {
      node = document.createElement(type);
      node.innerHTML = text;
    }
    return node;
  }
  //获取消息头
  function getHeader(headers, key) {
    let reg = new RegExp(`${key}: (?<token>.*?)\\r\\n`, 'i');
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
})();
