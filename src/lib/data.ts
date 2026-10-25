/**
 * 数据工具：全站读取产品/品类/博客的唯一入口。
 * 页面不要直接 getCollection，改从这里拿，保证排序和过滤口径一致。
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Product = CollectionEntry<'products'>;
export type Category = CollectionEntry<'categories'>;
export type Post = CollectionEntry<'blog'>;

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

/** 产品卡片上展示的 3 个快速参数（按品类 specSchema 的 filterable 顺序取） */
export function quickSpecs(product: Product, category: Category | undefined) {
  if (!category) return [];
  return category.data.specSchema
    .filter((s) => s.filterable && product.data.specs[s.key])
    .slice(0, 3)
    .map((s) => ({
      label: s.label,
      value: `${product.data.specs[s.key]}${s.unit && !product.data.specs[s.key].includes(s.unit) ? (s.unit === 'A' || s.unit === '%' ? s.unit : '') : ''}`,
    }));
}

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
