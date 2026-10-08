// 首页和各页面共用的数据：版块（home.json，按 previewOnly / enabled 过滤）、顶栏链接、晨报、官宣
import home from './data/home.json';
import announce from './data/announce.json';
import morningIndex from './data/morning/index.json';

export const sections = (home.sections as any[]).filter((s) => s.enabled !== false && (!s.previewOnly || __PREVIEW__));

// 顶栏链接：版块的 navLinks（一个版块多个锚点，如双栏区）或 nav + id；hrefPrefix 在首页是 ''，其他页面是首页地址
export function navLinks(hrefPrefix = '') {
  return sections.flatMap((s) => (s.navLinks || (s.nav && s.id ? [{ label: s.nav, id: s.id }] : [])).map((l: any) => ({ ...l, href: `${hrefPrefix}#${l.id}` })));
}

const issueFiles = import.meta.glob('./data/morning/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9].json', { eager: true, import: 'default' });
export const morningIssues: Record<string, any> = Object.fromEntries(Object.entries(issueFiles).map(([k, v]) => [k.match(/(\d{4}-\d{2}-\d{2})\.json$/)![1], v]));
export const morning = morningIndex as any; // {latest, dates(新→旧), items:[{date, issue_no, ...}]}
export const morningMeta = (date: string) => morning.items.find((x: any) => x.date === date);
// 比 date 早、且有条目的最近一期（空日的「看上一期 →」用）；morning.items 是新 → 旧
export const morningPrevWithItems = (date: string) => morning.items.find((x: any) => x.date < date && x.items > 0)?.date || null;
export const announcements = announce as any;

const WD = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
export const weekday = (date: string) => WD[new Date(`${date}T12:00:00+08:00`).getUTCDay()];
export const md = (date: string) => `${Number(date.slice(5, 7))}月${Number(date.slice(8, 10))}日`;
export const hm = (iso?: string | null) => (iso ? iso.slice(11, 16) : null);
export const shortDT = (iso?: string | null) => (iso ? `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))} ${iso.slice(11, 16)}` : '');

// 官宣原文 → HTML（只做显示，不改字）：转义后处理 Discord 的 **粗体**、`代码`、<t:时间戳>、自定义表情、链接、换行
const escH = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function renderAnnounce(text: string): string {
  const fmtT = (n: string) => {
    const d = new Date(Number(n) * 1000 + 8 * 3600 * 1000);
    return `${d.getUTCMonth() + 1}月${d.getUTCDate()}日 ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}（北京时间）`;
  };
  let s = text
    .replace(/<t:(\d+)(?::\w)?>/g, (_, n) => `\u0000T${n}\u0000`)
    .replace(/<(a?):(\w+):(\d+)>/g, (_, a, name, id) => `\u0000E${a}|${name}|${id}\u0000`);
  s = escH(s)
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)'"])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/\u0000T(\d+)\u0000/g, (_, n) => fmtT(n))
    .replace(/\u0000E(a?)\|(\w+)\|(\d+)\u0000/g, (_, a, name, id) => `<img class="d-emoji" src="https://cdn.discordapp.com/emojis/${id}.${a ? 'gif' : 'webp'}?size=48" alt=":${name}:" title=":${name}:" width="18" height="18" loading="lazy" />`);
  return s.split('\n').join('<br>');
}
export const bjDateTime = (iso: string) => `${Number(iso.slice(5, 7))}月${Number(iso.slice(8, 10))}日 ${iso.slice(11, 16)}`;
