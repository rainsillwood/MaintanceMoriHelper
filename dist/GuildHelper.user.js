// ==UserScript==
// @name         MementoMori Guild Helper
// @namespace    https://suzunemaiki.moe/
// @updateURL    https://raw.githubusercontent.com/rainsillwood/MementoMoriGuildHelper/main/dist/GuildHelper.user.js
// @downloadURL  https://raw.githubusercontent.com/rainsillwood/MementoMoriGuildHelper/main/dist/GuildHelper.user.js
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
// ==/UserScript==

(async function () {
  'use strict';
  const ModelName = 'Xiaomi 2203121C';
  const OSVersion = 'Android OS 13 / API-33 (TKQ1.220829.002/V14.0.12.0.TLACNXM)';
  const assetURL = 'https://raw.githubusercontent.com/rainsillwood/MementoMoriGuildHelper/main/assets/';
  initPage();
  //const account = getStorage('Account') ? getStorage('Account') : await createUser();
  switch (document.URL) {
    case 'https://mentemori.icu/?function=fileConverter': {
      fileConverter();
      break;
    }
    case 'https://mentemori.icu/?function=gvgMapper': {
      gvgMapper();
      break;
    }
  }
  //初始化功能
  //初始化页面
  async function initPage() {
    console.log('脚本运行中');
    //获取原导航栏
    const navDefault = document.querySelector('nav');
    //获取语言模块
    const divLocal = navDefault.childNodes[3].childNodes[3];
    //插入中文模块
    divLocal.appendChild(createElement('text', ' | '));
    divLocal.appendChild(createElement('a', 'ZH', { href: '?lang=zh' }));
    //初始化导航栏
    const navExtend = createElement('nav');
    //初始化功能模块
    const divFunction = createElement('div');
    //二进制文件转换功能
    divFunction.appendChild(createElement('a', '数据转换', { href: '/?function=fileConverter' }));
    divFunction.appendChild(createElement('text', ' | '));
    //战斗布局功能
    divFunction.appendChild(createElement('a', '战斗布局', { href: '/?function=gvgMapper' }));
    //插入功能模块
    navExtend.appendChild(divFunction);
    //初始化账号管理模块
    const divAccount = createElement('div', '', 'accountmanager');
    divAccount.appendChild(createElement('a', '登录状态:'));
    //登录状态模块
    divAccount.appendChild(createElement('a', '无账号'));
    //登出模块
    const buttonLogout = createElement('button', '登出', 'logout');
    buttonLogout.classList.add('hidden');
    buttonLogout.onclick = logoutAccount;
    divAccount.appendChild(buttonLogout);
    //插入账号管理模块
    navExtend.appendChild(divAccount);
    //插入导航栏
    navDefault.insertAdjacentElement('afterend', navExtend);
    navDefault.insertAdjacentElement('afterend', createElement('hr'));
  }
  //初始化选择栏
  async function initSelect() {
    //空选项
    const NullOption = () => {
      let option = new Option('-'.repeat(100), -1);
      option.classList.add('default');
      return option;
    };
    //选择栏样式
    const Style = createElement(
      'style',
      `
            #selectpanel {
              width: 640px;
              display: inline-block;
              vertical-align: top;
            }
            #selectpanel a {
              display: inline-block;
            }
            #selectpanel a:nth-child(1) {
              width: 75px;
            }
            #selectpanel a:nth-child(2) {
              width: 25px;
            }
            #selectpanel select {
              width: 520px;
            }
            #selectpanel button {
              width: 33%;
            }
            #selectpanel option {
              display: none;
            }
            #selectpanel option.default {
              display: inline;
            }
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
            tr > :nth-child(1) {
              width: 25px;
            }
            tr > :nth-child(2) {
              text-align: left;
            }
            tr > :nth-child(3) {
              width: 25px;
            }
            tr > :nth-child(4) {
              width: 25px;
            }
            tr > :nth-child(5) {
              width: 25px;
            }`
    );
    document.head.appendChild(Style);
    //获取世界分组
    const WorldGroup = await getWorldGroup();
    //初始化选择区
    const divSelect = createElement('div', '', 'selectpanel');
    const pRegion = createElement('p', '<a>Region</a><a> : </a>');
    const selectRegion = createElement('select', '', 'listRegion');
    const pGroup = createElement('p', '<a>Group</a><a> : </a>');
    const selectGroup = createElement('select', '', 'listGroup');
    const pGrand = createElement('p', '<a>Grand</a><a> : </a>');
    const selectGrand = createElement('select', '', 'listGrand');
    const pWorld = createElement('p', '<a>World</a><a> : </a>');
    const selectWorld = createElement('select', '', 'listWorld');
    const pRequest = createElement('p');
    const buttonGetServer = createElement('button', `从服务器获取`);
    buttonGetServer.onclick = async () => {
      if (selectWorld.value < 0) {
        alert('未选择世界');
        return;
      }
      const GuildData = JSON.parse(getStorage('GuildData')) ?? {};
      const _getGuildWar = await getGuildWar(getStorage('GrandId'), getStorage('WorldId'), getStorage('GroupId'));
      let Matching = _getGuildWar?.data;
      if (Matching) {
        for (let i in Matching.guilds) {
          Matching.guilds[i] = {
            'Name': Matching.guilds[i],
            'Color': GuildData[i] ?? '0,0,0',
          };
        }
        fillMap(Matching.castles, Matching.guilds);
      } else {
        alert('无法获取战斗信息');
      }
    };
    const buttonGetLocal = createElement('button', `从上一次恢复`);
    buttonGetLocal.onclick = () => {
      if (selectWorld.value < 0) {
        alert('未选择世界');
        return;
      }
      const MatchingData = JSON.parse(getStorage('MatchingData')) ?? {};
      const GuildData = JSON.parse(getStorage('GuildData')) ?? {};
      let Matching = MatchingData[`${getStorage('GroupId')}-${getStorage('GrandId')}-${getStorage('WorldId')}`];
      if (Matching) {
        for (let i in Matching.guilds) {
          Matching.guilds[i] = {
            'Name': Matching.guilds[i],
            'Color': GuildData[i] ?? '0,0,0',
          };
        }
        fillMap(Matching.castles, Matching.guilds);
      } else {
        alert('没有该对战的城池信息');
      }
    };
    const buttonSetLocal = createElement('button', `保存设置`);
    buttonSetLocal.onclick = () => {
      if (selectWorld.value < 0) {
        alert('未选择世界');
        return;
      }
      let Matching = { 'castles': [], 'guilds': {} };
      const GuildList = document.querySelectorAll('tr[id]');
      let GuildData = JSON.parse(getStorage('GuildData')) ?? {};
      for (let i = 0; i < GuildList.length; i++) {
        const Guild = GuildList[i];
        const GuildId = Guild.id;
        GuildData[GuildId] = document.querySelector(`#style${GuildId}`).sheet.rules[0].style.backgroundColor.replace(/rgba\((.*?), 0.5\)/, '$1');
        Matching.guilds[GuildId] = Guild.childNodes[1].innerHTML;
      }
      setStorage('GuildData', JSON.stringify(GuildData));
      const CastalList = document.querySelectorAll('gvg-castle');
      let MatchingData = JSON.parse(getStorage('MatchingData')) ?? {};
      if (MatchingData) {
        for (let i = 0; i < CastalList.length; i++) {
          const Castal = CastalList[i];
          const CastalId = Castal.getAttribute('castle-id');
          Matching.castles.push({
            'CastleId': CastalId,
            'GuildId': Castal.getAttribute('defense'),
            'AttackerGuildId': Castal.getAttribute('offense'),
            'AttackPartyCount': Castal.querySelector('gvg-status-icon-offense').innerHTML,
            'DefensePartyCount': Castal.querySelector('gvg-status-icon-defense').innerHTML,
            'GvgCastleState': Castal.querySelector('gvg-status').hasAttribute('active') + Castal.querySelector('gvg-status').hasAttribute('counter'),
            'LastWinPartyKnockOutCount': Castal.querySelector('gvg-ko-count').innerHTML,
          });
        }
        MatchingData[`${getStorage('GroupId')}-${getStorage('GrandId')}-${getStorage('WorldId')}`] = Matching;
        setStorage('MatchingData', JSON.stringify(MatchingData));
      }
    };
    pRequest.appendChild(buttonGetServer);
    pRequest.appendChild(buttonGetLocal);
    pRequest.appendChild(buttonSetLocal);
    const RegionList = WorldGroup.RegionList;
    const GroupList = WorldGroup.GroupList;
    const GrandList = {
      '0': {
        'Name': 'Local',
        'Class': 'static',
      },
      '1': {
        'Name': 'Elite',
        'Class': 'dynamic',
      },
      '2': {
        'Name': 'Expert',
        'Class': 'dynamic',
      },
      '3': {
        'Name': 'Master',
        'Class': 'dynamic',
      },
    };
    const WorldList = WorldGroup.WorldList;
    const BlockList = {
      '0': {
        'Name': 'Block A',
      },
      '1': {
        'Name': 'Block B',
      },
      '2': {
        'Name': 'Block C',
      },
      '3': {
        'Name': 'Block D',
      },
    };
    selectRegion.options.add(NullOption());
    for (let i in RegionList) {
      const Region = RegionList[i];
      const option = new Option(Region.Name, i);
      if (Region.GroupList.length > 0) {
        option.classList.add('default');
        selectRegion.options.add(option);
      }
    }
    selectGroup.options.add(NullOption());
    for (let i in GroupList) {
      const Group = GroupList[i];
      if (Group.WorldList.length > 0) {
        const text = Group.WorldList.map((value) => {
          return `${WorldList[value].SName}`;
        });
        const option = new Option(`${Group.Name}(${text})`, i);
        option.classList.add('R' + Group.Region);
        selectGroup.options.add(option);
      }
    }
    selectGrand.options.add(NullOption());
    for (let i in GrandList) {
      const Grand = GrandList[i];
      const option = new Option(Grand.Name, i);
      option.classList.add(Grand.Class);
      selectGrand.options.add(option);
    }
    selectWorld.options.add(NullOption());
    for (let i in WorldList) {
      const World = WorldList[i];
      const option = new Option(World.Name, i);
      option.classList.add('G' + World.Group);
      selectWorld.options.add(option);
    }
    for (let i in BlockList) {
      const Block = BlockList[i];
      const option = new Option(Block.Name, i);
      option.classList.add('global');
      selectWorld.options.add(option);
    }
    selectRegion.onchange = () => {
      document.querySelector('#styleGroup')?.remove();
      resetTable();
      selectGroup.value = '-1';
      selectGrand.value = '-1';
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
    };
    selectGroup.onchange = () => {
      document.querySelector('#styleGrand')?.remove();
      resetTable();
      selectGrand.value = '-1';
      selectWorld.value = '-1';
      document.head.appendChild(
        createElement(
          'style',
          `
            #listGrand > .static
            ${selectGroup.value == 'N' + selectRegion.value ? '' : ',#listGrand > .dynamic'} {
              display: inline;
            }`,
          'styleGrand'
        )
      );
    };
    selectGrand.onchange = () => {
      document.querySelector('#styleWorld')?.remove();
      resetTable();
      selectWorld.value = '-1';
      document.head.appendChild(
        createElement(
          'style',
          `
            #listWorld > ${selectGrand.value > 0 ? '.global' : '.G' + selectGroup.value} {
              display: inline;
            }`,
          'styleWorld'
        )
      );
    };
    selectWorld.onchange = () => {
      resetTable();
      setStorage('RegionId', selectRegion.value);
      setStorage('GroupId', selectGroup.value);
      setStorage('GrandId', selectGrand.value);
      setStorage('WorldId', selectWorld.value);
      drawMap(selectGrand.value);
    };
    pRegion.appendChild(selectRegion);
    pGroup.appendChild(selectGroup);
    pGrand.appendChild(selectGrand);
    pWorld.appendChild(selectWorld);
    divSelect.appendChild(pRegion);
    divSelect.appendChild(pGroup);
    divSelect.appendChild(pGrand);
    divSelect.appendChild(pWorld);
    divSelect.appendChild(pRequest);
    document.body.appendChild(divSelect);
    document.body.appendChild(createElement('table', `<thead><tr><th>图</th><th>公会名称</th><th>友</th><th>中</th><th>敌</th></tr></thead><tbody></tbody>`, 'guilds1'));
    document.body.appendChild(createElement('table', `<thead><tr><th>图</th><th>公会名称</th><th>友</th><th>中</th><th>敌</th></tr></thead><tbody></tbody>`, 'guilds2'));
    document.body.appendChild(createElement('hr'));
  }
  //主功能
  //文件转换
  function fileConverter() {
    //清除元素
    while (document.body.childNodes.length > 6) {
      document.body.lastChild.remove();
    }
    let divData = createElement('div');
    divData.setAttribute('style', 'width: 100%;display: flex;flex-direction: column;flex-wrap: nowrap;');
    let uploadButton = createElement('input', '', {
      type: 'file',
      multiple: 'multiple',
    });
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
    divData.appendChild(uploadButton);
    divData.appendChild(createElement('br'));
    document.body.appendChild(divData);
  }
  //战斗布局
  async function gvgMapper() {
    //清除元素
    while (document.body.childNodes.length > 6) {
      document.body.lastChild.remove();
    }
    await initSelect();
    const RegionId = getStorage('RegionId');
    const GroupId = getStorage('GroupId');
    const GrandId = getStorage('GrandId');
    const WorldId = getStorage('WorldId');
    if (WorldId >= 0) {
      document.querySelector('#listRegion').value = RegionId;
      document.querySelector('#listGroup').value = GroupId;
      document.querySelector('#listGrand').value = GrandId;
      document.querySelector('#listWorld').value = WorldId;
      document.head.appendChild(
        createElement(
          'style',
          `
            #listGroup > option.R${RegionId} {
              display: inline;
            }`,
          'styleGroup'
        )
      );
      document.head.appendChild(
        createElement(
          'style',
          `
            #listGrand > .static
            ${GroupId == 'N' + RegionId ? '' : ',#listGrand > .dynamic'} {
              display: inline;
            }`,
          'styleGrand'
        )
      );
      document.head.appendChild(
        createElement(
          'style',
          `
            #listWorld > ${GrandId > 0 ? '.global' : '.G' + GroupId} {
              display: inline;
            }`,
          'styleWorld'
        )
      );
    }
    if (GrandId >= 0) {
      drawMap(GrandId);
    }
  }
  //子功能
  //战斗布局-绘制地图
  function drawMap(GrandId) {
    document.querySelector('#gvgMapStyle')?.remove();
    document.querySelector('gvg-viewer')?.remove();
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
    const Grand = GrandId == 0 ? 'local' : 'global';
    const image = Grand == 'local' ? 'base_ribbon_01' : 'base_metal';
    let style = createElement(
      'style',
      `
            gvg-viewer {
              display: block;
              position: relative;
              width: 1280px;
              height: 1280px;
              font-family: sans-serif;
              background-size: cover;
              background-image: url(assets/${Grand}gvg.png);
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
            gvg-status[neutral] > gvg-attacker {
              display: none;
            }
            gvg-status[neutral] > gvg-status-icon-defense {
              margin: auto;
              left: 0;
              right: 0;
              top: 0;
            }
            gvg-status[neutral] > gvg-status-icon-offense {
              display: none;
            }
            gvg-status[neutral] > gvg-status-bar-defense {
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
            gvg-status[neutral] > gvg-status-bar-offense {
              display: none;
            }
            gvg-status[active] > gvg-status-icon-defense {
              right: 0;
              bottom: 0;
            }
            gvg-status[active] > gvg-status-icon-offense {
              left: 0;
              bottom: 0;
            }
            gvg-status[active] > gvg-status-bar-defense {
              right: 25px;
              bottom: 0;
              text-align: right;
              line-height: 24px;
              background-image: url(assets/base_s_09_blue.png);
            }
            gvg-status[active] > gvg-status-bar-offense {
              left: 25px;
              bottom: 10px;
              text-align: left;
              line-height: 16px;
              background-image: url(assets/base_s_09_red.png);
            }
            gvg-status[counter] > gvg-status-icon-defense {
              left: 0;
              bottom: 0;
              background-image: url(${assetURL}icon_gvg_party_offense_counter.png);
            }
            gvg-status[counter] > gvg-status-icon-offense {
              right: 0;
              bottom: 0;
              background-image: url(assets/icon_gvg_party_defense.png);
            }
            gvg-status[counter] > gvg-status-bar-defense {
              left: 25px;
              bottom: 10px;
              text-align: left;
              line-height: 16px;
              background-image: url(assets/base_s_09_red.png);
            }
            gvg-status[counter] > gvg-status-bar-offense {
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
              color: $ {
                grand== 'local' ? '#473d3b' : 'white';
              }
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
    );
    let viewer = createElement('gvg-viewer');
    viewer.setAttribute(Grand, '');
    for (let i in castalList[Grand]) {
      let castal = castalList[Grand][i];
      let castleNode = createElement('gvg-castle');
      castleNode.setAttribute('castle-id', i);
      castleNode.setAttribute(castal.type, 'true');
      let status = createElement('gvg-status');
      status.setAttribute('neutral', '');
      const NodeOffense = createElement('gvg-status-bar-offense');
      NodeOffense.onclick = (e) => {
        changeGuild(e.target);
      };
      status.appendChild(NodeOffense);
      const NodeDefense = createElement('gvg-status-bar-defense');
      NodeDefense.onclick = (e) => {
        changeGuild(e.target);
      };
      status.appendChild(NodeDefense);
      const IconOffense = createElement('gvg-status-icon-offense', 0);
      IconOffense.onclick = hideOffense;
      status.appendChild(IconOffense);
      const IconDefense = createElement('gvg-status-icon-defense', 0);
      IconDefense.onclick = showOffense;
      status.appendChild(IconDefense);
      const NodeAttacker = createElement('gvg-attacker', '⚔️');
      NodeAttacker.onclick = counterOffense;
      status.appendChild(NodeAttacker);
      castleNode.appendChild(status);
      castleNode.appendChild(createElement('gvg-castle-icon'));
      const NodeCastalName = createElement('gvg-castle-name', castal.name);
      NodeCastalName.onclick = addHint;
      castleNode.appendChild(NodeCastalName);
      let kos = createElement('gvg-ko-count-container');
      kos.classList.add('hidden');
      kos.appendChild(createElement('gvg-ko-count', 0));
      kos.appendChild(createElement('gvg-ko-count-label'));
      castleNode.appendChild(kos);
      viewer.appendChild(castleNode);
      style.appendChild(
        createElement(
          'text',
          `
            gvg-viewer[${Grand}] gvg-castle[castle-id='${i}'] {
              left: ${castal.left};
              top: ${castal.top};
            }`
        )
      );
    }
    document.head.appendChild(style);
    document.body.appendChild(viewer);
  }
  //战斗布局-填充数据
  async function fillMap(CastalList, GuildList) {
    resetTable();
    const table1 = document.querySelector('#guilds1').tBodies[0];
    const table2 = document.querySelector('#guilds2').tBodies[0];
    let trList = [];
    for (let i in GuildList) {
      const GuildId = i;
      const Guild = GuildList[i];
      changeColor(GuildId, Guild.Color);
      const divGuild = createElement('tr', '', GuildId);
      const aColor = createElement('td', '■');
      aColor.classList.add('GuildId');
      aColor.onclick = (e) => {
        const GuildId = e.target.parentNode.id;
        const Color = prompt('请输入设定颜色，形式为R,G,B');
        changeColor(GuildId, Color);
      };
      divGuild.appendChild(aColor);
      divGuild.appendChild(createElement('td', GuildList[i].Name));
      divGuild.appendChild(createElement('td', `<input type="radio" name="${GuildId}" value="friendly">`));
      divGuild.appendChild(createElement('td', `<input type="radio" name="${GuildId}" value="neutral" checked="true">`));
      divGuild.appendChild(createElement('td', `<input type="radio" name="${GuildId}" value="enermy">`));
      trList.push(divGuild);
    }
    for (let i = 0; i < trList.length; i++) {
      if (i < trList.length / 2) {
        table1.appendChild(trList[i]);
      } else {
        table2.appendChild(trList[i]);
      }
    }
    for (let i = 0; i < CastalList.length; i++) {
      const CastalData = CastalList[i];
      const CastalNode = document.querySelector(`gvg-castle[castle-id="${CastalData.CastleId}"]`);
      CastalNode.setAttribute('defense', CastalData.GuildId);
      CastalNode.setAttribute('offense', CastalData.AttackerGuildId);
      CastalNode.querySelector('gvg-status-bar-defense').innerHTML = GuildList[CastalData.GuildId]?.Name ?? '';
      CastalNode.querySelector('gvg-status-bar-offense').innerHTML = GuildList[CastalData.AttackerGuildId]?.Name ?? '';
      CastalNode.querySelector('gvg-status-icon-defense').innerHTML = CastalData.DefensePartyCount;
      CastalNode.querySelector('gvg-status-icon-offense').innerHTML = CastalData.AttackPartyCount;
      if (CastalData.GvgCastleState == 1) {
        CastalNode.querySelector('gvg-status').removeAttribute('neutral');
        CastalNode.querySelector('gvg-status').setAttribute('active', '');
      } else {
        CastalNode.querySelector('gvg-status').removeAttribute('active');
        CastalNode.querySelector('gvg-status').setAttribute('neutral', '');
      }
      CastalNode.querySelector('gvg-ko-count').innerHTML = CastalData.LastWinPartyKnockOutCount;
    }
  }
  //战斗布局-重置表格
  function resetTable() {
    document.querySelector('#guilds1').tBodies[0].innerHTML = '';
    document.querySelector('#guilds2').tBodies[0].innerHTML = '';
  }
  //战斗布局-增加提示
  async function addHint() {
    let exist = this.parentNode.querySelector('gvg-castle-hint');
    let image = this.parentNode.querySelector('.gvg-castle-symbol');
    let hint = prompt('输入添加的提示,然后输入"|"(不带引号),再输入标识代码(A1:攻击1;A2:攻击2;D1:防御1;D2:防御2;F1:禁止;F2:旗帜)\n若标识代码为空则移除图标,其他代码则为你确认知道的图片名称,包含相对路径,路经确认:\nhttps://github.com/rainsillwood/MementoMoriGuildHelper/tree/main/assets', exist ? exist.innerHTML : '');
    if (hint == '' || hint == undefined) {
      exist.remove();
      return;
    }
    hint = hint.split('|');
    if (!exist) {
      exist = createElement('gvg-castle-hint', hint[0]);
      this.parentNode.appendChild(exist);
    } else {
      exist.innerHTML = hint[0];
    }
    if (image) {
      image.remove();
    } else {
      image = createElement('img');
      image.classList.add('gvg-castle-symbol');
    }
    const imageName = {
      'A1': 'icon_gvg_marker_1',
      'A2': 'icon_gvg_marker_2',
      'D1': 'icon_gvg_marker_3',
      'D2': 'icon_gvg_marker_4',
      'F1': 'icon_gvg_marker_5',
      'F2': 'icon_gvg_marker_6',
    };
    if (hint[1]) {
      image.src = `${assetURL}${imageName[hint[1]] ?? hint[1]}.png`;
      this.parentNode.appendChild(image);
    }
  }
  //战斗布局-显示进攻方
  function showOffense() {
    this.parentNode.removeAttribute('neutral');
    this.parentNode.removeAttribute('counter');
    this.parentNode.setAttribute('active', '');
  }
  //战斗布局-隐藏进攻方
  function hideOffense() {
    this.parentNode.removeAttribute('active');
    this.parentNode.removeAttribute('counter');
    this.parentNode.setAttribute('neutral', '');
  }
  //战斗布局-反击进攻方
  function counterOffense() {
    this.parentNode.removeAttribute('active');
    this.parentNode.removeAttribute('neutral');
    this.parentNode.setAttribute('counter', '');
  }
  //战斗布局-修改颜色
  function changeColor(GuildId, Color) {
    document.querySelector(`#style${GuildId}`)?.remove();
    const style = createElement(
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
    );
    document.head.appendChild(style);
  }
  //战斗布局-修改公会
  function changeGuild(target) {
    const trList = document.querySelectorAll('tbody > tr');
    const selectGuild = createElement('select', '', {
      castal: target.parentNode.parentNode.getAttribute('castle-id'),
      target: target.tagName,
    });
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
    const dialogGuild = createElement('dialog', `<a>请选择公会：</a>`);
    dialogGuild.onclose = (e) => {
      const select = e.target.querySelector('select');
      const castal = document.querySelector(`gvg-castle[castle-id="${select.getAttribute('castal')}"]`);
      const target = select.getAttribute('target');
      castal.setAttribute(target.split('-').pop(), select.value);
      castal.querySelector(target).innerHTML = select.selectedOptions[0].innerHTML;
      dialogGuild.remove();
    };
    dialogGuild.appendChild(selectGuild);
    document.body.appendChild(dialogGuild);
    dialogGuild.showModal();
  }
  //API函数
  //获取世界组
  async function getWorldGroup() {
    const buffer = await sendGMRequest(`https://cdn-mememori.akamaized.net/master/prd1/version/${getStorage('MasterVersion')}/WorldGroupMB`, { type: 'arraybuffer', msgpack: true });
    const WorldGroupMB = await msgpack.decode(new Uint8Array(buffer));
    const RegionList = { 'jp': 'Japan', 'kr': 'Korea', 'ap': 'Asia', 'us': 'America', 'eu': 'Europe', 'gl': 'Global' };
    const RegionIdList = { 'jp': 0, 'kr': 2, 'ap': 3, 'us': 4, 'eu': 5, 'gl': 6 };
    let result = {
      'RegionList': {},
      'GroupList': {},
      'WorldList': {},
    };
    for (let i = 0; i < WorldGroupMB.length; i++) {
      const WorldGroup = WorldGroupMB[i];
      const RegionMemo = WorldGroup.Memo;
      const RegionId = RegionIdList[RegionMemo].toString();
      const WorldIdList = WorldGroup.WorldIdList;
      if (new Date(WorldGroup.EndTime) > new Date()) {
        let region = result.RegionList[RegionId];
        if (!region) {
          region = {
            'Name': RegionList[RegionMemo],
            'SName': RegionMemo,
            'WorldList': [],
            'GroupList': [`N${RegionId}`],
          };
          result.RegionList[RegionId] = region;
          result.GroupList[`N${RegionId}`] = {
            'Name': `Group NA`,
            'SName': `GNA`,
            'Region': RegionId,
            'WorldList': [],
          };
        }
        const GroupId = WorldGroup.Id.toString();
        let group = result.GroupList[GroupId];
        if (!group) {
          group = {
            'Region': RegionId,
            'Name': `Group ${GroupId}`,
            'SName': `G${GroupId}`,
            'WorldList': [],
          };
          result.GroupList[GroupId] = group;
        }
        region.GroupList.push(GroupId);
        for (let j = 0; j < WorldIdList.length; j++) {
          const WorldId = WorldIdList[j].toString();
          region.WorldList.push(WorldId);
          let world = {
            'Name': `World ${WorldId % 1000}`,
            'SName': `W${WorldId % 1000}`,
            'Region': RegionId,
            'Group': GroupId,
          };
          result.WorldList[WorldId] = world;
          region.WorldList.push(WorldId);
          group.WorldList.push(WorldId);
        }
      }
    }
    const _getDataUri = await getDataUri();
    for (let i = 0; i < _getDataUri.WorldInfos.length; i++) {
      const World = _getDataUri.WorldInfos[i];
      const GameServerId = World.GameServerId;
      const RegionId = Math.floor(GameServerId / 10).toString();
      const WorldId = World.Id.toString();
      let region = result.RegionList[RegionId];
      region.WorldList.push(WorldId);
      let world = result.WorldList[WorldId];
      if (world) {
        world.GameServerId = GameServerId;
      } else {
        const GroupId = `N${RegionId}`;
        result.GroupList[GroupId].WorldList.push(WorldId);
        result.WorldList[WorldId] = {
          'Name': `World ${WorldId % 1000}`,
          'SName': `W${WorldId % 1000}`,
          'Region': RegionId,
          'Group': GroupId,
          'GameServerId': GameServerId,
        };
      }
    }
    return result;
  }
  //获取gvg信息
  async function getGuildWar(GrandId, WorldId, GroupId) {
    let request;
    if (GrandId == 0) {
      request = await sendRequest(`https://api.mentemori.icu/${WorldId}/localgvg/latest`);
    } else {
      request = await sendRequest(`https://api.mentemori.icu/wg/${GroupId}/globalgvg/${GrandId}/${WorldId}/latest`);
    }
    return JSON.parse(request);
  }
  //工具函数
  //请求函数
  async function sendRequest(url, option) {
    let request = await sendGMRequest(url, option);
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
            headers.ortegaaccesstoken = getStorage('ortegaaccesstoken');
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
                setStorage('ortegaaccesstoken', token);
              }
              setStorage('AssetVersion', getHeader(response.responseHeaders, 'ortegamasterversion'));
              setStorage('MasterVersion', getHeader(response.responseHeaders, 'ortegamasterversion'));
              setStorage('utcnowtimestamp', getHeader(response.responseHeaders, 'ortegautcnowtimestamp'));
              data = await msgpack.decode(new Uint8Array(response.response));
              if (data.ErrorCode) {
                const ErrorCode = JSON.parse(getStorage('ErrorCode'));
                console.log(`${response.finalUrl.split('/').pop()}:${ErrorCode[data.ErrorCode]}`);
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
        node.setAttribute(i, option[i]);
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
