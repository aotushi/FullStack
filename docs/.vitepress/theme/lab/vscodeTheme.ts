import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

const palette = {
  background: "#1e1e1e",
  foreground: "#d4d4d4",
  gutter: "#252526",
  gutterForeground: "#858585",
  activeLine: "#2a2d2e",
  selection: "#264f78",
  cursor: "#aeafad",
  border: "#3c3c3c",
  keyword: "#569cd6",
  string: "#ce9178",
  number: "#b5cea8",
  function: "#dcdcaa",
  type: "#4ec9b0",
  variable: "#9cdcfe",
  property: "#9cdcfe",
  comment: "#6a9955",
  tag: "#569cd6",
  attribute: "#9cdcfe",
};

export const vscodeEditorTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      color: palette.foreground,
      backgroundColor: palette.background,
      fontSize: "13px",
    },
    ".cm-content": {
      caretColor: palette.cursor,
      fontFamily:
        '"Cascadia Code", "JetBrains Mono", "Fira Code", Consolas, "Liberation Mono", monospace',
      padding: "12px 0",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: palette.cursor,
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      backgroundColor: palette.selection,
    },
    ".cm-panels": {
      backgroundColor: palette.gutter,
      color: palette.foreground,
    },
    ".cm-gutters": {
      backgroundColor: palette.gutter,
      color: palette.gutterForeground,
      borderRight: `1px solid ${palette.border}`,
    },
    ".cm-activeLine": {
      backgroundColor: palette.activeLine,
    },
    ".cm-activeLineGutter": {
      backgroundColor: palette.activeLine,
      color: palette.foreground,
    },
    ".cm-foldPlaceholder": {
      borderColor: palette.border,
      backgroundColor: "#2d2d30",
      color: palette.foreground,
    },
    ".cm-tooltip": {
      border: `1px solid ${palette.border}`,
      backgroundColor: "#252526",
      color: palette.foreground,
    },
    ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
      backgroundColor: "#04395e",
      color: "#ffffff",
    },
  },
  { dark: true },
);

const vscodeHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: palette.keyword },
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: palette.variable },
  { tag: [tags.propertyName, tags.attributeName], color: palette.property },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: palette.function },
  { tag: [tags.labelName, tags.className, tags.typeName, tags.namespace], color: palette.type },
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: palette.number },
  { tag: [tags.definition(tags.name), tags.separator], color: palette.foreground },
  { tag: [tags.brace, tags.squareBracket, tags.paren], color: palette.foreground },
  { tag: [tags.annotation, tags.modifier, tags.operatorKeyword], color: palette.keyword },
  { tag: [tags.operator, tags.derefOperator, tags.arithmeticOperator, tags.logicOperator], color: palette.foreground },
  { tag: [tags.number, tags.bool, tags.null], color: palette.number },
  { tag: [tags.string, tags.special(tags.string), tags.regexp], color: palette.string },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: palette.comment },
  { tag: [tags.tagName], color: palette.tag },
  { tag: [tags.heading], color: palette.keyword, fontWeight: "bold" },
  { tag: [tags.emphasis], fontStyle: "italic" },
  { tag: [tags.strong], fontWeight: "bold" },
  { tag: [tags.link], color: "#3794ff", textDecoration: "underline" },
]);

export const vscodeSyntaxHighlighting = syntaxHighlighting(vscodeHighlightStyle);
