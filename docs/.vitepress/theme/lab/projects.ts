export interface LabManifest {
  id: string;
  title: string;
  description?: string;
  defaultFile: string;
  runnable?: boolean;
  installable?: boolean;
  scripts?: {
    dev?: string;
  };
}

export interface LabProject {
  manifest: LabManifest;
  files: Record<string, string>;
}

const manifestModules = import.meta.glob("/labs/*/manifest.json", {
  eager: true,
  import: "default",
}) as Record<string, LabManifest>;

const topicRootManifestModules = import.meta.glob("/*/examples/*/manifest.json", {
  eager: true,
  import: "default",
}) as Record<string, LabManifest>;

const topicSectionManifestModules = import.meta.glob("/*/*/examples/*/manifest.json", {
  eager: true,
  import: "default",
}) as Record<string, LabManifest>;

const fileModules = import.meta.glob("/labs/*/files/**/*", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const topicRootFileModules = import.meta.glob("/*/examples/*/files/**/*", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const topicSectionFileModules = import.meta.glob("/*/*/examples/*/files/**/*", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const hiddenFileNames = new Set(["package-lock.json", "pnpm-lock.yaml", "yarn.lock"]);

function labIdFromPath(filePath: string) {
  const parts = filePath.split("/");
  const examplesIndex = parts.indexOf("examples");
  if (examplesIndex >= 0) return parts[examplesIndex + 1];
  return parts[2];
}

function labFilePath(filePath: string) {
  const marker = "/files/";
  return filePath.slice(filePath.indexOf(marker) + marker.length);
}

function shouldShowFile(filePath: string) {
  const name = filePath.split("/").at(-1) ?? "";
  return !hiddenFileNames.has(name);
}

export function loadStaticLab(projectId: string): LabProject | null {
  const manifests = {
    ...manifestModules,
    ...topicRootManifestModules,
    ...topicSectionManifestModules,
  };
  const files = { ...fileModules, ...topicRootFileModules, ...topicSectionFileModules };
  const manifestEntry = Object.entries(manifests).find(([, manifest]) => {
    return manifest.id === projectId;
  });

  if (!manifestEntry) return null;

  const labFiles: Record<string, string> = {};
  for (const [filePath, content] of Object.entries(files)) {
    const relativePath = labFilePath(filePath);
    if (labIdFromPath(filePath) === projectId && shouldShowFile(relativePath)) {
      labFiles[relativePath] = content;
    }
  }

  return {
    manifest: manifestEntry[1],
    files: labFiles,
  };
}
