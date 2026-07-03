import browser from "webextension-polyfill";

interface VersionData {
  checkedAt: number;
  latestVersion: string;
  releaseUrl: string;
  hasUpdate: boolean;
}

interface ReleaseData {
  tag_name: string;
  html_url: string;
};

export const checkUpdate = async () => {
  const lastCheck = await getVersion("update_data");
  const now = Date.now();
  if (lastCheck && (now - lastCheck.checkedAt) < 24 * 60 * 60 * 1000) return; // Пропуск проверки, если прошло меньше 24 часов с последней проверки
  await getReleaseData().then(async (releaseData) => {
    const currentVersion = browser.runtime.getManifest().version;
    const hasUpdate = compareVersions(releaseData.tag_name, currentVersion) > 0;
    await setVersion({
      checkedAt: now,
      latestVersion: releaseData.tag_name,
      releaseUrl: releaseData.html_url,
      hasUpdate
    });
  });
};

const compareVersions = (v1: string, v2: string): number => {
  const clean = (v: string) => v.replace(/^v/i, '').split('.').map(Number);
  const a = clean(v1);
  const b = clean(v2);

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const num1 = a[i] || 0;
    const num2 = b[i] || 0;
    if (num1 !== num2) return num1 > num2 ? 1 : -1;
  }
  return 0;
}

const getVersion = async (source: string): Promise<VersionData> => {
  const data = await browser.storage.local.get("update_data");
  return data[source] as VersionData;
};

const setVersion = async (data: VersionData) => {
  await browser.storage.local.set({ "update_data": data });
};

const getReleaseData = async (): Promise<ReleaseData> => {
  const response = await fetch("https://api.github.com/repos/SamuelGambino/extention-react/releases/latest");
  const data = await response.json();
  return {
    tag_name: data.tag_name,
    html_url: data.html_url
  }
};