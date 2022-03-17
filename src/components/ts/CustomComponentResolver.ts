import type { ComponentResolver } from "unplugin-vue-components/types";

const components = [
  "Table",
  "Thead",
  "Tr",
  "Th",
  "Td",
  "Tcell",
  "List",
  "Input",
  "Textarea",
  "SearchInput",
  "Select",
  "Combobox",
  "Autocomplete",
];

export function CustomComponentResolver(options: any = {}): ComponentResolver {
  const { prefix = "" } = options;
  return {
    type: "component",
    resolve: (name: string) => {
      if (name.startsWith(prefix)) {
        const componentName = name.substring(prefix.length);
        if (components.includes(componentName)) {
          return {
            importName: componentName,
            path: "@/components/ts",
          };
        }
      }
    },
  };
}
