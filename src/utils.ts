export function getProviderName(url?: string): string {
  if (!url) return 'Tải về';
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes('drive.google.com')) return 'Google Drive';
    if (host.includes('mediafire.com')) return 'MediaFire';
    if (host.includes('mega.nz')) return 'MEGA';
    if (host.includes('fshare.vn')) return 'Fshare';
    if (host.includes('dropbox.com')) return 'Dropbox';
    if (host.includes('onedrive') || host.includes('1drv.ms')) return 'OneDrive';
    return host.replace('www.', '').split('.')[0] || 'Tải Xuống';
  } catch {
    return 'Tải Xuống';
  }
}

export function sanitizeGameVersion(version?: string): string {
  if (!version || version === 'All') return '';
  // FM25 was cancelled, normalize any legacy references to FM24
  if (version === 'FM25') return 'FM24';
  return version;
}
