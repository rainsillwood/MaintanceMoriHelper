Account = {
  RegionId: {
    'ClientKey': ClientKey,
    'UserId': UserId,
    'AdverisementId': AdverisementId,
    'ortegauuid': ortegauuid,
  },
};
WorldGroup = {
  RegionList: {
    RegionId: {
      'Name': 'Asia',
      'SName': 'ap',
      'WorldList': [WorldId],
      'GroupList': [`N${RegionId}`, GroupId],
    },
  },
  GroupList: {
    GroupId: {
      'Name': `Group NA`,
      'SName': `GNA`,
      'Region': `${RegionId}`,
      'WorldList': [WorldId],
    },
    GroupId: {
      'Name': `Group ${GroupId}`,
      'SName': `G${GroupId}`,
      'Region': RegionId,
      'WorldList': [WorldId],
    },
  },
  WorldList: {
    WorldId: {
      'Name': `World ${WorldId % 1000}`,
      'SName': `W${WorldId % 1000}`,
      'Region': RegionId,
      'Group': GroupId,
    },
  },
};
Match = {
  'Guid': `${GroupId}_${ClassId}_${WorldId}`,
  'Guilds': [],
  'Castles': [
    {
      'CastleId': CastleId,
      'GuildId': GuildId,
      'AttackerGuildId': AttackerGuildId,
      'AttackPartyCount': AttackPartyCount,
      'DefensePartyCount': DefensePartyCount,
      'GvgCastleState': GvgCastleState,
      'UtcFallenTimeStamp': UtcFallenTimeStamp,
      'LastWinPartyKnockOutCount': LastWinPartyKnockOutCount,
    },
  ],
};
Guild = {
  'Guid': `${RegionId}_${GuildId}`,
  'GuildId': GuildId,
  'Name': Name,
  'Color': Color,
  'GuildLevel': GuildLevel,
  'Relation': Relation,
};
Player = {
  'Guid': `${RegionId}_${PlayerId}`,
  'PlayerId': PlayerId,
  'Name': Name,
  'Guild': GuildId,
  'Level': Level,
  'BattlePower': BattlePower,
};
Deck = {
  'Guid': `${Time}_${Guid}`,
  'DeckId': Guid,
  'Player': PlayerId,
  'Content': [CharacterId1, CharacterId2, CharacterId3, CharacterId4, CharacterId5],
  'LastUpdate': Time,
};
Character = {
  'Guid': Guid,
  'CharacterId': CharacterId,
  'Player': PlayerId,
  'Level': Level,
  'SubLevel': SubLevel,
  'BattlePower': BattlePower,
  'LastUpdate': Time,
};
Battle = {
  'Guid': Guid,
  'LastUpdate': Time,
};
