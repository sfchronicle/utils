const getPathValue = (object, path, fallback = '') => {
  const value = path.split('.').reduce((current, key) => {
    if (current === null || typeof current === 'undefined') return undefined;
    return current[key];
  }, object);

  return typeof value === 'undefined' || value === null ? fallback : value;
};

// The caller supplies React so the provider and project use the same instance.
const PREVIEW_CONFIG_PROTOCOL_VERSION = 1;
const noDynamicSections = async () => [];
const noValidation = () => null;
const PREVIEW_CONFIG_MESSAGE_TYPE = 'devhub-preview-config:update';
const PREVIEW_CONFIG_FOCUS_FIELD_TYPE = 'devhub-preview-config:focus-field';

function createPreviewConfigRuntime(React) {
  const { useContext, useEffect, useMemo, useState } = React;
  const PreviewConfigContext = React.createContext(null);
  const usePreviewConfig = () => useContext(PreviewConfigContext);
  const usePreviewValue = (path, fallback = '') => {
    const preview = usePreviewConfig();
    return preview ? preview.getValue(path, fallback) : fallback;
  };

const getConfigFields = (sections) =>
  sections.flatMap((section) =>
    section.type === 'collection'
      ? []
      : section.fields.map((field) => ({ ...field, sectionId: section.id })),
  );

const getConfigCollections = (sections) =>
  sections.filter((section) => section.type === 'collection');

const mergeSections = (baseSections, dynamicSections) => {
  const existingIds = new Set(baseSections.map((section) => section.id));
  return [
    ...baseSections,
    ...dynamicSections.filter((section) => !existingIds.has(section.id)),
  ];
};

const clone = (value) => JSON.parse(JSON.stringify(value || {}));

const setPathValue = (object, path, value) => {
  const keys = path.split('.');
  const next = { ...object };
  let cursor = next;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }

    cursor[key] = Array.isArray(cursor[key])
      ? [...cursor[key]]
      : { ...(cursor[key] || {}) };
    cursor = cursor[key];
  });

  return next;
};

const addCollectionDefaults = (config, sections) =>
  sections.reduce((nextConfig, section) => {
    if (section.type !== 'collection') return nextConfig;
    if (getPathValue(nextConfig, section.path, null) !== null) {
      return nextConfig;
    }

    return setPathValue(
      nextConfig,
      section.path,
      clone(section.defaultRows || []),
    );
  }, config);

const normalizeValue = (value) => {
  if (typeof value === 'undefined' || value === null) return '';
  return String(value);
};

const createOriginalValues = (config, fields) =>
  fields.reduce((values, field) => {
    values[field.id] = normalizeValue(getPathValue(config, field.path));
    return values;
  }, {});

const getCollectionRows = (section, config) =>
  getPathValue(config, section.path, []).map((row) =>
    section.fields.reduce((values, field) => {
      values[field.columnName] = normalizeValue(row?.[field.columnName]);
      return values;
    }, {}),
  );

const createOriginalCollections = (config, collections) =>
  collections.reduce((values, section) => {
    values[section.id] = getCollectionRows(section, config);
    return values;
  }, {});

const rowsAreEqual = (rows, originalRows) =>
  JSON.stringify(rows) === JSON.stringify(originalRows || []);

const getEditableProps = (fieldId) =>
  fieldId
    ? {
        'data-preview-field-id': fieldId,
        title: 'Double-click to edit this field',
      }
    : {};

const createValidationResults = (config, fields, validateField) =>
  fields.reduce((results, field) => {
    const result = validateField(field, getPathValue(config, field.path), config);
    if (result) {
      results[field.id] = result;
    }
    return results;
  }, {});

const PreviewConfigProvider = ({
  children,
  listenForFrameUpdates = false,
  meta,
  initialConfig: sourceConfig,
  baseSections = [],
  getDynamicConfigSections = noDynamicSections,
  validateField = noValidation,
}) => {
  const initialConfig = useMemo(() => clone(sourceConfig), []);
  const [configSections, setConfigSections] = useState(baseSections);
  const configFields = useMemo(
    () => getConfigFields(configSections),
    [configSections],
  );
  const configCollections = useMemo(
    () => getConfigCollections(configSections),
    [configSections],
  );
  const [originalValues, setOriginalValues] = useState(() =>
    createOriginalValues(initialConfig, configFields),
  );
  const [originalCollections, setOriginalCollections] = useState(() =>
    createOriginalCollections(initialConfig, configCollections),
  );
  const [config, setConfig] = useState(initialConfig);
  const [dirtyFields, setDirtyFields] = useState({});
  const validationResults = useMemo(
    () => createValidationResults(config, configFields, validateField),
    [config, configFields, validateField],
  );

  useEffect(() => {
    let mounted = true;

    getDynamicConfigSections().then((dynamicSections) => {
      if (!mounted || dynamicSections.length === 0) return;
      setConfigSections((current) => mergeSections(current, dynamicSections));
      setConfig((current) => addCollectionDefaults(current, dynamicSections));
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setOriginalValues((current) => ({
      ...createOriginalValues(initialConfig, configFields),
      ...current,
    }));
    setOriginalCollections((current) => ({
      ...createOriginalCollections(initialConfig, configCollections),
      ...current,
    }));
  }, [configCollections, configFields, initialConfig]);

  useEffect(() => {
    if (!listenForFrameUpdates || typeof window === 'undefined') {
      return undefined;
    }

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type !== PREVIEW_CONFIG_MESSAGE_TYPE) return;
      if (!event.data.config) return;

      setConfig(event.data.config);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [listenForFrameUpdates]);

  const setFieldValue = (field, rawValue) => {
    const value =
      field.type === 'boolean'
        ? rawValue
          ? field.trueValue || 'TRUE'
          : field.falseValue || 'FALSE'
        : rawValue;

    let nextConfig;
    setConfig((current) => {
      nextConfig = setPathValue(current, field.path, value);
      return nextConfig;
    });
    setDirtyFields((current) => {
      const normalizedValue = normalizeValue(value);
      const originalValue = originalValues[field.id] || '';
      const validationResult = validateField(field, value, nextConfig || config);
      const next = { ...current };

      if (normalizedValue === originalValue) {
        delete next[field.id];
        return next;
      }

      next[field.id] = {
        id: field.id,
        label: field.label,
        sheetName: field.sheetName,
        columnName: field.columnName,
        rowIndex: field.rowIndex,
        value,
        hasError: validationResult?.level === 'error',
        originalValue,
        saveable: field.saveable !== false && Boolean(field.sheetName),
      };
      return next;
    });
  };

  const setCollectionItems = (section, items) => {
    let nextConfig;
    setConfig((current) => {
      nextConfig = setPathValue(current, section.path, items);
      return nextConfig;
    });
    setDirtyFields((current) => {
      const rows = getCollectionRows(section, nextConfig || config);
      const originalRows = originalCollections[section.id] || [];
      const next = { ...current };

      if (rowsAreEqual(rows, originalRows)) {
        delete next[section.id];
        return next;
      }

      next[section.id] = {
        id: section.id,
        label: section.title,
        sheetName: section.sheetName,
        type: 'rows',
        rowStartIndex: section.rowStartIndex || 2,
        columns: section.fields.map((field) => field.columnName),
        rows,
        originalRows,
        saveable: true,
      };
      return next;
    });
  };

  const setCollectionFieldValue = (section, itemIndex, field, rawValue) => {
    const items = getPathValue(config, section.path, []);
    const nextItems = items.map((item, index) =>
      index === itemIndex
        ? { ...item, [field.columnName]: rawValue }
        : { ...item },
    );
    setCollectionItems(section, nextItems);
  };

  const addCollectionItem = (section) => {
    const items = getPathValue(config, section.path, []);
    setCollectionItems(section, [...items, { ...section.defaultItem }]);
  };

  const removeCollectionItem = (section, itemIndex) => {
    const items = getPathValue(config, section.path, []);
    setCollectionItems(
      section,
      items.filter((_item, index) => index !== itemIndex),
    );
  };

  const markSaved = (savedIds) => {
    setOriginalValues((current) => {
      const next = { ...current };
      savedIds.forEach((id) => {
        const field = configFields.find((configField) => configField.id === id);
        if (field) {
          next[id] = normalizeValue(getPathValue(config, field.path));
        }
      });
      return next;
    });
    setOriginalCollections((current) => {
      const next = { ...current };
      savedIds.forEach((id) => {
        const collection = configCollections.find(
          (section) => section.id === id,
        );
        if (collection) {
          next[id] = getCollectionRows(collection, config);
        }
      });
      return next;
    });
    setDirtyFields((current) => {
      const next = { ...current };
      savedIds.forEach((id) => {
        delete next[id];
      });
      return next;
    });
  };

  const value = useMemo(
    () => ({
      config,
      dirtyFields,
      fields: configFields,
      sections: configSections,
      addCollectionItem,
      getEditableProps,
      getValue: (path, fallback = '') => getPathValue(config, path, fallback),
      meta,
      markSaved,
      removeCollectionItem,
      setCollectionFieldValue,
      setFieldValue,
      validationResults,
    }),
    [
      config,
      configFields,
      configSections,
      dirtyFields,
      meta,
      originalCollections,
      originalValues,
      validationResults,
      validateField,
    ],
  );

  return React.createElement(PreviewConfigContext.Provider, { value }, children);
};

return { PreviewConfigContext, PreviewConfigProvider, usePreviewConfig, usePreviewValue };
}

module.exports = { createPreviewConfigRuntime, getPathValue, PREVIEW_CONFIG_MESSAGE_TYPE, PREVIEW_CONFIG_FOCUS_FIELD_TYPE, PREVIEW_CONFIG_PROTOCOL_VERSION };
