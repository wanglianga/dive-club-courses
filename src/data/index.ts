export type CourseLevel = "discover" | "openwater" | "advanced" | "rescue";

export interface Course {
  id: CourseLevel;
  name: string;
  nameEn: string;
  shortName: string;
  description: string;
  duration: string;
  maxDepth: number;
  price: number;
  originalPrice?: number;
  prerequisites: string[];
  icon: string;
  color: string;
  bgColor: string;
  badge?: string;
}

export interface Instructur {
  id: string;
  name: string;
  title: string;
  rating: number;
  dives: number;
  experience: string;
  specialties: string[];
  avatar: string;
  languages: string[];
}

export interface TrainingStage {
  id: string;
  name: string;
  type: "pool" | "openwater" | "theory";
  duration: string;
  description: string;
  completed: boolean;
  date?: string;
}

export interface CourseSession {
  id: string;
  courseId: CourseLevel;
  poolDates: string[];
  openWaterDates: string[];
  instructorId: string;
  maxStudents: number;
  enrolled: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: "mask" | "fins" | "wetsuit" | "bcd" | "regulator" | "accessory";
  sizes?: string[];
  required: boolean;
  description?: string;
  icon: string;
}

export interface SizeOption {
  label: string;
  value: string;
  bust?: string;
  waist?: string;
  hip?: string;
  height?: string;
  foot?: string;
}

export interface HealthDeclaration {
  id: string;
  question: string;
  warning: boolean;
}

export interface CertificateProgress {
  id: string;
  courseId: CourseLevel;
  studentName: string;
  theoryScore: number;
  poolStatus: "pending" | "completed" | "failed";
  openWaterDives: number;
  requiredDives: number;
  overallProgress: number;
  issueDate?: string;
  certificateNumber?: string;
}

export interface SeaCondition {
  date: string;
  location: string;
  waveHeight: string;
  visibility: string;
  waterTemp: string;
  current: string;
  weather: string;
  level: "calm" | "moderate" | "rough" | "dangerous";
  recommendation: string;
}

export interface MeetingPoint {
  id: string;
  name: string;
  address: string;
  time: string;
  notes: string;
  mapImage?: string;
}

export const courses: Course[] = [
  {
    id: "discover",
    name: "体验潜水",
    nameEn: "Discover Scuba Diving",
    shortName: "DSD",
    description: "零基础体验课程，在教练陪同下探索水下世界，感受呼吸水下的奇妙体验。",
    duration: "半天 ~ 1天",
    maxDepth: 12,
    price: 680,
    badge: "热门",
    prerequisites: ["年满10周岁", "无严重心脏病/哮喘", "会基础游泳"],
    icon: "Waves",
    color: "text-ocean-300",
    bgColor: "bg-ocean-300",
  },
  {
    id: "openwater",
    name: "开放水域潜水员",
    nameEn: "Open Water Diver",
    shortName: "OW",
    description: "PADI 入门认证课程，完成后可独立潜水至18米，全球通用潜水执照。",
    duration: "3~4天",
    maxDepth: 18,
    price: 3280,
    originalPrice: 3680,
    badge: "推荐",
    prerequisites: ["年满10周岁", "无严重心脏病/哮喘", "会游泳200米", "近1年内体检合格"],
    icon: "Anchor",
    color: "text-coral-400",
    bgColor: "bg-coral-400",
  },
  {
    id: "advanced",
    name: "进阶开放水域潜水员",
    nameEn: "Advanced Open Water",
    shortName: "AOW",
    description: "提升潜水技能，学习导航、深潜、船潜等专长，探索更多潜水点。",
    duration: "2~3天",
    maxDepth: 30,
    price: 2880,
    prerequisites: ["持有OW证书", "年满12周岁", "近6个月内有潜水记录"],
    icon: "Compass",
    color: "text-kelp-400",
    bgColor: "bg-kelp-400",
  },
  {
    id: "rescue",
    name: "救援潜水员",
    nameEn: "Rescue Diver",
    shortName: "RD",
    description: "学习自救和救援他人的专业技能，成为更负责任的潜水员。",
    duration: "3~4天",
    maxDepth: 40,
    price: 3680,
    badge: "专业",
    prerequisites: ["持有AOW证书", "年满15周岁", "持有EFR证书或同等急救证", "近3个月内有潜水记录"],
    icon: "Shield",
    color: "text-sand-500",
    bgColor: "bg-sand-500",
  },
];

export const instructors: Instructur[] = [
  {
    id: "ins-1",
    name: "陈海峰",
    title: "PADI 课程总监",
    rating: 4.9,
    dives: 3800,
    experience: "12年教学经验",
    specialties: ["深潜专长", "沉船潜水", "水下摄影", "技术潜水"],
    avatar: "CH",
    languages: ["中文", "英文"],
  },
  {
    id: "ins-2",
    name: "林小雨",
    title: "PADI 名仕潜水员训练官",
    rating: 4.8,
    dives: 2100,
    experience: "8年教学经验",
    specialties: ["自由潜", "水肺复习", "海洋生物"],
    avatar: "LX",
    languages: ["中文", "英文", "日文"],
  },
  {
    id: "ins-3",
    name: "Marco Rossi",
    title: "PADI 参谋教练",
    rating: 4.95,
    dives: 5200,
    experience: "15年教学经验",
    specialties: ["技术潜水", "洞穴潜水", "救援专长"],
    avatar: "MR",
    languages: ["中文", "英文", "意大利文"],
  },
  {
    id: "ins-4",
    name: "王小渔",
    title: "PADI 开放水域潜水教练",
    rating: 4.7,
    dives: 900,
    experience: "4年教学经验",
    specialties: ["体验潜水", "儿童潜水", "浮潜"],
    avatar: "WY",
    languages: ["中文", "英文"],
  },
];

export const trainingStages: Record<CourseLevel, TrainingStage[]> = {
  discover: [
    {
      id: "d-1",
      name: "理论简报",
      type: "theory",
      duration: "1小时",
      description: "学习潜水基础原理、安全规则和装备介绍",
      completed: true,
      date: "2026-06-15 09:00",
    },
    {
      id: "d-2",
      name: "泳池训练",
      type: "pool",
      duration: "2小时",
      description: "在泳池练习呼吸、排水、浮力控制等基础技巧",
      completed: false,
      date: "2026-06-15 10:30",
    },
    {
      id: "d-3",
      name: "开放水域体验",
      type: "openwater",
      duration: "2小时",
      description: "教练带领下进行1次开放水域潜水体验",
      completed: false,
      date: "2026-06-16 08:00",
    },
  ],
  openwater: [
    {
      id: "ow-1",
      name: "理论课程（5章）",
      type: "theory",
      duration: "6小时",
      description: "完成PADI OW在线学习或线下理论课，通过理论考试",
      completed: true,
      date: "2026-06-10 ~ 2026-06-12",
    },
    {
      id: "ow-2",
      name: "泳池技巧训练",
      type: "pool",
      duration: "2天",
      description: "5次平静水域训练，掌握24项基础技巧",
      completed: true,
      date: "2026-06-13 ~ 2026-06-14",
    },
    {
      id: "ow-3",
      name: "开放水域潜水 1-2",
      type: "openwater",
      duration: "1天",
      description: "完成前两次开放水域潜水，最大深度12米",
      completed: false,
      date: "2026-06-17",
    },
    {
      id: "ow-4",
      name: "开放水域潜水 3-4",
      type: "openwater",
      duration: "1天",
      description: "完成后两次开放水域潜水，最大深度18米",
      completed: false,
      date: "2026-06-18",
    },
  ],
  advanced: [
    {
      id: "aow-1",
      name: "深潜专长",
      type: "openwater",
      duration: "2潜",
      description: "学习深度潜水计划、气体管理和减压程序",
      completed: false,
    },
    {
      id: "aow-2",
      name: "水下导航",
      type: "openwater",
      duration: "2潜",
      description: "使用指北针、自然导航技术定位",
      completed: false,
    },
    {
      id: "aow-3",
      name: "船潜专长",
      type: "openwater",
      duration: "1潜",
      description: "学习从潜水船入水、出水和安全程序",
      completed: false,
    },
    {
      id: "aow-4",
      name: "专长选修（2项）",
      type: "openwater",
      duration: "2潜",
      description: "可选：顶尖中性浮力、水下摄影、夜潜等",
      completed: false,
    },
  ],
  rescue: [
    {
      id: "r-1",
      name: "EFR 紧急第一反应",
      type: "theory",
      duration: "1天",
      description: "学习心肺复苏CPR和急救包扎技巧",
      completed: true,
      date: "2026-06-08",
    },
    {
      id: "r-2",
      name: "自救与压力识别",
      type: "pool",
      duration: "1天",
      description: "识别紧张潜水员、自救逃生技巧",
      completed: false,
    },
    {
      id: "r-3",
      name: "泳池救援演练",
      type: "pool",
      duration: "1天",
      description: "水面救援、水下搜救、人工呼吸",
      completed: false,
    },
    {
      id: "r-4",
      name: "开放水域救援场景",
      type: "openwater",
      duration: "2天",
      description: "模拟真实潜水事故救援场景",
      completed: false,
    },
  ],
};

export const courseSessions: CourseSession[] = [
  {
    id: "s-1",
    courseId: "openwater",
    poolDates: ["2026-06-13", "2026-06-14"],
    openWaterDates: ["2026-06-17", "2026-06-18"],
    instructorId: "ins-1",
    maxStudents: 8,
    enrolled: 5,
  },
  {
    id: "s-2",
    courseId: "openwater",
    poolDates: ["2026-06-20", "2026-06-21"],
    openWaterDates: ["2026-06-24", "2026-06-25"],
    instructorId: "ins-2",
    maxStudents: 8,
    enrolled: 3,
  },
  {
    id: "s-3",
    courseId: "advanced",
    poolDates: [],
    openWaterDates: ["2026-06-22", "2026-06-23"],
    instructorId: "ins-3",
    maxStudents: 6,
    enrolled: 4,
  },
  {
    id: "s-4",
    courseId: "discover",
    poolDates: [],
    openWaterDates: ["2026-06-15", "2026-06-16"],
    instructorId: "ins-4",
    maxStudents: 4,
    enrolled: 2,
  },
  {
    id: "s-5",
    courseId: "rescue",
    poolDates: ["2026-06-15", "2026-06-16"],
    openWaterDates: ["2026-06-19", "2026-06-20"],
    instructorId: "ins-3",
    maxStudents: 6,
    enrolled: 3,
  },
];

export const equipmentList: EquipmentItem[] = [
  {
    id: "eq-1",
    name: "潜水面镜",
    category: "mask",
    sizes: ["S", "M", "L", "XL"],
    required: true,
    description: "建议在泳池课前试戴，确保贴合面部不漏水",
    icon: "Glasses",
  },
  {
    id: "eq-2",
    name: "呼吸管",
    category: "accessory",
    required: true,
    icon: "Wind",
  },
  {
    id: "eq-3",
    name: "潜水脚蹼",
    category: "fins",
    sizes: ["36-37", "38-39", "40-41", "42-43", "44-45", "46+"],
    required: true,
    icon: "Footprints",
  },
  {
    id: "eq-4",
    name: "湿式潜水服",
    category: "wetsuit",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    required: true,
    description: "厚度：3mm 适合夏季，5mm 适合春秋冬季",
    icon: "Shirt",
  },
  {
    id: "eq-5",
    name: "BCD 浮力控制器",
    category: "bcd",
    sizes: ["XS", "S", "M", "L", "XL"],
    required: true,
    icon: "Backpack",
  },
  {
    id: "eq-6",
    name: "调节器套装",
    category: "regulator",
    required: true,
    description: "含一级头、二级头、备用二级头、气压表",
    icon: "Settings",
  },
  {
    id: "eq-7",
    name: "潜水袜",
    category: "accessory",
    sizes: ["S", "M", "L"],
    required: false,
    icon: "Footprints",
  },
  {
    id: "eq-8",
    name: "潜水手套",
    category: "accessory",
    sizes: ["S", "M", "L"],
    required: false,
    icon: "Hand",
  },
  {
    id: "eq-9",
    name: "潜水头套",
    category: "accessory",
    sizes: ["S", "M", "L"],
    required: false,
    description: "水温低于25°C建议佩戴",
    icon: "HardHat",
  },
  {
    id: "eq-10",
    name: "潜水电脑表",
    category: "accessory",
    required: true,
    description: "可自带或向俱乐部租赁",
    icon: "Watch",
  },
];

export const wetsuitSizeChart: SizeOption[] = [
  { label: "XS", value: "xs", bust: "78-84", waist: "62-68", hip: "84-90", height: "155-165" },
  { label: "S", value: "s", bust: "84-90", waist: "68-74", hip: "90-96", height: "160-170" },
  { label: "M", value: "m", bust: "90-96", waist: "74-80", hip: "96-102", height: "165-175" },
  { label: "L", value: "l", bust: "96-102", waist: "80-86", hip: "102-108", height: "170-180" },
  { label: "XL", value: "xl", bust: "102-110", waist: "86-94", hip: "108-116", height: "175-185" },
  { label: "XXL", value: "xxl", bust: "110-118", waist: "94-102", hip: "116-124", height: "180-190" },
];

export const healthDeclarations: HealthDeclaration[] = [
  { id: "h-1", question: "您是否有心脏病、高血压或其他心血管疾病？", warning: true },
  { id: "h-2", question: "您是否有哮喘、慢性支气管炎或其他呼吸系统疾病？", warning: true },
  { id: "h-3", question: "您是否有癫痫、晕厥病史或其他神经系统疾病？", warning: true },
  { id: "h-4", question: "您是否有严重的耳部疾病或近期进行过耳部手术？", warning: true },
  { id: "h-5", question: "您是否在过去12个月内进行过大型手术？", warning: false },
  { id: "h-6", question: "您是否有恐水症或怕水心理？", warning: false },
  { id: "h-7", question: "您是否怀孕或可能已怀孕？", warning: true },
  { id: "h-8", question: "您是否有药物过敏史？请在备注中说明。", warning: false },
];

export const certificateProgress: CertificateProgress[] = [
  {
    id: "cert-1",
    courseId: "openwater",
    studentName: "张小海",
    theoryScore: 92,
    poolStatus: "completed",
    openWaterDives: 2,
    requiredDives: 4,
    overallProgress: 65,
  },
  {
    id: "cert-2",
    courseId: "discover",
    studentName: "李思涵",
    theoryScore: 100,
    poolStatus: "completed",
    openWaterDives: 1,
    requiredDives: 1,
    overallProgress: 100,
    issueDate: "2026-06-05",
    certificateNumber: "DSD-2026-0605-0847",
  },
];

export const seaConditions: SeaCondition[] = [
  {
    date: "2026-06-17",
    location: "蜈支洲岛 A 潜点",
    waveHeight: "0.5m",
    visibility: "18-22m",
    waterTemp: "27°C",
    current: "弱",
    weather: "多云转晴",
    level: "calm",
    recommendation: "非常适合潜水，新手友好",
  },
  {
    date: "2026-06-18",
    location: "蜈支洲岛 B 潜点",
    waveHeight: "0.8m",
    visibility: "15-20m",
    waterTemp: "26°C",
    current: "中等",
    weather: "晴",
    level: "moderate",
    recommendation: "适合有经验的潜水员，注意水流方向",
  },
  {
    date: "2026-06-19",
    location: "分界洲岛",
    waveHeight: "1.5m",
    visibility: "10-15m",
    waterTemp: "25°C",
    current: "较强",
    weather: "阵雨",
    level: "rough",
    recommendation: "谨慎出海，建议只安排经验潜水员",
  },
];

export const meetingPoints: MeetingPoint[] = [
  {
    id: "mp-1",
    name: "蓝珊瑚潜水俱乐部（总部）",
    address: "海南省三亚市海棠湾龙海路88号",
    time: "集合：07:30 | 出发：08:00",
    notes: "提供免费停车位，大厅内有更衣室和储物柜",
  },
  {
    id: "mp-2",
    name: "蜈支洲岛码头集合点",
    address: "海南省三亚市海棠湾蜈支洲岛客运码头",
    time: "集合：08:30 | 登船：09:00",
    notes: "请携带身份证件，船票已包含在课程费用中",
  },
];

export const healthRestrictions: { name: string; description: string; level: "prohibit" | "caution" | "need-doctor" }[] = [
  { name: "心脏病/心绞痛", description: "严禁潜水", level: "prohibit" },
  { name: "未控制的高血压", description: "血压>160/100mmHg需医生签字", level: "need-doctor" },
  { name: "活动性哮喘", description: "近期发作需医生确认", level: "need-doctor" },
  { name: "癫痫病史", description: "近5年发作史严禁潜水", level: "prohibit" },
  { name: "近期中耳炎", description: "鼓膜穿孔未愈合禁止", level: "caution" },
  { name: "怀孕", description: "妊娠期不建议潜水", level: "prohibit" },
  { name: "严重鼻窦炎", description: "需症状完全缓解后", level: "caution" },
  { name: "幽闭恐惧症", description: "需评估后决定", level: "caution" },
];
