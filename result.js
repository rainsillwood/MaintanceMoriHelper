result = {
    RegionList: {
        RegionId: {
            'Name': RegionList[RegionMemo],
            'SName': RegionMemo,
            'WorldList': [],
            'GroupList': [`N${RegionId}`],
        }
    },
    GroupList: {
        GroupId: {
            'Name': `Group NA`,
            'SName': `GNA`,
            'Region': RegionId,
            'WorldList': [],
        },
        GroupId: {
            'Region': RegionId,
            'Name': `Group ${GroupId}`,
            'SName': `G${GroupId}`,
            'WorldList': [],
        }
    },
    WorldList: {
        WorldId: {
            'Name': `World ${WorldId % 1000}`,
            'SName': `W${WorldId % 1000}`,
            'Region': RegionId,
            'Group': GroupId,
        }
    }
}