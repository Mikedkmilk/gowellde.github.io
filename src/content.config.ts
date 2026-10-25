import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 产品集合：一款机器一个 JSON 文件，文件名 = 产品 slug（URL 用的短名）。
 * 参数只存"值"；字段含义、顺序、是否可筛选由所属品类的 specSchema 定义。
 */
const products = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/products' }),
  schema: z.object({
    model: z.string(), // 原始型号，页面展示用（可含空格和斜杠）
    name: z.string(), // SEO 长名称，如 "ARC-400 IGBT MMA Welder 320A"
    category: z.string(), // 所属品类 slug
    series: z.string().optional(),
    tags: z.array(z.string()).default([]), // 卡片角标，如 "3-PHASE"
    status: z.enum(['active', 'coming-soon', 'discontinued']).default('active'),
    badges: z.array(z.enum(['best-seller', 'new'])).default([]),
    featured: z.boolean().default(false), // 是否上首页推荐位
    sortOrder: z.number().default(100), // 品类页内排序，小的在前

    images: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]), // 图册，第一张为封面；放 public/assets/products/{slug}/ 下
    video: z.string().url().optional(),

    // 参数：key 必须对齐品类 specSchema，缺哪个就少渲染一行
    specs: z.record(z.string(), z.string()).default({}),

    summary: z.string().default(''), // 卡片一句话
    description: z.string().default(''), // 详情页正文
    features: z.array(z.string()).default([]),
    applications: z.array(z.string()).default([]),
    downloads: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    related: z.array(z.string()).default([]), // 相关型号 slug 列表

    // 商务信息——只放可公开内容！真实价格只留在本地 Excel
    priceDisplay: z.string().default(''), // 掩码价，如 "$1XX"
    moq: z.string().default(''),
    fobPort: z.string().default('FOB Qingdao'),
    leadTimeDays: z.string().default(''),
    packing: z.string().default(''),
  }),
});

/**
 * 品类集合：一个品类一个 JSON。specSchema 是本品类参数表的"渲染合同"，
 * 新品类只需在这里定义一套参数，所有模板自动适配。
 */
const categories = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/categories' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    parent: z.string().nullable().default(null), // 最多两级
    hero: z.string().default(''),
    intro: z.string().default(''), // 品类页介绍文案（SEO 用，建议 150 词以上）
    order: z.number().default(100), // 导航排序
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    specSchema: z.array(
      z.object({
        key: z.string(), // 对应产品 specs 的 key
        label: z.string(), // 参数表表头
        unit: z.string().default(''),
        filterable: z.boolean().default(false), // 品类页是否展示为快速参数
      })
    ),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { products, categories, blog };
