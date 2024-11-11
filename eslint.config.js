import js from '@eslint/js';
import { fixupPluginRules } from '@eslint/compat';
import jsGlobals from 'globals';
import rnConfig from '@react-native/eslint-config';
import commentsPlugin from 'eslint-plugin-eslint-comments';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import intellicodeReactHooksPlugin from 'eslint-plugin-react-native';
import facebookReactNativePlugin from '@react-native/eslint-plugin';
import jestPlugin from 'eslint-plugin-jest';
import ftFlowPlugin from 'eslint-plugin-ft-flow';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';

import babelParser from '@babel/eslint-parser';
import typescriptParser from '@typescript-eslint/parser';

const { parserOptions, plugins, settings, overrides, globals, rules } =
  rnConfig;

function findParser(name) {
  switch (name) {
    case '@babel/eslint-parser':
      return babelParser;
    case '@typescript-eslint/parser':
      return typescriptParser;
    default:
      throw new Error(`Cannot find an eslint parser for ${name}`);
  }
}

function findPlugin(name) {
  switch (name) {
    case 'eslint-comments':
      return commentsPlugin;
    case 'react':
      return reactPlugin;
    case 'react-hooks':
      return reactHooksPlugin;
    case 'react-native':
      // ref: https://github.com/Intellicode/eslint-plugin-react-native/issues/333#issuecomment-2150582430
      return fixupPluginRules(intellicodeReactHooksPlugin);
    case '@react-native':
      return facebookReactNativePlugin;
    case 'jest':
      return jestPlugin;
    case 'ft-flow':
      return ftFlowPlugin;
    case '@typescript-eslint/eslint-plugin':
      return typescriptPlugin;
    default:
      throw new Error(`Cannot find an eslint plugin for ${name}`);
  }
}

function fixupPlugins(array) {
  return Object.fromEntries(
    array.map((plugin) => [plugin, findPlugin(plugin)]),
  );
}

function fixupConfig(config) {
  const { parser, ...base } = config;
  const override = {};

  if (parser != null) {
    override.languageOptions = { parser: findParser(parser) };
  }

  if (config.plugins != null) {
    override.plugins = fixupPlugins(config.plugins);
  }

  return { ...base, ...override };
}

export default [
  js.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions,
      globals: { ...jsGlobals.browser, ...globals },
    },
    plugins: fixupPlugins(plugins),
    settings,
    rules,
  },
  {
    rules: {
      'object-curly-spacing': ['warn', 'always'],
      'array-bracket-spacing': ['warn', 'never'],
      'computed-property-spacing': ['warn', 'never'],
    },
  },
  ...overrides.map(fixupConfig),
];
