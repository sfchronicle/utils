# utils
Importable util functions for our templates

This package includes some helpful functions that you can use across SFC projects

The `copy` directory includes the standard ways we copy data from sheets and docs into project data directories. If the sheets command is giving you trouble with types in GraphQL, please note that you can force the command to return only strings by setting the third param to `true`: 

```
googleAuth(project, null, true)
```

`brands.js` has all the LESS settings that are specific to each brand. They are applied to the project in `gatsby-config.js` using the modifyVars config option. Since it's done at build time, we can only make brand distinctions by deployable market. We cannot use this same override strategy to make a style change between CTPost and New Haven Register, for example (since they are both CT market).

`nav.js` and `footer.js` both export the HTML needed for each markets' nav and footer settings. The styles controlling the actual look of these features exists at the project level.

`topper.js` implements a cool standardized set of topper options. Great for templates! If story_settings is configured with the right columns, this should be standard across projects.

`blueconic.js` handles the mapping of domains to the arbitrary string that the blueconic script lives on. Why is there an arbitrary string instead of a standard one? Maybe blueconic.houstonchronicle.com, for example? No one knows.

`settings.js` reconciles the project-config.json file and a story_settings sheet (if present) into a single standard object.

`specialnav.js` is a cool variant of `nav.js` that gives it a floating style for special projects, but works the same way.

## Install
```
npm i git+https://github.com/sfchronicle/utils.git
```

## Import the functions

```
import { blendHDN, getSettings, appCheck } from 'sfc-utils'
```

## Use them

```
let isApp = appCheck()
```

## Troubleshooting

If you get a message about a new function not existing in your project, you might need to force a reinstall of this package. The best way to do that is to completely uninstall it and then reinstall it:

```
npm uninstall sfc-utils && npm i git+https://github.com/sfchronicle/utils.git
```
