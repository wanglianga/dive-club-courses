<script setup lang="ts">
import { Star, Droplets, Award, Languages } from 'lucide-vue-next';
import type { Instructur } from '@/data';

interface Props {
  instructor: Instructur;
  selected?: boolean;
}

defineProps<Props>();
const emit = defineEmits<{ select: [instructor: Instructur] }>();
</script>

<template>
  <div
    class="relative rounded-xl p-4 cursor-pointer transition-all duration-300 bg-ocean-800/40 border border-ocean-600/30 backdrop-blur-sm"
    :class="[
      selected
        ? 'ring-2 ring-coral-400 bg-ocean-700/60 shadow-lg shadow-coral-500/10'
        : 'hover:bg-ocean-700/50 hover:border-ocean-500/40',
    ]"
    @click="emit('select', instructor)"
  >
    <div class="flex items-start gap-4">
      <div class="relative flex-shrink-0">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {{ instructor.avatar }}
        </div>
        <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-kelp-400 border-2 border-ocean-800 flex items-center justify-center">
          <Award :size="12" class="text-ocean-900" />
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-1">
          <div>
            <h4 class="font-bold text-white text-lg">{{ instructor.name }}</h4>
            <p class="text-xs text-ocean-300">{{ instructor.title }}</p>
          </div>
          <div class="flex items-center gap-1 bg-sand-500/20 text-sand-300 px-2 py-1 rounded-lg">
            <Star :size="13" class="fill-sand-400" />
            <span class="text-sm font-bold">{{ instructor.rating }}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-3 text-xs text-ocean-200/70 mb-2.5">
          <span class="inline-flex items-center gap-1">
            <Droplets :size="12" class="text-ocean-400" />
            {{ instructor.dives.toLocaleString() }} 潜
          </span>
          <span class="text-ocean-500">|</span>
          <span>{{ instructor.experience }}</span>
        </div>

        <div class="mb-2">
          <span class="text-xs text-ocean-400 mb-1 block">专长领域</span>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="(sp, idx) in instructor.specialties.slice(0, 3)"
              :key="idx"
              class="text-xs bg-ocean-600/40 text-ocean-100 px-2 py-0.5 rounded-md"
            >
              {{ sp }}
            </span>
            <span
              v-if="instructor.specialties.length > 3"
              class="text-xs text-ocean-400"
            >
              +{{ instructor.specialties.length - 3 }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <Languages :size="12" class="text-ocean-400" />
          <span v-for="(lang, idx) in instructor.languages" :key="lang" class="text-xs text-ocean-200/70">
            {{ lang }}<span v-if="idx < instructor.languages.length - 1"> / </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
