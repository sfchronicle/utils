const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createPreviewConfigRuntime, getPathValue, PREVIEW_CONFIG_PROTOCOL_VERSION } = require('./index');
const { createPreviewSchemaHelpers, createDefaultRowsFromSheetRows } = require('./schema');

function createReactHarness() {
  const state = [];
  let index = 0;
  const react = {
    createContext: () => ({ Provider: Symbol('provider') }),
    createElement: (type, props, children) => ({ type, props, children }),
    useContext: () => null,
    useEffect: () => {},
    useMemo: fn => fn(),
    useState(initial) {
      const slot = index++;
      if (!(slot in state)) state[slot] = typeof initial === 'function' ? initial() : initial;
      return [state[slot], next => { state[slot] = typeof next === 'function' ? next(state[slot]) : next; }];
    },
  };
  return { react, render(Component, props) { index = 0; return Component(props).props.value; } };
}

test('provider tracks edits, validates, and marks saved values', () => {
  const { react, render } = createReactHarness();
  const { PreviewConfigProvider } = createPreviewConfigRuntime(react);
  const field = { id: 'title', path: 'story.title', label: 'Title', sheetName: 'story', columnName: 'title' };
  const props = { initialConfig: { story: { title: 'before' } }, baseSections: [{ id: 'story', fields: [field] }], validateField: (_field, value) => value === 'bad' ? { level: 'error' } : null };
  let preview = render(PreviewConfigProvider, props);
  assert.equal(preview.getValue('story.title'), 'before');
  preview.setFieldValue(field, 'bad');
  preview = render(PreviewConfigProvider, props);
  assert.equal(preview.getValue('story.title'), 'bad');
  assert.equal(preview.dirtyFields.title.originalValue, 'before');
  assert.equal(preview.dirtyFields.title.hasError, true);
  preview.markSaved(['title']);
  preview = render(PreviewConfigProvider, props);
  assert.deepEqual(preview.dirtyFields, {});
  preview.setFieldValue(field, 'bad');
  preview = render(PreviewConfigProvider, props);
  assert.deepEqual(preview.dirtyFields, {});
});

test('schema uses adapter options, rows, and environment', () => {
  const helpers = createPreviewSchemaHelpers({ getValidationOptions: (sheet, col) => sheet === 'team' && col === 'Role' ? ['Editor', 'Writer'] : null });
  const section = helpers.createPreviewSchemaFromComponentConfig({ previewConfig: { sheetName: 'team', type: 'collection' }, rows: [{ Name: '', Role: '' }, { Name: 'A', Role: 'Editor' }] });
  assert.equal(section.fields[1].type, 'select');
  assert.deepEqual(section.fields[1].options, ['Editor', 'Writer']);
  assert.deepEqual(section.defaultRows, [{ Name: 'A', Role: 'Editor' }]);
  assert.deepEqual(createDefaultRowsFromSheetRows([{}, { x: '1' }], ['x']), [{ x: '1' }]);
  assert.equal(createPreviewSchemaHelpers({ isEnabled: false }).createPreviewSchemaFromComponentConfig({ previewConfig: { sheetName: 'team' } }), null);
});

test('path reads and protocol version are stable', () => {
  assert.equal(getPathValue({ story: { title: 'A' } }, 'story.title'), 'A');
  assert.equal(getPathValue({}, 'story.title', 'fallback'), 'fallback');
  assert.equal(PREVIEW_CONFIG_PROTOCOL_VERSION, 1);
});
