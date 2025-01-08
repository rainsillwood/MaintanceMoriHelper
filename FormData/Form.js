Account = {
  RegionId: {
    ClientKey: ClientKey,
    UserId: UserId,
    AdverisementId: AdverisementId,
    ortegauuid: ortegauuid,
  },
};
WorldGroup = {
  RegionList: {
    '3': {
      Name: 'Asia',
      SName: 'ap',
      WorldList: [3019, 3020],
      GroupList: [`N${3}`, 21],
    },
  },
  GroupList: {
    'N3': {
      Name: `Group NA`,
      SName: `GNA`,
      Region: 3,
      WorldList: [3020],
    },
    '21': {
      Name: `Group ${GroupId}`,
      SName: `G${GroupId}`,
      Region: 3,
      WorldList: [3019],
    },
  },
  WorldList: {
    '3019': {
      Name: `World ${3019 % 1000}`,
      SName: `W${3019 % 1000}`,
      Region: 3,
      Group: 21,
    },
  },
};
Match = {
  Guid: '21_0_3019',
  Guilds: [],
  Castles: [
    {
      CastleId: 1,
      GuildId: 864636787003,
      AttackerGuildId: 0,
      AttackPartyCount: 0,
      DefensePartyCount: 0,
      GvgCastleState: 0,
      UtcFallenTimeStamp: 0,
      LastWinPartyKnockOutCount: 0,
    },
  ],
};
Guild = {
  Guid: `${3}_864636787003`,
  GuildId: 864636787003,
  Name: 'θωθ',
  Color: '255, 127, 127',
};
Player = {
  Guid: `${3}_864636787003`,
  PlayerId: 864636787003,
  Name: Name,
  Guild: 864636787003,
  Level: Level,
};
Deck = {
  Guid: Guid_Time,
  Date: Time,
  DeckId: Guid,
  Player: PlayerId,
  Content: [CharacterId1, CharacterId2, CharacterId3, CharacterId4, CharacterId5],
};
Character = {
  Guid: Guid,
  CharacterId: CharacterId,
  Player: PlayerId,
  Level: Level,
  SubLevel: SubLevel,
  BattlePower: BattlePower,
};
Battle = {
  Guid: Guid,
  Date: Time,
};
