<script setup lang="ts">
import { BookOpen, Waves, Droplets, CheckCircle2, Circle } from 'lucide-vue-next';
import type { TrainingStage } from '@/data';

interface Props {
  stages: TrainingStage[];
}

defineProps<Props>();

const typeConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  theory: {
    label: '理论课',
    icon: BookOpen,
    color: 'text-sand-400',
    bg: 'bg-sand-400',
  },
  pool: {
    label: '泳池课',
    icon: Waves,
    color: 'text-ocean-400',
    bg: 'bg-ocean-400',
  },
  openwater: {
    label: '开放水域',
    icon: Droplets,
    color: 'text-coral-400',
    bg: 'bg-coral-400',
  },
};
</script>

<template>
  <div class="space-y-0">
    <div
      v-for="(stage, idx) in stages"
      :key="stage.id"
      class="relative flex gap-4 pb-6 last:pb-0"
    >
      <div class="relative flex flex-col items-center">
        <div
          class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
          :class="[
            stage.completed
              ? 'bg-kelp-500 text-white shadow-lg shadow-kelp-500/30'
              : 'bg-ocean-700 border-2 border-ocean-500 text-ocean-300',
          ]"
        >
          <CheckCircle2 v-if="stage.completed" :size="20" />
          <component v-else :is="typeConfig[stage.type].icon" :size="18" />
        </div>
        <div
          v-if="idx < stages.length - 1"
          class="absolute top-10 w-0.5 h-full bg-gradient-to-b"
          :class="[
            stage.completed ? 'from-kelp-500 to-kelp-500/30' : 'from-ocean-500 to-ocean-500/30',
          ]"
        />
      </div>

      <div class="flex-1 min-w-0 pt-1">
        <div class="flex items-start justify-between gap-3 mb-1.5">
          <div>
            <div class="flex items-center gap-2 mb-0.5">
              <h5 class="font-semibold text-white" :class="{ 'text-ocean-300/70': !stage.completed }">
                {{ stage.name }}
              </h5>
              <span
                class="text-xs px-2 py-0.5 rounded-md font-medium"
                :class="[
                  stage.type === 'theory' && 'bg-sand-500/20 text-sand-300',
                  stage.type === 'pool' && 'bg-ocean-500/20 text-ocean-300',
                  stage.type === 'openwater' && 'bg-coral-500/20 text-coral-300',
                ]"
              >
                {{ typeConfig[stage.type].label }}
              </span>
            </div>
            <p class="text-sm text-ocean-200/60 leading-relaxed">{{ stage.description }}</p>
          </div>
          <div class="flex-shrink-0 text-right">
            <span
              class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md"
              :class="[
                stage.completed
                  ? 'bg-kelp-500/20 text-kelp-300'
                  : stage.date
                  ? 'bg-ocean-600/40 text-ocean-200'
                  : 'bg-ocean-700/40 text-ocean-400',
              ]"
            >
              {{ stage.completed ? '已完成' : stage.date || '待安排' }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 text-xs text-ocean-400">
          <span>时长：{{ stage.duration }}</span>
          <span v-if="!stage.completed && !stage.date">
            <Circle :size="10" class="inline mr-1 animate-pulse" />
            待排期
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
