// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE


module.exports.reportMarkdown = function reportMarkdown(
  todos,
  reportLinksPrefix,
  labelsSeparator,
) {
  const {subSectionKeys, subSectionText} = recurseSection({
    currentSection: todos,
    currentLevel: 1,
    groupedValues: [],
    reportLinksPrefix,
    labelsSeparator,
  })

  const tableOfContents = new sectionText()

  if (subSectionKeys.length) {
    tableOfContents.addLine('# Table of contents')
    tableOfContents.addLine('')

    for (const [currentLevel, index, key] of subSectionKeys) {
      tableOfContents.addLine(`${'   '.repeat(currentLevel - 1)}${
        index + 1}. [${key}](#${makeSectionId(currentLevel, index)})`)
    }

    tableOfContents.addLine('')
  }

  // Remove the additional line break added by the last table
  return tableOfContents.text + subSectionText.slice(0, -1)
}


function makeSectionId(currentLevel, index) {
  return [currentLevel, index].join('-')
}


class sectionText {
  constructor() {
    this.text = ''
  }

  addLine(line) {
    // eslint-disable-next-line prefer-template
    this.text += line + '\n'
  }

  addMultilineQuiet(line) {
    this.text += line
  }

  setFilters(groupedValues) {
    this.showFilePath = !groupedValues.includes('filePath')
    this.showTag = !groupedValues.includes('tag')
  }

  addTableHeader({filePath, startLineNo, tag, labels, lines}) {
    const line = []

    if (this.showFilePath) line.push(filePath)
    line.push(startLineNo)
    if (this.showTag) line.push(tag)
    line.push(
      labels,
      lines,
    )

    this.addLine(line.join(''))
  }

  addTableData(
    {filePath, startLineNo, tag, labels, lines},
    reportLinksPrefix,
    labelsSeparator,
  ) {
    // TODO[enhancement]: Escape at least '\|' and '\' (optionally?)
    //  Or escape all special Markdown characters?
    //  Or just let the user do the escaping when necessary
    //  Use '\' or HTML entities? Test
    const url = `${reportLinksPrefix || ''}${filePath}#L${startLineNo}`
    const line = []

    if (this.showFilePath) {
      line.push(
        `| [${filePath}](${url})`,
        `| ${startLineNo}`,
      )
    } else {
      line.push(`| [${startLineNo}](${url})`)
    }

    if (this.showTag) line.push(`| ${tag}`)

    line.push(
      `| ${labels.join(labelsSeparator)}`,
      `| ${lines.join('<br>')}`,
    )

    this.addLine(line.join(' '))
  }
}


function recurseSection({
  currentSection, currentLevel, groupedValues, reportLinksPrefix,
  labelsSeparator,
}) {
  const sectionKeys = []
  const text = new sectionText()

  if (!currentSection.length) {
    return {
      subSectionKeys: sectionKeys,
      subSectionText: text.text,
    }
  }

  if ('matches' in currentSection[0]) {
    for (const [index, {type, key, matches}] of currentSection.entries()) {
      sectionKeys.push([currentLevel, index, key])

      text.addLine(`${'#'.repeat(currentLevel)} ${key}<a id="${
        makeSectionId(currentLevel, index)}"></a>`)

      text.addLine('')

      const {subSectionKeys, subSectionText} = recurseSection({
        currentSection: matches,
        currentLevel: currentLevel + 1,
        groupedValues: groupedValues.concat(type),
        reportLinksPrefix,
        labelsSeparator,
      })

      sectionKeys.push(...subSectionKeys)
      text.addMultilineQuiet(subSectionText)
    }
  } else {
    text.setFilters(groupedValues)

    text.addTableHeader({
      filePath: '| file path ',
      startLineNo: '| line # ',
      tag: '| tag ',
      labels: '| labels ',
      lines: '| comment',
    })

    text.addTableHeader({
      filePath: '|:----------',
      startLineNo: '|:-------',
      tag: '|:----',
      labels: '|:-------',
      lines: '|:-------',
    })

    for (const match of currentSection) {
      text.addTableData(
        {
          filePath: match.filePath,
          startLineNo: match.startLineNo,
          tag: match.tag,
          labels: match.labels,
          lines: match.lines,
        },
        reportLinksPrefix,
        labelsSeparator,
      )
    }

    text.addLine('')
  }

  return {subSectionKeys: sectionKeys, subSectionText: text.text}
}
