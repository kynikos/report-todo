module.exports.groupsAndSorts = [
  [
    'default', {
      // reportGroupBy: ['labels'],
      // reportSortBy: ['filePath', 'startLineNo'],
    },
    [
      // '--report-group-by',
      // 'labels',
      // '--report-sort-by',
      // 'filePath,startLineNo',
    ],
  ],
  [
    'group_tag,filePath_sort_labels,startLineNo',
    {
      reportGroupBy: ['tag', 'filePath'],
      reportSortBy: ['labels', 'startLineNo'],
    },
    [
      '--report-group-by',
      'tag,filePath',
      '--report-sort-by',
      'labels,startLineNo',
    ],
  ],
  [
    'group_filePath,labels,tag_sort_startLineNo',
    {
      reportGroupBy: ['filePath', 'labels', 'tag'],
      reportSortBy: ['startLineNo'],
    },
    [
      '--report-group-by',
      'filePath,labels,tag',
      '--report-sort-by',
      'startLineNo',
    ],
  ],
]
