<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowLeft, ChevronRight, CheckCircle2, ShoppingBag,
  CalendarDays, UserCheck, ClipboardList, Package, MapPin, Waves
} from 'lucide-vue-next';
import {
  courses, instructors, trainingStages, equipmentList,
  meetingPoints, seaConditions, certificateProgress,
  type Course, type CourseLevel, type Instructur,
} from '@/data';
import CourseCard from './CourseCard.vue';
import InstructorCard from './InstructorCard.vue';
import TrainingTimeline from './TrainingTimeline.vue';
import EquipmentSizeSelector from './EquipmentSizeSelector.vue';
import HealthDeclarationForm from './HealthDeclarationForm.vue';
import SeaConditionAlert from './SeaConditionAlert.vue';
import CertificateProgressCard from './CertificateProgressCard.vue';
import CourseDatePicker from './CourseDatePicker.vue';
import MeetingPointCard from './MeetingPointCard.vue';

type StudentStep = 'courses' | 'dates' | 'instructor' | 'equipment' | 'health' | 'confirm';

const currentStep = ref<StudentStep>('courses');
const selectedCourse = ref<Course | null>(null);
const selectedSessionId = ref<string | null>(null);
const selectedInstructor = ref<Instructur | null>(null);
const showConfirmSuccess = ref(false);

const stepConfig: { id: StudentStep; label: string; icon: any }[] = [
  { id: 'courses', label: '选择课程', icon: Waves },
  { id: 'dates', label: '选择排期', icon: CalendarDays },
  { id: 'instructor', label: '分配教练', icon: UserCheck },
  { id: 'equipment', label: '装备尺码', icon: Package },
  { id: 'health', label: '健康声明', icon: ClipboardList },
  { id: 'confirm', label: '确认行程', icon: MapPin },
];

const currentStepIndex = computed(() =>
  stepConfig.findIndex(s => s.id === currentStep.value)
);

const canGoNext = computed(() => {
  switch (currentStep.value) {
    case 'courses': return !!selectedCourse.value;
    case 'dates': return !!selectedSessionId.value;
    case 'instructor': return !!selectedInstructor.value;
    case 'equipment': return true;
    case 'health': return true;
    case 'confirm': return true;
    default: return false;
  }
});

const selectCourse = (course: Course) => {
  selectedCourse.value = course;
  selectedSessionId.value = null;
  selectedInstructor.value = null;
};

const nextStep = () => {
  if (!canGoNext.value) return;
  const idx = currentStepIndex.value;
  if (idx < stepConfig.length - 1) {
    currentStep.value = stepConfig[idx + 1].id;
  } else {
    showConfirmSuccess.value = true;
  }
};

const prevStep = () => {
  const idx = currentStepIndex.value;
  if (idx > 0) {
    currentStep.value = stepConfig[idx - 1].id;
  }
};

const resetForm = () => {
  showConfirmSuccess.value = false;
  currentStep.value = 'courses';
  selectedCourse.value = null;
  selectedSessionId.value = null;
  selectedInstructor.value = null;
};
</script>

<template>
  <div class="w-full max-w-full">
    <div v-if="showConfirmSuccess" class="py-10">
      <div class="max-w-md mx-auto text-center">
        <div class="w-20 h-20 rounded-full bg-kelp-500/20 border-4 border-kelp-500/40 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 :size="44" class="text-kelp-400" />
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">🎉 报名成功！</h3>
        <p class="text-ocean-300 mb-6">
          您的潜水课程已成功报名，我们会尽快联系您确认详情。
        </p>
        <div class="bg-ocean-800/60 rounded-2xl p-5 border border-ocean-600/30 mb-6 text-left">
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-ocean-400">课程名称</span>
              <span class="text-white font-medium">{{ selectedCourse?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-ocean-400">带课教练</span>
              <span class="text-white font-medium">{{ selectedInstructor?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-ocean-400">订单状态</span>
              <span class="text-kelp-400 font-medium">待确认</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            class="flex-1 px-5 py-3 rounded-xl bg-ocean-600/50 text-white font-medium hover:bg-ocean-500/60 transition-colors"
            @click="resetForm"
          >
            继续报名其他课程
          </button>
          <button
            class="flex-1 px-5 py-3 rounded-xl bg-coral-gradient text-white font-medium shadow-lg shadow-coral-500/20"
          >
            查看我的证书
          </button>
        </div>
      </div>
      return;
    </div>

    <div class="mb-6 sm:mb-8">
      <div class="hidden sm:flex items-center justify-between gap-2 mb-3">
        <template v-for="(step, idx) in stepConfig" :key="step.id">
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <button
              class="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              :class="[
                idx < currentStepIndex
                  ? 'bg-kelp-500 text-white'
                  : idx === currentStepIndex
                  ? 'bg-coral-gradient text-white shadow-lg shadow-coral-500/30 ring-4 ring-coral-500/20'
                  : 'bg-ocean-700/60 text-ocean-400',
              ]"
              :disabled="idx > currentStepIndex + 1"
              @click="idx <= currentStepIndex ? (currentStep = step.id) : null"
            >
              <CheckCircle2 v-if="idx < currentStepIndex" :size="18" />
              <span v-else>{{ idx + 1 }}</span>
            </button>
            <span
              class="text-xs font-medium whitespace-nowrap truncate"
              :class="idx <= currentStepIndex ? 'text-white' : 'text-ocean-500'"
            >
              {{ step.label }}
            </span>
          </div>
          <div
            v-if="idx < stepConfig.length - 1"
            class="w-full h-0.5 flex-shrink-0 rounded-full"
            :class="idx < currentStepIndex ? 'bg-kelp-500' : 'bg-ocean-700/60'"
          ></div>
        </template>
      </div>

      <div class="sm:hidden flex items-center gap-3">
        <button
          v-if="currentStepIndex > 0"
          class="w-10 h-10 rounded-xl bg-ocean-700/50 flex items-center justify-center text-ocean-300"
          @click="prevStep"
        >
          <ArrowLeft :size="20" />
        </button>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1.5">
            <component :is="stepConfig[currentStepIndex].icon" :size="16" class="text-coral-400" />
            <span class="font-semibold text-white text-sm">
              步骤 {{ currentStepIndex + 1 }}/{{ stepConfig.length }}
            </span>
            <span class="text-ocean-400 text-xs">· {{ stepConfig[currentStepIndex].label }}</span>
          </div>
          <div class="h-1.5 bg-ocean-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-coral-400 to-coral-500 rounded-full transition-all duration-300"
              :style="{ width: ((currentStepIndex + 1) / stepConfig.length * 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div v-show="currentStep === 'courses'">
        <h3 class="text-white font-bold text-xl mb-4 flex items-center gap-2">
          <Waves :size="24" class="text-ocean-300" />
          选择潜水课程
        </h3>
        <p class="text-ocean-300/70 text-sm mb-5">
          从入门到专业，选择适合您的潜水课程等级
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CourseCard
            v-for="course in courses"
            :key="course.id"
            :course="course"
            :selected="selectedCourse?.id === course.id"
            @select="selectCourse"
          />
        </div>
      </div>

      <div v-show="currentStep === 'dates'">
        <CourseDatePicker
          v-if="selectedCourse"
          :course-id="selectedCourse.id as CourseLevel"
          @select="selectedSessionId = $event"
        />
      </div>

      <div v-show="currentStep === 'instructor'">
        <div class="mb-4">
          <h3 class="text-white font-bold text-xl mb-2 flex items-center gap-2">
            <UserCheck :size="24" class="text-ocean-300" />
            选择带课教练
          </h3>
          <p class="text-ocean-300/70 text-sm">
            所有教练均持有 PADI 认证，经验丰富，专业可靠
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InstructorCard
            v-for="ins in instructors"
            :key="ins.id"
            :instructor="ins"
            :selected="selectedInstructor?.id === ins.id"
            @select="selectedInstructor = $event"
          />
        </div>

        <div v-if="trainingStages[selectedCourse?.id as CourseLevel]" class="mt-8">
          <h4 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <ClipboardList :size="20" class="text-ocean-300" />
            训练阶段安排
          </h4>
          <div class="bg-ocean-800/40 rounded-2xl p-4 sm:p-5 border border-ocean-600/30">
            <TrainingTimeline :stages="trainingStages[selectedCourse?.id as CourseLevel]" />
          </div>
        </div>
      </div>

      <div v-show="currentStep === 'equipment'">
        <EquipmentSizeSelector />
      </div>

      <div v-show="currentStep === 'health'">
        <HealthDeclarationForm />
      </div>

      <div v-show="currentStep === 'confirm'">
        <div class="space-y-6">
          <div class="bg-coral-500/10 border border-coral-500/30 rounded-2xl p-5">
            <h3 class="text-white font-bold text-xl mb-2 flex items-center gap-2">
              <ShoppingBag :size="22" class="text-coral-400" />
              订单确认
            </h3>
            <p class="text-ocean-300/70 text-sm">
              请核对以下信息，确认无误后提交报名
            </p>
          </div>

          <div class="bg-ocean-800/50 rounded-2xl p-5 border border-ocean-600/30">
            <h4 class="font-semibold text-white mb-4">报名详情</h4>
            <div class="space-y-4">
              <div class="flex items-start gap-3 pb-4 border-b border-ocean-700/40">
                <div class="w-10 h-10 rounded-xl bg-ocean-600/40 flex items-center justify-center flex-shrink-0">
                  <Waves :size="18" class="text-ocean-300" />
                </div>
                <div class="flex-1">
                  <div class="text-xs text-ocean-400 mb-0.5">课程选择</div>
                  <div class="text-white font-medium">{{ selectedCourse?.name }}</div>
                  <div class="text-sm text-ocean-300 mt-0.5">{{ selectedCourse?.duration }} · 最大深度 {{ selectedCourse?.maxDepth }}m</div>
                </div>
                <div class="text-right">
                  <div class="text-coral-400 font-bold text-xl">¥{{ selectedCourse?.price }}</div>
                </div>
              </div>

              <div class="flex items-start gap-3 pb-4 border-b border-ocean-700/40">
                <div class="w-10 h-10 rounded-xl bg-sand-500/20 flex items-center justify-center flex-shrink-0">
                  <CalendarDays :size="18" class="text-sand-400" />
                </div>
                <div class="flex-1">
                  <div class="text-xs text-ocean-400 mb-0.5">课程排期</div>
                  <div class="text-white font-medium">
                    {{ selectedSessionId ? '已选择排期 #' + selectedSessionId : '待排期' }}
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3 pb-4 border-b border-ocean-700/40">
                <div class="w-10 h-10 rounded-xl bg-kelp-500/20 flex items-center justify-center flex-shrink-0">
                  <UserCheck :size="18" class="text-kelp-400" />
                </div>
                <div class="flex-1">
                  <div class="text-xs text-ocean-400 mb-0.5">带课教练</div>
                  <div class="text-white font-medium">{{ selectedInstructor?.name }}</div>
                  <div class="text-sm text-ocean-300 mt-0.5">{{ selectedInstructor?.title }}</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-coral-500/20 flex items-center justify-center flex-shrink-0">
                  <Package :size="18" class="text-coral-400" />
                </div>
                <div class="flex-1">
                  <div class="text-xs text-ocean-400 mb-0.5">装备</div>
                  <div class="text-white font-medium">全套租赁装备</div>
                  <div class="text-sm text-ocean-300 mt-0.5">共 {{ equipmentList.length }} 件，含必备装备</div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CertificateProgressCard v-if="certificateProgress[0]" :progress="certificateProgress[0]" />
            <SeaConditionAlert :conditions="seaConditions.slice(0, 2)" />
          </div>

          <MeetingPointCard :points="meetingPoints" />

          <div class="bg-ocean-900/60 rounded-2xl p-5 border border-ocean-700/40">
            <div class="flex items-end justify-between mb-4">
              <div>
                <div class="text-ocean-300 text-sm mb-1">应付金额</div>
                <div class="flex items-baseline gap-2">
                  <span class="text-coral-400 font-bold text-3xl">¥{{ selectedCourse?.price }}</span>
                  <span class="text-ocean-400 text-sm">/ 人</span>
                </div>
              </div>
              <div class="text-right">
                <div v-if="selectedCourse?.originalPrice" class="text-ocean-500 text-sm line-through">
                  原价 ¥{{ selectedCourse.originalPrice }}
                </div>
                <div class="text-kelp-400 text-xs">
                  已优惠 ¥{{ (selectedCourse?.originalPrice || 0) - (selectedCourse?.price || 0) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sticky bottom-4 sm:relative sm:bottom-auto z-20 pt-2">
        <div class="flex flex-col-reverse sm:flex-row gap-3">
          <button
            v-if="currentStepIndex > 0"
            class="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-ocean-700/50 text-white font-medium hover:bg-ocean-600/60 transition-colors flex items-center justify-center gap-2 border border-ocean-600/30"
            @click="prevStep"
          >
            <ArrowLeft :size="18" />
            上一步
          </button>
          <div class="flex-1"></div>
          <button
            class="flex-1 sm:flex-none min-w-[180px] px-8 py-3.5 rounded-xl bg-coral-gradient text-white font-bold shadow-xl shadow-coral-500/25 transition-all hover:shadow-coral-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            :disabled="!canGoNext"
            @click="nextStep"
          >
            <template v-if="currentStepIndex === stepConfig.length - 1">
              <CheckCircle2 :size="18" />
              确认报名
            </template>
            <template v-else>
              下一步
              <ChevronRight :size="18" />
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
