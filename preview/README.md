# Preview configuration runtime

This is an opt-in API for projects with live preview configuration. Existing
`sfc-utils` imports and projects are unaffected. Use the same React instance as
the application, and create the runtime once in a shared module:

```js
import React from 'react';
import { createPreviewConfigRuntime } from 'sfc-utils/preview';

export const { PreviewConfigProvider, usePreviewConfig, usePreviewValue } =
  createPreviewConfigRuntime(React);
```

Wrap the editing UI and its preview consumers with that provider. The project
passes `initialConfig`, `baseSections`, optional `meta`,
`getDynamicConfigSections` (an async function returning sections), and
`validateField(field, value, config)` (a validation result or `null`). It owns
loading sheet data, discovering Gatsby components, constructing the base
sections, and validating dates. The provider tracks edits and original values,
provides collection setters and `markSaved`, and exposes validation results.
`listenForFrameUpdates` accepts updates only from the same-origin parent frame.

The provider and hooks must come from the same call to
`createPreviewConfigRuntime`; making a runtime separately in each component
creates separate React contexts. Production callers should retain their existing
no-op context and should not include the editor runtime in production bundles.

Schema helpers are exported from `sfc-utils/preview/schema`:

```js
import { createPreviewSchemaHelpers } from 'sfc-utils/preview/schema';

const { createPreviewSchemaFromComponentConfig, createSheetCollectionPreviewSchema } =
  createPreviewSchemaHelpers({ isEnabled, getValidationOptions });
```

`getValidationOptions(sheetName, columnName)` returns an options array or
`null`. The module also exports `createDefaultItemFromSheetRows` and
`createDefaultRowsFromSheetRows`. No project-specific files or credentials are
read by these utilities.

The runtime exports `PREVIEW_CONFIG_PROTOCOL_VERSION` (currently 1),
`PREVIEW_CONFIG_MESSAGE_TYPE`, and `PREVIEW_CONFIG_FOCUS_FIELD_TYPE`. Version 1
preserves the existing message type and same-origin iframe behavior. A separate
cross-origin Launchpad protocol is not implemented by this package yet.
