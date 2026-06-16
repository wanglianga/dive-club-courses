<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Search, Filter, Plus, Minus, AlertTriangle, CheckCircle2,
  XCircle, Package, Users, ClipboardCheck, Stethoscope,
  Calendar, FileText, Trash2, Edit3, Save, X, ChevronDown, ChevronUp,
  ShieldAlert, UserCheck, Waves, Clock, Check, FileCheck, CalendarX
} from 'lucide-vue-next';
import {
  courses, instructors, healthRestrictions, equipmentList,
  courseSessions, type Course, type Instructur, type CourseLevel,
  healthDeclarations, type HealthRiskRecord,
} from '@/data';
import CourseCard from './CourseCard.vue';
import InstructorCard from './InstructorCard.vue';
import { useHealthRisk } from '@/composables/useHealthRisk';

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
const activeTab = ref<'bundle' | 'health' | 'equipment' | 'risk_review'>('bundle');
const showSizeExpanded = ref<Record<string, boolean>>({});
const selectedRiskRecordId = ref<string | null>(null);
const advisorName = ref('陈顾问');
const reviewNotes = ref('');
const selectedCoursesForApproval = ref<CourseLevel[]>([]);
const deferralReason = ref('');
const deferralUntil = ref('');
const showDeferModal = ref(false);
const showRejectModal = ref(false);

const {
  healthRiskRecords,
  pendingReviews,
  getWarningDeclarations,
  verifyDoctorCertificate,
  advisorApprove,
  advisorReject,
  deferRegistration,
  getStatusInfo,
  setActiveStudent,
} = useHealthRisk();

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

const selectedRiskRecord = computed<HealthRiskRecord | null>(() => {
  if (!selectedRiskRecordId.value) return null;
  return healthRiskRecords.value.find(r => r.id === selectedRiskRecordId.value) || null;
});

const selectedRecordWarnings = computed(() => {
  if (!selectedRiskRecord.value) return [];
  return getWarningDeclarations(selectedRiskRecord.value);
});

const pendingCount = computed(() => pendingReviews.value.length);

const selectRiskRecord = (recordId: string) => {
  selectedRiskRecordId.value = recordId;
  const record = healthRiskRecords.value.find(r => r.id === recordId);
  if (record) {
    setActiveStudent(record.studentId, record.studentName);
    selectedCoursesForApproval.value = [...record.advisorReview.approvedCourses];
    reviewNotes.value = record.advisorReview.notes || '';
  }
};

const toggleCourseApproval = (courseId: CourseLevel) => {
  const idx = selectedCoursesForApproval.value.indexOf(courseId);
  if (idx >= 0) {
    selectedCoursesForApproval.value.splice(idx, 1);
  } else {
    selectedCoursesForApproval.value.push(courseId);
  }
};

const handleVerifyDoctorCert = (verified: boolean) => {
  if (!selectedRiskRecord.value) return;
  verifyDoctorCertificate(selectedRiskRecord.value.id, verified, advisorName.value);
};

const handleApprove = () => {
  if (!selectedRiskRecord.value || selectedCoursesForApproval.value.length === 0) return;
  advisorApprove(
    selectedRiskRecord.value.id,
    advisorName.value,
    selectedCoursesForApproval.value,
    reviewNotes.value
  );
  selectedRiskRecordId.value = null;
  reviewNotes.value = '';
  selectedCoursesForApproval.value = [];
};

const handleReject = () => {
  if (!selectedRiskRecord.value || !reviewNotes.value.trim()) return;
  advisorReject(selectedRiskRecord.value.id, advisorName.value, reviewNotes.value);
  showRejectModal.value = false;
  selectedRiskRecordId.value = null;
  reviewNotes.value = '';
  selectedCoursesForApproval.value = [];
};

const handleDefer = () => {
  if (!selectedRiskRecord.value || !deferralReason.value.trim()) return;
  deferRegistration(
    selectedRiskRecord.value.id,
    advisorName.value,
    deferralReason.value,
    deferralUntil.value || undefined
  );
  showDeferModal.value = false;
  selectedRiskRecordId.value = null;
  deferralReason.value = '';
  deferralUntil.value = '';
  reviewNotes.value = '';
  selectedCoursesForApproval.value = [];
};

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

      <div class="flex flex-wrap gap-1 bg-ocean-800/50 p-1 rounded-xl w-fit">
        <button
          v-for="tab in ([
            { id: 'bundle', label: '课程组合', icon: Package, badge: 0 },
            { id: 'health', label: '体检限制', icon: Stethoscope, badge: 0 },
            { id: 'risk_review', label: '健康风险审核', icon: ShieldAlert, badge: pendingCount },
            { id: 'equipment', label: '装备分配', icon: ClipboardCheck, badge: 0 },
          ] as const)"
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
          <span
            v-if="tab.badge > 0"
            class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-coral-500 text-white text-xs font-bold"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>
    </div>

    <div v-show="activeTab === 'risk_review'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-ocean-800/50 rounded-2xl p-4 sm:p-5 border border-ocean-600/30">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-bold text-white text-lg flex items-center gap-2">
                <ShieldAlert :size="20" class="text-coral-400" />
                待审核列表
              </h4>
              <span class="text-xs bg-coral-500/20 text-coral-300 px-2.5 py-1 rounded-full font-medium">
                {{ pendingCount }} 人待处理
              </span>
            </div>

            <div v-if="healthRiskRecords.length === 0" class="py-10 text-center">
              <ShieldAlert :size="36" class="text-ocean-500 mx-auto mb-3" />
              <div class="text-ocean-400 text-sm">暂无健康风险审核记录</div>
            </div>

            <div v-else class="space-y-2">
              <button
                v-for="record in healthRiskRecords"
                :key="record.id"
                class="w-full text-left p-3 sm:p-4 rounded-xl border transition-all"
                :class="[
                  selectedRiskRecordId === record.id
                    ? 'bg-coral-500/10 border-coral-500/40'
                    : 'bg-ocean-900/40 border-ocean-700/40 hover:border-ocean-600/50',
                ]"
                @click="selectRiskRecord(record.id)"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-white text-sm truncate">{{ record.studentName }}</div>
                    <div class="text-xs text-ocean-500 font-mono mt-0.5">{{ record.studentId }}</div>
                    <div class="flex flex-wrap gap-1 mt-2">
                      <span
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                        :class="[getStatusInfo(record.status).bg + ' ' + getStatusInfo(record.status).color]"
                      >
                        <span class="w-1.5 h-1.5 rounded-full" :class="getStatusInfo(record.status).dot"></span>
                        {{ getStatusInfo(record.status).label }}
                      </span>
                      <span
                        v-if="record.warningItems.length > 0"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-coral-500/15 text-coral-300"
                      >
                        {{ record.warningItems.length }} 项警示
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    v-if="selectedRiskRecordId !== record.id"
                    :size="18"
                    class="text-ocean-500 flex-shrink-0 mt-1"
                  />
                  <ChevronUp
                    v-else
                    :size="18"
                    class="text-coral-400 flex-shrink-0 mt-1"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3 space-y-4">
          <div v-if="!selectedRiskRecord" class="bg-ocean-800/40 rounded-2xl p-10 sm:p-16 border border-ocean-600/30 text-center">
            <div class="w-16 h-16 rounded-2xl bg-ocean-700/50 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert :size="32" class="text-ocean-500" />
            </div>
            <h5 class="text-white font-semibold mb-2">选择学员查看详情</h5>
            <p class="text-sm text-ocean-400">
              从左侧列表选择需要审核的学员健康风险记录
            </p>
          </div>

          <div v-else class="space-y-4">
            <div class="bg-gradient-to-r from-coral-500/15 via-sand-500/10 to-coral-500/15 rounded-2xl p-5 border-2 border-coral-500/30">
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-3">
                  <div class="w-12 h-12 rounded-xl bg-coral-500/20 flex items-center justify-center flex-shrink-0">
                    <UserCheck :size="24" class="text-coral-400" />
                  </div>
                  <div>
                    <h4 class="font-bold text-white text-lg">{{ selectedRiskRecord.studentName }}</h4>
                    <div class="text-xs text-ocean-400 font-mono mt-0.5">{{ selectedRiskRecord.studentId }} · {{ selectedRiskRecord.id }}</div>
                    <div class="flex items-center gap-2 mt-2">
                      <Clock :size="12" class="text-ocean-500" />
                      <span class="text-xs text-ocean-400">
                        提交时间：{{ new Date(selectedRiskRecord.createdAt).toLocaleString('zh-CN') }}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  class="p-2 rounded-lg bg-ocean-700/50 text-ocean-300 hover:bg-ocean-600/70 transition-colors"
                  @click="selectedRiskRecordId = null"
                >
                  <X :size="18" />
                </button>
              </div>
            </div>

            <div class="bg-ocean-800/50 rounded-2xl p-4 sm:p-5 border border-ocean-600/30">
              <div class="flex items-center gap-2 mb-4">
                <AlertTriangle :size="18" class="text-coral-400" />
                <h5 class="font-semibold text-white">健康警示项</h5>
              </div>
              <div class="space-y-2">
                <div
                  v-for="item in selectedRecordWarnings" :key="item.id"
                  class="flex items-start gap-3 p-3 rounded-xl bg-coral-500/10 border border-coral-500/20"
                >
                  <div class="w-7 h-7 rounded-lg bg-coral-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle :size="14" class="text-coral-400" />
                  </div>
                  <div class="flex-1">
                    <div class="text-sm text-white">{{ item.question }}</div>
                    <div class="text-xs text-ocean-400 mt-1">
                      学员回答：是
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-ocean-800/50 rounded-2xl p-4 sm:p-5 border border-ocean-600/30">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <FileText :size="18" class="text-sand-400" />
                  <h5 class="font-semibold text-white">医生证明</h5>
                </div>
                <div v-if="selectedRiskRecord.doctorCertificate.uploaded" class="flex items-center gap-2">
                  <button
                    v-if="!selectedRiskRecord.doctorCertificate.verified"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium bg-coral-500/20 text-coral-300 hover:bg-coral-500/30 transition-colors flex items-center gap-1.5"
                    @click="handleVerifyDoctorCert(false)"
                  >
                    <XCircle :size="12" />
                    验证不通过
                  </button>
                  <button
                    v-if="!selectedRiskRecord.doctorCertificate.verified"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium bg-kelp-500/20 text-kelp-300 hover:bg-kelp-500/30 transition-colors flex items-center gap-1.5"
                    @click="handleVerifyDoctorCert(true)"
                  >
                    <CheckCircle2 :size="12" />
                    验证通过
                  </button>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-kelp-500/20 text-kelp-300"
                  >
                    <FileCheck :size="12" />
                    已验证
                  </span>
                </div>
              </div>

              <div v-if="!selectedRiskRecord.doctorCertificate.uploaded" class="py-6 text-center">
                <FileText :size="32" class="text-ocean-500 mx-auto mb-2" />
                <div class="text-sm text-ocean-400">学员尚未上传医生证明</div>
              </div>
              <div v-else class="p-4 rounded-xl bg-ocean-900/50 border border-ocean-700/40">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-sand-500/20 flex items-center justify-center">
                    <FileText :size="20" class="text-sand-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-white truncate">
                      {{ selectedRiskRecord.doctorCertificate.fileName || '体检证明.pdf' }}
                    </div>
                    <div class="text-xs text-ocean-400">
                      <span v-if="selectedRiskRecord.doctorCertificate.verified">
                        验证人：{{ selectedRiskRecord.doctorCertificate.verifiedBy }}
                        · {{ selectedRiskRecord.doctorCertificate.verifiedAt ? new Date(selectedRiskRecord.doctorCertificate.verifiedAt).toLocaleString('zh-CN') : '' }}
                      </span>
                      <span v-else>等待验证</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-ocean-800/50 rounded-2xl p-4 sm:p-5 border border-ocean-600/30">
              <div class="flex items-center gap-2 mb-4">
                <Waves :size="18" class="text-kelp-400" />
                <h5 class="font-semibold text-white">可选课程确认</h5>
              </div>
              <p class="text-xs text-ocean-400 mb-4">选择该学员适合参加的潜水课程（可多选）</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  v-for="course in courses" :key="course.id"
                  class="text-left p-3 sm:p-4 rounded-xl border transition-all"
                  :class="[
                    selectedCoursesForApproval.includes(course.id)
                      ? 'bg-kelp-500/15 border-kelp-500/50 ring-2 ring-kelp-500/20'
                      : 'bg-ocean-900/40 border-ocean-700/40 hover:border-ocean-600/60',
                  ]"
                  @click="toggleCourseApproval(course.id)"
                >
                  <div class="flex items-start gap-3">
                    <div
                      class="w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                      :class="[
                        selectedCoursesForApproval.includes(course.id)
                          ? 'bg-kelp-500 border-kelp-500'
                          : 'bg-transparent border-ocean-500',
                      ]"
                    >
                      <Check v-if="selectedCoursesForApproval.includes(course.id)" :size="14" class="text-white" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-white text-sm">{{ course.name }}</div>
                      <div class="text-xs text-ocean-400 mt-0.5">{{ course.shortName }} · {{ course.duration }} · {{ course.maxDepth }}m</div>
                      <div class="text-xs text-coral-400 mt-1">¥{{ course.price }}</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div class="bg-ocean-800/50 rounded-2xl p-4 sm:p-5 border border-ocean-600/30">
              <div class="flex items-center gap-2 mb-3">
                <ClipboardCheck :size="18" class="text-ocean-300" />
                <h5 class="font-semibold text-white">审核备注</h5>
              </div>
              <textarea
                v-model="reviewNotes"
                rows="3"
                placeholder="请输入审核备注（拒绝或暂缓时必填）..."
                class="w-full px-4 py-3 rounded-xl bg-ocean-900/60 border border-ocean-600/40 text-white placeholder:text-ocean-500 focus:outline-none focus:border-ocean-400 transition-colors resize-none text-sm"
              />
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                class="flex-1 px-5 py-3 rounded-xl bg-sand-500/20 text-sand-300 font-medium hover:bg-sand-500/30 transition-colors flex items-center justify-center gap-2 border border-sand-500/30"
                @click="showDeferModal = true"
              >
                <CalendarX :size="18" />
                暂缓报名
              </button>
              <button
                class="flex-1 px-5 py-3 rounded-xl bg-coral-500/20 text-coral-300 font-medium hover:bg-coral-500/30 transition-colors flex items-center justify-center gap-2 border border-coral-500/30"
                @click="showRejectModal = true"
              >
                <XCircle :size="18" />
                拒绝报名
              </button>
              <button
                class="flex-1 sm:flex-none min-w-[160px] px-6 py-3 rounded-xl bg-kelp-500 text-white font-bold shadow-lg shadow-kelp-500/25 hover:bg-kelp-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="selectedCoursesForApproval.length === 0"
                @click="handleApprove"
              >
                <CheckCircle2 :size="18" />
                审核通过
              </button>
            </div>
          </div>
        </div>
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

    <div
      v-if="showDeferModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/70 backdrop-blur-sm"
      @click.self="showDeferModal = false"
    >
      <div class="w-full max-w-md bg-ocean-900 rounded-2xl border border-ocean-700/50 shadow-2xl overflow-hidden">
        <div class="p-5 bg-gradient-to-r from-sand-500/20 to-ocean-500/20 border-b border-ocean-700/40">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sand-500/30 flex items-center justify-center">
              <CalendarX :size="20" class="text-sand-400" />
            </div>
            <div>
              <h4 class="font-bold text-white">暂缓报名</h4>
              <p class="text-xs text-ocean-300">建议学员延迟报名</p>
            </div>
          </div>
        </div>
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm text-ocean-300 mb-1.5">暂缓原因 <span class="text-coral-400">*</span></label>
            <textarea
              v-model="deferralReason"
              rows="3"
              placeholder="请说明暂缓报名的原因..."
              class="w-full px-4 py-3 rounded-xl bg-ocean-800/60 border border-ocean-600/40 text-white placeholder:text-ocean-500 focus:outline-none focus:border-ocean-400 transition-colors resize-none text-sm"
            />
          </div>
          <div>
            <label class="block text-sm text-ocean-300 mb-1.5">建议重新报名时间（可选）</label>
            <input
              v-model="deferralUntil"
              type="date"
              class="w-full px-4 py-3 rounded-xl bg-ocean-800/60 border border-ocean-600/40 text-white focus:outline-none focus:border-ocean-400 transition-colors text-sm"
            />
          </div>
        </div>
        <div class="p-5 bg-ocean-950/50 border-t border-ocean-700/40 flex flex-col-reverse sm:flex-row gap-3">
          <button
            class="flex-1 px-5 py-3 rounded-xl bg-ocean-700/60 text-white font-medium hover:bg-ocean-600/70 transition-colors border border-ocean-600/30"
            @click="showDeferModal = false"
          >
            取消
          </button>
          <button
            class="flex-1 px-5 py-3 rounded-xl bg-sand-gradient text-white font-bold shadow-lg shadow-sand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!deferralReason.trim()"
            @click="handleDefer"
          >
            确认暂缓
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showRejectModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/70 backdrop-blur-sm"
      @click.self="showRejectModal = false"
    >
      <div class="w-full max-w-md bg-ocean-900 rounded-2xl border border-ocean-700/50 shadow-2xl overflow-hidden">
        <div class="p-5 bg-gradient-to-r from-coral-500/20 to-coral-500/10 border-b border-ocean-700/40">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-coral-500/30 flex items-center justify-center">
              <XCircle :size="20" class="text-coral-400" />
            </div>
            <div>
              <h4 class="font-bold text-white">拒绝报名</h4>
              <p class="text-xs text-ocean-300">该学员暂不适合潜水</p>
            </div>
          </div>
        </div>
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm text-ocean-300 mb-1.5">拒绝原因 <span class="text-coral-400">*</span></label>
            <textarea
              v-model="reviewNotes"
              rows="4"
              placeholder="请详细说明拒绝报名的原因..."
              class="w-full px-4 py-3 rounded-xl bg-ocean-800/60 border border-ocean-600/40 text-white placeholder:text-ocean-500 focus:outline-none focus:border-ocean-400 transition-colors resize-none text-sm"
            />
          </div>
          <div class="p-3 bg-coral-500/10 rounded-xl border border-coral-500/20">
            <div class="flex items-start gap-2 text-xs text-coral-200">
              <AlertTriangle :size="14" class="mt-0.5 flex-shrink-0" />
              <div>
                <div class="font-semibold text-coral-300 mb-1">注意</div>
                <p>拒绝后学员端将收到通知，无法继续当前报名流程。请确保原因充分且准确。</p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-5 bg-ocean-950/50 border-t border-ocean-700/40 flex flex-col-reverse sm:flex-row gap-3">
          <button
            class="flex-1 px-5 py-3 rounded-xl bg-ocean-700/60 text-white font-medium hover:bg-ocean-600/70 transition-colors border border-ocean-600/30"
            @click="showRejectModal = false"
          >
            取消
          </button>
          <button
            class="flex-1 px-5 py-3 rounded-xl bg-coral-gradient text-white font-bold shadow-lg shadow-coral-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!reviewNotes.trim()"
            @click="handleReject"
          >
            确认拒绝
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
