import browser from "webextension-polyfill";
import type { UpdateData } from "../globalTypes/update_data";

const UPDATE_DATA_KEY = "update_data";
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

interface ReleaseData {
  tag_name: string;
  html_url: string;
}

export const checkUpdate = async () => {
  const currentVersion = browser.runtime.getManifest().version;
  const stored = await getUpdateData();
  const isStale = !stored || stored.extensionVersion !== currentVersion;
  const isRecentCheck = stored && (Date.now() - stored.checkedAt) < CHECK_INTERVAL_MS;

  if (!isStale && isRecentCheck) return;

  const releaseData = await getReleaseData();
  const hasUpdate = compareVersions(releaseData.tag_name, currentVersion) > 0;

  await saveUpdateData({
    checkedAt: Date.now(),
    latestVersion: releaseData.tag_name,
    releaseUrl: releaseData.html_url,
    hasUpdate,
    extensionVersion: currentVersion,
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
};

const getUpdateData = async (): Promise<UpdateData | undefined> => {
  const data = await browser.storage.local.get(UPDATE_DATA_KEY);
  return data[UPDATE_DATA_KEY] as UpdateData | undefined;
};

const saveUpdateData = async (data: UpdateData) => {
  await browser.storage.local.set({ [UPDATE_DATA_KEY]: data });
};

const getReleaseData = async (): Promise<ReleaseData> => {
  const response = await fetch("https://api.github.com/repos/SamuelGambino/extention-react/releases/latest");
  const data = await response.json();
  return {
    tag_name: data.tag_name,
    html_url: data.html_url
  };
};
