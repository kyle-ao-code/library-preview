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
export const announcements = announce as any;

const WD = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
export const weekday = (date: string) => WD[new Date(`${date}T12:00:00+08:00`).getUTCDay()];
export const md = (date: string) => `${Number(date.slice(5, 7))}月${Number(date.slice(8, 10))}日`;
export const hm = (iso?: string | null) => (iso ? iso.slice(11, 16) : null);
export const shortDT = (iso?: string | null) => (iso ? `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))} ${iso.slice(11, 16)}` : '');
