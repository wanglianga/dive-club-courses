<script setup lang="ts">
import { Award, CheckCircle, Clock, FileCheck, GraduationCap } from 'lucide-vue-next';
import type { CertificateProgress } from '@/data';

interface Props {
  progress: CertificateProgress;
}

defineProps<Props>();

const courseShortNames: Record<string, string> = {
  discover: 'DSD',
  openwater: 'OW',
  advanced: 'AOW',
  rescue: 'RD',
};

const courseNames: Record<string, string> = {
  discover: '体验潜水',
  openwater: '开放水域',
  advanced: '进阶开放水域',
  rescue: '救援潜水员',
};

const poolStatusText: Record<string, { text: string; color: string; bg: string }> = {
  pending: { text: '待完成', color: 'text-ocean-300', bg: 'bg-ocean-500/20' },
  completed: { text: '已通过', color: 'text-kelp-300', bg: 'bg-kelp-500/20' },
  failed: { text: '未通过', color: 'text-coral-300', bg: 'bg-coral-500/20' },
};
</script>

<template>
  <div class="relative rounded-2xl overflow-hidden bg-ocean-800/60 border border-ocean-600/30 backdrop-blur-sm">
    <div
      v-if="progress.overallProgress === 100"
      class="absolute inset-0 bg-gradient-to-br from-kelp-500/10 via-transparent to-sand-500/10"
    />

    <div class="relative p-5 sm:p-6">
      <div class="flex items-start justify-between gap-4 mb-5">
        <div class="flex items-start gap-3">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
            :class="[
              progress.overallProgress === 100
                ? 'bg-gradient-to-br from-kelp-400 to-kelp-600 text-white'
                : 'bg-gradient-to-br from-ocean-400 to-ocean-600 text-white',
            ]"
          >
            <GraduationCap :size="26" />
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span
                class="text-xs font-mono px-2 py-0.5 rounded-md font-bold"
                :class="[
                  progress.overallProgress === 100
                    ? 'bg-kelp-500/30 text-kelp-200'
                    : 'bg-ocean-500/30 text-ocean-200',
                ]"
              >
                {{ courseShortNames[progress.courseId] }}
              </span>
              <h5 class="font-bold text-white text-lg">
                {{ courseNames[progress.courseId] }}证书
              </h5>
            </div>
            <p class="text-sm text-ocean-300">学员：{{ progress.studentName }}</p>
          </div>
        </div>
        <div class="text-right flex-shrink-0">
          <div class="text-3xl font-bold"
            :class="progress.overallProgress === 100 ? 'text-kelp-400' : 'text-ocean-300'"
          >
            {{ progress.overallProgress }}%
          </div>
          <div class="text-xs text-ocean-400">完成进度</div>
        </div>
      </div>

      <div class="h-3 bg-ocean-900/60 rounded-full overflow-hidden mb-6">
        <div
          class="h-full rounded-full transition-all duration-700 relative overflow-hidden"
          :class="[
            progress.overallProgress === 100
              ? 'bg-gradient-to-r from-kelp-400 to-kelp-300'
              : 'bg-gradient-to-r from-ocean-400 to-coral-400',
          ]"
          :style="{ width: progress.overallProgress + '%' }"
        >
          <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 mb-5">
        <div class="bg-ocean-900/40 rounded-xl p-3 text-center">
          <div class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sand-500/20 mb-1.5">
            <FileCheck :size="16" class="text-sand-400" />
          </div>
          <div class="text-xl font-bold text-white">{{ progress.theoryScore }}</div>
          <div class="text-xs text-ocean-400">理论分数</div>
        </div>
        <div class="bg-ocean-900/40 rounded-xl p-3 text-center">
          <div
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg mb-1.5"
            :class="poolStatusText[progress.poolStatus].bg"
          >
            <CheckCircle :size="16" :class="poolStatusText[progress.poolStatus].color" />
          </div>
          <div class="text-lg font-bold" :class="poolStatusText[progress.poolStatus].color">
            {{ poolStatusText[progress.poolStatus].text }}
          </div>
          <div class="text-xs text-ocean-400">泳池训练</div>
        </div>
        <div class="bg-ocean-900/40 rounded-xl p-3 text-center">
          <div class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-coral-500/20 mb-1.5">
            <Clock :size="16" class="text-coral-400" />
          </div>
          <div class="text-xl font-bold text-white">
            {{ progress.openWaterDives }}<span class="text-ocean-500 text-sm">/{{ progress.requiredDives }}</span>
          </div>
          <div class="text-xs text-ocean-400">开放水域</div>
        </div>
      </div>

      <div
        v-if="progress.overallProgress === 100"
        class="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-kelp-500/20 to-sand-500/10 border border-kelp-500/30"
      >
        <div class="w-12 h-12 rounded-xl bg-kelp-500/30 flex items-center justify-center flex-shrink-0">
          <Award :size="22" class="text-kelp-300" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-kelp-300 mb-0.5">🎉 证书已颁发</div>
          <div class="text-xs text-ocean-200/80">
            颁发日期：{{ progress.issueDate }}
          </div>
          <div class="text-xs text-ocean-400 font-mono mt-0.5">
            NO. {{ progress.certificateNumber }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
