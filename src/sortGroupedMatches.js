// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE


module.exports.sortGroupedMatches = function sortGroupedMatches(
  groupedMatches,
  remainingGroupBy,
  sortBy,
) {
  if (remainingGroupBy.length) {
    const [currentGroupBy, ...newRemainingGroupBy] = remainingGroupBy
    const groupedSortedMatches = []

    for (const [groupKey, groupMatches] of Object.entries(groupedMatches).sort((j, k) => {
      if (j[0] < k[0]) return -1
      if (j[0] > k[0]) return 1
      return 0
    })) {
      groupedSortedMatches.push({
        type: currentGroupBy,
        key: groupKey,
        matches: sortGroupedMatches(
          groupMatches,
          newRemainingGroupBy,
          sortBy,
        ),
      })
    }
    return groupedSortedMatches
  }

  groupedMatches.sort((j, k) => {
    for (const sortKey of sortBy) {
      if (j[sortKey] < k[sortKey]) return -1
      if (j[sortKey] > k[sortKey]) return 1
    }
    return 0
  })

  return groupedMatches
}
