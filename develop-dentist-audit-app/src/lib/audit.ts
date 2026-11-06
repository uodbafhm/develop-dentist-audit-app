// ------------------------------------------------------------------
// MAPSO.RADAR — محرك فحص الحضور الرقمي لعيادات الأسنان
// 5 ركائز، 20 معياراً، نتيجة إجمالية / 100.
// ------------------------------------------------------------------

export type CategoryId = "instagram" | "video" | "gmaps" | "website" | "engagement";
export type IconKey = "instagram" | "video" | "mapPin" | "globe" | "messageCircle";

export interface CriterionOption {
  value: string;
  label: string;
  points: number;
}

export interface CriterionDef {
  id: string;
  label: string;
  hint: string;
  type: "boolean" | "choice";
  points: number;
  options?: CriterionOption[];
  recommendation: string;
}

export interface CategoryDef {
  id: CategoryId;
  shortLabel: string;
  title: string;
  blurb: string;
  icon: IconKey;
  criteria: CriterionDef[];
}

export type AnswerValue = boolean | string;
export type Answers = Record<string, AnswerValue>;

export const CATEGORIES: CategoryDef[] = [
  {
    id: "instagram",
    shortLabel: "إنستغرام",
    title: "إنستغرام ووسائل التواصل",
    blurb: "نشاط العيادة وجودة محتواها على الشبكات الاجتماعية.",
    icon: "instagram",
    criteria: [
      {
        id: "ig_exists",
        label: "حساب إنستغرام خاص بالعيادة",
        hint: "ملف مهني واضح: اسم العيادة، المدينة، وسائل التواصل.",
        type: "boolean",
        points: 3,
        recommendation:
          "أنشئ حساب إنستغرام مهنياً باسم العيادة، مع نبذة واضحة تتضمن المدينة ورابط حجز المواعيد.",
      },
      {
        id: "ig_active",
        label: "الحساب نشط فعلياً",
        hint: "منشور واحد على الأقل خلال آخر 30 يوماً.",
        type: "boolean",
        points: 6,
        recommendation: "استأنف النشر فوراً: الهدف الأدنى منشور واحد في الأسبوع، ويستحسن منشوران.",
      },
      {
        id: "ig_frequency",
        label: "وتيرة النشر",
        hint: "متوسط عدد المنشورات في الشهر.",
        type: "choice",
        points: 6,
        options: [
          { value: "none", label: "بدون منشورات", points: 0 },
          { value: "1-2", label: "1 – 2 شهرياً", points: 2 },
          { value: "3-5", label: "3 – 5 شهرياً", points: 4 },
          { value: "6+", label: "6+ شهرياً", points: 6 },
        ],
        recommendation: "ضع جدولاً تحريرياً بسيطاً وثابتاً: منشوران + 3 قصص في الأسبوع.",
      },
      {
        id: "ig_stories",
        label: "قصص (ستوري) منتظمة",
        hint: "قصص ظاهرة باستمرار: كواليس، مرضى، عروض، تذكير بالمواعيد.",
        type: "boolean",
        points: 2,
        recommendation: "انشر قصصاً يومياً: كواليس العلاج، معدات جديدة، وتذكيرات بالمواعيد.",
      },
      {
        id: "ig_beforeafter",
        label: "محتوى قبل / بعد",
        hint: "نتائج المرضى (بموافقتهم)، تحولات، وكواليس جلسات العلاج.",
        type: "boolean",
        points: 3,
        recommendation:
          "أضف محتوى «إثبات»: قبل/بعد بموافقة كتابية، شهادات مرضى بالفيديو، وكواليس العيادة.",
      },
      {
        id: "social_other",
        label: "شبكات اجتماعية أخرى نشطة",
        hint: "فيسبوك و/أو تيك توك محدَّثة بانتظام.",
        type: "boolean",
        points: 2,
        recommendation: "زامن فيسبوك وتيك توك مع إنستغرام لمضاعفة نقاط التواصل دون جهد إضافي.",
      },
    ],
  },
  {
    id: "video",
    shortLabel: "الفيديو",
    title: "فيديو العيادة",
    blurb: "فيديو يطمئن المريض قبل زيارته الأولى.",
    icon: "video",
    criteria: [
      {
        id: "video_tour",
        label: "جولة فيديو داخل العيادة",
        hint: "فيديو متصل: الخارج → المدخل → الاستقبال → قاعة الانتظار → قاعة العلاج.",
        type: "choice",
        points: 8,
        options: [
          { value: "none", label: "بدون فيديو", points: 0 },
          { value: "partial", label: "جزئية (فضاء واحد)", points: 4 },
          { value: "full", label: "كاملة (من الخارج إلى الداخل)", points: 8 },
        ],
        recommendation:
          "صوّر فيديو من 45 إلى 60 ثانية: الواجهة، المدخل، الاستقبال، قاعة الانتظار، ثم قاعة العلاج مع كرسي الأسنان.",
      },
      {
        id: "video_quality",
        label: "جودة الفيديو",
        hint: "تصوير ثابت، إضاءة نظيفة، صورة واضحة.",
        type: "choice",
        points: 4,
        options: [
          { value: "low", label: "ضعيفة", points: 0 },
          { value: "ok", label: "مقبولة", points: 2 },
          { value: "pro", label: "احترافية", points: 4 },
        ],
        recommendation: "أعد تصوير الفيديو بإضاءة طبيعية مع مثبّت للكاميرا، أو استعن بمصوّر محلي.",
      },
      {
        id: "video_published",
        label: "الفيديو منشور ومرئي",
        hint: "على إنستغرام (ريل مثبّت)، خرائط جوجل و/أو الموقع الإلكتروني.",
        type: "boolean",
        points: 4,
        recommendation: "ثبّت الفيديو في إنستغرام، وأضِفه إلى ملف جوجل التجاري والصفحة الرئيسية للموقع.",
      },
    ],
  },
  {
    id: "gmaps",
    shortLabel: "خرائط جوجل",
    title: "خرائط جوجل والتقييمات",
    blurb: "ملف جوجل: غالباً أول احتكاك للمريض مع العيادة.",
    icon: "mapPin",
    criteria: [
      {
        id: "g_claimed",
        label: "ملف جوجل مُطالَب به ومحدَّث",
        hint: "أوقات العمل، الهاتف، العنوان الدقيق، وفئة «طبيب أسنان».",
        type: "boolean",
        points: 4,
        recommendation:
          "طالِب بملف Google Business Profile وأكمل 100% من المعلومات (أوقات العمل، الخدمات، الخصائص).",
      },
      {
        id: "g_photo_ext",
        label: "صور خارج العيادة",
        hint: "الواجهة والمدخل ظاهران من الشارع ليسهل على المريض إيجاد العيادة.",
        type: "boolean",
        points: 3,
        recommendation: "أضف 3 صور واضحة للواجهة والمدخل، ملتقطة من الرصيف وموقف السيارات.",
      },
      {
        id: "g_photo_reception",
        label: "صور مكتب الاستقبال",
        hint: "أول فضاء يشاهده المريض عند الدخول.",
        type: "boolean",
        points: 3,
        recommendation: "صوّر الاستقبال بزاوية واسعة وإضاءة طبيعية، مع منضدة مرتبة.",
      },
      {
        id: "g_photo_waiting",
        label: "صور قاعة الانتظار",
        hint: "تُظهر الراحة والنظافة قبل العلاج.",
        type: "boolean",
        points: 3,
        recommendation: "أضف صوراً لقاعة الانتظار: مقاعد نظيفة، إضاءة دافئة، بدون أي فوضى.",
      },
      {
        id: "g_photo_chair",
        label: "قاعة العلاج والكرسي ظاهران",
        hint: "كرسي الأسنان يجب أن يظهر نظيفاً وعصرياً في الصور.",
        type: "boolean",
        points: 4,
        recommendation:
          "صوّر قاعة العلاج: الكرسي في المنتصف بحالة ممتازة، المعدات ظاهرة، الأسطح معقّمة.",
      },
      {
        id: "g_rating",
        label: "متوسط تقييم جوجل",
        hint: "التقييم الظاهر على ملف العيادة في جوجل.",
        type: "choice",
        points: 5,
        options: [
          { value: "low", label: "أقل من 3.8 ★", points: 1 },
          { value: "mid", label: "3.8 – 4.4 ★", points: 3 },
          { value: "high", label: "4.5 ★ فأكثر", points: 5 },
        ],
        recommendation: "ضع روتيناً لطلب تقييم من المريض بعد كل علاج ناجح لرفع المعدل تدريجياً.",
      },
      {
        id: "g_reviews",
        label: "عدد تقييمات جوجل",
        hint: "العدد الإجمالي للتقييمات المنشورة على الملف.",
        type: "choice",
        points: 4,
        options: [
          { value: "0-10", label: "0 – 10", points: 0 },
          { value: "10-30", label: "10 – 30", points: 2 },
          { value: "30-75", label: "30 – 75", points: 3 },
          { value: "75+", label: "75 فأكثر", points: 4 },
        ],
        recommendation: "أرسل رابط تقييم جوجل عبر واتساب بعد كل موعد، مع شكر المريض.",
      },
    ],
  },
  {
    id: "website",
    shortLabel: "الموقع",
    title: "الموقع الإلكتروني والحجز",
    blurb: "الموقع يقنع الزائر، والحجز يملأ جدول المواعيد.",
    icon: "globe",
    criteria: [
      {
        id: "web_exists",
        label: "موقع إلكتروني نشط",
        hint: "موقع متاح، آمن (https)، ومحدَّث.",
        type: "boolean",
        points: 6,
        recommendation:
          "أنشئ موقعاً تعريفياً سريعاً: تقديم الطبيب، الخدمات، صور العيادة، وتواصل مباشر.",
      },
      {
        id: "web_booking",
        label: "الحجز عبر الإنترنت (Booking)",
        hint: "حجز مواعيد مدمج: وحدة داخلية، Calendly، أو أداة طبية متخصصة.",
        type: "boolean",
        points: 8,
        recommendation: "ادمج حجز المواعيد عبر الإنترنت مع تأكيد تلقائي برسالة نصية أو واتساب.",
      },
      {
        id: "web_mobile",
        label: "تجربة الهاتف للموقع",
        hint: "أكثر من 80% من الزيارات تأتي من الهاتف.",
        type: "choice",
        points: 4,
        options: [
          { value: "bad", label: "سيئة", points: 0 },
          { value: "ok", label: "مقبولة", points: 2 },
          { value: "great", label: "ممتازة", points: 4 },
        ],
        recommendation: "حسّن نسخة الهاتف: تحميل في أقل من 3 ثوانٍ، وأزرار «اتصل» و«الاتجاهات» ظاهرة دائماً.",
      },
      {
        id: "web_content",
        label: "محتوى واضح: الخدمات، الفريق، الأسعار",
        hint: "يفهم المريض العرض قبل أن يرفع سماعة الهاتف.",
        type: "boolean",
        points: 4,
        recommendation: "انشر قائمة الخدمات وصور الفريق وأسعاراً استرشادية لتقليل المكالمات غير الضرورية.",
      },
    ],
  },
  {
    id: "engagement",
    shortLabel: "التفاعل",
    title: "الردود والتفاعل مع المرضى",
    blurb: "الرد السريع والجيد هو ما يحوّل المشاهد إلى مريض.",
    icon: "messageCircle",
    criteria: [
      {
        id: "eng_reviews_reply",
        label: "الطبيب يرد على تقييمات جوجل",
        hint: "ردود ظاهرة على التقييمات، الإيجابية والسلبية.",
        type: "choice",
        points: 5,
        options: [
          { value: "never", label: "أبداً", points: 0 },
          { value: "sometimes", label: "أحياناً", points: 2 },
          { value: "always", label: "دائماً", points: 5 },
        ],
        recommendation: "رُدّ على كل تقييم خلال 48 ساعة: شكر شخصي أو معالجة راقية لأي استياء.",
      },
      {
        id: "eng_questions",
        label: "يرد على أسئلة المرضى",
        hint: "أسئلة جوجل، التعليقات، والرسائل الخاصة على إنستغرام.",
        type: "boolean",
        points: 4,
        recommendation: "راقب أسئلة جوجل والرسائل الخاصة على إنستغرام، وأجب خلال أقل من 24 ساعة عمل.",
      },
      {
        id: "eng_whatsapp",
        label: "واتساب للأعمال (WhatsApp Business) نشط",
        hint: "ملف مهني بأوقات العمل، كتالوج الخدمات، ورسائل تلقائية.",
        type: "boolean",
        points: 2,
        recommendation: "فعّل WhatsApp Business: رسالة ترحيب، ردود سريعة، وكتالوج الخدمات.",
      },
      {
        id: "eng_delay",
        label: "متوسط زمن الرد",
        hint: "المدة المتوسطة قبل الرد على مريض عبر الإنترنت.",
        type: "choice",
        points: 3,
        options: [
          { value: "slow", label: "أكثر من 48 ساعة", points: 0 },
          { value: "day", label: "أقل من 24 ساعة", points: 1 },
          { value: "fast", label: "أقل من 4 ساعات", points: 3 },
        ],
        recommendation: "ضع ردوداً سريعة تلقائية، ونبّه الفريق فورياً عند وصول أي رسالة.",
      },
    ],
  },
];

export const TOTAL_CRITERIA = CATEGORIES.reduce((n, c) => n + c.criteria.length, 0);

export const MAX_TOTAL = CATEGORIES.reduce(
  (n, c) => n + c.criteria.reduce((m, cr) => m + cr.points, 0),
  0,
); // = 100

export function criterionScore(def: CriterionDef, answers: Answers): number {
  const raw = answers[def.id];
  if (def.type === "boolean") return raw === true ? def.points : 0;
  const opt = def.options?.find((o) => o.value === raw);
  return opt ? opt.points : 0;
}

export interface CategoryResult {
  id: CategoryId;
  shortLabel: string;
  title: string;
  icon: IconKey;
  earned: number;
  max: number;
  percent: number;
}

export interface Gap {
  criterionId: string;
  label: string;
  categoryId: CategoryId;
  categoryTitle: string;
  lost: number;
  max: number;
  recommendation: string;
}

export interface Verdict {
  label: string;
  tagline: string;
  color: string;
  softColor: string;
}

export function verdictFor(score: number): Verdict {
  if (score < 25) {
    return {
      label: "غير مرئي",
      tagline: "العيادة شبه غائبة على الإنترنت. وفي هذه الأثناء، المنافسون يكسبون المرضى.",
      color: "#e5484d",
      softColor: "#fae3e3",
    };
  }
  if (score < 50) {
    return {
      label: "حضور خجول",
      tagline: "توجد بعض الأساسات، لكن أغلب المرضى يختارون عيادات أكثر ظهوراً.",
      color: "#e8960c",
      softColor: "#faeed3",
    };
  }
  if (score < 75) {
    return {
      label: "مرئي",
      tagline: "أساس رقمي جيد. بعض الجهود المستهدفة تكفي للسيطرة على منطقتك.",
      color: "#3d7bf5",
      softColor: "#e2ecfd",
    };
  }
  return {
    label: "قائد رقمي",
    tagline: "حضور ممتاز على الإنترنت. العيادة تحوّل ظهورها إلى مواعيد حقيقية.",
    color: "#00a86b",
    softColor: "#d9f3e6",
  };
}

export interface AuditResults {
  total: number;
  categories: CategoryResult[];
  gaps: Gap[];
  verdict: Verdict;
}

export function computeResults(answers: Answers): AuditResults {
  const categories: CategoryResult[] = CATEGORIES.map((cat) => {
    const earned = cat.criteria.reduce((n, c) => n + criterionScore(c, answers), 0);
    const max = cat.criteria.reduce((n, c) => n + c.points, 0);
    return {
      id: cat.id,
      shortLabel: cat.shortLabel,
      title: cat.title,
      icon: cat.icon,
      earned,
      max,
      percent: max === 0 ? 0 : Math.round((earned / max) * 100),
    };
  });

  const total = categories.reduce((n, c) => n + c.earned, 0);

  const gaps: Gap[] = [];
  for (const cat of CATEGORIES) {
    for (const c of cat.criteria) {
      const earned = criterionScore(c, answers);
      const lost = c.points - earned;
      if (lost > 0) {
        gaps.push({
          criterionId: c.id,
          label: c.label,
          categoryId: cat.id,
          categoryTitle: cat.shortLabel,
          lost,
          max: c.points,
          recommendation: c.recommendation,
        });
      }
    }
  }
  gaps.sort((a, b) => b.lost - a.lost || a.label.localeCompare(b.label));

  return { total, categories, gaps, verdict: verdictFor(total) };
}

export function barTone(percent: number): string {
  if (percent < 40) return "#e5484d";
  if (percent < 70) return "#e8960c";
  return "#00a86b";
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ar-MA", { day: "2-digit", month: "long", year: "numeric" });
}
