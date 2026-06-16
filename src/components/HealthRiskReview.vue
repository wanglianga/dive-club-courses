<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ShieldAlert, FileText, UserCheck, Waves, Clock,
  Upload, CheckCircle2, AlertTriangle, Lock, Unlock,
  ChevronRight, Check, X, Calendar, ClipboardCheck
} from 'lucide-vue-next';
import { useHealthRisk } from '@/composables/useHealthRisk';
import type { HealthRiskStep } from '@/data';
import { courses, healthDeclarations, type CourseLevel } from '@/data';

const emit = defineEmits<{
  (e: 'status-updated'): void;
}>();

const {
  currentRiskRecord,
  getWarningDeclarations,
  uploadDoctorCertificate,
  getStatusInfo,
  getStepInfo,
  isRiskBlocked,
} = useHealthRisk();

const reviewSteps = computed<{ id: HealthRiskStep; label: string; desc: string }[]>(() => [
  { id: 'doctor_certificate', label: '提交医生证明', desc: '请上传医生签字的体检证明，确认身体状况适合潜水' },
  { id: 'advisor_review', label: '顾问复核', desc: '潜水顾问评估健康风险，确认适合的课程' },
  { id: 'course_options', label: '可选课程', desc: '顾问确认您适合参加的潜水课程范围' },
  { id: 'defer_reason', label: '暂缓原因', desc: '如需暂缓报名，顾问将说明具体原因和建议' },
]);

const getStepStatus = (stepId: HealthRiskStep) => {
  const record = currentRiskRecord.value;
  if (!record) return 'pending';

  const stepOrder: HealthRiskStep[] = ['doctor_certificate', 'advisor_review', 'course_options', 'defer_reason'];
  const currentIdx = record.currentStep ? stepOrder.indexOf(record.currentStep) : -1;
  const stepIdx = stepOrder.indexOf(stepId);

  if (record.status === 'approved') {
    if (stepId === 'defer_reason') return 'skipped';
    return 'completed';
  }
  if (record.status === 'rejected') return 'blocked';
  if (record.status === 'deferred') {
    if (stepId === 'defer_reason') return 'current';
    if (stepIdx < 2) return 'completed';
    return 'completed';
  }
  if (stepIdx < currentIdx) return 'completed';
  if (stepIdx === currentIdx) return 'current';
  return 'pending';
};

const isDoctorCertUploaded = computed(() => currentRiskRecord.value?.doctorCertificate.uploaded);
const isDoctorCertVerified = computed(() => currentRiskRecord.value?.doctorCertificate.verified);

const approvedCourseNames = computed(() => {
  const record = currentRiskRecord.value;
  if (!record || !record.advisorReview.approvedCourses.length) return [];
  return courses.filter(c => record.advisorReview.approvedCourses.includes(c.id));
});

const handleUploadCert = () => {
  const record = currentRiskRecord.value;
  if (record && !record.doctorCertificate.uploaded) {
    uploadDoctorCertificate(record.id, '体检证明_' + record.studentName + '.pdf');
    emit('status-updated');
  }
};

const warningDeclarations = computed(() => {
  const record = currentRiskRecord.value;
  if (!record) return [];
  return getWarningDeclarations(record);
});

const getWarningCategoryLabel = computed(() => {
  const cats = new Set<string>();
  warningDeclarations.value.forEach(d => {
    if (d.category) cats.add(d.category);
  });
  const labels: Record<string, string> = {
    asthma: '呼吸系统',
    ear: '耳部问题',
    surgery: '近期手术',
    medication: '服药情况',
    pregnancy: '怀孕',
    heart: '心血管',
    neurology: '神经系统',
    other: '其他',
  };
  return Array.from(cats).map(c => labels[c] || c);
});
</script>

<template>
  <div class="space-y-5">
    <div class="bg-gradient-to-r from-sand-500/20 via-coral-500/20 to-sand-500/20 rounded-2xl p-5 sm:p-6 border-2 border-sand-500/40">
      <div class="flex items-start gap-3 sm:gap-4">
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sand-500/30 flex items-center justify-center flex-shrink-0">
          <ShieldAlert :size="26" class="text-sand-400 sm:w-[30px] sm:h-[30px]" />
        </div>
        <div class="flex-1">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <h4 class="font-bold text-white text-lg sm:text-xl">健康风险评估</h4>
            <span
              v-if="currentRiskRecord"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              :class="[getStatusInfo(currentRiskRecord.status).bg, getStatusInfo(currentRiskRecord.status).color]"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="getStatusInfo(currentRiskRecord.status).dot"></span>
              {{ getStatusInfo(currentRiskRecord.status).label }}
            </span>
          </div>
          <p class="text-sm text-ocean-200/80 leading-relaxed">
            根据您填写的健康声明，存在需要人工评估的健康事项。为了您的安全，请完成以下步骤后可继续报名流程。
          </p>
        </div>
      </div>
    </div>

    <div class="bg-ocean-800/50 rounded-2xl p-4 sm:p-5 border border-ocean-600/30">
      <div class="flex items-center gap-2 mb-3">
        <AlertTriangle :size="18" class="text-coral-400" />
        <h5 class="font-semibold text-white text-sm sm:text-base">需评估事项</h5>
      </div>
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="cat in getWarningCategoryLabel" :key="cat"
          class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-coral-500/20 text-coral-300 border border-coral-500/30"
        >
          {{ cat }}
        </span>
      </div>
      <ul class="space-y-2">
        <li
          v-for="item in warningDeclarations" :key="item.id"
          class="flex items-start gap-2 text-sm text-ocean-200/80"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-coral-400 mt-1.5 flex-shrink-0"></span>
          <span>{{ item.question }}</span>
        </li>
      </ul>
    </div>

    <div class="bg-ocean-800/40 rounded-2xl p-4 sm:p-5 border border-ocean-600/30">
      <h5 class="font-semibold text-white text-sm sm:text-base mb-4">评估流程步骤</h5>
      <div class="space-y-1">
        <template v-for="(step, idx) in reviewSteps" :key="step.id">
          <div
            class="flex items-start gap-3 sm:gap-4">
            <div
              class="relative flex flex-col items-center">
              <div
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              :class="[
                getStepStatus(step.id) === 'completed'
                  ? 'bg-kelp-500 text-white'
                  : getStepStatus(step.id) === 'current'
                  ? 'bg-coral-gradient text-white shadow-lg shadow-coral-500/30 ring-4 ring-coral-500/20'
                  : getStepStatus(step.id) === 'skipped'
                  ? 'bg-ocean-700/40 text-ocean-500'
                  : getStepStatus(step.id) === 'blocked'
                  ? 'bg-coral-500/30 text-coral-400'
                  : 'bg-ocean-700/60 text-ocean-400',
              ]"
            >
              <Check v-if="getStepStatus(step.id) === 'completed'" :size="16" />
              <Lock v-else-if="getStepStatus(step.id) === 'pending'" :size="14" />
              <X v-else-if="getStepStatus(step.id) === 'blocked'" :size="14" />
              <span v-else-if="getStepStatus(step.id) === 'skipped'">—</span>
              <span v-else>{{ idx + 1 }}</span>
            </div>
              <div
                v-if="idx < reviewSteps.length - 1"
                class="w-0.5 h-10 sm:h-12"
                :class="getStepStatus(step.id) === 'completed' ? 'bg-kelp-500' : 'bg-ocean-700/60'"
              ></div>
            </div>
            <div class="flex-1 pb-6">
              <div class="flex items-center gap-2">
              <div
                class="font-medium"
                :class="[
                  getStepStatus(step.id) === 'pending' || getStepStatus(step.id) === 'skipped' ? 'text-ocean-400' : 'text-white',
                ]"
              >
                {{ step.label }}
              </div>
              <span
                v-if="getStepStatus(step.id) === 'current'"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-coral-500/20 text-coral-300"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-coral-400 animate-pulse"></span>
                进行中
              </span>
              <span
                v-else-if="getStepStatus(step.id) === 'completed'"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-kelp-500/20 text-kelp-300"
              >
                <Check :size="12" />
                已完成
              </span>
              <span
                v-else-if="getStepStatus(step.id) === 'skipped'"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-ocean-600/30 text-ocean-400"
              >
                不适用
              </span>
              <span
                v-else-if="getStepStatus(step.id) === 'blocked'"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-coral-500/20 text-coral-300"
              >
                <X :size="12" />
                已终止
              </span>
            </div>
              <p
                class="text-xs mt-0.5"
                :class="getStepStatus(step.id) === 'pending' || getStepStatus(step.id) === 'skipped' ? 'text-ocean-500' : 'text-ocean-300/70'"
              >
                {{ step.desc }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="currentRiskRecord?.currentStep === 'doctor_certificate'" class="space-y-4">
      <div class="bg-sand-500/10 rounded-2xl p-4 sm:p-5 border-2 border-dashed border-sand-500/40">
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-10 h-10 rounded-xl bg-sand-500/20 flex items-center justify-center flex-shrink-0">
            <FileText :size="20" class="text-sand-400" />
          </div>
          <div class="flex-1">
            <h5 class="font-semibold text-white text-base mb-1">第一步：提交医生证明</h5>
            <p class="text-sm text-ocean-200/70 mb-4">
              请提供由正规医院出具的、医生签字的体检证明，确认您的身体状况适合潜水活动。
            </p>
            <ul class="text-xs text-ocean-300/80 space-y-1 mb-4">
              <li>• 证明需包含心肺功能评估</li>
              <li>• 需有医生签字和医院盖章</li>
              <li>• 证明有效期需在3个月内</li>
              <li>• 支持 PDF、JPG、PNG 格式</li>
            </ul>

            <div v-if="!isDoctorCertUploaded" class="space-y-3">
              <div
                class="border-2 border-dashed border-ocean-600/50 rounded-xl p-6 sm:p-8 text-center cursor-pointer hover:border-sand-500/50 hover:bg-sand-500/10 transition-all"
                @click="handleUploadCert"
              >
                <Upload :size="36" class="text-ocean-400 mx-auto mb-3" />
                <div class="text-sm text-ocean-300 mb-1">点击上传或拖拽文件到此处</div>
                <div class="text-xs text-ocean-500">支持 PDF、JPG、PNG（最大 10MB</div>
              </div>
              <button
                class="w-full sm:w-auto px-6 py-3 rounded-xl bg-sand-gradient text-white font-bold shadow-lg shadow-sand-500/25 flex items-center justify-center gap-2 hover:shadow-sand-500/40 transition-all"
                @click="handleUploadCert"
              >
                <Upload :size="18" />
                模拟上传医生证明
              </button>
            </div>

            <div v-else class="bg-kelp-500/15 border border-kelp-500/40 rounded-xl p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-kelp-500/30 flex items-center justify-center">
                  <FileText :size="20" class="text-kelp-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-white text-sm truncate">
                    体检证明_{{ currentRiskRecord?.studentName }}.pdf
                  </div>
                  <div class="text-xs text-ocean-400 flex items-center gap-2">
                    <CheckCircle2 :size="12" class="text-kelp-400" />
                    已上传，等待顾问验证
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="currentRiskRecord?.currentStep === 'advisor_review'" class="space-y-4">
      <div class="bg-coral-500/10 rounded-2xl p-4 sm:p-5 border border-coral-500/40">
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-10 h-10 rounded-xl bg-coral-500/20 flex items-center justify-center flex-shrink-0">
            <UserCheck :size="20" class="text-coral-400" />
          </div>
          <div class="flex-1">
            <h5 class="font-semibold text-white text-base mb-1">第二步：顾问复核中</h5>
            <p class="text-sm text-ocean-200/70 mb-3">
              您的健康信息已提交，潜水顾问正在评估您的健康风险。
            </p>
            <div class="flex items-center gap-3 text-xs text-ocean-300/80">
              <Clock :size="14" class="text-coral-400" />
              <span>预计处理时间：通常在 2 小时内完成</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-ocean-800/50 rounded-2xl p-4 sm:p-5 border border-ocean-600/30">
        <div class="flex items-center gap-2 mb-3">
          <AlertTriangle :size="16" class="text-sand-400" />
          <h6 class="font-semibold text-white text-sm">评估期间，以下步骤暂时锁定：</h6>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div class="flex items-center gap-2 p-3 rounded-xl bg-ocean-900/60 border border-ocean-700/40">
            <Lock :size="14" class="text-sand-400" />
            <span class="text-xs text-ocean-300">选择排期</span>
          </div>
          <div class="flex items-center gap-2 p-3 rounded-xl bg-ocean-900/60 border border-ocean-700/40">
            <Lock :size="14" class="text-sand-400" />
            <span class="text-xs text-ocean-300">分配教练</span>
          </div>
          <div class="flex items-center gap-2 p-3 rounded-xl bg-ocean-900/60 border border-ocean-700/40">
            <Lock :size="14" class="text-sand-400" />
            <span class="text-xs text-ocean-300">装备尺码</span>
          </div>
          <div class="flex items-center gap-2 p-3 rounded-xl bg-ocean-900/60 border border-ocean-700/40">
            <Lock :size="14" class="text-sand-400" />
            <span class="text-xs text-ocean-300">确认付款</span>
          </div>
        </div>
      </div>
      <div class="text-xs text-ocean-400 text-center">
        顾问确认后，以上步骤将自动解锁。您可随时返回查看进度。
      </div>
    </div>

    <div v-else-if="currentRiskRecord?.status === 'approved'" class="space-y-4">
      <div class="bg-kelp-500/15 rounded-2xl p-5 sm:p-6 border-2 border-kelp-500/40">
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-kelp-500/30 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 :size="28" class="text-kelp-400" />
          </div>
          <div class="flex-1">
            <h5 class="font-bold text-white text-lg sm:text-xl mb-1">健康评估通过！</h5>
            <p class="text-sm text-ocean-200/80">
              顾问已确认您可以参加潜水课程。可选排期、教练和装备清单已解锁，现在可以继续完成后续报名步骤。
            </p>
          </div>
        </div>
      </div>

      <div v-if="approvedCourseNames.length > 0" class="bg-ocean-800/50 rounded-2xl p-4 sm:p-5 border border-ocean-600/30">
        <div class="flex items-center gap-2 mb-3">
          <Waves :size="18" class="text-kelp-400" />
          <h6 class="font-semibold text-white text-sm">适合您的课程</h6>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="course in approvedCourseNames" :key="course.id"
            class="flex items-center gap-3 p-3 rounded-xl bg-ocean-900/50 border border-kelp-500/30"
          >
            <div class="w-10 h-10 rounded-lg bg-kelp-500/20 flex items-center justify-center">
              <Waves :size="18" class="text-kelp-400" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-white text-sm truncate">{{ course.name }}</div>
              <div class="text-xs text-ocean-400">{{ course.shortName }} · {{ course.duration }}</div>
            </div>
            <Unlock :size="16" class="text-kelp-400" />
          </div>
        </div>
      </div>

      <div class="bg-ocean-800/50 rounded-2xl p-4 sm:p-5 border border-ocean-600/30">
        <div class="flex items-center gap-2 mb-3">
          <ClipboardCheck :size="16" class="text-sand-400" />
          <h6 class="font-semibold text-white text-sm">健康声明确认记录</h6>
        </div>
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-xs">
            <span class="text-ocean-400">声明人：</span>
            <span class="text-white">{{ currentRiskRecord.studentName }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="text-ocean-400">声明时间：</span>
            <span class="text-white">{{ new Date(currentRiskRecord.createdAt).toLocaleString('zh-CN') }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="text-ocean-400">确认时间：</span>
            <span class="text-white">{{ currentRiskRecord.confirmedAt ? new Date(currentRiskRecord.confirmedAt).toLocaleString('zh-CN') : '—' }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="text-ocean-400">审核人：</span>
            <span class="text-white">{{ currentRiskRecord.advisorReview.reviewerName || '—' }}</span>
          </div>
          <div class="flex flex-wrap gap-1.5 mt-2">
            <span
              v-for="cat in getWarningCategoryLabel" :key="cat"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-coral-500/15 text-coral-300 border border-coral-500/20"
            >
              {{ cat }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="currentRiskRecord?.advisorReview.reviewerName" class="text-xs text-ocean-400 text-center">
        审核人：{{ currentRiskRecord.advisorReview.reviewerName }}
        <span v-if="currentRiskRecord.advisorReview.reviewedAt">
          · {{ new Date(currentRiskRecord.advisorReview.reviewedAt).toLocaleString('zh-CN') }}</span>
      </div>
    </div>

    <div v-else-if="currentRiskRecord?.status === 'deferred'" class="space-y-4">
      <div class="bg-sand-500/15 rounded-2xl p-5 sm:p-6 border-2 border-sand-500/40">
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sand-500/30 flex items-center justify-center flex-shrink-0">
            <Calendar :size="28" class="text-sand-400" />
          </div>
          <div class="flex-1">
            <h5 class="font-bold text-white text-lg sm:text-xl mb-1">报名已暂缓</h5>
            <p class="text-sm text-ocean-200/80">
              根据评估结果，您的报名已被暂缓。
            </p>
          </div>
        </div>
      </div>
      <div v-if="currentRiskRecord?.deferral.reason" class="bg-ocean-800/50 rounded-xl p-4 border border-ocean-600/30">
        <div class="text-xs text-ocean-400 mb-1">暂缓原因</div>
        <div class="text-sm text-ocean-200">{{ currentRiskRecord.deferral.reason }}</div>
      </div>
      <div v-if="currentRiskRecord?.deferral.deferredUntil" class="text-xs text-ocean-400 text-center">
        建议暂缓至：{{ currentRiskRecord.deferral.deferredUntil }} 后再次报名
      </div>
    </div>

    <div v-else-if="currentRiskRecord?.status === 'rejected'" class="space-y-4">
      <div class="bg-coral-500/15 rounded-2xl p-5 sm:p-6 border-2 border-coral-500/40">
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-coral-500/30 flex items-center justify-center flex-shrink-0">
            <X :size="28" class="text-coral-400" />
          </div>
          <div class="flex-1">
            <h5 class="font-bold text-white text-lg sm:text-xl mb-1">暂不适合潜水</h5>
            <p class="text-sm text-ocean-200/80">
              很抱歉，根据健康评估结果，您目前暂不适合参加潜水课程。
            </p>
          </div>
        </div>
      </div>
      <div v-if="currentRiskRecord?.advisorReview.notes" class="bg-ocean-800/50 rounded-xl p-4 border border-ocean-600/30">
        <div class="text-xs text-ocean-400 mb-1">评估说明</div>
        <div class="text-sm text-ocean-200">{{ currentRiskRecord.advisorReview.notes }}</div>
      </div>
    </div>
  </div>
</template>
