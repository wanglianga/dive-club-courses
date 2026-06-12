<script setup lang="ts">
import { Waves, Anchor, Compass, Shield, Clock, Gauge, CheckCircle } from 'lucide-vue-next';
import type { Course } from '@/data';

interface Props {
  course: Course;
  selected?: boolean;
  compact?: boolean;
}

defineProps<Props>();
const emit = defineEmits<{ select: [course: Course] }>();

const iconMap: Record<string, any> = {
  Waves,
  Anchor,
  Compass,
  Shield,
};
</script>

<template>
  <div
    class="relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300"
    :class="[
      selected
        ? 'ring-2 ring-offset-2 ring-offset-ocean-900 ring-coral-400 scale-[1.02] shadow-xl shadow-coral-500/20'
        : 'hover:shadow-lg hover:shadow-ocean-400/10 hover:-translate-y-1',
      compact ? 'p-3' : 'p-5',
    ]"
    @click="emit('select', course)"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br opacity-90"
      :class="[
        course.id === 'discover' && 'from-ocean-500/20 to-ocean-700/40',
        course.id === 'openwater' && 'from-coral-500/20 to-coral-700/30',
        course.id === 'advanced' && 'from-kelp-500/20 to-kelp-700/30',
        course.id === 'rescue' && 'from-sand-500/20 to-sand-700/30',
      ]"
    />
    <div class="absolute inset-0 bg-ocean-800/50 backdrop-blur-sm" />

    <div class="relative z-10">
      <div v-if="course.badge && !compact"
        class="absolute -top-1 -right-1 bg-coral-gradient text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-lg animate-float-slow"
      >
        {{ course.badge }}
      </div>

      <div class="flex items-start gap-3 mb-3">
        <div
          class="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
          :class="[
            course.id === 'discover' && 'bg-ocean-400/30 text-ocean-200',
            course.id === 'openwater' && 'bg-coral-400/30 text-coral-200',
            course.id === 'advanced' && 'bg-kelp-400/30 text-kelp-200',
            course.id === 'rescue' && 'bg-sand-400/30 text-sand-200',
          ]"
        >
          <component :is="iconMap[course.icon]" :size="compact ? 18 : 22" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-white" :class="compact ? 'text-base' : 'text-lg'">
              {{ course.name }}
            </h3>
            <span class="text-xs font-mono text-ocean-300 bg-ocean-700/50 px-2 py-0.5 rounded">
              {{ course.shortName }}
            </span>
          </div>
          <p v-if="!compact" class="text-xs text-ocean-200/70 mt-0.5">{{ course.nameEn }}</p>
        </div>
      </div>

      <p v-if="!compact" class="text-sm text-ocean-100/80 mb-4 leading-relaxed line-clamp-2">
        {{ course.description }}
      </p>

      <div class="flex flex-wrap gap-2 mb-3">
        <div class="inline-flex items-center gap-1 text-xs text-ocean-200/80 bg-ocean-700/40 px-2.5 py-1 rounded-lg">
          <Clock :size="12" />
          <span>{{ course.duration }}</span>
        </div>
        <div class="inline-flex items-center gap-1 text-xs text-ocean-200/80 bg-ocean-700/40 px-2.5 py-1 rounded-lg">
          <Gauge :size="12" />
          <span>{{ course.maxDepth }}m</span>
        </div>
      </div>

      <div v-if="!compact" class="mb-4">
        <div class="text-xs text-ocean-300 mb-1.5">报名要求</div>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="(prereq, idx) in course.prerequisites.slice(0, compact ? 1 : 3)"
            :key="idx"
            class="inline-flex items-center gap-1 text-xs text-ocean-100/70 bg-ocean-900/50 px-2 py-0.5 rounded"
          >
            <CheckCircle :size="10" class="text-kelp-400" />
            {{ prereq }}
          </span>
        </div>
      </div>

      <div class="flex items-end justify-between pt-3 border-t border-ocean-600/30">
        <div>
          <div v-if="course.originalPrice" class="text-xs text-ocean-400/60 line-through">
            ¥{{ course.originalPrice }}
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-coral-400 font-bold" :class="compact ? 'text-xl' : 'text-2xl'">
              ¥{{ course.price }}
            </span>
            <span class="text-xs text-ocean-300/60">/人</span>
          </div>
        </div>
        <button
          class="text-xs font-semibold px-4 py-2 rounded-xl transition-all"
          :class="[
            selected
              ? 'bg-coral-gradient text-white shadow-lg shadow-coral-500/30'
              : 'bg-ocean-600/50 text-ocean-100 hover:bg-ocean-500/70',
          ]"
        >
          {{ selected ? '已选择' : '选择课程' }}
        </button>
      </div>
    </div>
  </div>
</template>
