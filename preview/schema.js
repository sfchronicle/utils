const toLabel = (columnName) =>
  columnName.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const toKebabCase = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();

const toCamelCase = (value) =>
  value.replace(/_([a-z0-9])/g, (_match, char) => char.toUpperCase());

const inferFieldType = (columnName) => {
  const normalized = columnName.toLowerCase();
  if (normalized.includes('date')) return 'text';
  if (normalized.includes('alt')) return 'text';
  if (normalized.includes('url')) return 'url';
  if (normalized.includes('link')) return 'url';
  if (normalized === 'image_url' || normalized.endsWith('_image_url')) {
    return 'url';
  }
  if (normalized.includes('text')) return 'textarea';
  if (normalized.includes('graf')) return 'textarea';
  if (normalized.includes('caption')) return 'textarea';
  return 'text';
};

const createDefaultItemFromSheetRows = (
  rows = [],
  fallbackColumns = [],
) => {
  const firstRow = rows.find((row) => row && Object.keys(row).length > 0);
  const columns = firstRow ? Object.keys(firstRow) : fallbackColumns;

  return columns.reduce(
    (defaultItem, columnName) => ({
      ...defaultItem,
      [columnName]: '',
    }),
    {},
  );
};

const getColumnsFromRows = (rows = [], fallbackColumns = []) => {
  const firstRow = rows.find((row) => row && Object.keys(row).length > 0);
  return firstRow ? Object.keys(firstRow) : fallbackColumns;
};

const createDefaultRowsFromSheetRows = (
  rows = [],
  fallbackColumns = [],
) => {
  const columns = getColumnsFromRows(rows, fallbackColumns);

  return rows
    .slice(1)
    .map((row) =>
      columns.reduce(
        (values, columnName) => ({
          ...values,
          [columnName]: row?.[columnName] || '',
        }),
        {},
      ),
    )
    .filter((row) => Object.values(row).some(Boolean));
};

const createFieldsFromColumns = ({
  columns,
  fieldOverrides = {},
  sheetName,
  getValidationOptions,
}) =>
  columns.map((columnName) => {
    const override = fieldOverrides[columnName] || {};
    const options = getValidationOptions(sheetName, columnName);
    const type =
      override.type || (options ? 'select' : inferFieldType(columnName));

    return {
      id: override.id || `${sheetName}-${columnName}`,
      label: override.label || toLabel(columnName),
      type,
      columnName,
      ...(columnName.toLowerCase().includes('date')
        ? {
            placeholder: 'Month D, YYYY H:MM AM',
            validator: 'sheetDate',
          }
        : {}),
      ...(options ? { options } : {}),
      ...override,
    };
  });

function createPreviewSchemaHelpers({ isEnabled = true, getValidationOptions = () => null } = {}) {
  const createSheetCollectionPreviewSchema = ({
    id,
    title,
    source,
    path,
    sheetName,
    rowStartIndex = 3,
    defaultItem,
    fieldOverrides = {},
  }) => {
    if (!isEnabled) return null;

    const fields = createFieldsFromColumns({
      columns: Object.keys(defaultItem),
      fieldOverrides,
      sheetName,
      getValidationOptions,
    });

    return {
      id,
      title,
      type: 'collection',
      source,
      path,
      sheetName,
      rowStartIndex,
      defaultItem,
      fields,
    };
  };

  const createPreviewSchemaFromComponentConfig = ({
    fieldOverrides = {}, // Optional overrides for field properties like id, label, type, etc.
    previewConfig,
    rows = [],
  }) => {
    if (!isEnabled || !previewConfig?.sheetName) return null;

    const {
      sheetName,
      type,
      source = toCamelCase(sheetName),
      path = type === 'collection' ? `${source}.items` : source,
      rowStartIndex = type === 'collection' ? 3 : 2,
      title = toLabel(sheetName),
      id = toKebabCase(source),
    } = previewConfig;
    const columns = getColumnsFromRows(rows);
    const fields = createFieldsFromColumns({
      columns,
      fieldOverrides,
      sheetName,
      getValidationOptions,
    });

    if (type === 'settings') {
      return {
        id,
        title,
        fields: fields.map((field) => ({
          ...field,
          source,
          path: `${source}.${field.columnName}`,
          sheetName,
          rowIndex: rowStartIndex,
        })),
      };
    }

    return {
      id,
      title,
      type: 'collection',
      source,
      path,
      sheetName,
      rowStartIndex,
      defaultItem: createDefaultItemFromSheetRows(rows, columns),
      defaultRows: createDefaultRowsFromSheetRows(rows, columns),
      fields,
    };
  };

  return { createSheetCollectionPreviewSchema, createPreviewSchemaFromComponentConfig };
}

module.exports = { createDefaultItemFromSheetRows, createDefaultRowsFromSheetRows, createPreviewSchemaHelpers };
