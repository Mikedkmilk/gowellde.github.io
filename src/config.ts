/**
 * 全站唯一配置文件：联系方式、统计、表单密钥都在这里改。
 * 改完 npm run build 重新构建即生效。
 */
export const SITE = {
  name: 'GOWELLDE',
  legalName: 'GOWELLDE Welding Technology',
  tagline: 'China Professional Inverter Welding Machine Factory',
  url: 'https://www.812818.xyz', // 换正式域名时同步改 astro.config.mjs / public/CNAME / public/robots.txt
};

export const CONTACT = {
  email: 'jackie007hello@gmail.com', // TODO: 换成 sales@你的域名 的企业邮箱
  whatsapp: '8618235335022',
  whatsappDisplay: '+86 182 3533 5022',
  phoneDisplay: '+86-18235335022',
  address: 'East of National Road 104, Tengzhou City, Shandong Province, China',
  youtube: 'https://www.youtube.com/@GowelldeWeld',
  facebook: 'https://www.facebook.com/people/Gowellde-Weld-Tech-Factory/61584937718348/',
  // 产品目录 PDF（暂时用 GitHub 外链；正式上线前建议压缩后放 public/assets/pdf/）
  catalogUrl: 'https://raw.githubusercontent.com/Mikedkmilk/gowellde/refs/heads/main/pdf/GOWELLDE.pdf',
};

/**
 * Web3Forms 免费表单服务：https://web3forms.com
 * 用邮箱注册后把 access key 填到这里。留空时表单自动降级为
 * "拉起邮件客户端并预填内容"的兜底模式（仍比旧站 mailto 表单可靠）。
 */
export const FORM = {
  web3formsKey: '', // 例：'a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
};

/**
 * Google Analytics 4：https://analytics.google.com
 * 填 G- 开头的衡量 ID 后统计代码自动启用；留空则完全不加载。
 */
export const ANALYTICS = {
  ga4Id: '', // 例：'G-XXXXXXXXXX'
};
