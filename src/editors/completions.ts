import { IMarkdownString, IRange, languages, Token } from 'monaco-editor'
import { findClosestTokenIndex, isInCharacterSet, tokenizePomsky } from './tokenizePomsky'

interface Snippet {
  label: string
  insertText?: string
  detail: string
  documentation: string | IMarkdownString
  kind?: languages.CompletionItemKind
  insertTextRules?: languages.CompletionItemInsertTextRule
}

const completionRange = {
  startColumn: 1,
  endColumn: 1,
  startLineNumber: 1,
  endLineNumber: 1,
}

const globalSnippets: languages.CompletionItem[] = detailedCompletions([
  {
    label: 'Start',
    detail: 'built-in',
    documentation: {
      value: 'Start of the string. Equivalent to `^`.',
    },
    kind: languages.CompletionItemKind.Value,
  },
  {
    label: 'End',
    detail: 'built-in',
    documentation: {
      value: 'End of the string. Equivalent to `$`.',
    },
    kind: languages.CompletionItemKind.Value,
  },
  {
    label: 'Codepoint',
    detail: 'built-in',
    documentation: {
      value: 'A single code point.',
    },
    kind: languages.CompletionItemKind.Value,
  },
  {
    label: 'C',
    detail: 'built-in',
    documentation: {
      value: 'A single code point.',
    },
    kind: languages.CompletionItemKind.Value,
  },
  {
    label: 'Grapheme',
    detail: 'built-in',
    documentation: {
      value: 'A single grapheme cluster.',
    },
    kind: languages.CompletionItemKind.Value,
  },
  {
    label: 'G',
    detail: 'built-in',
    documentation: {
      value: 'A single grapheme cluster.',
    },
    kind: languages.CompletionItemKind.Value,
  },
  {
    label: 'range',
    insertText: "range '${1:0}'-'${2:255}'",
    detail: 'snippet',
    documentation: {
      value: `Matches a range of numbers. Use this if the number may be more than 1 code point.

### Examples:
~~~pomsky
range '0'-'255'
range '0'-'10FFFF' base 16
~~~`,
    },
    kind: languages.CompletionItemKind.Snippet,
    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: 'enable',
    insertText: 'enable lazy;\n',
    detail: 'snippet',
    documentation: {
      value: `Makes lazy matching the default.`,
    },
    kind: languages.CompletionItemKind.Snippet,
  },
  {
    label: 'disable',
    insertText: 'disable lazy;\n',
    detail: 'snippet',
    documentation: {
      value: `Makes greedy matching the default.

Note that greedy matching is usually the default, unless \`enable lazy;\` was used.`,
    },
    kind: languages.CompletionItemKind.Snippet,
  },
  {
    label: 'let',
    insertText: 'let ${1:var_name} = $0;\n',
    detail: 'snippet',
    documentation: {
      value: `Declares a variable.
      
### Example
~~~pomsky
let greeting = 'Hello';
greeting ' world'
~~~`,
    },
    kind: languages.CompletionItemKind.Snippet,
    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  // TODO: only show after repetition
  {
    label: 'lazy',
    detail: 'keyword',
    documentation: {
      value: `Keyword to make the previous repetition lazy. Opposite of \`greedy\`.
      
### Example:
~~~pomsky
['test']? lazy
~~~`,
    },
    kind: languages.CompletionItemKind.Keyword,
  },
  {
    label: 'greedy',
    detail: 'keyword',
    documentation: {
      value: `Keyword to make the previous repetition greedy. Opposite of \`lazy\`.
Since \`greedy\` is the default, you only need this when you enabled \`lazy\` mode.

### Example:
~~~pomsky
enable lazy;
['test']? greedy
~~~`,
    },
    kind: languages.CompletionItemKind.Keyword,
  },
  // TODO: only show after range
  {
    label: 'base',
    detail: 'keyword',
    documentation: {
      value: `Comes after a \`range\` expression to set the number base, e.g. 16 for hexadecimal.
      
### Example:
~~~pomsky
range '0'-'FFF' base 16
~~~`,
    },
    kind: languages.CompletionItemKind.Keyword,
  },
])

const charSetSnippets: languages.CompletionItem[] = [
  ...prepareChars([
    ['n', 'The _newline_ character `\\n`'],
    ['r', 'The _carriage_ return character `\\n`'],
    ['f', 'The _line feed_ character `\\f`'],
    ['a', 'The _alert_ or _bell_ character `\\a`'],
    ['e', 'The _escape_ character `\\e`'],
  ]),
  ...unicodeCompletions('character class', [
    'word, w',
    'digit, d',
    'space, s',
    'horiz_space, h',
    'vert_space, v',
    'ascii',
    'ascii_alpha',
    'ascii_alnum',
    'ascii_blank',
    'ascii_cntrl',
    'ascii_digit',
    'ascii_graph',
    'ascii_lower',
    'ascii_print',
    'ascii_punct',
    'ascii_space',
    'ascii_upper',
    'ascii_word',
    'ascii_xdigit',
  ]),
  ...unicodeCompletions('general category', [
    'Cased_Letter, LC',
    'Close_Punctuation, Pe',
    'Connector_Punctuation, Pc',
    'Control, Cc, cntrl',
    'Currency_Symbol, Sc',
    'Dash_Punctuation, Pd',
    'Decimal_Number, Nd, digit, d',
    'Enclosing_Mark, Me',
    'Final_Punctuation, Pf',
    'Format, Cf',
    'Initial_Punctuation, Pi',
    'Letter, L',
    'Letter_Number, Nl',
    'Line_Separator, Zl',
    'Lowercase_Letter, Ll',
    'Mark, M, Combining_Mark',
    'Math_Symbol, Sm',
    'Modifier_Letter, Lm',
    'Modifier_Symbol, Sk',
    'Nonspacing_Mark, Mn',
    'Number, N',
    'Open_Punctuation, Ps',
    'Other, C',
    'Other_Letter, Lo',
    'Other_Number, No',
    'Other_Punctuation, Po',
    'Other_Symbol, So',
    'Paragraph_Separator, Zp',
    'Private_Use, Co',
    'Punctuation, P, punct',
    'Separator, Z, space, s',
    'Space_Separator, Zs',
    'Spacing_Mark, Mc',
    'Surrogate, Cs',
    'Symbol, S',
    'Titlecase_Letter, Lt',
    'Unassigned, Cn',
    'Uppercase_Letter, Lu',
  ]),
  ...unicodeCompletions('script', [
    'Adlam, Adlm',
    'Ahom',
    'Anatolian_Hieroglyphs, Hluw',
    'Arabic, Arab',
    'Armenian, Armn',
    'Avestan, Avst',
    'Balinese, Bali',
    'Bamum, Bamu',
    'Bassa_Vah, Bass',
    'Batak, Batk',
    'Bengali, Beng',
    'Bhaiksuki, Bhks',
    'Bopomofo, Bopo',
    'Brahmi, Brah',
    'Braille, Brai',
    'Buginese, Bugi',
    'Buhid, Buhd',
    'Canadian_Aboriginal, Cans',
    'Carian, Cari',
    'Caucasian_Albanian, Aghb',
    'Chakma, Cakm',
    'Cham',
    'Chorasmian, Chrs',
    'Cherokee, Cher',
    'Common, Zyyy',
    'Coptic, Copt',
    'Cuneiform, Xsux',
    'Cypriot, Cprt',
    'Cypro_Minoan, Cpmn',
    'Cyrillic, Cyrl',
    'Deseret, Dsrt',
    'Devanagari, Deva',
    'Dives_Akuru, Diak',
    'Dogra, Dogr',
    'Duployan, Dupl',
    'Egyptian_Hieroglyphs, Egyp',
    'Elbasan, Elba',
    'Elymaic, Elym',
    'Ethiopic, Ethi',
    'Georgian, Geor',
    'Glagolitic, Glag',
    'Gothic, Goth',
    'Grantha, Gran',
    'Greek, Grek',
    'Gujarati, Gujr',
    'Gunjala_Gondi, Gong',
    'Gurmukhi, Guru',
    'Han, Hani',
    'Hangul, Hang',
    'Hanifi_Rohingya, Rohg',
    'Hanunoo, Hano',
    'Hatran, Hatr',
    'Hebrew, Hebr',
    'Hiragana, Hira',
    'Imperial_Aramaic, Armi',
    'Inherited, Zinh',
    'Inscriptional_Pahlavi, Phli',
    'Inscriptional_Parthian, Prti',
    'Javanese, Java',
    'Kaithi, Kthi',
    'Kannada, Knda',
    'Katakana, Kana',
    'Kayah_Li, Kali',
    'Kharoshthi, Khar',
    'Khitan_Small_Script, Kits',
    'Khmer, Khmr',
    'Khojki, Khoj',
    'Khudawadi, Sind',
    'Lao, Laoo',
    'Latin, Latn',
    'Lepcha, Lepc',
    'Limbu, Limb',
    'Linear_A, Lina',
    'Linear_B, Linb',
    'Lisu',
    'Lycian, Lyci',
    'Lydian, Lydi',
    'Mahajani, Mahj',
    'Makasar, Maka',
    'Malayalam, Mlym',
    'Mandaic, Mand',
    'Manichaean, Mani',
    'Marchen, Marc',
    'Medefaidrin, Medf',
    'Masaram_Gondi, Gonm',
    'Meetei_Mayek, Mtei',
    'Mende_Kikakui, Mend',
    'Meroitic_Cursive, Merc',
    'Meroitic_Hieroglyphs, Mero',
    'Miao, Plrd',
    'Modi',
    'Mongolian, Mong',
    'Mro, Mroo',
    'Multani, Mult',
    'Myanmar, Mymr',
    'Nabataean, Nbat',
    'Nandinagari, Nand',
    'New_Tai_Lue, Talu',
    'Newa',
    'Nko, Nkoo',
    'Nushu, Nshu',
    'Nyiakeng_Puachue_Hmong, Hmnp',
    'Ogham, Ogam',
    'Ol_Chiki, Olck',
    'Old_Hungarian, Hung',
    'Old_Italic, Ital',
    'Old_North_Arabian, Narb',
    'Old_Permic, Perm',
    'Old_Persian, Xpeo',
    'Old_Sogdian, Sogo',
    'Old_South_Arabian, Sarb',
    'Old_Turkic, Orkh',
    'Old_Uyghur, Ougr',
    'Oriya, Orya',
    'Osage, Osge',
    'Osmanya, Osma',
    'Pahawh_Hmong, Hmng',
    'Palmyrene, Palm',
    'Pau_Cin_Hau, Pauc',
    'Phags_Pa, Phag',
    'Phoenician, Phnx',
    'Psalter_Pahlavi, Phlp',
    'Rejang, Rjng',
    'Runic, Runr',
    'Samaritan, Samr',
    'Saurashtra, Saur',
    'Sharada, Shrd',
    'Shavian, Shaw',
    'Siddham, Sidd',
    'SignWriting, Sgnw',
    'Sinhala, Sinh',
    'Sogdian, Sogd',
    'Sora_Sompeng, Sora',
    'Soyombo, Soyo',
    'Sundanese, Sund',
    'Syloti_Nagri, Sylo',
    'Syriac, Syrc',
    'Tagalog, Tglg',
    'Tagbanwa, Tagb',
    'Tai_Le, Tale',
    'Tai_Tham, Lana',
    'Tai_Viet, Tavt',
    'Takri, Takr',
    'Tamil, Taml',
    'Tangsa, Tnsa',
    'Tangut, Tang',
    'Telugu, Telu',
    'Thaana, Thaa',
    'Thai',
    'Tibetan, Tibt',
    'Tifinagh, Tfng',
    'Tirhuta, Tirh',
    'Toto',
    'Ugaritic, Ugar',
    'Vai, Vaii',
    'Vithkuqi, Vith',
    'Wancho, Wcho',
    'Warang_Citi, Wara',
    'Yezidi, Yezi',
    'Yi, Yiii',
    'Zanabazar_Square, Zanb',
  ]),
  ...unicodeCompletions('block', [
    'InBasic_Latin',
    'InLatin_1_Supplement',
    'InLatin_Extended_A',
    'InLatin_Extended_B',
    'InIPA_Extensions',
    'InSpacing_Modifier_Letters',
    'InCombining_Diacritical_Marks',
    'InGreek_and_Coptic',
    'InCyrillic',
    'InCyrillic_Supplementary',
    'InArmenian',
    'InHebrew',
    'InArabic',
    'InSyriac',
    'InThaana',
    'InDevanagari',
    'InBengali',
    'InGurmukhi',
    'InGujarati',
    'InOriya',
    'InTamil',
    'InTelugu',
    'InKannada',
    'InMalayalam',
    'InSinhala',
    'InThai',
    'InLao',
    'InTibetan',
    'InMyanmar',
    'InGeorgian',
    'InHangul_Jamo',
    'InEthiopic',
    'InCherokee',
    'InUnified_Canadian_Aboriginal_Syllabics',
    'InOgham',
    'InRunic',
    'InTagalog',
    'InHanunoo',
    'InBuhid',
    'InTagbanwa',
    'InKhmer',
    'InMongolian',
    'InLimbu',
    'InTai_Le',
    'InKhmer_Symbols',
    'InPhonetic_Extensions',
    'InLatin_Extended_Additional',
    'InGreek_Extended',
    'InGeneral_Punctuation',
    'InSuperscripts_and_Subscripts',
    'InCurrency_Symbols',
    'InCombining_Diacritical_Marks_for_Symbols',
    'InLetterlike_Symbols',
    'InNumber_Forms',
    'InArrows',
    'InMathematical_Operators',
    'InMiscellaneous_Technical',
    'InControl_Pictures',
    'InOptical_Character_Recognition',
    'InEnclosed_Alphanumerics',
    'InBox_Drawing',
    'InBlock_Elements',
    'InGeometric_Shapes',
    'InMiscellaneous_Symbols',
    'InDingbats',
    'InMiscellaneous_Mathematical_Symbols_A',
    'InSupplemental_Arrows_A',
    'InBraille_Patterns',
    'InSupplemental_Arrows_B',
    'InMiscellaneous_Mathematical_Symbols_B',
    'InSupplemental_Mathematical_Operators',
    'InMiscellaneous_Symbols_and_Arrows',
    'InCJK_Radicals_Supplement',
    'InKangxi_Radicals',
    'InIdeographic_Description_Characters',
    'InCJK_Symbols_and_Punctuation',
    'InHiragana',
    'InKatakana',
    'InBopomofo',
    'InHangul_Compatibility_Jamo',
    'InKanbun',
    'InBopomofo_Extended',
    'InKatakana_Phonetic_Extensions',
    'InEnclosed_CJK_Letters_and_Months',
    'InCJK_Compatibility',
    'InCJK_Unified_Ideographs_Extension_A',
    'InYijing_Hexagram_Symbols',
    'InCJK_Unified_Ideographs',
    'InYi_Syllables',
    'InYi_Radicals',
    'InHangul_Syllables',
    'InHigh_Surrogates',
    'InHigh_Private_Use_Surrogates',
    'InLow_Surrogates',
    'InPrivate_Use_Area',
    'InCJK_Compatibility_Ideographs',
    'InAlphabetic_Presentation_Forms',
    'InArabic_Presentation_Forms_A',
    'InVariation_Selectors',
    'InCombining_Half_Marks',
    'InCJK_Compatibility_Forms',
    'InSmall_Form_Variants',
    'InArabic_Presentation_Forms_B',
    'InHalfwidth_and_Fullwidth_Forms',
    'InSpecials',
  ]),
  ...unicodeCompletions('property', [
    'White_Space',
    'Alphabetic, Alpha',
    'Noncharacter_Code_Point',
    'Default_Ignorable_Code_Point',
    'Logical_Order_Exception',
    'Deprecated',
    'Variation_Selector',
    'Uppercase, upper',
    'Lowercase, lower',
    'Soft_Dotted',
    'Case_Ignorable',
    'Changes_When_Lowercased',
    'Changes_When_Uppercased',
    'Changes_When_Titlecased',
    'Changes_When_Casefolded',
    'Changes_When_Casemapped',
    'Emoji',
    'Emoji_Presentation',
    'Emoji_Modifier',
    'Emoji_Modifier_Base',
    'Emoji_Component',
    'Extended_Pictographic',
    'Hex_Digit',
    'ASCII_Hex_Digit',
    'Join_Control',
    'Joining_Group',
    'Bidi_Control',
    'Bidi_Mirrored',
    'Bidi_Mirroring_Glyph',
    'ID_Continue',
    'ID_Start',
    'XID_Continue',
    'XID_Start',
    'Pattern_Syntax',
    'Pattern_White_Space',
    'Ideographic',
    'Unified_Ideograph',
    'Radical',
    'IDS_Binary_Operator',
    'IDS_Trinary_Operator',
    'Math',
    'Quotation_Mark',
    'Dash',
    'Sentence_Terminal',
    'Terminal_Punctuation',
    'Diacritic',
    'Extender',
    'Grapheme_Base',
    'Grapheme_Extend',
    'Regional_Indicator',
  ]),
]

function detailedCompletions(snippets: Snippet[]): languages.CompletionItem[] {
  return snippets.map(({ label, insertText, insertTextRules, documentation, detail, kind }) => ({
    kind: kind ?? languages.CompletionItemKind.Text,
    label,
    insertText: insertText ?? label,
    insertTextRules,
    documentation,
    range: completionRange,
    detail,
  }))
}

function unicodeCompletions(name: string, items: string[]): languages.CompletionItem[] {
  return items.flatMap((item): languages.CompletionItem[] => {
    const [first, ...rest] = item.split(', ')
    return [
      {
        label: first,
        insertText: first,
        detail: name,
        documentation: {
          value: `The \`${first}\` ${name}`,
        },
        range: completionRange,
        kind: languages.CompletionItemKind.Constant,
      },
      ...rest.map((label) => ({
        label,
        insertText: label,
        detail: name,
        documentation: {
          value: `Alias for the \`${first}\` ${name}`,
        },
        range: completionRange,
        kind: languages.CompletionItemKind.Constant,
      })),
    ]
  })
}

function prepareChars(items: [string, string][]): languages.CompletionItem[] {
  return items.map(
    ([label, documentation]): languages.CompletionItem => ({
      label,
      insertText: label,
      detail: 'character',
      documentation: { value: documentation },
      kind: languages.CompletionItemKind.Text,
      range: completionRange,
    }),
  )
}

export const completionItems: languages.CompletionItemProvider = {
  provideCompletionItems(model, position) {
    const value = model.getValue()
    const tokens = tokenizePomsky(value)

    const offset = model.getOffsetAt(position)
    let tokenIndex = findClosestTokenIndex(tokens, offset)
    let isInCharClass = false

    if (tokenIndex < tokens.length) {
      // don't show completions within strings or multi-char sigils such as `<<`
      const token = tokens[tokenIndex]
      if (token[0] !== 'Identifier' && offset > token[1] && offset < token[2]) return

      isInCharClass = isInCharacterSet(tokens, tokenIndex, offset)
    }

    const wordModel = model.getWordAtPosition(position)

    // This implicitly updates all snippets, which reference this object
    completionRange.startColumn = wordModel?.startColumn ?? position.column
    completionRange.endColumn = wordModel?.endColumn ?? position.column
    completionRange.startLineNumber = position.lineNumber
    completionRange.endLineNumber = position.lineNumber

    const suggestions = isInCharClass
      ? charSetSnippets
      : [
          ...[...new Set([...value.matchAll(/\blet (\w+)/gi)].map((x) => x[1]))].map(
            (word): languages.CompletionItem => ({
              kind: languages.CompletionItemKind.Variable,
              label: word,
              insertText: word,
              detail: 'variable',
              range: completionRange,
            }),
          ),
          ...globalSnippets,
        ]

    return { suggestions }
  },
}
