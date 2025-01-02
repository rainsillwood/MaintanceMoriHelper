(() => {
  let e = [new URLSearchParams(window.location.search).get('lang') || 'n_a'];
  if ('n_a' == e[0] && localStorage.getItem('lang')) window.langs = JSON.parse(localStorage.getItem('lang'));
  else {
    let n = navigator.languages.map((e) => e.split('-')[0]),
      a = e.concat(n);
    window.langs = a.slice(0, -1 == a.indexOf('en') ? a.length : a.indexOf('en')).reverse();
    localStorage.setItem('lang', JSON.stringify(a));
  }
  for (let e of langs) {
    if ('en' == e) break;
    document.querySelectorAll(`[data-${e}]`).forEach((n) => (n.innerText = n.attributes[`data-${e}`].nodeValue));
  }
  window.m = {
    ja: {},
  };
  window._m = (e, n, a) => {
    for (let t of langs) {
      if ('en' == t) break;
      if (n(t, e)) return a(t, e);
    }
    return a('en', e);
  };
  window._ = (e) =>
    _m(
      e,
      (e, n) => e in m && n in m[e],
      (e, n) => ('en' == e ? n : m[e][n])
    );
  window._l = (e, n) =>
    _m(
      n,
      (n, a) => `${a}-${n}` in e,
      (n, a) => e['en' == n ? a : `${a}-${n}`]
    );
  window._x = (e, n, a) =>
    _m(
      a,
      (e) => 'ja' == e,
      (a, t) => ('en' == a ? n(t) : e(t))
    );
})();
(() => {
  let e = () => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dark', 'light');
    },
    t = () => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dark', 'dark');
    };
  document.getElementById('switch-light').onclick = e;
  document.getElementById('switch-dark').onclick = t;
  if ('dark' === localStorage.getItem('dark')) t();
  else if ('light' === localStorage.getItem('dark')) e();
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) document.documentElement.classList.add('dark');
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
let getDivError = document.$.bind(document);
{
  HTMLElement.prototype.$ = HTMLElement.prototype.querySelector;
  document.__proto__.$$ = document.__proto__.querySelectorAll;
}
document.$$.bind(document);
{
  HTMLElement.prototype.$$ = HTMLElement.prototype.querySelectorAll;
  Object.assign(window.m.ja, {
    ' Forces': '軍',
  });
}
let getMatchInfo = (e, t) => {
    let l = e.getUint32(t, true);
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
  getGuildInformation = (e, t) => {
    let l = e.getUint32(t, true),
      r = e.getUint8(t + 4, true);
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
      GuildId: 1000 * e.getUint32(t, true) + 0,
      AttackerGuildId: 1000 * e.getUint32(t + 4, true) + 0,
      UtcFallenTimeStamp: 1000 * e.getUint32(t + 8, true),
      DefensePartyCount: e.getUint16(t + 12, true),
      AttackPartyCount: e.getUint16(t + 14, true),
      GvgCastleState: e.getUint8(t + 16, true),
      LastWinPartyKnockOutCount: e.getUint16(t + 18, true),
    },
    offset: t + 20,
  }),
  getPlayer = (e, t, l) => {
    let r = e.getUint32(t, true),
      n = e.getUint32(t + 4, true),
      a = e.getUint8(t + 8, true);
    return {
      value: {
        PlayerId: 1000 * r + (l % 1000),
        GuildId: 1000 * n + (l % 1000),
        PlayerName: new TextDecoder('utf-8').decode(new Uint8Array(e.buffer, t + 16, a)),
      },
      offset: t + 16 + a,
    };
  },
  getAttack = (e, t, l) => {
    let r = e.getUint32(t, true),
      n = e.getUint16(t + 4, true),
      a = e.getUint16(t + 6, true);
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
  LastLoginTime = (e, t, l) => ({
    value: {
      PlayerId: 1000 * e.getUint32(t, true) + (l % 1000),
      LastLoginTime: e.getUint32(t + 4, true),
    },
    offset: t + 16,
  }),
  isSameWorld = (e, t) => ((0 == e.GroupId && 0 == e.Class && 0 == e.Block) || (0 == t.GroupId && 0 == t.Class && 0 == t.Block) ? e.WorldId == t.WorldId : e.GroupId == t.GroupId && e.Class == t.Class && e.Block == t.Block),
  sendData = (socket, t) => {
    let buffer = new ArrayBuffer(4);
    ((view, position, MatchInfo) => {
      let data = (MatchInfo.WorldId << 19) | (MatchInfo.Class << 16) | (MatchInfo.GroupId << 8) | (MatchInfo.Block << 5) | MatchInfo.CastleId;
      view.setUint32(position, data, true);
    })(new DataView(buffer), 0, t);
    socket.send(buffer);
  },
  c = (() => {
    let e,
      MatchInfo = null,
      c = {},
      g = [],
      f = () => {
        e = ((e, t, u, c, g, f, v, I, m) => {
          let socket = new WebSocket('wss://api.mentemori.icu/gvg'),
            C = {},
            y = {},
            w = {},
            b = [];
          return (
            (socket.binaryType = 'arraybuffer'),
            socket.addEventListener('open', () => {
              getDivError('#error').innerText = '';
              e(socket);
            }),
            socket.addEventListener('message', (event) => {
              let t = new DataView(event.data),
                l = 0;
              for (; l < t.byteLength; ) {
                let e = getMatchInfo(t, l),
                  u = e.value;
                {
                  l = e.offset;
                  if (0 == u.CastleId) {
                    e = getGuildInformation(t, l, u.WorldId);
                    let r = e.value;
                    {
                      r.StreamId = u;
                      l = e.offset;
                      if (!isSameWorld(u, c())) continue;
                    }
                    if (0 == r.GuildId) C = {};
                    else C[r.GuildId] = r.GuildName;
                    g(C, r);
                  } else if (31 == u.CastleId) {
                    e = getPlayer(t, l, u.WorldId);
                    let r = e.value;
                    {
                      r.StreamId = u;
                      l = e.offset;
                      if (!isSameWorld(u, c())) continue;
                    }
                    if (0 == r.PlayerId) y = {};
                    else {
                      if (!y[r.GuildId]) y[r.GuildId] = [];
                      y[r.GuildId].push(r);
                    }
                    v(y, r);
                  } else if (30 == u.CastleId || 29 == u.CastleId) {
                    e = getAttack(t, l, u.WorldId);
                    let r = e.value;
                    {
                      r.StreamId = u;
                      l = e.offset;
                      if (!isSameWorld(u, c())) continue;
                    }
                    m(r);
                  } else if (28 == u.CastleId) {
                    e = LastLoginTime(t, l, u.WorldId);
                    let r = e.value;
                    {
                      r.StreamId = u;
                      l = e.offset;
                      if (!isSameWorld(u, c())) continue;
                    }
                    if (0 == r.PlayerId) w = {};
                    else w[r.PlayerId] = r;
                    I(w, r);
                  } else {
                    e = getCastle(t, l, u.WorldId);
                    let r = e.value;
                    {
                      r.StreamId = u;
                      l = e.offset;
                      if (!isSameWorld(u, c())) continue;
                    }
                    b[u.CastleId - 1] = r;
                    f(b, u.CastleId);
                  }
                }
              }
            }),
            socket.addEventListener('error', () => {
              getDivError('#error').innerText = 'WebSocket error';
            }),
            socket.addEventListener('close', () => {
              if (u()) {
                getDivError('#error').innerText = 'Connection closed, retrying in 5s';
                setTimeout(t, 5000);
              }
            }),
            socket
          );
        })(
          (e) => {
            if (null !== MatchInfo) sendData(e, MatchInfo);
          },
          f,
          () => true,
          () => MatchInfo,
          (e) => {
            c = e;
          },
          (e, t) => {
            g = e;
            ((e) => {
              let t = g[e - 1],
                r = getDivError(`gvg-castle[castle-id="${e}"]`),
                n = r.$('gvg-status'),
                a = [-32400, -32400, -28800, 25200, -3600, -3600][Math.floor(t.StreamId.WorldId / 1000) - 1];
              new Date(Math.max(0, t.UtcFallenTimeStamp + 1000 * a));
              n.$('gvg-status-icon-offense').innerText = t.AttackPartyCount;
              n.$('gvg-status-icon-defense').innerText = t.DefensePartyCount;
              let o = c[t.GuildId] || getDivError(`gvg-castle[castle-id="${e}"] > gvg-castle-name`).innerText + _(' Forces'),
                d = c[t.AttackerGuildId] || '';
              if (t.GvgCastleState % 2 == 0) {
                n.removeAttribute('active');
                n.setAttribute('neutral', '');
              } else {
                n.removeAttribute('neutral');
                n.setAttribute('active', '');
              }
              if (!(2 != t.GvgCastleState && 3 != t.GvgCastleState)) [o, d] = [d, o];
              n.$('gvg-status-bar-offense').innerText = d;
              n.$('gvg-status-bar-defense').innerText = o;
              if (t.LastWinPartyKnockOutCount < 10) {
                r.$('gvg-ko-count-container').classList.add('hidden');
              } else {
                r.$('gvg-ko-count').innerText = t.LastWinPartyKnockOutCount;
                r.$('gvg-ko-count-container').classList.remove('hidden');
              }
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
        let r = MatchInfo;
        MatchInfo = l;
        if (e.readyState == WebSocket.OPEN) {
          ((e, t, l) => {
            if (t) sendData(e, t);
            sendData(e, l);
          })(e, r, MatchInfo);
        }
      }
    );
  })();
Object.assign(window.m.ja, {
  'All Worlds': 'すべて',
});
{
  ((e) => {
    let r = e.en;
    for (let t of langs) {
      if (t in e) {
        r = e[t];
        break;
      }
    }
    let n = getDivError('gvg-viewer'),
      a = n.$('gvg-castle');
    for (let e = 1; e < r.length; ++e) {
      let l = a.cloneNode(true);
      l.setAttribute(e < 5 ? 'castle' : 'church', true);
      l.setAttribute('castle-id', e + 1);
      l.$('gvg-castle-name').innerText = t(r[e]);
      n.appendChild(l);
    }
    a.setAttribute('temple', true);
    a.$('gvg-castle-name').innerText = t(r[0]);
  })({
    en: ['Brussell', 'Wissekerke', 'Modave', 'Chimay', 'Gravensteen', 'Cambre', 'Quentin', 'Lambert', 'Saint-Jacques', 'Michael', 'Namur', 'Charleroi', 'Alzette', 'Hainaut', 'Wavre', 'Mons', 'Christophe', 'Kortrijk', 'Ypres', 'Salvador', 'Bavo'],
    ja: ['ブラッセル', 'ウィスケルケー', 'モダーヴ', 'シメイ', 'グラベンスティン', 'カンブル', 'クインティヌス', 'ランベール', 'サンジャック', 'ミヒャエル', 'ナミュール', 'シャルルロア', 'アルゼット', 'エノー', 'ワーヴル', 'モンス', 'クリストフ', 'コルトレイク', 'イーペル', 'サルヴァトール', 'バーフ'],
  });
  fetch('https://api.mentemori.icu/worlds')
    .then((e) => e.json())
    .then((e) => {
      ((e, t, r, n) => {
        e.data.sort((e, t) => e.world_id - t.world_id);
        if (n) {
          getDivError('#server').value = ['jp', 'kr', 'as', 'na', 'eu', 'gl'][(n / 1000 - 1) | 0];
        }
        let a = () => {
          let a = getDivError('#world'),
            o = getDivError('#server').value;
          for (let e of [...a.children]) a.removeChild(e);
          for (let l of e.data) {
            if (!t(l)) continue;
            if (l.server != o) continue;
            let e = document.createElement('option');
            e.value = l.world_id;
            e.innerText = 'W' + (l.world_id % 1000);
            a.appendChild(e);
          }
          if (n) {
            getDivError('#world').value = n;
            n = null;
          }
          getDivError('#world').onchange = (e) => r(e.target.value);
          r(getDivError('#world').value);
        };
        getDivError('#server').onchange = a;
        a();
      })(
        e,
        (e) => e.localgvg,
        (e) => {
          localStorage.setItem('localgvg', e);
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
}
