<script setup lang="ts">
import { Waves, Eye, Thermometer, Wind, CloudRain, AlertTriangle, CheckCircle2, Clock, MapPin } from 'lucide-vue-next';
import type { SeaCondition } from '@/data';

interface Props {
  conditions: SeaCondition[];
}

defineProps<Props>();

const levelConfig: Record<string, { label: string; bg: string; text: string; border: string; dot: string; icon: any }> = {
  calm: {
    label: '海况平静',
    bg: 'bg-kelp-500/15',
    text: 'text-kelp-300',
    border: 'border-kelp-500/40',
    dot: 'bg-kelp-400',
    icon: CheckCircle2,
  },
  moderate: {
    label: '海况一般',
    bg: 'bg-sand-500/15',
    text: 'text-sand-300',
    border: 'border-sand-500/40',
    dot: 'bg-sand-400',
    icon: Clock,
  },
  rough: {
    label: '海况较差',
    bg: 'bg-coral-500/15',
    text: 'text-coral-300',
    border: 'border-coral-500/40',
    dot: 'bg-coral-400',
    icon: AlertTriangle,
  },
  dangerous: {
    label: '危险禁潜',
    bg: 'bg-red-500/15',
    text: 'text-red-300',
    border: 'border-red-500/40',
    dot: 'bg-red-500',
    icon: AlertTriangle,
  },
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-white font-bold text-lg flex items-center gap-2">
          <Waves :size="22" class="text-ocean-300" />
          海况预报
        </h4>
        <p class="text-xs text-ocean-400 mt-1">近期开放水域潜水日海况信息</p>
      </div>
      <div class="flex items-center gap-3 text-xs">
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-kelp-400"></span>
          <span class="text-ocean-300">良好</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-sand-400"></span>
          <span class="text-ocean-300">一般</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-coral-400"></span>
          <span class="text-ocean-300">较差</span>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <div
        v-for="cond in conditions"
        :key="cond.date + cond.location"
        class="relative rounded-2xl overflow-hidden border transition-all hover:shadow-lg"
        :class="[levelConfig[cond.level].border]"
      >
        <div class="absolute inset-0" :class="levelConfig[cond.level].bg" />
        <div class="absolute inset-0 bg-ocean-800/30 backdrop-blur-[2px]" />

        <div class="relative p-4 sm:p-5">
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex items-start gap-3">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                :class="[levelConfig[cond.level].bg, 'border', levelConfig[cond.level].border]"
              >
                <component :is="levelConfig[cond.level].icon" :size="22" :class="levelConfig[cond.level].text" />
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h5 class="font-bold text-white">{{ cond.location }}</h5>
                  <span
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="[levelConfig[cond.level].bg, levelConfig[cond.level].text, 'border', levelConfig[cond.level].border]"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="levelConfig[cond.level].dot"></span>
                    {{ levelConfig[cond.level].label }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs text-ocean-300">
                  <MapPin :size="11" />
                  {{ cond.date }}
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div class="bg-ocean-800/40 rounded-xl p-3 border border-ocean-600/20">
              <div class="flex items-center gap-1.5 text-ocean-400 text-xs mb-1">
                <Waves :size="12" />
                浪高
              </div>
              <div class="text-lg font-bold text-white">{{ cond.waveHeight }}</div>
            </div>
            <div class="bg-ocean-800/40 rounded-xl p-3 border border-ocean-600/20">
              <div class="flex items-center gap-1.5 text-ocean-400 text-xs mb-1">
                <Eye :size="12" />
                能见度
              </div>
              <div class="text-lg font-bold text-white">{{ cond.visibility }}</div>
            </div>
            <div class="bg-ocean-800/40 rounded-xl p-3 border border-ocean-600/20">
              <div class="flex items-center gap-1.5 text-ocean-400 text-xs mb-1">
                <Thermometer :size="12" />
                水温
              </div>
              <div class="text-lg font-bold text-white">{{ cond.waterTemp }}</div>
            </div>
            <div class="bg-ocean-800/40 rounded-xl p-3 border border-ocean-600/20">
              <div class="flex items-center gap-1.5 text-ocean-400 text-xs mb-1">
                <Wind :size="12" />
                水流
              </div>
              <div class="text-lg font-bold text-white">{{ cond.current }}</div>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-xl bg-ocean-900/40 border border-ocean-700/30">
            <CloudRain :size="16" class="text-ocean-400 mt-0.5 flex-shrink-0" />
            <div class="flex-1">
              <div class="flex items-center gap-2 text-xs mb-1">
                <span class="text-ocean-300">天气：</span>
                <span class="text-white font-medium">{{ cond.weather }}</span>
              </div>
              <div class="text-sm" :class="levelConfig[cond.level].text">
                <span class="font-semibold">建议：</span>{{ cond.recommendation }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
