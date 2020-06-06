const { readdirSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const StyleDictionary = require('style-dictionary');

const baseDir = `${__dirname}/tokens`;
const distDir = `${__dirname}/dist`;

// Create dist folder if not exist
if (!existsSync(distDir)){
  mkdirSync(distDir);
}

// Style dictionary format https://amzn.github.io/style-dictionary/#/api?id=registerformat
StyleDictionary.registerFormat({
  name: 'json/flat',
  formatter: (dictionary) => JSON.stringify(dictionary.allProperties, null, 2)
});

// Add a custom transform to the Style Dictionary Transforms can manipulate a property's name, value, or attributes
// https://amzn.github.io/style-dictionary/#/api?id=registertransform
StyleDictionary.registerTransform({
  name: 'size/pxToPt',
  type: 'value',
  matcher: (prop) => prop.value.match(/^[\d.]+px$/),
  transformer: (prop) => prop.value.replace(/px$/, 'pt')
});

StyleDictionary.registerTransform({
  name: 'size/pxToDp',
  type: 'value',
  matcher: (prop) => prop.value.match(/^[\d.]+px$/),
  transformer: (prop) => prop.value.replace(/px$/, 'dp')
});

// Add a custom transformGroup to the Style Dictionary, which is a group of transforms.
// https://amzn.github.io/style-dictionary/#/api?id=registertransformgroup
StyleDictionary.registerTransformGroup({
  name: 'tokens-scss',
  transforms: ['name/cti/kebab', 'time/seconds', 'size/px', 'color/css']
});

// Get all theme names in tokens/themes folder
const themes = readdirSync(`${baseDir}/themes/`, { withFileTypes: true })
  .filter(dir => dir.isDirectory())
  .map(dir => dir.name);

// Save theme names in json file
writeFileSync(`${distDir}/themes.json`, JSON.stringify({
  themes: themes
}));

// Build properties
StyleDictionary.extend(getConfig()).buildPlatform('web/scss');
// Build themes
themes.map(function (theme) {
  StyleDictionary.extend(getConfig(theme)).buildPlatform('web/scss');
});

// https://amzn.github.io/style-dictionary/#/config
function getConfig(theme = false) {
  const source = theme ? `${baseDir}/themes/${theme}` : `${baseDir}/properties`;
  const buildPath = theme ? `${distDir}/${theme}/` : `${distDir}/`;
  return {
    source: [`${source}/**/*.json`],
    platforms: {
      'web/scss': {
        transformGroup: 'scss',
        buildPath: `${buildPath}`,
        files: [
          {
            destination: 'tokens-map.scss',
            format: 'scss/map-flat',
            options: {
              showFileHeader: false
            }
          }
        ]
      }
    }
  };
}
