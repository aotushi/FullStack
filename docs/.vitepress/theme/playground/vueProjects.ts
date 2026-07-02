export interface VuePlaygroundManifest {
  id: string;
  title: string;
  description?: string;
  mainFile?: string;
  activeFile?: string;
}

export interface VuePlaygroundProject {
  manifest: VuePlaygroundManifest;
  files: Record<string, string>;
}

const topicRootManifestModules = import.meta.glob("/*/playgrounds/*/manifest.json", {
  eager: true,
  import: "default",
}) as Record<string, VuePlaygroundManifest>;

const topicSectionManifestModules = import.meta.glob("/*/*/playgrounds/*/manifest.json", {
  eager: true,
  import: "default",
}) as Record<string, VuePlaygroundManifest>;

const topicDeepManifestModules = import.meta.glob("/*/*/*/playgrounds/*/manifest.json", {
  eager: true,
  import: "default",
}) as Record<string, VuePlaygroundManifest>;

const playgroundFileModules = import.meta.glob(
  [
    "/*/playgrounds/*/**/*.{vue,ts,js,css,html,json}",
    "/*/playgrounds/*/*.{vue,ts,js,css,html,json}",
    "/*/*/playgrounds/*/**/*.{vue,ts,js,css,html,json}",
    "/*/*/playgrounds/*/*.{vue,ts,js,css,html,json}",
    "/*/*/*/playgrounds/*/**/*.{vue,ts,js,css,html,json}",
    "/*/*/*/playgrounds/*/*.{vue,ts,js,css,html,json}",
  ],
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
) as Record<string, string>;

function projectIdFromPath(filePath: string) {
  const parts = filePath.split("/");
  const playgroundIndex = parts.indexOf("playgrounds");
  return playgroundIndex >= 0 ? parts[playgroundIndex + 1] : "";
}

function playgroundFilePath(filePath: string) {
  const parts = filePath.split("/");
  const playgroundIndex = parts.indexOf("playgrounds");
  return parts.slice(playgroundIndex + 2).join("/");
}

function shouldShowFile(filePath: string) {
  return filePath !== "manifest.json" && !filePath.includes("/node_modules/");
}

function replFilePath(filePath: string) {
  if (
    filePath === "import-map.json" ||
    filePath === "tsconfig.json" ||
    filePath.startsWith("src/")
  ) {
    return filePath;
  }

  return `src/${filePath}`;
}

export function loadVuePlaygroundProject(projectId: string): VuePlaygroundProject | null {
  const manifestModules = {
    ...topicRootManifestModules,
    ...topicSectionManifestModules,
    ...topicDeepManifestModules,
  };
  const fileModules = {
    ...playgroundFileModules,
  };

  const manifestEntry = Object.entries(manifestModules).find(([, manifest]) => {
    return manifest.id === projectId;
  });

  if (!manifestEntry) return null;

  const manifestProjectFolder = projectIdFromPath(manifestEntry[0]);
  const files: Record<string, string> = {};
  for (const [filePath, content] of Object.entries(fileModules)) {
    const relativePath = playgroundFilePath(filePath);
    if (projectIdFromPath(filePath) === manifestProjectFolder && shouldShowFile(relativePath)) {
      files[replFilePath(relativePath)] = content;
    }
  }

  return {
    manifest: manifestEntry[1],
    files,
  };
}
