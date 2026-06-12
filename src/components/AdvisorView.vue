<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Search, Filter, Plus, Minus, AlertTriangle, CheckCircle2,
  XCircle, Package, Users, ClipboardCheck, Stethoscope,
  Calendar, FileText, Trash2, Edit3, Save, X, ChevronDown, ChevronUp,
} from 'lucide-vue-next';
import {
  courses, instructors, healthRestrictions, equipmentList,
  courseSessions, type Course, type Instructur, type CourseLevel,
} from '@/data';
import CourseCard from './CourseCard.vue';
import InstructorCard from './InstructorCard.vue';

interface BundleItem {
  courseId: CourseLevel;
  quantity: number;
}

interface EquipmentAssignment {
  studentId: string;
  studentName: string;
  equipment: Record<string, string>;
}

const searchTerm = ref('');
const activeTab = ref<'bundle' | 'health' | 'equipment'>('bundle');
const showSizeExpanded = ref<Record<string, boolean>>({});

const courseBundle = ref<BundleItem[]>([
  { courseId: 'openwater', quantity: 1 },
]);

const studentHealthChecks = ref<Record<string, Record<string, 'pass' | 'fail' | 'pending'>>>({
  'stu-001': {
    '心脏病/心绞痛': 'pass',
    '未控制的高血压': 'pass',
    '活动性哮喘': 'pass',
    '癫痫病史': 'pass',
    '近期中耳炎': 'pass',
    '怀孕': 'pass',
    '严重鼻窦炎': 'pending',
    '幽闭恐惧症': 'pass',
  },
});

const equipmentAssignments = ref<EquipmentAssignment[]>([
  {
    studentId: 'stu-001',
    studentName: '张小海',
    equipment: {
      'eq-1': 'M',
      'eq-3': '40-41',
      'eq-4': 'L',
      'eq-5': 'M',
      'eq-7': 'M',
    },
  },
  {
    studentId: 'stu-002',
    studentName: '李思涵',
    equipment: {
      'eq-1': 'S',
      'eq-3': '38-39',
      'eq-4': 'M',
      'eq-5': 'S',
    },
  },
]);

const newStudentName = ref('');

const totalPrice = computed(() => {
  return courseBundle.value.reduce((sum, item) => {
    const c = courses.find(c => c.id === item.courseId);
    return sum + (c?.price || 0) * item.quantity;
  }, 0);
});

const totalOriginalPrice = computed(() => {
  return courseBundle.value.reduce((sum, item) => {
    const c = courses.find(c => c.id === item.courseId);
    return sum + (c?.originalPrice || c?.price || 0) * item.quantity;
  }, 0);
});

const totalStudents = computed(() => {
  return courseBundle.value.reduce((sum, item) => sum + item.quantity, 0);
});

const addCourseToBundle = (courseId: CourseLevel) => {
  const existing = courseBundle.value.find(b => b.courseId === courseId);
  if (existing) {
    existing.quantity++;
  } else {
    courseBundle.value.push({ courseId, quantity: 1 });
  }
};

const removeCourseFromBundle = (courseId: CourseLevel) => {
  const idx = courseBundle.value.findIndex(b => b.courseId === courseId);
  if (idx >= 0) {
    if (courseBundle.value[idx].quantity > 1) {
      courseBundle.value[idx].quantity--;
    } else {
      courseBundle.value.splice(idx, 1);
    }
  }
};

const setHealthStatus = (studentId: string, condition: string, status: 'pass' | 'fail' | 'pending') => {
  if (!studentHealthChecks.value[studentId]) {
    studentHealthChecks.value[studentId] = {};
  }
  studentHealthChecks.value[studentId][condition] = status;
};

const toggleSizePanel = (equipmentId: string) => {
  showSizeExpanded.value[equipmentId] = !showSizeExpanded.value[equipmentId];
};

const setEquipmentSize = (studentId: string, equipmentId: string, size: string) => {
  const assignment = equipmentAssignments.value.find(a => a.studentId === studentId);
  if (assignment) {
    if (assignment.equipment[equipmentId] === size) {
      delete assignment.equipment[equipmentId];
    } else {
      assignment.equipment[equipmentId] = size;
    }
  }
};

const addNewStudent = () => {
  if (!newStudentName.value.trim()) return;
  const newId = 'stu-' + String(equipmentAssignments.value.length + 1).padStart(3, '0');
  equipmentAssignments.value.push({
    studentId: newId,
    studentName: newStudentName.value.trim(),
    equipment: {},
  });
  studentHealthChecks.value[newId] = {};
  healthRestrictions.forEach(r => {
    studentHealthChecks.value[newId][r.name] = 'pending';
  });
  newStudentName.value = '';
};

const removeStudent = (studentId: string) => {
  const idx = equipmentAssignments.value.findIndex(a => a.studentId === studentId);
  if (idx >= 0) {
    equipmentAssignments.value.splice(idx, 1);
    delete studentHealthChecks.value[studentId];
  }
};

const getHealthStatusInfo = (status: 'pass' | 'fail' | 'pending') => {
  switch (status) {
    case 'pass':
      return { label: '通过', icon: CheckCircle2, color: 'text-kelp-400', bg: 'bg-kelp-500/20', border: 'border-kelp-500/30' };
    case 'fail':
      return { label: '不通过', icon: XCircle, color: 'text-coral-400', bg: 'bg-coral-500/20', border: 'border-coral-500/30' };
    default:
      return { label: '待评估', icon: AlertTriangle, color: 'text-sand-400', bg: 'bg-sand-500/20', border: 'border-sand-500/30' };
  }
};

const getRestrictionLevelInfo = (level: string) => {
  switch (level) {
    case 'prohibit':
      return { label: '禁止', color: 'text-coral-300', bg: 'bg-coral-500/20', dot: 'bg-coral-400' };
    case 'need-doctor':
      return { label: '需医生证明', color: 'text-sand-300', bg: 'bg-sand-500/20', dot: 'bg-sand-400' };
    default:
      return { label: '谨慎评估', color: 'text-ocean-300', bg: 'bg-ocean-500/20', dot: 'bg-ocean-400' };
  }
};
</script>

<template>
  <div class="w-full max-w-full">
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 class="text-white font-bold text-2xl mb-1">课程顾问工作台</h3>
          <p class="text-ocean-300/70 text-sm">组合课程、确认体检、分配装备一站式处理</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative flex-1 sm:w-72">
            <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-400" />
            <input
              v-model="searchTerm"
              type="text"
              placeholder="搜索学员、订单..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ocean-800/60 border border-ocean-600/40 text-white placeholder:text-ocean-500 focus:outline-none focus:border-ocean-400 text-sm"
            />
          </div>
          <button class="px-4 py-2.5 rounded-xl bg-ocean-700/60 text-ocean-200 hover:bg-ocean-600/70 transition-colors flex items-center gap-2 text-sm">
            <Filter :size="16" />
            筛选
          </button>
        </div>
      </div>

      <div class="flex gap-1 bg-ocean-800/50 p-1 rounded-xl w-fit">
        <button
          v-for="tab in [
            { id: 'bundle', label: '课程组合', icon: Package },
            { id: 'health', label: '体检限制', icon: Stethoscope },
            { id: 'equipment', label: '装备分配', icon: ClipboardCheck },
          ] as const"
          :key="tab.id"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
          :class="[
            activeTab === tab.id
              ? 'bg-coral-gradient text-white shadow-lg shadow-coral-500/20'
              : 'text-ocean-300 hover:text-white hover:bg-ocean-700/50',
          ]"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" :size="16" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div v-show="activeTab === 'bundle'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-3 space-y-5">
          <div>
            <h4 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Package :size="22" class="text-ocean-300" />
              可选课程
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="course in courses"
                :key="course.id"
                class="relative"
              >
                <CourseCard :course="course" compact @select="addCourseToBundle(course.id)" />
                <button
                  class="absolute bottom-4 left-4 w-9 h-9 rounded-xl bg-kelp-500 text-white flex items-center justify-center hover:bg-kelp-400 transition-colors shadow-lg"
                  @click="addCourseToBundle(course.id)"
                >
                  <Plus :size="18" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Calendar :size="22" class="text-ocean-300" />
              可选排期
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              <div
                v-for="session in courseSessions"
                :key="session.id"
                class="bg-ocean-800/50 rounded-xl p-4 border border-ocean-600/30 hover:border-ocean-500/50 transition-colors cursor-pointer"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-mono bg-ocean-600/50 px-2 py-0.5 rounded text-ocean-200">
                    {{ (courses.find(c => c.id === session.courseId))?.shortName }}
                  </span>
                  <span class="text-xs text-kelp-400">
                    {{ session.enrolled }}/{{ session.maxStudents }}
                  </span>
                </div>
                <div class="text-xs text-ocean-400 mb-1">泳池课</div>
                <div class="text-sm text-white mb-3">
                  {{ session.poolDates.length ? session.poolDates.join(' / ') : '无' }}
                </div>
                <div class="text-xs text-coral-400 mb-1">开放水域</div>
                <div class="text-sm text-white">
                  {{ session.openWaterDates.join(' / ') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-5">
          <div class="bg-ocean-800/60 rounded-2xl p-5 border border-ocean-600/30 sticky top-4">
            <div class="flex items-center justify-between mb-5">
              <h4 class="text-white font-bold text-lg flex items-center gap-2">
                <Users :size="20" class="text-ocean-300" />
                课程组合
              </h4>
              <span class="text-xs bg-coral-500/20 text-coral-300 px-2.5 py-1 rounded-full font-medium">
                共 {{ totalStudents }} 人
              </span>
            </div>

            <div v-if="courseBundle.length === 0" class="py-10 text-center">
              <Package :size="40" class="text-ocean-500 mx-auto mb-3" />
              <div class="text-ocean-400 text-sm">暂无课程，请从左侧添加</div>
            </div>

            <div v-else class="space-y-3 mb-5">
              <div
                v-for="item in courseBundle"
                :key="item.courseId"
                class="bg-ocean-900/50 rounded-xl p-4 border border-ocean-700/40"
              >
                <div class="flex items-start gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-white text-sm mb-0.5">
                      {{ courses.find(c => c.id === item.courseId)?.name }}
                    </div>
                    <div class="text-xs text-ocean-400 mb-2">
                      {{ courses.find(c => c.id === item.courseId)?.shortName }} · {{ courses.find(c => c.id === item.courseId)?.duration }}
                    </div>
                    <div class="text-coral-400 font-bold">
                      ¥{{ courses.find(c => c.id === item.courseId)?.price }}
                      <span class="text-ocean-500 text-xs font-normal"> × {{ item.quantity }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button
                      class="w-7 h-7 rounded-lg bg-ocean-700/60 text-ocean-300 hover:bg-ocean-600/70 transition-colors flex items-center justify-center"
                      @click="removeCourseFromBundle(item.courseId)"
                    >
                      <Minus :size="14" />
                    </button>
                    <span class="w-7 text-center text-white font-bold text-sm">{{ item.quantity }}</span>
                    <button
                      class="w-7 h-7 rounded-lg bg-kelp-500/80 text-white hover:bg-kelp-500 transition-colors flex items-center justify-center"
                      @click="addCourseToBundle(item.courseId)"
                    >
                      <Plus :size="14" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-ocean-700/40 space-y-2 mb-5">
              <div class="flex justify-between text-sm">
                <span class="text-ocean-400">小计</span>
                <span class="text-ocean-200 line-through">¥{{ totalOriginalPrice }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-ocean-400">组合优惠</span>
                <span class="text-kelp-400">-¥{{ totalOriginalPrice - totalPrice }}</span>
              </div>
              <div class="flex justify-between items-end pt-2">
                <span class="text-ocean-300">总计</span>
                <span class="text-2xl font-bold text-coral-400">¥{{ totalPrice }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <button class="w-full px-5 py-3 rounded-xl bg-coral-gradient text-white font-bold shadow-lg shadow-coral-500/25 hover:shadow-coral-500/40 transition-all flex items-center justify-center gap-2">
                <Save :size="18" />
                保存组合方案
              </button>
              <button class="w-full px-5 py-3 rounded-xl bg-ocean-700/50 text-white font-medium hover:bg-ocean-600/60 transition-colors flex items-center justify-center gap-2 border border-ocean-600/30">
                <FileText :size="16" />
                生成报价单
              </button>
            </div>
          </div>

          <div>
            <h4 class="text-white font-bold text-lg mb-4">推荐教练</h4>
            <div class="space-y-3">
              <InstructorCard v-for="ins in instructors.slice(0, 2)" :key="ins.id" :instructor="ins" compact />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="activeTab === 'health'" class="space-y-6">
      <div class="bg-ocean-800/50 rounded-2xl p-5 border border-ocean-600/30">
        <h4 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Stethoscope :size="22" class="text-ocean-300" />
          健康限制对照表
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            v-for="restriction in healthRestrictions"
            :key="restriction.name"
            class="rounded-xl p-4 border transition-all"
            :class="[getRestrictionLevelInfo(restriction.level).bg, 'border-' + getRestrictionLevelInfo(restriction.level).dot + '/30']"
          >
            <div class="flex items-start gap-2 mb-2">
              <span class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" :class="getRestrictionLevelInfo(restriction.level).dot"></span>
              <span class="font-semibold text-white text-sm">{{ restriction.name }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="px-2 py-0.5 rounded-md font-medium" :class="[getRestrictionLevelInfo(restriction.level).bg, getRestrictionLevelInfo(restriction.level).color]">
                {{ getRestrictionLevelInfo(restriction.level).label }}
              </span>
            </div>
            <p class="text-xs text-ocean-200/70 mt-2">{{ restriction.description }}</p>
          </div>
        </div>
      </div>

      <div class="bg-ocean-800/50 rounded-2xl p-5 border border-ocean-600/30">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h4 class="text-white font-bold text-lg flex items-center gap-2">
            <ClipboardCheck :size="22" class="text-ocean-300" />
            学员健康评估
          </h4>
          <div class="flex gap-2">
            <input
              v-model="newStudentName"
              type="text"
              placeholder="输入学员姓名添加..."
              class="px-4 py-2 rounded-xl bg-ocean-900/60 border border-ocean-600/40 text-white placeholder:text-ocean-500 focus:outline-none focus:border-ocean-400 text-sm"
              @keyup.enter="addNewStudent"
            />
            <button
              class="px-4 py-2 rounded-xl bg-kelp-500 text-white text-sm font-medium hover:bg-kelp-400 transition-colors flex items-center gap-2"
              @click="addNewStudent"
            >
              <Plus :size="16" />
              添加
            </button>
          </div>
        </div>

        <div class="overflow-x-auto -mx-5 px-5">
          <table class="w-full min-w-[720px]">
            <thead>
              <tr class="text-xs text-ocean-400 border-b border-ocean-700/50">
                <th class="py-3 px-3 text-left font-medium sticky left-0 bg-ocean-800 z-10">学员</th>
                <th
                  v-for="r in healthRestrictions"
                  :key="r.name"
                  class="py-3 px-3 text-center font-medium whitespace-nowrap"
                >
                  {{ r.name }}
                </th>
                <th class="py-3 px-3 text-center font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in equipmentAssignments"
                :key="student.studentId"
                class="border-b border-ocean-700/30 hover:bg-ocean-700/20 transition-colors"
              >
                <td class="py-4 px-3 sticky left-0 bg-ocean-800/80 z-10">
                  <div class="font-medium text-white text-sm">{{ student.studentName }}</div>
                  <div class="text-xs text-ocean-500 font-mono">{{ student.studentId }}</div>
                </td>
                <td
                  v-for="r in healthRestrictions"
                  :key="r.name"
                  class="py-4 px-3 text-center"
                >
                  <div class="inline-flex items-center gap-1 rounded-lg p-0.5"
                    :class="[
                      getHealthStatusInfo(studentHealthChecks[student.studentId]?.[r.name] || 'pending').bg,
                      getHealthStatusInfo(studentHealthChecks[student.studentId]?.[r.name] || 'pending').border,
                    ]"
                  >
                    <button
                      v-for="status in (['pass', 'pending', 'fail'] as const)"
                      :key="status"
                      class="px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1"
                      :class="[
                        (studentHealthChecks[student.studentId]?.[r.name] || 'pending') === status
                          ? 'bg-white/10 ' + getHealthStatusInfo(status).color
                          : 'text-ocean-400 hover:text-white',
                      ]"
                      @click="setHealthStatus(student.studentId, r.name, status)"
                    >
                      <component :is="getHealthStatusInfo(status).icon" :size="12" />
                      {{ getHealthStatusInfo(status).label }}
                    </button>
                  </div>
                </td>
                <td class="py-4 px-3 text-center">
                  <div class="inline-flex items-center gap-1">
                    <button class="p-2 rounded-lg bg-ocean-700/50 text-ocean-300 hover:bg-ocean-600/70 transition-colors">
                      <Edit3 :size="14" />
                    </button>
                    <button
                      class="p-2 rounded-lg bg-coral-500/20 text-coral-300 hover:bg-coral-500/30 transition-colors"
                      @click="removeStudent(student.studentId)"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-show="activeTab === 'equipment'" class="space-y-6">
      <div class="bg-ocean-800/50 rounded-2xl p-5 border border-ocean-600/30">
        <div class="flex items-center justify-between mb-5">
          <h4 class="text-white font-bold text-lg flex items-center gap-2">
            <Package :size="22" class="text-ocean-300" />
            装备清单
          </h4>
          <span class="text-xs bg-ocean-600/50 text-ocean-200 px-3 py-1 rounded-full">
            共 {{ equipmentList.length }} 件
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="eq in equipmentList"
            :key="eq.id"
            class="bg-ocean-900/40 rounded-xl p-4 border border-ocean-700/40"
          >
            <div class="flex items-start justify-between gap-3 cursor-pointer" @click="toggleSizePanel(eq.id)">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-ocean-700/50 flex items-center justify-center text-ocean-300 flex-shrink-0">
                  <Package :size="18" />
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-semibold text-white text-sm">{{ eq.name }}</span>
                    <span
                      v-if="eq.required"
                      class="text-xs bg-coral-500/20 text-coral-300 px-1.5 py-0.5 rounded"
                    >必备</span>
                    <span v-else class="text-xs bg-ocean-600/40 text-ocean-300 px-1.5 py-0.5 rounded">可选</span>
                  </div>
                  <p v-if="eq.description" class="text-xs text-ocean-400">{{ eq.description }}</p>
                </div>
              </div>
              <component
                :is="showSizeExpanded[eq.id] ? ChevronUp : ChevronDown"
                :size="18"
                class="text-ocean-400 mt-2 flex-shrink-0"
              />
            </div>

            <div v-if="showSizeExpanded[eq.id]" class="mt-4 pt-4 border-t border-ocean-700/40 space-y-3">
              <div v-for="student in equipmentAssignments" :key="student.studentId">
                <div class="text-xs text-ocean-400 mb-1.5">{{ student.studentName }}</div>
                <div v-if="eq.sizes" class="flex flex-wrap gap-1.5">
                  <button
                    v-for="size in eq.sizes"
                    :key="size"
                    class="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                    :class="[
                      student.equipment[eq.id] === size
                        ? 'bg-coral-500 text-white'
                        : 'bg-ocean-700/60 text-ocean-300 hover:bg-ocean-600/70',
                    ]"
                    @click="setEquipmentSize(student.studentId, eq.id, size)"
                  >
                    {{ size }}
                  </button>
                </div>
                <div v-else class="text-xs text-kelp-400">标准尺寸，无需选择</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-ocean-800/50 rounded-2xl p-5 border border-ocean-600/30">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h4 class="text-white font-bold text-lg flex items-center gap-2">
            <Users :size="22" class="text-ocean-300" />
            学员装备分配总览
          </h4>
          <button class="px-4 py-2 rounded-xl bg-kelp-500 text-white text-sm font-medium hover:bg-kelp-400 transition-colors flex items-center gap-2">
            <Save :size="16" />
            导出分配清单
          </button>
        </div>

        <div class="overflow-x-auto -mx-5 px-5">
          <table class="w-full min-w-[640px]">
            <thead>
              <tr class="text-xs text-ocean-400 border-b border-ocean-700/50">
                <th class="py-3 px-3 text-left font-medium sticky left-0 bg-ocean-800 z-10">学员</th>
                <th
                  v-for="eq in equipmentList.filter(e => e.sizes)"
                  :key="eq.id"
                  class="py-3 px-3 text-center font-medium whitespace-nowrap"
                >
                  {{ eq.name }}
                </th>
                <th class="py-3 px-3 text-center font-medium">完成度</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in equipmentAssignments"
                :key="student.studentId"
                class="border-b border-ocean-700/30 hover:bg-ocean-700/20 transition-colors"
              >
                <td class="py-4 px-3 sticky left-0 bg-ocean-800/80 z-10">
                  <div class="font-medium text-white text-sm">{{ student.studentName }}</div>
                  <div class="text-xs text-ocean-500 font-mono">{{ student.studentId }}</div>
                </td>
                <td
                  v-for="eq in equipmentList.filter(e => e.sizes)"
                  :key="eq.id"
                  class="py-4 px-3 text-center"
                >
                  <span
                    v-if="student.equipment[eq.id]"
                    class="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-kelp-500/20 text-kelp-300 border border-kelp-500/30"
                  >
                    {{ student.equipment[eq.id] }}
                  </span>
                  <span
                    v-else
                    class="inline-block px-2.5 py-1 rounded-md text-xs bg-ocean-700/50 text-ocean-500"
                  >
                    未分配
                  </span>
                </td>
                <td class="py-4 px-3 text-center">
                  <div class="inline-flex items-center gap-1.5">
                    <div class="w-16 h-2 bg-ocean-800 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all"
                        :class="[
                          Math.round(Object.keys(student.equipment).length / equipmentList.filter(e => e.sizes).length * 100) >= 80
                            ? 'bg-kelp-400'
                            : Math.round(Object.keys(student.equipment).length / equipmentList.filter(e => e.sizes).length * 100) >= 50
                            ? 'bg-sand-400'
                            : 'bg-coral-400',
                        ]"
                        :style="{
                          width: Math.min(100, Math.round(Object.keys(student.equipment).length / equipmentList.filter(e => e.sizes).length * 100)) + '%',
                        }"
                      ></div>
                    </div>
                    <span class="text-xs text-ocean-300 font-mono">
                      {{ Math.min(100, Math.round(Object.keys(student.equipment).length / equipmentList.filter(e => e.sizes).length * 100)) }}%
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
