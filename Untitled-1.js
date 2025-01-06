t >
  (() => {
    let e = [new URLSearchParams(window.location.search).get('lang') || 'n_a'];
    if ('n_a' == e[0] && localStorage.getItem('lang')) window.langs = JSON.parse(localStorage.getItem('lang'));
    else {
      let n = navigator.languages.map((e) => e.split('-')[0]),
        a = e.concat(n);
      (window.langs = a.slice(0, -1 == a.indexOf('en') ? a.length : a.indexOf('en')).reverse()), localStorage.setItem('lang', JSON.stringify(a));
    }
    for (let e of langs) {
      if ('en' == e) break;
      document.querySelectorAll(`[data-${e}]`).forEach((n) => (n.innerText = n.attributes[`data-${e}`].nodeValue));
    }
    (window.m = {
      ja: {},
    }),
      (window._m = (e, n, a) => {
        for (let t of langs) {
          if ('en' == t) break;
          if (n(t, e)) return a(t, e);
        }
        return a('en', e);
      }),
      (window._ = (e) =>
        _m(
          e,
          (e, n) => e in m && n in m[e],
          (e, n) => ('en' == e ? n : m[e][n])
        )),
      (window._l = (e, n) =>
        _m(
          n,
          (n, a) => `${a}-${n}` in e,
          (n, a) => e['en' == n ? a : `${a}-${n}`]
        )),
      (window._x = (e, n, a) =>
        _m(
          a,
          (e) => 'ja' == e,
          (a, t) => ('en' == a ? n(t) : e(t))
        ));
  })();
(() => {
  let e = () => {
      document.documentElement.classList.remove('dark'), localStorage.setItem('dark', 'light');
    },
    t = () => {
      document.documentElement.classList.add('dark'), localStorage.setItem('dark', 'dark');
    };
  (document.getElementById('switch-light').onclick = e), (document.getElementById('switch-dark').onclick = t), 'dark' === localStorage.getItem('dark') ? t() : 'light' === localStorage.getItem('dark') ? e() : window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches && document.documentElement.classList.add('dark');
})();
let e = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
    ' ': '&nbsp;',
  },
  t = (t) => t.replace(/[&"'<> ]/g, (t) => e[t]);
document.__proto__.$ = document.__proto__.querySelector;
let getElementById = document.$.bind(document);
(HTMLElement.prototype.$ = HTMLElement.prototype.querySelector), (document.__proto__.$$ = document.__proto__.querySelectorAll);
document.$$.bind(document);
(HTMLElement.prototype.$$ = HTMLElement.prototype.querySelectorAll),
  Object.assign(window.m.ja, {
    ' Forces': '軍',
  });
let getMatch = (e, t) => {
    let l = e.getUint32(t, !0);
    return {
      value: {
        WorldId: l >>> 19,
        GroupId: (l >>> 8) & 255,
        Class: (l >>> 16) & 7,
        Block: (l >>> 5) & 7,
        CastleId: 31 & l,
      },
      offset: t + 4,
    };
  },
  getGuild = (e, t) => {
    let l = e.getUint32(t, !0),
      r = e.getUint8(t + 4, !0);
    return {
      value: {
        GuildId: 1000 * l + 0,
        GuildName: new TextDecoder('utf-8').decode(new Uint8Array(e.buffer, t + 5, r)),
      },
      offset: t + 5 + r,
    };
  },
  getCastle = (e, t) => ({
    value: {
      GuildId: 1000 * e.getUint32(t, !0) + 0,
      AttackerGuildId: 1000 * e.getUint32(t + 4, !0) + 0,
      UtcFallenTimeStamp: 1000 * e.getUint32(t + 8, !0),
      DefensePartyCount: e.getUint16(t + 12, !0),
      AttackPartyCount: e.getUint16(t + 14, !0),
      GvgCastleState: e.getUint8(t + 16, !0),
      LastWinPartyKnockOutCount: e.getUint16(t + 18, !0),
    },
    offset: t + 20,
  }),
  getPlayer = (e, t, l) => {
    let r = e.getUint32(t, !0),
      n = e.getUint32(t + 4, !0),
      a = e.getUint8(t + 8, !0);
    return {
      value: {
        PlayerId: 1000 * r + (l % 1000),
        GuildId: 1000 * n + (l % 1000),
        PlayerName: new TextDecoder('utf-8').decode(new Uint8Array(e.buffer, t + 16, a)),
      },
      offset: t + 16 + a,
    };
  },
  getAttacker = (e, t, l) => {
    let r = e.getUint32(t, !0),
      n = e.getUint16(t + 4, !0),
      a = e.getUint16(t + 6, !0);
    return {
      value: {
        PlayerId: 1000 * r + (l % 1000),
        CharacterId: n,
        CastleId: 31 & a,
        DeployCount: (a >> 5) & 3,
      },
      offset: t + 8,
    };
  },
  getLastLoginTime = (e, t, l) => ({
    value: {
      PlayerId: 1000 * e.getUint32(t, !0) + (l % 1000),
      LastLoginTime: e.getUint32(t + 4, !0),
    },
    offset: t + 16,
  }),
  checkSameWorld = (e, t) => ((0 == e.GroupId && 0 == e.Class && 0 == e.Block) || (0 == t.GroupId && 0 == t.Class && 0 == t.Block) ? e.WorldId == t.WorldId : e.GroupId == t.GroupId && e.Class == t.Class && e.Block == t.Block),
  sendData = (e, t) => {
    let l = new ArrayBuffer(4);
    ((e, t, l) => {
      let r = (l.WorldId << 19) | (l.Class << 16) | (l.GroupId << 8) | (l.Block << 5) | l.CastleId;
      e.setUint32(t, r, !0);
    })(new DataView(l), 0, t),
      e.send(l);
  },
  c = (() => {
    let e,
      BasicStreamId = null,
      BasicGuildList = {},
      g = [],
      f = () => {
        e = ((e114514, t114514, u114514, c114514, g114514, f114514, v114514, I114514, m114514) => {
          let socket = new WebSocket('wss://api.mentemori.icu/gvg');
          let GuildList = {};
          let y = {};
          let w = {};
          let b = [];
          socket.binaryType = 'arraybuffer';
          socket.addEventListener('open', () => {
            getElementById('#error').innerText = '';
            null !== t114514 && sendData(socket, t114514);
          });
          socket.addEventListener('message', (e) => {
            let view = new DataView(e.data),
              index = 0;
            for (; index < view.byteLength; ) {
              let data = getMatch(view, index),
                StreamId = data.value;
              if ((index = data.offset) && 0 == StreamId.CastleId) {
                data = getGuild(view, index, StreamId.WorldId);
                let Guild = data.value;
                if ((Guild.StreamId = StreamId) && (index = data.offset) && !checkSameWorld(StreamId, BasicStreamId)) {
                  continue;
                }
                if (0 == Guild.GuildId) {
                  GuildList = {};
                } else {
                  GuildList[Guild.GuildId] = Guild.GuildName;
                }
                BasicGuildList = GuildList;
              } else if (31 == StreamId.CastleId) {
                data = getPlayer(view, index, StreamId.WorldId);
                let r = data.value;
                if (((r.StreamId = StreamId), (index = data.offset), !checkSameWorld(StreamId, BasicStreamId))) continue;
                0 == r.PlayerId ? (y = {}) : (y[r.GuildId] || (y[r.GuildId] = []), y[r.GuildId].push(r)), v114514(y, r);
              } else if (30 == StreamId.CastleId || 29 == StreamId.CastleId) {
                data = getAttacker(view, index, StreamId.WorldId);
                let r = data.value;
                if (((r.StreamId = StreamId), (index = data.offset), !checkSameWorld(StreamId, BasicStreamId))) continue;
                m114514(r);
              } else if (28 == StreamId.CastleId) {
                data = getLastLoginTime(view, index, StreamId.WorldId);
                let r = data.value;
                if (((r.StreamId = StreamId), (index = data.offset), !checkSameWorld(StreamId, BasicStreamId))) continue;
                0 == r.PlayerId ? (w = {}) : (w[r.PlayerId] = r), I114514(w, r);
              } else {
                data = getCastle(view, index, StreamId.WorldId);
                let r = data.value;
                if (((r.StreamId = StreamId), (index = data.offset), !checkSameWorld(StreamId, BasicStreamId))) continue;
                (b[StreamId.CastleId - 1] = r), f114514(b, StreamId.CastleId);
              }
            }
          });
          socket.addEventListener('error', () => {
            getElementById('#error').innerText = 'WebSocket error';
          });
          socket.addEventListener('close', () => {
            true && ((getElementById('#error').innerText = ''), setTimeout(t114514, 5000));
          });
          socket;
        })(
          (e) => {
            null !== BasicStreamId && sendData(e, BasicStreamId);
          },
          f,
          () => !0,
          () => BasicStreamId,
          (e) => {
            BasicGuildList = e;
          },
          (e, t) => {
            (g = e),
              ((castleid) => {
                let t = g[castleid - 1],
                  divcastle = getElementById(`gvg-castle[castle-id="${castleid}"]`),
                  divgvgstatus = divcastle.$('gvg-status'),
                  a = [-32400, -32400, -28800, 25200, -3600, -3600][Math.floor(t.StreamId.WorldId / 1000) - 1];
                new Date(Math.max(0, t.UtcFallenTimeStamp + 1000 * a)), (divgvgstatus.$('gvg-status-icon-offense').innerText = t.AttackPartyCount), (divgvgstatus.$('gvg-status-icon-defense').innerText = t.DefensePartyCount);
                let o = BasicGuildList[t.GuildId] || getElementById(`gvg-castle[castle-id="${castleid}"] > gvg-castle-name`).innerText + _(' Forces'),
                  d = BasicGuildList[t.AttackerGuildId] || '';
                t.GvgCastleState % 2 == 0 ? (divgvgstatus.removeAttribute('active'), divgvgstatus.setAttribute('neutral', '')) : (divgvgstatus.removeAttribute('neutral'), divgvgstatus.setAttribute('active', '')), (2 != t.GvgCastleState && 3 != t.GvgCastleState) || ([o, d] = [d, o]), (divgvgstatus.$('gvg-status-bar-offense').innerText = d), (divgvgstatus.$('gvg-status-bar-defense').innerText = o), t.LastWinPartyKnockOutCount < 10 ? divcastle.$('gvg-ko-count-container').classList.add('hidden') : ((divcastle.$('gvg-ko-count').innerText = t.LastWinPartyKnockOutCount), divcastle.$('gvg-ko-count-container').classList.remove('hidden'));
              })(t);
          },
          () => {},
          () => {},
          () => {}
        );
      };
    return (
      f(),
      (l) => {
        let r = BasicStreamId;
        (BasicStreamId = l),
          e.readyState == WebSocket.OPEN &&
            ((e, t, l) => {
              t && sendData(e, t), sendData(e, l);
            })(e, r, BasicStreamId);
      }
    );
  })();
Object.assign(window.m.ja, {
  'All Worlds': 'すべて',
});
((e) => {
  let r = e.en;
  for (let t of langs)
    if (t in e) {
      r = e[t];
      break;
    }
  let n = getElementById('gvg-viewer'),
    a = n.$('gvg-castle');
  for (let e = 1; e < r.length; ++e) {
    let l = a.cloneNode(!0);
    l.setAttribute(e < 5 ? 'castle' : 'church', !0), l.setAttribute('castle-id', e + 1), (l.$('gvg-castle-name').innerText = t(r[e])), n.appendChild(l);
  }
  a.setAttribute('temple', !0), (a.$('gvg-castle-name').innerText = t(r[0]));
})({
  en: ['Brussell', 'Wissekerke', 'Modave', 'Chimay', 'Gravensteen', 'Cambre', 'Quentin', 'Lambert', 'Saint-Jacques', 'Michael', 'Namur', 'Charleroi', 'Alzette', 'Hainaut', 'Wavre', 'Mons', 'Christophe', 'Kortrijk', 'Ypres', 'Salvador', 'Bavo'],
  ja: ['ブラッセル', 'ウィスケルケー', 'モダーヴ', 'シメイ', 'グラベンスティン', 'カンブル', 'クインティヌス', 'ランベール', 'サンジャック', 'ミヒャエル', 'ナミュール', 'シャルルロア', 'アルゼット', 'エノー', 'ワーヴル', 'モンス', 'クリストフ', 'コルトレイク', 'イーペル', 'サルヴァトール', 'バーフ'],
}),
  fetch('https://api.mentemori.icu/worlds')
    .then((e) => e.json())
    .then((e) => {
      ((e, t, r, n) => {
        e.data.sort((e, t) => e.world_id - t.world_id), n && (getElementById('#server').value = ['jp', 'kr', 'as', 'na', 'eu', 'gl'][(n / 1000 - 1) | 0]);
        let a = () => {
          let a = getElementById('#world'),
            o = getElementById('#server').value;
          for (let e of [...a.children]) a.removeChild(e);
          for (let l of e.data) {
            if (!t(l)) continue;
            if (l.server != o) continue;
            let e = document.createElement('option');
            (e.value = l.world_id), (e.innerText = 'W' + (l.world_id % 1000)), a.appendChild(e);
          }
          n && ((getElementById('#world').value = n), (n = null)), (getElementById('#world').onchange = (e) => r(e.target.value)), r(getElementById('#world').value);
        };
        (getElementById('#server').onchange = a), a();
      })(
        e,
        (e) => e.localgvg,
        (e) => {
          localStorage.setItem('localgvg', e),
            c({
              WorldId: +e,
              GroupId: 0,
              Class: 0,
              Block: 0,
            });
        },
        +localStorage.getItem('localgvg')
      );
    });
