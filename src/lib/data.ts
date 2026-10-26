/**
 * 数据工具：全站读取产品/品类/博客的唯一入口。
 * 页面不要直接 getCollection，改从这里拿，保证排序、过滤、多语言回落口径一致。
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';

export type Product = CollectionEntry<'products'>;
export type Category = CollectionEntry<'categories'>;
export type Post = CollectionEntry<'blog'>;

// —— 本地化取值：优先 JSON 里的 i18n 字段，缺回落英文 ——

function pick(data: { i18n?: Record<string, Record<string, string>> }, locale: Locale, field: string, fallback: string): string {
  if (locale !== 'en') {
    const v = data.i18n?.[locale]?.[field];
    if (v) return v;
  }
  return fallback;
}

export function catName(c: Category, l: Locale): string {
  return pick(c.data, l, 'name', c.data.name);
}
export function catIntro(c: Category, l: Locale): string {
  return pick(c.data, l, 'intro', c.data.intro);
}
export function catSeoTitle(c: Category, l: Locale): string {
  return pick(c.data, l, 'seoTitle', c.data.seoTitle ?? `${c.data.name} | GOWELLDE`);
}
export function catSeoDesc(c: Category, l: Locale): string {
  return pick(c.data, l, 'seoDescription', c.data.seoDescription ?? c.data.intro.slice(0, 155));
}
export function specLabel(s: { label: string; labelEs?: string; labelRu?: string }, l: Locale): string {
  if (l === 'es' && s.labelEs) return s.labelEs;
  if (l === 'ru' && s.labelRu) return s.labelRu;
  return s.label;
}
export function prodSummary(p: Product, l: Locale): string {
  return pick(p.data, l, 'summary', p.data.summary);
}
export function prodDescription(p: Product, l: Locale): string {
  return pick(p.data, l, 'description', p.data.description);
}
export function prodFeatures(p: Product, l: Locale): string[] {
  if (l !== 'en') {
    const v = p.data.i18n?.[l]?.['features'];
    if (v) return v.split('|').map((s) => s.trim());
  }
  return p.data.features;
}
export function prodApplications(p: Product, l: Locale): string[] {
  if (l !== 'en') {
    const v = p.data.i18n?.[l]?.['applications'];
    if (v) return v.split('|').map((s) => s.trim());
  }
  return p.data.applications;
}

// —— 集合查询 ——

export async function getCategories(): Promise<Category[]> {
  const cats = await getCollection('categories');
  return cats.sort((a, b) => a.data.order - b.data.order);
}

/** 顶级品类（无父级） */
export async function getRootCategories(): Promise<Category[]> {
  const cats = await getCategories();
  return cats.filter((c) => !c.data.parent);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const cats = await getCategories();
  return cats.find((c) => c.data.slug === slug);
}

/** 某品类的子品类 */
export async function getChildCategories(parentSlug: string): Promise<Category[]> {
  const cats = await getCategories();
  return cats.filter((c) => c.data.parent === parentSlug);
}

export async function getProducts(): Promise<Product[]> {
  const items = await getCollection('products');
  return items
    .filter((p) => p.data.status !== 'discontinued')
    .sort((a, b) => a.data.category.localeCompare(b.data.category) || a.data.sortOrder - b.data.sortOrder);
}

/** 某品类下的产品；品类有子品类时返回全部后代产品 */
export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const children = await getChildCategories(slug);
  const slugs = new Set([slug, ...children.map((c) => c.data.slug)]);
  const items = await getProducts();
  return items.filter((p) => slugs.has(p.data.category)).sort((a, b) => a.data.sortOrder - b.data.sortOrder);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const items = await getCollection('products');
  return items.find((p) => p.id === slug);
}

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

// —— 渲染辅助 ——

/** 产品卡片快览参数：按品类 specSchema 的 filterable 顺序取，带单位 */
export function quickSpecs(product: Product, category: Category | undefined, locale: Locale = 'en') {
  if (!category) return [];
  return category.data.specSchema
    .filter((s) => s.filterable && product.data.specs[s.key])
    .slice(0, 3)
    .map((s) => {
      const v = product.data.specs[s.key];
      const needsUnit = s.unit && !v.includes(s.unit) && /^\d/.test(v) && (s.unit === 'A' || s.unit === '%');
      return { label: specLabel(s, locale), value: needsUnit ? v + s.unit : v };
    });
}

/** 品类筛选组：从本品类产品的 specs 中提取 filterable 参数的所有取值 */
export function filterGroups(products: Product[], category: Category | undefined, locale: Locale = 'en') {
  if (!category) return [];
  return category.data.specSchema
    .filter((s) => s.filterable)
    .map((s) => {
      const values = new Set<string>();
      for (const p of products) if (p.data.specs[s.key]) values.add(p.data.specs[s.key]);
      return {
        key: s.key,
        label: specLabel(s, locale),
        unit: s.unit,
        values: [...values],
      };
    })
    .filter((g) => g.values.length > 1); // 只有一个取值的参数不值得筛选
}

/** 卡片上的筛选数据（仅 filterable 参数），JSON 序列化到 data-specs */
export function cardFilterData(product: Product, category: Category | undefined) {
  if (!category) return {};
  const out: Record<string, string> = {};
  for (const s of category.data.specSchema) {
    if (s.filterable && product.data.specs[s.key]) out[s.key] = product.data.specs[s.key];
  }
  return out;
}
