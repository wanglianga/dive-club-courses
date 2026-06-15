<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { AlertTriangle, CheckCircle, XCircle, FileText, ChevronRight } from 'lucide-vue-next';
import { healthDeclarations, type HealthDeclaration } from '@/data';

export interface HealthDeclarationValidation {
  isValid: boolean;
  hasWarning: boolean;
  allAnswered: boolean;
  hasSignature: boolean;
  hasDate: boolean;
  hasAgreement: boolean;
  warningItems: HealthDeclaration[];
  missingFields: string[];
}

const emit = defineEmits<{
  (e: 'validate', payload: HealthDeclarationValidation): void;
}>();

const answers = ref<Record<string, 'yes' | 'no'>>({});
const signatureName = ref('');
const signatureDate = ref('');
const emergencyContact = ref('');
const emergencyPhone = ref('');
const additionalNotes = ref('');
const declarationAgreed = ref(false);

const allAnswered = computed(() => {
  return healthDeclarations.every(h => answers.value[h.id]);
});

const hasWarningYes = computed(() => {
  return healthDeclarations.some(h => h.warning && answers.value[h.id] === 'yes');
});

const warningItems = computed(() => {
  return healthDeclarations.filter(h => h.warning && answers.value[h.id] === 'yes');
});

const missingFields = computed<string[]>(() => {
  const missing: string[] = [];
  if (!allAnswered.value) missing.push('健康问题');
  if (!signatureName.value.trim()) missing.push('声明人签名');
  if (!signatureDate.value) missing.push('声明日期');
  if (!declarationAgreed.value) missing.push('责任声明确认');
  return missing;
});

const validation = computed<HealthDeclarationValidation>(() => ({
  isValid: allAnswered.value && !!signatureName.value.trim() && !!signatureDate.value && declarationAgreed.value,
  hasWarning: hasWarningYes.value,
  allAnswered: allAnswered.value,
  hasSignature: !!signatureName.value.trim(),
  hasDate: !!signatureDate.value,
  hasAgreement: declarationAgreed.value,
  warningItems: warningItems.value,
  missingFields: missingFields.value,
}));

const setAnswer = (id: string, answer: 'yes' | 'no') => {
  answers.value[id] = answer;
};

const today = new Date().toISOString().split('T')[0];

watch(validation, (v) => emit('validate', v), { immediate: true, deep: true });

defineExpose({
  validation,
  getValidation: () => validation.value,
});
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-start gap-3 p-4 bg-sand-500/10 border border-sand-500/30 rounded-xl">
      <FileText :size="22" class="text-sand-400 flex-shrink-0 mt-0.5" />
      <div>
        <h4 class="font-bold text-white text-lg">潜水健康声明</h4>
        <p class="text-sm text-ocean-200/70 mt-1">
          请如实回答以下健康问题，如有任何疑虑请咨询医生。隐瞒健康信息可能导致潜水风险。
        </p>
      </div>
    </div>

    <div class="space-y-3">
      <div
        v-for="item in healthDeclarations"
        :key="item.id"
        class="rounded-xl p-4 border transition-all"
        :class="[
          answers[item.id] === 'yes' && item.warning
            ? 'bg-coral-500/10 border-coral-500/40'
            : answers[item.id] === 'no'
            ? 'bg-kelp-500/10 border-kelp-500/30'
            : 'bg-ocean-800/40 border-ocean-600/30',
        ]"
      >
        <div class="flex items-start gap-3">
          <div
            v-if="item.warning"
            class="w-8 h-8 rounded-lg bg-coral-500/20 flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            <AlertTriangle :size="16" class="text-coral-400" />
          </div>
          <div
            v-else
            class="w-8 h-8 rounded-lg bg-ocean-600/40 flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            <FileText :size="14" class="text-ocean-300" />
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-sm text-white leading-relaxed mb-3">
              {{ item.question }}
              <span v-if="item.warning" class="text-coral-400 font-medium">（重要）</span>
            </p>

            <div class="flex gap-2">
              <button
                class="flex-1 max-w-[120px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                :class="[
                  answers[item.id] === 'yes'
                    ? 'bg-coral-500 text-white shadow-lg shadow-coral-500/20'
                    : 'bg-ocean-700/50 text-ocean-200 hover:bg-ocean-600/60 border border-ocean-500/30',
                ]"
                @click="setAnswer(item.id, 'yes')"
              >
                <XCircle :size="16" />
                是
              </button>
              <button
                class="flex-1 max-w-[120px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                :class="[
                  answers[item.id] === 'no'
                    ? 'bg-kelp-500 text-white shadow-lg shadow-kelp-500/20'
                    : 'bg-ocean-700/50 text-ocean-200 hover:bg-ocean-600/60 border border-ocean-500/30',
                ]"
                @click="setAnswer(item.id, 'no')"
              >
                <CheckCircle :size="16" />
                否
              </button>
            </div>

            <div
              v-if="answers[item.id] === 'yes' && item.warning"
              class="mt-3 p-3 bg-coral-500/10 rounded-lg border border-coral-500/30"
            >
              <div class="flex items-start gap-2 text-xs text-coral-200">
                <AlertTriangle :size="14" class="mt-0.5 flex-shrink-0" />
                <div>
                  <div class="font-semibold text-coral-300 mb-1">需要进一步确认</div>
                  <p>
                    请在顾问协助下评估潜水可行性，可能需要提供医生签字的体检证明后方可报名。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm text-ocean-300 mb-1.5">紧急联系人姓名</label>
        <input
          v-model="emergencyContact"
          type="text"
          placeholder="请输入紧急联系人"
          class="w-full px-4 py-3 rounded-xl bg-ocean-800/60 border border-ocean-600/40 text-white placeholder:text-ocean-500 focus:outline-none focus:border-ocean-400 transition-colors"
        />
      </div>
      <div>
        <label class="block text-sm text-ocean-300 mb-1.5">紧急联系电话</label>
        <input
          v-model="emergencyPhone"
          type="tel"
          placeholder="请输入联系电话"
          class="w-full px-4 py-3 rounded-xl bg-ocean-800/60 border border-ocean-600/40 text-white placeholder:text-ocean-500 focus:outline-none focus:border-ocean-400 transition-colors"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm text-ocean-300 mb-1.5">其他需要说明的情况</label>
      <textarea
        v-model="additionalNotes"
        rows="3"
        placeholder="如有过敏史、用药情况、特殊需求等请在此说明"
        class="w-full px-4 py-3 rounded-xl bg-ocean-800/60 border border-ocean-600/40 text-white placeholder:text-ocean-500 focus:outline-none focus:border-ocean-400 transition-colors resize-none"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm text-ocean-300 mb-1.5">声明人签名</label>
        <input
          v-model="signatureName"
          type="text"
          placeholder="请输入姓名"
          class="w-full px-4 py-3 rounded-xl bg-ocean-800/60 border border-ocean-600/40 text-white placeholder:text-ocean-500 focus:outline-none focus:border-ocean-400 transition-colors"
        />
      </div>
      <div>
        <label class="block text-sm text-ocean-300 mb-1.5">声明日期</label>
        <input
          v-model="signatureDate"
          :max="today"
          type="date"
          class="w-full px-4 py-3 rounded-xl bg-ocean-800/60 border border-ocean-600/40 text-white focus:outline-none focus:border-ocean-400 transition-colors"
        />
      </div>
    </div>

    <label class="flex items-start gap-3 cursor-pointer p-4 bg-ocean-800/40 rounded-xl border border-ocean-600/30 hover:border-ocean-500/50 transition-colors">
      <input
        v-model="declarationAgreed"
        type="checkbox"
        class="mt-1 w-5 h-5 rounded border-ocean-500 bg-ocean-800 text-coral-500 focus:ring-coral-500/30"
      />
      <span class="text-sm text-ocean-200 leading-relaxed">
        本人确认以上信息真实有效，已了解潜水运动存在的风险，自愿承担相应责任。如因隐瞒健康状况导致意外，本人承担全部责任。
        <span class="text-coral-400">（请仔细阅读后勾选）</span>
      </span>
    </label>

    <div class="flex items-center gap-3 p-4 rounded-xl"
      :class="[
        validation.isValid && !validation.hasWarning
          ? 'bg-kelp-500/15 border border-kelp-500/40'
          : validation.isValid && validation.hasWarning
          ? 'bg-sand-500/15 border border-sand-500/40'
          : 'bg-ocean-800/40 border border-ocean-600/30',
      ]"
    >
      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        :class="[
          validation.isValid && !validation.hasWarning
            ? 'bg-kelp-500 text-white'
            : validation.isValid && validation.hasWarning
            ? 'bg-sand-500 text-white'
            : 'bg-ocean-700/60 text-ocean-400',
        ]"
      >
        <AlertTriangle v-if="validation.hasWarning" :size="22" />
        <CheckCircle v-else :size="22" />
      </div>
      <div class="flex-1">
        <div
          class="font-semibold"
          :class="[
            validation.isValid && !validation.hasWarning
              ? 'text-kelp-300'
              : validation.isValid && validation.hasWarning
              ? 'text-sand-300'
              : 'text-ocean-300',
          ]"
        >
          健康声明状态
        </div>
        <div class="text-xs text-ocean-400 mt-0.5 flex items-center gap-1">
          <template v-if="validation.hasWarning && validation.isValid">
            <AlertTriangle :size="12" class="text-sand-400" />
            已完成，但存在警示项，需顾问进一步评估
          </template>
          <template v-else-if="validation.isValid">
            已完成所有必填项，可以提交
          </template>
          <template v-else>
            <span class="text-coral-400">缺少：{{ validation.missingFields.join('、') }}</span>
          </template>
        </div>
      </div>
      <ChevronRight :size="20"
        :class="[
          validation.isValid
            ? validation.hasWarning
              ? 'text-sand-400'
              : 'text-kelp-400'
            : 'text-ocean-500',
        ]"
      />
    </div>
  </div>
</template>
