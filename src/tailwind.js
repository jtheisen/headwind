import resolveConfig from "tailwindcss/resolveConfig";
import { pluginNamespaces, pseudoPlugins } from "./tailwind-namespaces";

const fullConfig = resolveConfig({});

function getClassName(ns, value) {
  return value === "DEFAULT" ? ns : `${ns}-${value}`;
}

function combineClassNameParts(x, y) {
  if (!x) return y;
  if (!y) return x;
  return `${x}-${y}`;
}

let namespacesToPluginMapping = {};
let classNamespaces = {};
let classPlugins = {};
let ambiguousClassNamespaces = {};
let pluginToValues = {};

let haveClassAmbiguity = false;

function addFlattenedPluginValues(result, prefix, values) {
  for (const k in values) {
    const v = values[k];

    const c = combineClassNameParts(prefix, k);

    switch (typeof v) {
      case "object":
        addFlattenedPluginValues(result, c, v);
        break;
      case "string":
      case "number":
      case "bigint":
        result[c] = v;
        break;
      default:
    }
  }
}

function getFlattenedPluginValues(plugin) {
  const result = {};

  const config = fullConfig.theme[plugin] ?? pseudoPlugins[plugin];

  if (config) {
    addFlattenedPluginValues(result, undefined, config);
  }

  return result;
}

for (const plugin in pluginNamespaces) {
  const namespaces = pluginNamespaces[plugin];

  const pluginValues = (pluginToValues[plugin] =
    getFlattenedPluginValues(plugin));

  for (const ns of namespaces) {
    const plugins = (namespacesToPluginMapping[ns] ??= []);
    plugins.push(plugin);

    for (const value in pluginValues) {
      const cls = getClassName(ns, value);

      haveClassAmbiguity ||= !!classNamespaces[cls];

      classNamespaces[cls] = ns;
      classPlugins[cls] = plugin;
      const clsNamespaces = (ambiguousClassNamespaces[cls] ??= []);
      clsNamespaces.push(`${ns} by ${plugin}`);
    }
  }
}

const tailwindDiagnosticVariable = {
  fullConfig,
  pluginToValues,
  haveClassAmbiguity,
  namespacesToPluginMapping,
  ambiguousClassNamespaces,
};

window.tailwindDiagnosticVariable = tailwindDiagnosticVariable;

console.info(tailwindDiagnosticVariable);

//console.info(classToPluginMapping);

export function createTailwind() {
  function getCandidateNamespace(prefix) {
    if (!prefix) return undefined;

    let shortestClass;
    for (let c in namespacesToPluginMapping) {
      if (
        c.startsWith(prefix) &&
        (!shortestClass || shortestClass.length > c.length)
      ) {
        shortestClass = c;
      }
    }
    return shortestClass;
  }
  function getNamespaceForClass(cls) {
    return classNamespaces[cls];
  }

  return {
    fullConfig,
    getClassName,
    getCandidateNamespace,
    getPluginForClass(cls) {
      return classPlugins[cls];
    },
    getPluginsForNamespace(ns) {
      return namespacesToPluginMapping[ns];
    },
    getNamespaceForClass,
    findClassForNs(classList, ns) {
      return classList.findIndex((cls) => classNamespaces[cls] === ns);
    },
    getValuesForPlugin(plugin) {
      return pluginToValues[plugin];
    },
  };
}
