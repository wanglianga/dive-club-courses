<script setup lang="ts">
import { MapPin, Clock, Info, Car, Phone } from 'lucide-vue-next';
import type { MeetingPoint } from '@/data';

interface Props {
  points: MeetingPoint[];
}

defineProps<Props>();
</script>

<template>
  <div class="space-y-4">
    <div>
      <h4 class="text-white font-bold text-lg flex items-center gap-2">
        <MapPin :size="22" class="text-ocean-300" />
        集合地点 & 时间
      </h4>
      <p class="text-xs text-ocean-400 mt-1">请提前到达集合地点，切勿迟到</p>
    </div>

    <div class="space-y-3">
      <div
        v-for="(point, idx) in points"
        :key="point.id"
        class="relative rounded-2xl overflow-hidden border border-ocean-600/30 bg-ocean-800/50"
      >
        <div class="absolute top-0 left-0 w-1 h-full"
          :class="idx === 0 ? 'bg-coral-gradient' : 'bg-gradient-to-b from-ocean-400 to-ocean-600'"
        ></div>

        <div class="relative p-4 sm:p-5">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-ocean-700/60 flex items-center justify-center text-ocean-200 border border-ocean-600/30">
              <MapPin :size="22" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold px-2 py-0.5 rounded-md"
                      :class="idx === 0 ? 'bg-coral-500/30 text-coral-200' : 'bg-ocean-600/50 text-ocean-200'"
                    >
                      {{ idx === 0 ? '第一集合点' : '第二集合点' }}
                    </span>
                  </div>
                  <h5 class="font-bold text-white mt-1.5">{{ point.name }}</h5>
                </div>
                <button class="p-2 rounded-lg bg-ocean-700/50 text-ocean-300 hover:bg-ocean-600/60 hover:text-white transition-colors">
                  <Phone :size="16" />
                </button>
              </div>

              <div class="space-y-2 text-sm">
                <div class="flex items-start gap-2 text-ocean-200/80">
                  <MapPin :size="14" class="text-ocean-400 mt-0.5 flex-shrink-0" />
                  <span>{{ point.address }}</span>
                </div>
                <div class="flex items-start gap-2 text-ocean-200/80">
                  <Clock :size="14" class="text-coral-400 mt-0.5 flex-shrink-0" />
                  <span class="text-coral-300 font-medium">{{ point.time }}</span>
                </div>
              </div>

              <div class="mt-3 pt-3 border-t border-ocean-600/20">
                <div class="flex items-start gap-2 text-xs">
                  <Info :size="12" class="text-sand-400 mt-0.5 flex-shrink-0" />
                  <span class="text-ocean-300/80">{{ point.notes }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3">
      <button class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ocean-600/50 text-white font-medium hover:bg-ocean-500/60 transition-colors">
        <Car :size="18" />
        获取导航路线
      </button>
      <button class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-coral-gradient text-white font-medium shadow-lg shadow-coral-500/20 hover:shadow-coral-500/30 transition-all">
        <MapPin :size="18" />
        查看地图
      </button>
    </div>
  </div>
</template>
