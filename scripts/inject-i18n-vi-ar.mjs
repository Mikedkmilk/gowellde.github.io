/**
 * 一次性脚本：注入越南语/阿拉伯语内容翻译到 content JSON。
 * 运行：node scripts/inject-i18n-vi-ar.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const C = (p) => path.join(__dirname, '..', 'src', 'content', p);

// —— 品类参数表头 vi/ar ——
const catLabels = {
  'welding-machines': {
    inputVoltage: ['Điện áp vào', 'جهد الدخل'],
    ratedCurrent: ['Dòng định mức', 'التيار المقنن'],
    dutyCycleAt40c: ['Chu kỳ tải @40°C', 'دورة التشغيل عند 40°م'],
    rodDiameterMm: ['Đường kính que hàn', 'قطر القطب الكهربائي'],
    wireDiameterMm: ['Đường kính dây hàn', 'قطر سلك اللحام'],
    dimensionsMm: ['Kích thước (D×R×C)', 'الأبعاد (ط×ع×ا)'],
    netWeightKg: ['Khối lượng', 'الوزن الصافي'],
    igbtConfig: ['Công suất (IGBT)', 'مرحلة القدرة (IGBT)'],
    accessories: ['Phụ kiện chuẩn', 'الحزمة القياسية'],
  },
  'mma-welders': {
    inputVoltage: ['Điện áp vào', 'جهد الدخل'],
    ratedCurrent: ['Dòng định mức', 'التيار المقنن'],
    dutyCycleAt40c: ['Chu kỳ tải @40°C', 'دورة التشغيل عند 40°م'],
    rodDiameterMm: ['Đường kính que hàn', 'قطر القطب الكهربائي'],
    dimensionsMm: ['Kích thước (D×R×C)', 'الأبعاد (ط×ع×ا)'],
    netWeightKg: ['Khối lượng', 'الوزن الصافي'],
    igbtConfig: ['Công suất (IGBT)', 'مرحلة القدرة (IGBT)'],
  },
  'mig-mag-welders': {
    inputVoltage: ['Điện áp vào', 'جهد الدخل'],
    ratedCurrent: ['Dòng định mức', 'التيار المقنن'],
    dutyCycleAt40c: ['Chu kỳ tải @40°C', 'دورة التشغيل عند 40°م'],
    wireDiameterMm: ['Đường kính dây hàn', 'قطر سلك اللحام'],
    dimensionsMm: ['Kích thước (D×R×C)', 'الأبعاد (ط×ع×ا)'],
    netWeightKg: ['Khối lượng', 'الوزن الصافي'],
    igbtConfig: ['Công suất (IGBT)', 'مرحلة القدرة (IGBT)'],
    accessories: ['Phụ kiện chuẩn', 'الحزمة القياسية'],
  },
  'air-compressors': {
    motorPowerKw: ['Công suất động cơ', 'قدرة المحرك'],
    displacementLmin: ['Lưu lượng khí', 'تدفق الهواء'],
    ratedPressureMpa: ['Áp suất định mức', 'الضغط المقنن'],
    tankCapacityL: ['Thể tích bình', 'سعة الخزان'],
    noiseLevelDb: ['Độ ồn', 'مستوى الضجيج'],
    dimensionsMm: ['Kích thước (D×R×C)', 'الأبعاد (ط×ع×ا)'],
    netWeightKg: ['Khối lượng', 'الوزن الصافي'],
  },
};

// —— 品类 i18n（name/intro/seo） vi/ar ——
const catI18n = {
  'welding-machines': {
    vi: {
      name: 'Máy hàn',
      intro: 'GOWELLDE sản xuất máy hàn biến tần IGBT cho đại lý và người dùng công nghiệp trên toàn thế giới. Dòng sản phẩm bao gồm máy hàn que (MMA) từ 160A đến 630A và máy hàn MIG/MAG với bộ đẩy dây kép đến 630A. Mỗi bo mạch đều qua test lão hóa 100% trước khi lắp ráp, mọi máy đều định mức chu kỳ tải tại 40°C. Với hỗ trợ OEM/ODM, thiết kế đạt CE và xuất hàng FOB Thanh Đảo, chúng tôi cung cấp thiết bị hàn cho Ai Cập, Ấn Độ, Pakistan, Việt Nam và hơn 20 thị trường.',
      seoTitle: 'Nhà máy máy hàn biến tần - MMA & MIG/MAG | GOWELLDE',
      seoDescription: 'Máy hàn biến tần IGBT từ xưởng Trung Quốc: MMA 160-630A và MIG/MAG bộ đẩy dây kép. Test lão hóa bo 100%, OEM/ODM, đạt CE.',
    },
    ar: {
      name: 'ماكينات اللحام',
      intro: 'تصنع GOWELLDE ماكينات لحام إنفرتر IGBT للموزعين والمستخدمين الصناعيين حول العالم. تشمل التشكيلة ماكينات قطب كهربائي (MMA) من 160 إلى 630 أمبير وماكينات MIG/MAG بوحدة تغذية مزدوجة تصل إلى 630 أمبير. كل لوحة إلكترونية تخضع لاختبار تعتيق 100% قبل التجميع، وجميع الماكينات مقومة دورة تشغيلها عند 40°م. مع دعم OEM/ODM وتصميم مطابق لمعيار CE ولوجستيات FOB ميناء تشينغداو، نوفر معدات اللحام لمصر والهند وباكستان وفيتنام وأكثر من 20 سوقًا.',
      seoTitle: 'ماكينات لحام إنفرتر - MMA وMIG/MAG | GOWELLDE',
      seoDescription: 'ماكينات لحام إنفرتر IGBT من مصنع صيني: MMA بقدرة 160-630 أمبير وMIG/MAG بوحدة تغذية مزدوجة. اختبار تعتيق 100% للوحات، OEM/ODM، ومطابقة CE.',
    },
  },
  'mma-welders': {
    vi: {
      name: 'Máy hàn que (MMA)',
      intro: 'Máy hàn que cho công trường, gia công kết cấu thép và bảo trì sửa chữa. Máy biến tần MMA của GOWELLDE dùng module IGBT từ dòng di động 160A (4,1 kg) đến máy công nghiệp 3 pha 630A. Chức năng khởi động nóng và chống dính que là tiêu chuẩn, và mỗi máy đều được test lão hóa trước khi xuất xưởng. Các mẫu phổ biến cho hàn cốt thép và thi công ngoài trời: dòng ARC-400 và ARC-500.',
      seoTitle: 'Máy hàn que biến tần 160A-630A | Xưởng GOWELLDE',
      seoDescription: 'Máy hàn que MMA biến tần trực tiếp từ xưởng: từ 160A di động đến 630A 3 pha hạng nặng. Khởi động nóng, chống dính que, test lão hóa 100%, nhận OEM.',
    },
    ar: {
      name: 'ماكينات MMA / قطب كهربائي',
      intro: 'ماكينات لحام بالقطب الكهربائي للمواقع الإنشائية وتصنيع الهياكل الفولاذية والصيانة. تعمل ماكينات MMA الإنفرتر من GOWELLDE بوحدات IGBT من الأنواع المحمولة بقدرة 160 أمبير (4.1 كجم) إلى الماكينات الصناعية ثلاثية الطور بقدرة 630 أمبير. ميزتا البدء الساخن ومنع التصاق القطب قياسيتان، وكل ماكينة تخضع لاختبار تعتيق قبل مغادرتها المصنع. الطُرز الشائعة للحديد التسليح والعمل الخارجي: سلسلتا ARC-400 وARC-500.',
      seoTitle: 'ماكينات لحام قطب كهربائي إنفرتر 160-630 أمبير | مصنع GOWELLDE',
      seoDescription: 'ماكينات MMA إنفرتر مباشرة من المصنع: من 160 أمبير محمولة إلى 630 أمبير ثلاثية الطور للأعمال الشاقة. بدء ساخن، منع التصاق، اختبار تعتيق 100%، ومتوفر OEM.',
    },
  },
  'mig-mag-welders': {
    vi: {
      name: 'Máy hàn MIG / MAG',
      intro: 'Máy hàn MIG/MAG bảo vệ khí với bộ đẩy dây kép cho hàn sản xuất liên tục. Dòng MIG/MMA còn chuyển sang hàn que, một máy phục vụ hai phương pháp trên cùng sàn xưởng. Chu kỳ tải lên đến 100% tại dòng định mức phục vụ nhà thép kết cấu và dây chuyền gia công, mỗi máy giao đủ bộ: tay hàn, cáp, kẹp mát và bình giảm áp CO2.',
      seoTitle: 'Máy hàn MIG/MAG bộ đẩy dây kép | GOWELLDE',
      seoDescription: 'Máy hàn MIG/MAG trực tiếp từ xưởng 250A-630A với bộ đẩy dây kép và chức năng MMA. Chu kỳ tải đến 100%, đủ bộ phụ kiện, OEM/ODM từ Trung Quốc.',
    },
    ar: {
      name: 'ماكينات MIG / MAG',
      intro: 'ماكينات لحام MIG/MAG بالغاز الواقي ووحدة تغذية سلك مزدوجة الدفع للّحام الإنتاجي المستمر. سلسلة MIG/MMA تتحول أيضًا إلى لحام بالقطب، فتغطي الماكينة الواحدة طريقتين في ورشة واحدة. دورات تشغيل تصل إلى 100% عند التيار المقنن لمدن الهياكل الفولاذية وخطوط التصنيع، وتُشحن كل وحدة كاملة: مشعلة وكابلات ومشبس أرضي ومنظم CO2.',
      seoTitle: 'ماكينات MIG/MAG بوحدة تغذية مزدوجة | GOWELLDE',
      seoDescription: 'ماكينات MIG/MAG مباشرة من المصنع 250-630 أمبير بوحدة تغذية مزدوجة ووظيفة MMA. دورة تشغيل حتى 100%، حزمة ملحقات كاملة، OEM/ODM من الصين.',
    },
  },
  'air-compressors': {
    vi: {
      name: 'Máy nén khí',
      intro: 'Máy nén khí piston không dầu kiểu yên tĩnh và dây đai cho xưởng hàn, trạm dịch vụ và công nghiệp nhẹ. Thiết kế đi kèm thiết bị hàn GOWELLDE: nguồn khí ổn định cho cắt plasma, dụng cụ khí nén và vệ sinh xưởng. Dòng sản phẩm đang hoàn tất khâu chuẩn bị — các mẫu dưới đây nhận đặt trước và yêu cầu báo giá; thông số đầy đủ, ảnh và giá sẽ công bố khi bắt đầu sản xuất.',
      seoTitle: 'Máy nén khí cho xưởng hàn | GOWELLDE (Sắp ra mắt)',
      seoDescription: 'Máy nén khí không dầu yên tĩnh và piston 2,5-7,5 mã lực, bình 24-150L, đi kèm thiết bị hàn và cắt plasma GOWELLDE. Nhận đặt trước và yêu cầu báo giá sỉ.',
    },
    ar: {
      name: 'ضواغط الهواء',
      intro: 'ضواغط هواء صامتة خالية من الزيت ومكبسية بحزام للورش اللحام ومحطات الخدمة والاستخدام الصناعي الخفيف. مصممة للعمل مع معدات لحام GOWELLDE: إمداد هواء ثابت لقطع البلازما والأدوات الهوائية وتنظيف الورشة. السلسلة في مرحلة الإعداد النهائية — الطُرز أدناه تقبل الحجز المسبك والاستفسارات، وتُنشر المواصفات الكاملة والصور والأسعار عند بدء الإنتاج.',
      seoTitle: 'ضواغط هواء لورش اللحام | GOWELLDE (قريبًا)',
      seoDescription: 'ضواغط هواء صامتة خالية من الزيت ومكبسية بقدرة 2.5-7.5 حصان وخزانات 24-150 لتر، مع معدات لحام وقطع بلازما GOWELLDE. الحجز المسبك واستفسارات الجملة متاحة.',
    },
  },
};

// —— 产品 vi/ar ——
const products = {
  'arc-315e': {
    vi: {
      summary: 'Máy hàn que di động 4,1 kg cho sửa chữa công trường và gia công nhẹ. Mẫu bán chạy số một của chúng tôi.',
      description: 'ARC-315E là lựa chọn chủ lực cho hàn que cơ bản. Chỉ 4,1 kg nên dễ di chuyển giữa các xưởng, mái nhà và công trình xa, trong khi mạch biến tần IGBT giữ hồ quang ổn định trên dây dẫn dài và khi dùng máy phát. Xử lý tốt mối hàn phức tạp và vị trí chật.',
      features: 'Công nghệ biến tần IGBT, tỷ lệ công suất/trọng lượng cao|Khởi động nóng & chống dính que dễ mồi hồ quang|Bảo vệ quá nhiệt có đèn báo|Hoạt động với nguồn 220V hoặc 380V ±15%|Tương thích máy phát cho công trình ngoài trời',
      applications: 'Bảo trì & sửa chữa công trường|Gia công thép nhẹ|Hàn tạm cốt thép|Sử dụng chung ở nông trại & xưởng',
    },
    ar: {
      summary: 'ماكينة لحام بالقطب محمولة بوزن 4.1 كجم للإصلاح في المواقع والتصنيع الخفيف. طرازنا الأكثر مبيعًا للمبتدئين.',
      description: 'ARC-315E هي الخيار الرئيسي للحام الأساسي بالقطب الكهربائي. بوزن 4.1 كجم فقط يمكن نقلها بسهولة بين الورش والأسطح والمواقع النائية، بينما تحافظ دارة الإنفرتر IGBT على قوس ثابت مع أسلاك التمديد الطويلة وعند التشغيل من مولد. تتعامل مع الوصلات المعقدة والأماكن الضيقة.',
      features: 'تقنية إنفرتر IGBT بنسبة قدرة إلى وزن عالية|بدء ساخن ومضاد للالتصاق لإشعال القوس بسهولة|حماية حرارية مع مؤشر|تعمل على مصدر 220 أو 380 فولت ±15%|متوافقة مع المولدات للأعمال الخارجية',
      applications: 'صيانة وإصلاح المواقع|تصنيع الفولاذ الخفيف|لحام التسليح المؤقت|استخدام عام في المزارع والورش',
    },
  },
  'arc-315a': {
    vi: {
      summary: 'Máy hàn que 180A với mạch IGBT mạnh hơn — bước nâng cấp tự nhiên từ 315E.',
      description: 'ARC-315A nâng lên 180A với mạch IGBT G40N120 và tụ lớn hơn, nhận que hàn 2,5–4,0 mm cho kết cấu dày hơn. Vẫn là máy bắc một tay 5,4 kg và là mặt hàng bán chạy cho đại lý phục vụ thị trường xây dựng.',
      features: 'Mạch công suất IGBT 4×G40N120 nâng cấp|Que hàn 2,5–4,0 mm cho kết cấu|Khởi động nóng & chống dính que|Bảo vệ nhiệt tự phục hồi|Tùy chọn nguồn 220V / 380V',
      applications: 'Hàn công trường|Gia công kết cấu thép|Xưởng bảo trì',
    },
    ar: {
      summary: 'ماكينة لحام بقطب 180 أمبير بمرحلة IGBT أقوى — الترقية الطبيعية عن 315E.',
      description: 'ترفع ARC-315A القدرة إلى 180 أمبير بوحدات IGBT G40N120 ومكثفات أكبر، وتقبل أقطابًا 2.5–4.0 مم للأعمال الإنشائية السميكة. تبقى ماكينة تُحمل بيد واحدة بوزن 5.4 كجم، ومنتجًا مثبت البيع للموزعين في قطاع البناء.',
      features: 'مرحلة قدرة IGBT محسّنة 4×G40N120|مدى أقطاب 2.5–4.0 مم للأعمال الإنشائية|بدء ساخن ومضاد للالتصاق|حماية حرارية باسترداد تلقائي|خيارات تغذية 220/380 فولت',
      applications: 'لحام مواقع البناء|تصنيع الهياكل الفولاذية|ورش الصيانة',
    },
  },
  'arc-400b': {
    vi: {
      summary: 'Máy hàn 200A bền bỉ với cụm tụ lớn nhất phân khúc.',
      description: 'ARC-400B kết hợp dòng ra 200A với cụm tụ 4×820µF và quạt làm mát 12038, thiết kế cho làm việc liên tục trên bàn gia công và công trường. 6,6 kg vẫn di động dễ trong khi chu kỳ tải đáp ứng mối hàn dài với que 2,5–4,0 mm.',
      features: 'Cụm tụ 4×820µF/450V cho hồ quang ổn định|Quạt làm mát 12038 cỡ lớn|Dòng ra 200A cho que 4,0 mm|Khởi động nóng, chống dính và điều chỉnh arc force|Bảo vệ quá nhiệt',
      applications: 'Xưởng gia công kết cấu|Hàn công trường & cốt thép|Sửa chữa thiết bị',
    },
    ar: {
      summary: 'ماكينة لحام 200 أمبير للمهام الشاقة بأكبر مجموعة مكثفات في فئتها.',
      description: 'تجمع ARC-400B بين خرج 200 أمبير ومجموعة مكثفات 4×820µF ومروحة 12038، مصممة للعمل المستمر على طاولات التصنيع والمواقع. بوزن 6.6 كجم تبقى محمولة، وتسمح دورة التشغيل بقطاعات لحام طويلة بأقطاب 2.5–4.0 مم.',
      features: 'مجموعة مكثفات 4×820µF/450 فولت لقوس ثابت|مروحة تبريد كبيرة 12038|خرج 200 أمبير لأقطاب 4.0 مم|بدء ساخن ومضاد التصاق وتعديل قوة القوس|حماية حرارية',
      applications: 'ورش التصنيع الفولاذي|البناء وتسليح الحديد|إصلاح المعدات',
    },
  },
  'arc-400a': {
    vi: {
      summary: 'Máy hàn công nghiệp 250A với tùy chọn nguồn đến 3 pha.',
      description: 'ARC-400A là cấp công nghiệp của dòng 400: dòng ra 250A, cụm tụ 8×470µF và biến áp T80 cho môi trường sản xuất khắc nghiệt. Nhiều tùy chọn điện áp vào (220V, 380V hoặc 380V 3 pha) giúp một mã hàng phục vụ nhiều điều kiện nguồn khác nhau.',
      features: 'Dòng định mức 250A cho que lớn|Nguồn vào 220V / 380V / 3P 380V|Cụm tụ 8×470µF|Biến áp T80 công suất cao|Vỏ công nghiệp,bảng điều khiển trước gia cố',
      applications: 'Nhà máy công nghiệp|Sửa chữa thiết bị nặng|Xưởng kết cấu thép',
    },
    ar: {
      summary: 'ماكينة لحام صناعية 250 أمبير بخيارات تغذية تصل إلى ثلاثية الطور.',
      description: 'ARC-400A هي المستوى الصناعي من فئة 400: خرج 250 أمبير، مجموعة مكثفات 8×470µF ومحوّل T80 للبيئات الإنتاجية القاسية. خيارات دخل متعددة (220/380 أو 380 ثلاثي الطور) تجعل رقم طراز واحد يخدم ظروف تشغيل مختلفة.',
      features: 'خرج مقنن 250 أمبير للأقطاب الثقيلة|دخل 220/380/380 فولت ثلاثي الطور|مجموعة مكثفات 8×470µF|محوّل T80 عالي السعة|هيكل صناعي بلوحة أمامية معززة',
      applications: 'المصانع الصناعية|إصلاح المعدات الثقيلة|ورش الهياكل الفولاذية',
    },
  },
  'arc-400': {
    vi: {
      summary: 'Máy hàn 3 pha 320A với chu kỳ tải 80% — bước vào phân khúc gia công nặng.',
      description: 'ARC-400 bước sang cấp nặng 3 pha: dòng định mức 320A tại chu kỳ tải 80%, que hàn 2,5–5,0 mm và biến áp lõi ferrite T102 dẫn động bởi hai IGBT G50N120. Đây là máy nền tảng cho nhà thép kết cấu chạy mối hàn dài liên tục.',
      features: '320A định mức tại chu kỳ tải 80%|Nguồn công nghiệp 3 pha 380V|Hàn được que 5,0 mm|Mạch IGBT nửa cầu 2×G50N120|Quạt công suất lớn 200FZY',
      applications: 'Nhà máy kết cấu thép|Đóng tàu & cầu|Chế tạo máy nặng',
    },
    ar: {
      summary: 'ماكينة ثلاثية الطور 320 أمبير بدورة تشغيل 80% — المدخل إلى فئة التصنيع الثقيل.',
      description: 'تدخل ARC-400 الفئة الثقيلة ثلاثية الطور: 320 أمبير مقننًا عند دورة تشغيل 80%، وأقطاب 2.5–5.0 مم، ومحوّل قلب فيريت T102 يقوده وحدتا IGBT G50N120. إنها الماكينة الأساسية لمصانع الهياكل الفولاذية ذات القطاعات الطويلة المستمرة.',
      features: '320 أمبير مقننًا عند دورة تشغيل 80%|دخل صناعي ثلاثي الطور 380 فولت|قدرة على قطر 5.0 مم|مرحلة IGBT نصف جسر 2×G50N120|مروحة تدفق عالٍ 200FZY',
      applications: 'مصانع الهياكل الفولاذية|حوض بناء السفن والجسور|صناعة الآلات الثقيلة',
    },
  },
  'arc-500b': {
    vi: {
      summary: '400A chu kỳ 80% trên khung 515mm đã kiểm chứng — mạch mới, kích thước cũ.',
      description: 'ARC-500B làm mới mạch công suất dòng 500 với hai IGBT G75N120, cho 400A tại chu kỳ tải 80% trong cùng khung gọn như ARC-400. Phương án nâng cấp trực tiếp cho người dùng ARC-400 cần dư địa cho que 5,0 mm.',
      features: '400A định mức chu kỳ 80%|Mạch IGBT 2×G75N120|Cùng khung & vị trí bắt với ARC-400|Hàn que 5,0 mm|Điều khiển quạt theo nhiệt',
      applications: 'Gia công thép nặng|Kết cấu xây dựng|Sửa chữa thiết bị mỏ',
    },
    ar: {
      summary: '400 أمبير بدورة 80% على الهيكل المجرَّب مقاس 514 مم — مرحلة محدّثة بنفس الأبعاد.',
      description: 'تجدّد ARC-500B مرحلة القدرة لفئة 500 بوحدتي IGBT G75N120، فتمنح 400 أمبير عند دورة تشغيل 80% في الهيكل المدمج نفسه المستخدم في ARC-400. ترقية مباشرة لمستخدمي ARC-400 الذين يحتاجون هامشًا لأقطاب 5.0 مم.',
      features: '400 أمبير مقننًا عند دورة 80%|مرحلة IGBT 2×G75N120|نفس الهيكل والتثبيت مثل ARC-400|قدرة قطر 5.0 مم|تحكم ترموستاتي بالمروحة',
      applications: 'التصنيع الفولاذي الثقيل|إنشاءات فولاذية|صيانة معدات المحاجر',
    },
  },
  'arc-500': {
    vi: {
      summary: '450A chu kỳ tải 100% — thiết kế để hàn liên tục cả ca.',
      description: 'ARC-500 cho 450A ở chu kỳ tải 100% với mạch 2×G100N120 và biến áp T105. Với dây chuyền nơi hồ quang không bao giờ nguội, đây là máy chạy trọn ca không nghỉ.',
      features: 'Chu kỳ tải 100% tại dòng định mức|Mạch IGBT 2×G100N120|Ổn định hồ quang thép dày|Que hàn tới 5,0 mm|Màn hình dòng điện phía trước',
      applications: 'Hàn sản xuất liên tục|Gia công tấm dày|Nhà thép kết cấu',
    },
    ar: {
      summary: '450 أمبير بدورة تشغيل 100% — مصممة للّحام طوال الوردية دون توقف.',
      description: 'تمنح ARC-500 قدرة 450 أمبير عند دورة تشغيل 100% بمرحلة 2×G100N120 ومحوّل T105. لخطوط الإنتاج حيث لا يبرد القوس أبدًا، هذه هي الماكينة التي تستمر بالعمل طوال الوردية.',
      features: 'دورة تشغيل 100% عند التيار المقنن|مرحلة IGBT 2×G100N120|ثبات القوس للصفيحة السميكة|أقطاب حتى 5.0 مم|شاشة رقمية للتيار في الأمام',
      applications: 'لحام إنتاجي مستمر|الصفائح السميكة|مصانع الهياكل',
    },
  },
  'arc-630b': {
    vi: {
      summary: '500A chu kỳ 100% trên khung dòng 630. Ảnh cung cấp theo yêu cầu.',
      description: 'ARC-630B ghép khung dòng 630 và biến áp T120 với mạch 2×G100N120 định mức 500A ở chu kỳ tải 100% — công suất liên tục cực đại cho công việc hàn que nặng nhất. Liên hệ để nhận ảnh và thông số mới nhất.',
      features: '500A tại chu kỳ 100%|Biến áp T120 cho tải kéo dài|Khung gia cố dòng 630|Que hàn 5,0 mm',
      applications: 'Thi công nặng|Kết cấu quy mô lớn|Hàn liên tục cường độ cao',
    },
    ar: {
      summary: '500 أمبير بدورة 100% على هيكل فئة 630. الصور عند الطلب.',
      description: 'تجمع ARC-630B هيكل فئة 630 ومحوّل T120 مع مرحلة 2×G100N120 بقدرة 500 أمبير عند دورة تشغيل 100% — خرج مستمر أقصى لأصعب أعمال اللحام بالقطب. تواصل معنا للحصول على الصور الحالية وورقة البيانات.',
      features: '500 أمبير عند دورة 100%|محوّل T120 للأحمال الممتدة|هيكل معزز فئة 630|أقطاب 5.0 مم',
      applications: 'الإنشاءات الثقيلة|التصنيع الإنشائي الكبير|لحام مستمر عالي الشدة',
    },
  },
  'arc-630': {
    vi: {
      summary: 'Máy hàn que đầu dòng 630A — đỉnh dải MMA của GOWELLDE.',
      description: 'ARC-630 đứng đầu dải MMA với 630A từ mạch 2×G150N120 và biến áp T130. Cho nung nóng trước, kết cấu dày và gouging than, đây là máy mà nhà gia công nặng chọn khi không máy nhỏ hơn nào chịu nổi ca làm việc.',
      features: 'Dòng ra tối đa 630A|Mạch IGBT 2×G150N120 hàng đầu|Biến áp T130 hạng nặng|Chu kỳ 80% tại dòng định mức|Khung gia cố dòng 630',
      applications: 'Gia công kết cấu nặng|Gouging hồ than|Dự án xây dựng quy mô lớn',
    },
    ar: {
      summary: 'ماكينة لحام قطب بقدرة 630 أمبير في القمة — أرفع طراز في سلسلة MMA من GOWELLDE.',
      description: 'تتوّج ARC-630 سلسلة MMA بقدرة 630 أمبير من مرحلة 2×G150N120 والمحوّل T130. للتسخين المسبق والمقاطع الإنشائية السميكة والقطع بالقوس الكربوني، هي الماكينة التي تحددها المصانع الثقيلة حين لا تنجو ماكينة أصغر من الوردية.',
      features: 'خرج أقصى 630 أمبير|مرحلة IGBT 2×G150N120 من الدرجة الأولى|محوّل T130 للأعمال الشاقة|دورة 80% عند التيار المقنن|هيكل معزز فئة 630',
      applications: 'التصنيع الإنشائي الثقيل|القطع بالقوس الكربوني|مشاريع البناء الكبرى',
    },
  },
  'mig-mma-315y': {
    vi: {
      summary: 'Combo MIG/MMA nhập môn: hàn khí và hàn que, nguồn vào linh hoạt.',
      description: 'MIG/MMA-315Y phủ cả hàn MIG lẫn hàn que trên một máy, với nguồn 220V/380V/3 pha linh hoạt phù hợp xưởng có điện hỗn hợp. Giao đủ bộ — tay hàn, cáp, kẹp mát và bình giảm áp CO2 — khách dùng được ngay ngày nhận máy.',
      features: 'Hai phương pháp MIG và MMA trên một máy|Nguồn linh hoạt 220V / 380V / 3P 380V|Dây hàn 0,8–1,0 mm|Đủ bộ phụ kiện|Mạch IGBT với 8×470µF',
      applications: 'Xưởng gia công nhỏ|Xưởng sửa chữa bảo trì|Dây chuyền sản xuất khởi điểm',
    },
    ar: {
      summary: 'مجموعة MIG/MMA للمبتدئين: لحام بالغاز وبالقطب مع دخل مرن.',
      description: 'تغطي MIG/MMA-315Y لحام MIG والقطب الكهربائي في وحدة واحدة، بمدخل مرن 220/380/ثلاثي الطور يناسب الورش ذات الشبكات المختلطة. تُشحن كاملة — مشعلة وكابلات ومشبس ومنظم CO2 — ليبدأ العميل باللحام يوم استلامها.',
      features: 'طريقتا MMA وMIG في ماكينة واحدة|مرونة دخل 220/380/380 فولت ثلاثي|سلك 0.8–1.0 مم|حزمة ملحقات كاملة|مرحلة إنفرتر IGBT بمكثفات 8×470µF',
      applications: 'ورش التصنيع الصغيرة|ورش الإصلاح والصيانة|خطوط إنتاج ابتدائية',
    },
  },
  'mig-mma-400ci': {
    vi: {
      summary: 'Chu kỳ tải 100% tại 350A trên khung gọn 515mm — sẵn sàng cho dây chuyền.',
      description: 'MIG/MMA-400CI đạt trọn chu kỳ 100% ở 350A trong khung gọn 515×270. Với bộ đẩy dây kép cho dây 0,8–1,2 mm và bộ phụ kiện đầy đủ, máy sinh ra cho dây chuyền hàn mối liên tục cả ca.',
      features: 'Chu kỳ tải 100% tại 350A|Bộ đẩy dây kép ổn định|Khung gọn rộng 515mm|Dây 0,8–1,2 mm|Đủ bộ phụ kiện',
      applications: 'Dây chuyền liên tục|Nội thất & cửa thép|Gia công phụ tùng ô tô',
    },
    ar: {
      summary: 'دورة تشغيل 100% عند 350 أمبير في هيكل مضغوط 514 مم — جاهزة لخط الإنتاج.',
      description: 'تمنح MIG/MMA-400CI دورة تشغيل كاملة 100% عند 350 أمبير في هيكل 515×270 المدمج. مع وحدة التغذية المزدوجة لسلك 0.8–1.2 مم وحزمة ملحقات كاملة، صُنعت لخطوط تُلحم قطاعات مستمرة طوال الوردية.',
      features: 'دورة تشغيل 100% عند 350 أمبير|تغذية مزدوجة الدفع لثبات السلك|هيكل مضغوط 514 مم|سلك مصمت 0.8–1.2 مم|حزمة ملحقات كاملة',
      applications: 'خطوط الإنتاج المستمر|الأثاث والأبواب الفولاذية|قطع غيار السيارات',
    },
  },
  'mig-mma-400': {
    vi: {
      summary: 'Trung vệ MIG/MMA 400A — máy sản xuất cân bằng nhất của chúng tôi.',
      description: 'MIG/MMA-400 là mẫu bán số lượng của dòng MIG: 400A chu kỳ 80%, mạch 2×G75N120 và bộ đẩy dây kép với cáp 35mm². Một máy phủ cả hàn khí sản xuất và hàn que, vì thế nó là trụ cột trong catalog của nhiều đại lý.',
      features: '400A định mức chu kỳ 80%|Hai quá trình MIG + MMA|Bộ đẩy dây kép|Cáp hàn 35mm² giảm sụt áp|Đủ bộ phụ kiện',
      applications: 'Gia công thép tổng hợp|Xưởng kết cấu|Chế tạo thiết bị',
    },
    ar: {
      summary: 'ماكينة MIG/MMA 400 أمبير متعددة المهام — أكثر ماكيناتنا الإنتاجية توازنًا.',
      description: 'MIG/MMA-400 هي طراز الحجم في سلسلة MIG: 400 أمبير عند دورة 80%، ومرحلة 2×G75N120، وتغذية مزدوجة بكابلات 35 مم². ماكينة واحدة تغطي اللحام الغازي الإنتاجي واللحام بالقطب، لذلك تشكّل عماد كتالوجات كثير من الموزعين.',
      features: '400 أمبير مقننًا عند دورة 80%|طريقتا MIG وMMA|تغذية مزدوجة الدفع|كابلات 35 مم² بانخفاض جهد منخفض|حزمة ملحقات كاملة',
      applications: 'التصنيع الفولاذي العام|الورش الإنشائية|تصنيع المعدات',
    },
  },
  'mig-mma-500': {
    vi: {
      summary: 'MIG/MMA 500A cho thép dày và mối hàn dài. Mẫu bán chạy.',
      description: 'MIG/MMA-500 đưa 500A vào hàn tấm dày với bộ đẩy dây kép và bộ cáp 40mm². Mặt hàng bán ổn định cho đại lý phục vụ kết cấu thép và sản xuất rơ-moóc. (Lưu ý: xác nhận phiếu kỹ thuật mới nhất với bộ phận bán hàng — đang cập nhật.)',
      features: '500A cho kết cấu dày|Hai quá trình MIG + MMA|Bộ đẩy dây kép|Bộ cáp 40mm²|Bảo vệ nhiệt có đèn báo',
      applications: 'Gia công kết cấu thép|Rơ-moóc & container|Sản xuất máy nặng',
    },
    ar: {
      summary: 'ماكينة MIG/MMA بقدرة 500 أمبير للقطاعات السميكة والقطاعات الطويلة. طراز مبيع قوي.',
      description: 'تنقل MIG/MMA-500 قدرة 500 أمبير إلى لحام الصفيحة السميكة مع التغذية المزدوجة وحزمة كابلات 40 مم². مبيعات قوية ومستقرة للموزعين الذين يخدمون الهياكل الفولاذية ومصنعي المقطورات. (ملاحظة: أكّد ورقة البيانات المحدثة مع المبيعات — قيد التحديث.)',
      features: '500 أمبير للقطاعات السميكة|طريقتا MIG وMMA|تغذية مزدوجة الدفع|حزمة كابلات 40 مم²|حماية حرارية مع مؤشر',
      applications: 'التصنيع الإنشائي|المقطورات والحاويات|الآلات الثقيلة',
    },
  },
  'mig-mma-500ci': {
    vi: {
      summary: '450A với mạch G100N120 trên khung lớn 570mm.',
      description: 'MIG/MMA-500CI kết hợp mạch 2×G100N120 với khung lớn 570×290, cho 450A ở chu kỳ 80% cho hàn công nghiệp liên tục. Cùng bộ phụ kiện đầy đủ, tay hàn 36KD chịu tải cao hơn.',
      features: 'Mạch IGBT 2×G100N120|450A chu kỳ 80%|Tay hàn 36KD cho tải kéo dài|Bộ đẩy dây kép|Đủ bộ phụ kiện',
      applications: 'Dây chuyền công nghiệp|Kết cấu nặng|Hàn liên tục',
    },
    ar: {
      summary: '450 أمبير بمرحلة G100N120 على الهيكل الأكبر مقاس 570 مم.',
      description: 'تجمع MIG/MMA-500CI مرحلة 2×G100N120 مع الهيكل الأكبر 570×290، فتمنح 450 أمبير عند دورة 80% للّحام الصناعي المستمر. الحزمة الكاملة نفسها مع مشعلة 36KD المصنفة لأحمال أعلى.',
      features: 'مرحلة IGBT 2×G100N120|450 أمبير عند دورة 80%|مشعلة 36KD للأحمال الممتدة|تغذية مزدوجة الدفع|حزمة ملحقات كاملة',
      applications: 'خطوط التصنيع الصناعية|الهياكل الثقيلة|اللحام المستمر',
    },
  },
  'mig-mma-630b': {
    vi: {
      summary: '500A chu kỳ 100% với dây 1,6mm — dựng cho dây chuyền không nghỉ.',
      description: 'MIG/MMA-630B ghép chu kỳ tải 100% với khả năng dây 0,8–1,6 mm trong khung cỡ đầy 655mm. Với cáp 45mm² và biến áp T120, máy đẩy dây lớn đều suốt ca dài — đỉnh dòng MIG.',
      features: '100% chu kỳ tại 500A|Dây 0,8–1,6 mm|Bộ cáp 45mm²|Biến áp T120 cho tải kéo dài|Bộ đẩy dây kép',
      applications: 'Dây chuyền không nghỉ|Gia công nặng|Cụm tàu & cầu',
    },
    ar: {
      summary: '500 أمبير بدورة 100% بسلك 1.6 مم — لخطوط الإنتاج التي لا تتوقف.',
      description: 'تجمع MIG/MMA-630B دورة تشغيل 100% مع قدرة سلك 0.8–1.6 مم في الهيكل الكامل مقاس 655 مم. بكابلات 45 مم² ومحوّل T120 تواصل تغذية السلك السميك خلال أطول الورديات — قمة سلسلة MIG.',
      features: 'دورة 100% عند 500 أمبير|سلك 0.8–1.6 مم|حزمة كابلات 45 مم²|محوّل T120 للأحمال الممتدة|تغذية مزدوجة الدفع',
      applications: 'خطوط بلا توقف|التصنيع الثقيل|مكونات السفن والجسور',
    },
  },
  'mig-mma-630': {
    vi: {
      summary: 'Máy MIG đầu dòng 630A với bộ cáp 50mm².',
      description: 'MIG/MMA-630 chốt dải sản phẩm ở 630A với mạch 2×G150N120, biến áp T130 và cáp 50mm². Cho công việc MIG nặng nhất — kết cấu dày, mối hàn ngang dài — đây là máy mạnh nhất trong catalog.',
      features: 'Dòng ra tối đa 630A|Mạch IGBT 2×G150N120|Bộ cáp 50mm²|Dây 0,8–1,6 mm|Khung gia cố 655mm',
      applications: 'Gia công xây dựng nặng|Hàn tấm dày|Chế tạo thiết bị lớn',
    },
    ar: {
      summary: 'ماكينة MIG في القمة بقدرة 630 أمبير وحزمة كابلات 50 مم².',
      description: 'تُنهي MIG/MMA-630 التشكيلة عند 630 أمبير بمرحلة 2×G150N120 والمحوّل T130 وكابلات 50 مم². لأثقل أعمال اللحام الميكانيكي — القطاعات الإنشائية السميكة والقطاعات الأفقية الطويلة — هذه أقصى ماكينة في الكتالوج.',
      features: 'خرج أقصى 630 أمبير|مرحلة IGBT 2×G150N120|حزمة كابلات 50 مم²|سلك 0.8–1.6 مم|هيكل معزز 655 مم',
      applications: 'التصنيع الإنشائي الثقيل|لحام الصفائح السميكة|تصنيع المعدات الكبيرة',
    },
  },
  // —— 空压机演示产品 ——
  'ac-2500': {
    vi: {
      summary: 'Máy nén không dầu yên tĩnh gọn cho tác vụ nhẹ: cắt plasma tới 40A, dụng cụ khí và vệ sinh.',
      description: 'AC-2500 là mẫu khởi đầu của dòng máy nén sắp ra mắt: đầu nén không dầu yên tĩnh trên bình 24L, độ ồn định mức 58 dB — đủ im lặng để chạy trong xưởng nhỏ. Cỡ công suất phù hợp máy cắt plasma 40A và dụng cụ khí nhẹ.',
      features: 'Đầu nén không dầu — khí sạch không lẫn dầu|58 dB dùng được trong nhà|Bình 24L phủ chống gỉ|Kèm van điều áp và đầu nối nhanh',
      applications: 'Cắt plasma 40A|Dụng cụ khí cầm tay|Vệ sinh xưởng|Bơm lốp',
    },
    ar: {
      summary: 'ضاغط صامت خالٍ من الزيت مدمج للمهام الخفيفة: قطع بلازما حتى 40 أمبير وأدوات هواء وتنظيف.',
      description: 'AC-2500 هو الطراز الافتتاحي لخط الضواغط القادم: رأس صامت خالٍ من الزيت على خزان 24 لترًا بضجيج مقنن 58 ديسيبل — هادئ بما يكفي للعمل داخل ورشة صغيرة. بحجم يناسب قاطع بلازما 40 أمبير والأدوات الهوائية الخفيفة.',
      features: 'رأس صامت بلا زيت — هواء نظيف بلا تلوث|ضجيج 58 ديسيبل للاستخدام الداخلي|خزان 24 لترًا مطلي|منظم ضغط ووصلة سريعة مرفقة',
      applications: 'قطع بلازما 40 أمبير|أدوات هوائية يدوية|تنظيف الورش|نفخ الإطارات',
    },
  },
  'ac-3500': {
    vi: {
      summary: 'Máy nén yên tĩnh cỡ trung bình bình 50L — đi cùng cắt plasma 60A và dụng cụ khí liên tục.',
      description: 'AC-3500 gấp đôi dung tích bình lên 50L và nâng lưu lượng lên 240 L/phút, phủ cắt plasma 60A và các phiên làm việc dụng cụ khí dài hơn mà vẫn khoảng 60 dB.',
      features: 'Đầu nén không dầu, tầm 60 dB|Bình 50L cho phiên dài|Lưu lượng 240 L/phút|Bộ bánh xe và tay đẩy di chuyển trong xưởng',
      applications: 'Cắt plasma 60A|Máy vặn & súng phun|Khí tổng hợp cho xưởng',
    },
    ar: {
      summary: 'ضاغط صامت متوسط بخزان 50 لترًا — يرافق قطع بلازما 60 أمبير والعمل الهوائي المتواصل.',
      description: 'يضاعف AC-3500 سعة الخزان إلى 50 لترًا ويرفع التدفق إلى 240 لترًا/دقيقة، فيغطي قطع البلازما 60 أمبير وجولات أدوات أطول مع البقاء قرب 60 ديسيبل.',
      features: 'رأس صامت بلا زيت بفئة 60 ديسيبل|خزان 50 لترًا لجولات أطول|تدفق 240 لترًا/دقيقة|طقم عجلات ومقبض للتنقل داخل الورشة',
      applications: 'قطع بلازما 60 أمبير|مفاتيح ربط ومسدسات رش|هواء الورشة العام',
    },
  },
  'ac-5500': {
    vi: {
      summary: 'Máy nén piston dây đai bình 100L — trụ cột cho xưởng gia công bận rộn.',
      description: 'AC-5500 chuyển sang bơm piston gang dây đai trên bình ngang 100L: lưu lượng 420 L/phút hỗ trợ cắt plasma nặng và nhiều dụng cụ cùng lúc ở xưởng gia công đông việc.',
      features: 'Bơm gang dây đai tuổi thọ cao|Bình ngang 100L|Lưu lượng 420 L/phút|Hai đồng hồ áp và van an toàn',
      applications: 'Cắt plasma nặng|Xưởng đa dụng cụ|Chuẩn bị sơn & phun cát',
    },
    ar: {
      summary: 'ضاغط مكبسي بحزام وخزان 100 لتر — العمود الفقري للورش المزدحمة.',
      description: 'ينتقل AC-5500 إلى مضخة مكبسية من حديد الزهر بحزام على خزان أفقي 100 لتر: تدفق 420 لترًا/دقيقة يدعم القطع الثقيل وتشغيل عدة أدوات معًا في ورش التصنيع المزدحمة.',
      features: 'مضخة حديد زهر بحزام بعمر طويل|خزان أفقي 100 لتر|تدفق 420 لترًا/دقيقة|مقياسا ضغط وصمام أمان',
      applications: 'القطع الثقيل|ورش متعددة الأدوات|التحضير للدهان والسفح',
    },
  },
  'ac-7500': {
    vi: {
      summary: 'Đỉnh dải: máy nén dây đai bình 150L cho nhu cầu khí công nghiệp.',
      description: 'AC-7500 đứng đầu dải sắp ra mắt với động cơ 5,5kW và 600 L/phút trên bình 150L — nguồn khí công nghiệp cho trạm plasma liên tục và xưởng nhiều vị trí.',
      features: 'Động cơ công nghiệp 5,5kW|Bình 150L|Lưu lượng 600 L/phút|Bơm dây đai có kính xem dầu',
      applications: 'Trạm cắt plasma liên tục|Xưởng nhiều vị trí|Thiết bị khí công nghiệp',
    },
    ar: {
      summary: 'قمة التشكيلة: ضاغط بحزام وخزان 150 لترًا للاحتياجات الصناعية.',
      description: 'يتصدر AC-7500 التشكيلة القادمة بمحرك 5.5 كيلوواط وتدفق 600 لتر/دقيقة على خزان 150 لترًا — إمداد هواء صناعي لمراكز البلازما المستمرة والورش متعددة المواقف.',
      features: 'محرك صناعي 5.5 كيلوواط|خزان 150 لترًا|تدفق 600 لتر/دقيقة|مضخة حزام بزجاج معايرة الزيت',
      applications: 'مراكز قطع بلازما مستمرة|ورش متعددة المواقف|المعدات الهوائية الصناعية',
    },
  },
};

async function main() {
  for (const [slug, labels] of Object.entries(catLabels)) {
    const f = C(`categories/${slug}.json`);
    const j = JSON.parse(await readFile(f, 'utf8'));
    for (const s of j.specSchema) {
      if (labels[s.key]) {
        s.labelVi = labels[s.key][0];
        s.labelAr = labels[s.key][1];
      }
    }
    if (catI18n[slug]) {
      j.i18n = { ...(j.i18n || {}), vi: catI18n[slug].vi, ar: catI18n[slug].ar };
    }
    await writeFile(f, JSON.stringify(j, null, 2) + '\n');
    console.log(`✓ categories/${slug}.json`);
  }
  for (const [slug, tr] of Object.entries(products)) {
    const f = C(`products/${slug}.json`);
    const j = JSON.parse(await readFile(f, 'utf8'));
    j.i18n = {
      ...(j.i18n || {}),
      vi: { ...(j.i18n?.vi || {}), ...tr.vi },
      ar: { ...(j.i18n?.ar || {}), ...tr.ar },
    };
    await writeFile(f, JSON.stringify(j, null, 2) + '\n');
    console.log(`✓ products/${slug}.json`);
  }
  console.log('done');
}
main().catch((e) => { console.error(e); process.exit(1); });
