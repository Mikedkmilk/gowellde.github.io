/**
 * 一次性脚本：把西语/俄语内容翻译注入 src/content 下的产品与品类 JSON。
 * 运行：node scripts/inject-i18n.mjs
 * 以后新增产品可直接在 JSON 里手写 i18n 字段（见 README），无需重跑本脚本。
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const C = (p) => path.join(__dirname, '..', 'src', 'content', p);

const products = {
  'arc-315e': {
    es: {
      summary: 'Soldadora portátil de 4,1 kg para reparación en obra y fabricación ligera. Nuestro modelo de entrada más vendido.',
      description: 'La ARC-315E es la opción estándar para soldadura básica con electrodo. Con solo 4,1 kg se traslada fácilmente entre talleres, azoteas y sitios remotos, mientras el inversor IGBT mantiene un arco estable en extensiones largas y con generador. Aporta uniones complejas y espacios estrechos donde las máquinas pesadas no llegan.',
      features: 'Tecnología inversora IGBT, alta relación potencia-peso|Arranque en caliente y antiadherencia para fácil cebado|Protección térmica con indicador|Funciona con red de 220V o 380V ±15%|Compatible con generador para exteriores',
      applications: 'Mantenimiento y reparación en obra|Fabricación ligera de acero|Punteo de ferralla|Uso general agrícola y de taller',
    },
    ru: {
      summary: 'Портативный аппарат 4,1 кг для ремонта на объекте и лёгкого производства. Наш самый продаваемый стартовый аппарат.',
      description: 'ARC-315E — базовый выбор для ручной дуговой сварки. Вес всего 4,1 кг позволяет легко переносить аппарат по цехам, кровлям и удалённым объектам, а IGBT-инвертор держит дугу стабильной на длинных удлинителях и от генератора. Справляется со сложными соединениями и узкими местами, куда тяжёлым машинам не добраться.',
      features: 'Инверторная технология IGBT, высокая мощность на килограмм|Горячий старт и антизалипание для лёгкого поджига|Термозащита с индикатором|Работа от сети 220В или 380В ±15%|Совместим с генератором',
      applications: 'Ремонт и обслуживание на объектах|Лёгкие металлоконструкции|Прихватка арматуры|Ферма и общие работы в мастерской',
    },
  },
  'arc-315a': {
    es: {
      summary: 'Soldadora de 180 A con etapa IGBT más robusta — la evolución natural de la 315E.',
      description: 'La ARC-315A sube a 180 A con módulos IGBT G40N120 y capacitores más grandes, aceptando electrodos de 2,5–4,0 mm para trabajos estructurales. Sigue siendo una máquina de una mano a 5,4 kg y es una venta probada para distribuidores del sector construcción.',
      features: 'Etapa de potencia IGBT 4×G40N120 mejorada|Rango de electrodos 2,5–4,0 mm para trabajo estructural|Arranque en caliente y antiadherencia|Protección térmica con auto-recuperación|Opciones de alimentación 220V / 380V',
      applications: 'Soldadura en obra|Estructuras de acero|Talleres de mantenimiento',
    },
    ru: {
      summary: 'Аппарат 180 А с усиленной IGBT-ступенью — логичное развитие модели 315E.',
      description: 'ARC-315A выдаёт 180 А на модулях G40N120 с увеличенными конденсаторами, работая электродами 2,5–4,0 мм для ответственных конструкций. По-прежнему переносной аппарат весом 5,4 кг и проверенный бестселлер для строительного рынка.',
      features: 'Улучшенная силовая ступень 4×G40N120|Электроды 2,5–4,0 мм для несущих конструкций|Горячий старт и антизалипание|Термозащита с автовосстановлением|Варианты питания 220В / 380В',
      applications: 'Сварка на стройке|Металлоконструкции|Ремонтные мастерские',
    },
  },
  'arc-400b': {
    es: {
      summary: 'Soldadora de 200 A con el banco de capacitores más grande de su clase.',
      description: 'La ARC-400B combina 200 A de salida con 4×820 µF y un ventilador 12038, pensada para trabajo continuo en mesas de fabricación y obra. Con 6,6 kg sigue siendo portátil y el ciclo de trabajo admite cordones largos con electrodos de 2,5–4,0 mm.',
      features: 'Banco de capacitores 4×820µF/450V para arco estable|Ventilador grande 12038|Salida 200 A para electrodos de 4,0 mm|Arranque en caliente, antiadherencia y ajuste de arc force|Protección térmica',
      applications: 'Talleres de fabricación|Construcción y ferralla|Reparación de equipos',
    },
    ru: {
      summary: 'Сварочный аппарат 200 А с самым ёмким банком конденсаторов в классе.',
      description: 'ARC-400B выдаёт 200 А с банком 4×820 мкФ и вентилятором 12038 — создана для непрерывной работы на производственных столах и стройплощадках. Вес 6,6 кг сохраняет мобильность, а ПВ позволяет варить длинные швы электродами 2,5–4,0 мм.',
      features: 'Банк конденсаторов 4×820 мкФ/450В — стабильная дуга|Мощный вентилятор 12038|Ток 200 А под электроды 4,0 мм|Горячий старт, антизалипание и регулировка Arc Force|Термозащита',
      applications: 'Производственные цеха|Строительство и арматура|Ремонт техники',
    },
  },
  'arc-400a': {
    es: {
      summary: 'Soldadora industrial de 250 A con opciones de alimentación hasta trifásica.',
      description: 'La ARC-400A es el escalón industrial de la clase 400: 250 A, banco de 8×470 µF y transformador T80 para entornos de producción exigentes. Las opciones de entrada (220V, 380V o trifásica 380V) permiten que un solo SKU sirva a distintas condiciones de red.',
      features: 'Salida nominal 250 A para electrodos pesados|Entrada 220V / 380V / 3P 380V|Banco de capacitores 8×470 µF|Transformador T80 de alta capacidad|Carcasa industrial con panel frontal reforzado',
      applications: 'Plantas industriales|Reparación de equipo pesado|Talleres estructurales',
    },
    ru: {
      summary: 'Промышленный аппарат 250 А с питанием вплоть до трёхфазного.',
      description: 'ARC-400A — промышленный уровень класса 400: 250 А, банк 8×470 мкФ и трансформатор T80 для требовательного производства. Варианты входа (220В, 380В или 3-ф 380В) позволяют одной модели закрывать разные условия электроснабжения.',
      features: 'Номинальный ток 250 А под тяжёлые электроды|Питание 220В / 380В / 3-ф 380В|Банк конденсаторов 8×470 мкФ|Трансформатор T80 повышенной мощности|Промышленный корпус с усиленной передней панелью',
      applications: 'Промышленные предприятия|Ремонт тяжёлой техники|Металлоконструкции',
    },
  },
  'arc-400': {
    es: {
      summary: 'Trifásica de 320 A al 80% de ciclo — la entrada a la clase pesada de fabricación.',
      description: 'La ARC-400 entra en la clase trifásica pesada: 320 A al 80% de ciclo de trabajo, rango de electrodos 2,5–5,0 mm y transformador de núcleo de ferrita T102 manejado por dos IGBT G50N120. Es la máquina base para plantas de estructuras de acero que realizan cordones largos y continuos.',
      features: '320 A nominales al 80% de ciclo de trabajo|Entrada industrial trifásica 380V|Capacidad de electrodo 5,0 mm|Etapa IGBT puente 2×G50N120|Ventilador de alto caudal 200FZY',
      applications: 'Plantas de estructuras metálicas|Astilleros y puentes|Maquinaria pesada',
    },
    ru: {
      summary: 'Трёхфазный аппарат 320 А при ПВ 80% — вход в тяжёлый производственный класс.',
      description: 'ARC-400 выходит в тяжёлый трёхфазный класс: 320 А при ПВ 80%, электроды 2,5–5,0 мм и ферритовый трансформатор T102 на двух IGBT G50N120. Базовый аппарат для заводов металлоконструкций с длинными непрерывными швами.',
      features: '320 А номинала при ПВ 80%|Промышленное трёхфазное питание 380В|Электроды до 5,0 мм|Полумостовая IGBT-ступень 2×G50N120|Высокопроизводительный вентилятор 200FZY',
      applications: 'Заводы металлоконструкций|Судостроение и мосты|Тяжёлое машиностроение',
    },
  },
  'arc-500b': {
    es: {
      summary: '400 A al 80% de ciclo en el chasis probado de 515 mm — etapa renovada, misma huella.',
      description: 'La ARC-500B renueva la etapa de potencia de la clase 500 con dos IGBT G75N120, entregando 400 A al 80% de ciclo en el mismo chasis compacto que la ARC-400. Una actualización directa para usuarios de la ARC-400 que necesitan margen para electrodos de 5,0 mm.',
      features: '400 A nominales al 80% de ciclo|Etapa IGBT 2×G75N120|Mismo chasis y anclajes que la ARC-400|Capacidad de electrodo 5,0 mm|Ventilación termostática',
      applications: 'Fabricación pesada|Construcción de estructuras|Mantenimiento minero',
    },
    ru: {
      summary: '400 А при ПВ 80% в проверенном корпусе 515 мм — новая силовая ступень, те же габариты.',
      description: 'ARC-500B обновляет силовую ступень 500-класса двумя IGBT G75N120, выдавая 400 А при ПВ 80% в том же компактном корпусе, что и ARC-400. Прямое обновление для владельцев ARC-400, которым нужен запас под электроды 5,0 мм.',
      features: '400 А при ПВ 80%|Ступень 2×G75N120|Тот же корпус и крепления, что у ARC-400|Электроды до 5,0 мм|Термостатическое управление вентилятором',
      applications: 'Тяжёлое производство|Стальные конструкции|Ремонт в карьерах',
    },
  },
  'arc-500': {
    es: {
      summary: '450 A al 100% de ciclo — diseñada para soldar toda la jornada sin parar.',
      description: 'La ARC-500 entrega 450 A al 100% de ciclo con una etapa 2×G100N120 y transformador T105. Para líneas de producción donde el arco nunca se enfría, es la máquina que sigue trabajando todo el turno.',
      features: 'Ciclo de trabajo 100% a corriente nominal|Etapa IGBT 2×G100N120|Estabilidad de arco para chapa gruesa|Capacidad de electrodo 5,0 mm|Display digital de corriente en el frontal',
      applications: 'Soldadura de producción continua|Chapa gruesa|Plantas estructurales',
    },
    ru: {
      summary: '450 А при ПВ 100% — создан варить всю смену без остановки.',
      description: 'ARC-500 выдаёт 450 А при ПВ 100% на ступени 2×G100N120 с трансформатором T105. Для производств, где дуга не остывает, — аппарат, который работает всю смену.',
      features: 'ПВ 100% при номинальном токе|Ступень 2×G100N120|Стабильность дуги на толстом металле|Электроды до 5,0 мм|Цифровой индикатор тока на передней панели',
      applications: 'Непрерывное производство|Толстолистовой металл|Металлоконструкции',
    },
  },
  'arc-630b': {
    es: {
      summary: '500 A al 100% de ciclo en el chasis de clase 630. Fotos a solicitud.',
      description: 'La ARC-630B combina el chasis de clase 630 y el transformador T120 con una etapa 2×G100N120 de 500 A al 100% de ciclo — salida extrema y continua para la soldadura con electrodo más exigente. Contáctenos para fotos actuales y ficha técnica.',
      features: '500 A al 100% de ciclo|Transformador T120 para carga sostenida|Chasis reforzado clase 630|Capacidad de electrodo 5,0 mm',
      applications: 'Construcción pesada|Fabricación estructural grande|Soldadura continua de alta carga',
    },
    ru: {
      summary: '500 А при ПВ 100% в корпусе 630-класса. Фото по запросу.',
      description: 'ARC-630B сочетает корпус 630-класса и трансформатор T120 со ступенью 2×G100N120 на 500 А при ПВ 100% — экстремальный непрерывный ток для самой тяжёлой ММА-сварки. Актуальные фото и техпаспорт — по запросу.',
      features: '500 А при ПВ 100%|Трансформатор T120 для длительной нагрузки|Усиленный корпус 630-класса|Электроды до 5,0 мм',
      applications: 'Тяжёлое строительство|Крупные металлоконструкции|Непрерывная тяжёлая сварка',
    },
  },
  'arc-630': {
    es: {
      summary: 'Soldadora tope de gama de 630 A — la cima de la línea MMA de GOWELLDE.',
      description: 'La ARC-630 corona la gama MMA con 630 A desde una etapa 2×G150N120 y el transformador T130. Para precalentamiento, secciones estructurales gruesas y gouging con carbón, es la máquina que especifican los fabricantes pesados cuando nada más pequeño sobrevive al turno.',
      features: 'Salida máxima 630 A|Etapa IGBT 2×G150N120 de primera calidad|Transformador T130 de servicio pesado|80% de ciclo a corriente nominal|Carcasa reforzada clase 630',
      applications: 'Fabricación estructural pesada|Gouging con carbón|Proyectos de construcción a gran escala',
    },
    ru: {
      summary: 'Флагман на 630 А — вершина линейки MMA GOWELLDE.',
      description: 'ARC-630 возглавляет линейку MMA: 630 А на ступени 2×G150N120 с трансформатором T130. Для подогрева, толстых несущих сечений и воздушно-дуговой строжки — аппарат, который берут тяжёлые производства, когда меньшие не переживают смену.',
      features: 'Максимальный ток 630 А|IGBT-ступень 2×G150N120 высшего класса|Тяжёлый трансформатор T130|ПВ 80% при номинале|Усиленный корпус 630-класса',
      applications: 'Тяжёлые металлоконструкции|Воздушно-дуговая строжка|Крупные строительные объекты',
    },
  },
  'mig-mma-315y': {
    es: {
      summary: 'Combo MIG/MMA de entrada: soldadura con gas más electrodo, entradas flexibles.',
      description: 'La MIG/MMA-315Y cubre soldadura MIG y electrodo en una sola unidad, con entradas flexibles de 220V/380V/trifásica que se adaptan a talleres con redes mixtas. Se envía como paquete completo — antorcha, cables, pinza y regulador CO2 incluidos — para que el usuario final suelde el día que llega.',
      features: 'Procesos MIG y MMA en una máquina|Flexibilidad de entrada 220V / 380V / 3P 380V|Rango de alambre 0,8–1,0 mm|Paquete completo de accesorios incluido|Etapa inversora IGBT con 8×470 µF',
      applications: 'Talleres de fabricación pequeños|Talleres de reparación y mantenimiento|Líneas de producción iniciales',
    },
    ru: {
      summary: 'Начальный комбо-аппарат MIG/MMA: полуавтомат плюс ММА, гибкое питание.',
      description: 'MIG/MMA-315Y закрывает полуавтомат и ММА в одном корпусе, с гибким питанием 220В/380В/3-ф для цехов со смешанными сетями. Поставляется полным комплектом — горелка, кабели, зажим и CO2-редуктор, — чтобы сварщик начал работать в день получения.',
      features: 'MIG и MMA в одном аппарате|Питание 220В / 380В / 3-ф 380В|Проволока 0,8–1,0 мм|Полный комплект аксессуаров|IGBT-ступень с банком 8×470 мкФ',
      applications: 'Небольшие производственные цеха|Ремонтные мастерские|Стартовые производственные линии',
    },
  },
  'mig-mma-400ci': {
    es: {
      summary: '100% de ciclo a 350 A en el chasis compacto de 515 mm — lista para línea de producción.',
      description: 'La MIG/MMA-400CI entrega un ciclo de trabajo completo del 100% a 350 A en el chasis compacto de 515×270 mm. Con el alimentador de doble tracción para alambre de 0,8–1,2 mm y un paquete completo de accesorios, está hecha para líneas que sueldan cordones continuos toda la jornada.',
      features: '100% de ciclo de trabajo a 350 A|Alimentador de doble tracción para alimentación estable|Chasis compacto de 515 mm|Rango de alambre sólido 0,8–1,2 mm|Paquete completo de accesorios incluido',
      applications: 'Líneas de producción continua|Muebles y puertas de acero|Piezas automotrices',
    },
    ru: {
      summary: 'ПВ 100% при 350 А в компактном корпусе 515 мм — готова к производственной линии.',
      description: 'MIG/MMA-400CI выдаёт полные 100% ПВ при 350 А в компактном корпусе 515×270 мм. С двухприводным механизмом подачи проволоки 0,8–1,2 мм и полным комплектом аксессуаров — для линий с непрерывными швами всю смену.',
      features: 'ПВ 100% при 350 А|Двухприводная подача — стабильная проволока|Компактный корпус 515 мм|Сплошная проволока 0,8–1,2 мм|Полный комплект аксессуаров',
      applications: 'Непрерывные производственные линии|Мебель и двери из стали|Автокомпоненты',
    },
  },
  'mig-mma-400': {
    es: {
      summary: 'Caballo de batalla MIG/MMA de 400 A — nuestra máquina de producción más equilibrada.',
      description: 'La MIG/MMA-400 es el modelo de volumen de la línea MIG: 400 A al 80% de ciclo, etapa 2×G75N120 y alimentador de doble tracción con cables de 35 mm². Una sola máquina cubre soldadura con gas y electrodo, por eso ancla tantos catálogos de distribuidores.',
      features: '400 A nominales al 80% de ciclo|Doble proceso MIG + MMA|Alimentador de doble tracción|Cables de 35 mm² de baja caída|Paquete completo de accesorios incluido',
      applications: 'Fabricación general de acero|Talleres estructurales|Manufactura de equipos',
    },
    ru: {
      summary: 'Рабочая лошадка MIG/MMA на 400 А — самый сбалансированный производственный аппарат.',
      description: 'MIG/MMA-400 — объёмная модель линейки MIG: 400 А при ПВ 80%, ступень 2×G75N120 и двухприводная подача с кабелями 35 мм². Один аппарат закрывает полуавтомат и ММА — поэтому он основа стольких каталогов дистрибьюторов.',
      features: '400 А при ПВ 80%|Два процесса MIG + MMA|Двухприводная подача|Кабели 35 мм² с малым падением|Полный комплект аксессуаров',
      applications: 'Общее металлопроизводство|Цеха металлоконструкций|Производство оборудования',
    },
  },
  'mig-mma-500': {
    es: {
      summary: 'Soldadora MIG/MMA de 500 A para secciones pesadas y cordones largos. Modelo de alta rotación.',
      description: 'La MIG/MMA-500 lleva 500 A a la soldadura de chapa pesada con el alimentador de doble tracción y el paquete de cables de 40 mm². Una venta consistentemente fuerte para distribuidores que atienden estructuras metálicas y fabricantes de remolques. (Nota: confirme la ficha técnica vigente con ventas — la de este modelo está en actualización.)',
      features: '500 A para secciones pesadas|Doble proceso MIG + MMA|Alimentador de doble tracción|Paquete de cables 40 mm²|Protección térmica con indicador',
      applications: 'Fabricación estructural|Remolques y contenedores|Maquinaria pesada',
    },
    ru: {
      summary: 'MIG/MMA 500 А для тяжёлых сечений и длинных швов. Ходовой аппарат.',
      description: 'MIG/MMA-500 подаёт 500 А на толстый металл: двухприводная подача и комплект кабелей 40 мм². Стабильно сильная позиция для дистрибьюторов, работающих с металлоконструкциями и производителями прицепов. (Примечание: уточните актуальный техпаспорт у менеджера — по этой модели он обновляется.)',
      features: '500 А для тяжёлых сечений|Два процесса MIG + MMA|Двухприводная подача|Комплект кабелей 40 мм²|Термозащита с индикатором',
      applications: 'Металлоконструкции|Прицепы и контейнеры|Тяжёлая техника',
    },
  },
  'mig-mma-500ci': {
    es: {
      summary: '450 A con la etapa G100N120 en el chasis ampliado de 570 mm.',
      description: 'La MIG/MMA-500CI combina la etapa 2×G100N120 con el chasis ampliado de 570×290 mm, entregando 450 A al 80% de ciclo para soldadura industrial continua. El mismo paquete completo de accesorios, con antorcha 36KD de mayor rendimiento.',
      features: 'Etapa IGBT 2×G100N120|450 A al 80% de ciclo|Antorcha 36KD para carga sostenida|Alimentador de doble tracción|Paquete completo de accesorios incluido',
      applications: 'Líneas de fabricación industrial|Estructuras pesadas|Soldadura continua',
    },
    ru: {
      summary: '450 А со ступенью G100N120 в увеличенном корпусе 570 мм.',
      description: 'MIG/MMA-500CI сочетает ступень 2×G100N120 с увеличенным корпусом 570×290 мм, выдавая 450 А при ПВ 80% для непрерывной промышленной сварки. Тот же полный комплект аксессуаров, с горелкой 36KD под большую нагрузку.',
      features: 'Ступень 2×G100N120|450 А при ПВ 80%|Горелка 36KD под длительную нагрузку|Двухприводная подача|Полный комплект аксессуаров',
      applications: 'Промышленные линии|Тяжёлые конструкции|Непрерывная сварка',
    },
  },
  'mig-mma-630b': {
    es: {
      summary: '500 A al 100% de ciclo con alambre de 1,6 mm — construida para líneas de producción sin paradas.',
      description: 'La MIG/MMA-630B empareja un ciclo de trabajo del 100% con capacidad de alambre 0,8–1,6 mm en el chasis completo de 655 mm. Con cables de 45 mm² y el transformador T120, sigue alimentando alambre grueso durante los turnos más largos — el tope de la línea MIG.',
      features: '100% de ciclo a 500 A|Rango de alambre 0,8–1,6 mm|Paquete de cables 45 mm²|Transformador T120 para carga sostenida|Alimentador de doble tracción',
      applications: 'Líneas sin paradas|Fabricación pesada|Componentes navales y de puentes',
    },
    ru: {
      summary: '500 А при ПВ 100% с проволокой 1,6 мм — для непрерывных производственных линий.',
      description: 'MIG/MMA-630B совмещает ПВ 100% с проволокой 0,8–1,6 мм в полноразмерном корпусе 655 мм. С кабелями 45 мм² и трансформатором T120 он держит толстую проволоку всю длинную смену — флагман линейки MIG.',
      features: 'ПВ 100% при 500 А|Проволока 0,8–1,6 мм|Комплект кабелей 45 мм²|Трансформатор T120 для длительной нагрузки|Двухприводная подача',
      applications: 'Непрерывные линии|Тяжёлое производство|Судовые и мостовые узлы',
    },
  },
  'mig-mma-630': {
    es: {
      summary: 'Soldadora MIG tope de gama de 630 A con paquete de cables de 50 mm².',
      description: 'La MIG/MMA-630 corona la gama con 630 A desde la etapa 2×G150N120, el transformador T130 y cables de 50 mm². Para la soldadura MIG más pesada — secciones estructurales gruesas y cordones largos horizontales — es la máquina máxima del catálogo.',
      features: 'Salida máxima 630 A|Etapa IGBT 2×G150N120|Paquete de cables 50 mm²|Rango de alambre 0,8–1,6 mm|Carcasa reforzada de 655 mm',
      applications: 'Fabricación de construcción pesada|Soldadura de chapa gruesa|Manufactura de gran equipo',
    },
    ru: {
      summary: 'Топовая MIG 630 А с комплектом кабелей 50 мм².',
      description: 'MIG/MMA-630 замыкает линейку на 630 А: ступень 2×G150N120, трансформатор T130 и кабели 50 мм². Для самой тяжёлой механизированной сварки — толстые несущие сечения и длинные нижние швы — это максимум в каталоге.',
      features: 'Максимальный ток 630 А|Ступень 2×G150N120|Комплект кабелей 50 мм²|Проволока 0,8–1,6 мм|Усиленный корпус 655 мм',
      applications: 'Тяжёлое строительство|Толстолистовая сварка|Крупное оборудование',
    },
  },
};

const categoryLabels = {
  'welding-machines': {
    labels: {
      inputVoltage: ['Tensión de entrada', 'Напряжение питания'],
      ratedCurrent: ['Corriente nominal', 'Номинальный ток'],
      dutyCycleAt40c: ['Ciclo de trabajo @40°C', 'ПВ при 40°C'],
      rodDiameterMm: ['Diámetro de electrodo', 'Диаметр электрода'],
      wireDiameterMm: ['Diámetro de alambre', 'Диаметр проволоки'],
      dimensionsMm: ['Dimensiones (L×An×Al)', 'Габариты (Д×Ш×В)'],
      netWeightKg: ['Peso neto', 'Вес нетто'],
      igbtConfig: ['Etapa de potencia (IGBT)', 'Силовая ступень (IGBT)'],
      accessories: ['Paquete estándar', 'Комплект поставки'],
    },
  },
  'mma-welders': {
    labels: {
      inputVoltage: ['Tensión de entrada', 'Напряжение питания'],
      ratedCurrent: ['Corriente nominal', 'Номинальный ток'],
      dutyCycleAt40c: ['Ciclo de trabajo @40°C', 'ПВ при 40°C'],
      rodDiameterMm: ['Diámetro de electrodo', 'Диаметр электрода'],
      dimensionsMm: ['Dimensiones (L×An×Al)', 'Габариты (Д×Ш×В)'],
      netWeightKg: ['Peso neto', 'Вес нетто'],
      igbtConfig: ['Etapa de potencia (IGBT)', 'Силовая ступень (IGBT)'],
    },
  },
  'mig-mag-welders': {
    labels: {
      inputVoltage: ['Tensión de entrada', 'Напряжение питания'],
      ratedCurrent: ['Corriente nominal', 'Номинальный ток'],
      dutyCycleAt40c: ['Ciclo de trabajo @40°C', 'ПВ при 40°C'],
      wireDiameterMm: ['Diámetro de alambre', 'Диаметр проволоки'],
      dimensionsMm: ['Dimensiones (L×An×Al)', 'Габариты (Д×Ш×В)'],
      netWeightKg: ['Peso neto', 'Вес нетто'],
      igbtConfig: ['Etapa de potencia (IGBT)', 'Силовая ступень (IGBT)'],
      accessories: ['Paquete estándar', 'Комплект поставки'],
    },
  },
};

const categoryI18n = {
  'welding-machines': {
    es: {
      name: 'Máquinas de soldadura',
      intro: 'GOWELLDE fabrica máquinas de soldadura inversoras IGBT para distribuidores y usuarios industriales en todo el mundo. La gama cubre soldadoras MMA de 160 A a 630 A y equipos MIG/MAG con alimentador de doble tracción hasta 630 A. Cada placa pasa una prueba de envejecimiento del 100% antes del ensamblaje y todos los aparatos están clasificados a 40°C. Con soporte OEM/ODM, diseño conforme a CE y logística FOB Qingdao, suministramos a Egipto, India, Pakistán, Vietnam y más de 20 mercados.',
      seoTitle: 'Máquinas de soldadura inversora - MMA y MIG/MAG | GOWELLDE',
      seoDescription: 'Máquinas de soldadura inversoras IGBT de fábrica china: MMA de 160-630 A y MIG/MAG con alimentador de doble tracción. 100% prueba de placas, OEM/ODM, conforme a CE.',
    },
    ru: {
      name: 'Сварочные аппараты',
      intro: 'GOWELLDE производит инверторные сварочные аппараты IGBT для дистрибьюторов и промышленных клиентов по всему миру. Линейка включает аппараты MMA от 160 до 630 А и MIG/MAG с двухприводной подачей до 630 А. Каждая плата проходит 100% тест на старение, все аппараты нормированы при 40°C. С поддержкой OEM/ODM, соответствием CE и логистикой FOB Циндао мы поставляем в Египет, Индию, Пакистан, Вьетнам и ещё 20+ стран.',
      seoTitle: 'Инверторные сварочные аппараты - MMA и MIG/MAG | GOWELLDE',
      seoDescription: 'Инверторные аппараты IGBT с завода в Китае: MMA 160-630 А и MIG/MAG с двухприводной подачей. 100% тест плат, OEM/ODM, соответствие CE.',
    },
  },
  'mma-welders': {
    es: {
      name: 'MMA / Electrodo',
      intro: 'Máquinas de soldadura con electrodo para obras, fabricación estructural y mantenimiento. Las inversoras MMA de GOWELLDE usan módulos IGBT desde unidades portátiles de 160 A (4,1 kg) hasta máquinas industriales trifásicas de 630 A. Arranque en caliente y antiadherencia de serie, y cada máquina pasa prueba de envejecimiento antes de salir de fábrica. Modelos populares para ferralla y trabajo en exterior: series ARC-400 y ARC-500.',
      seoTitle: 'Soldadoras inversoras MMA / electrodo 160A-630A | Fábrica GOWELLDE',
      seoDescription: 'Soldadoras MMA inversoras directas de fábrica: portátiles de 160 A hasta 630 A trifásicas de servicio pesado. Arranque en caliente, antiadherencia, 100% prueba de placas, OEM disponible.',
    },
    ru: {
      name: 'ММА / электрод',
      intro: 'Аппараты ручной дуговой сварки для стройки, металлоконструкций и ремонта. Инверторы MMA GOWELLDE на модулях IGBT: от переносных 160 А (4,1 кг) до трёхфазных промышленных 630 А. Горячий старт и антизалипание в базе, каждый аппарат проходит тест на старение перед отгрузкой. Популярные модели для арматуры и уличной работы: серии ARC-400 и ARC-500.',
      seoTitle: 'Инверторные сварочные аппараты ММА 160А-630А | Завод GOWELLDE',
      seoDescription: 'ММА-инверторы напрямую с завода: переносные от 160 А до трёхфазных 630 А. Горячий старт, антизалипание, 100% тест плат, доступен OEM.',
    },
  },
  'mig-mag-welders': {
    es: {
      name: 'MIG / MAG',
      intro: 'Máquinas de soldadura MIG/MAG con protección gaseosa y alimentador de doble tracción para producción continua. La serie MIG/MMA también cambia a electrodo, cubriendo dos procesos con una sola máquina en el taller. Ciclos de trabajo de hasta el 100% a corriente nominal para plantas estructurales y líneas de fabricación, y cada unidad se envía completa con antorcha, cables, pinza y regulador de CO2.',
      seoTitle: 'Máquinas MIG/MAG con alimentador de doble tracción | GOWELLDE',
      seoDescription: 'Soldadoras MIG/MAG directas de fábrica 250A-630A con alimentador de doble tracción y función MMA. Hasta 100% de ciclo, kit completo de accesorios, OEM/ODM desde China.',
    },
    ru: {
      name: 'MIG / MAG',
      intro: 'Аппараты механизированной сварки MIG/MAG в защитном газе с двухприводной подачей для непрерывного производства. Серия MIG/MMA также переключается на ММА — один аппарат закрывает два процесса в цехе. ПВ до 100% при номинальном токе для металлоконструкций и производственных линий; каждый аппарат поставляется с горелкой, кабелями, зажимом и CO2-редуктором.',
      seoTitle: 'Аппараты MIG/MAG с двухприводной подачей | GOWELLDE',
      seoDescription: 'Сварочные полуавтоматы 250А-630А напрямую с завода: двухприводная подача и функция ММА. ПВ до 100%, полный комплект, OEM/ODM из Китая.',
    },
  },
};

async function main() {
  for (const [slug, tr] of Object.entries(products)) {
    const f = C(`products/${slug}.json`);
    const j = JSON.parse(await readFile(f, 'utf8'));
    j.i18n = {
      ...(j.i18n || {}),
      es: { ...(j.i18n?.es || {}), ...tr.es },
      ru: { ...(j.i18n?.ru || {}), ...tr.ru },
    };
    await writeFile(f, JSON.stringify(j, null, 2) + '\n');
    console.log(`✓ products/${slug}.json`);
  }
  for (const [slug, cfg] of Object.entries(categoryLabels)) {
    const f = C(`categories/${slug}.json`);
    const j = JSON.parse(await readFile(f, 'utf8'));
    for (const s of j.specSchema) {
      if (cfg.labels[s.key]) {
        s.labelEs = cfg.labels[s.key][0];
        s.labelRu = cfg.labels[s.key][1];
      }
    }
    if (categoryI18n[slug]) {
      j.i18n = {
        ...(j.i18n || {}),
        es: { ...(j.i18n?.es || {}), ...categoryI18n[slug].es },
        ru: { ...(j.i18n?.ru || {}), ...categoryI18n[slug].ru },
      };
    }
    await writeFile(f, JSON.stringify(j, null, 2) + '\n');
    console.log(`✓ categories/${slug}.json`);
  }
  console.log('done');
}
main().catch((e) => { console.error(e); process.exit(1); });
