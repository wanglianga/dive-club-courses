<script setup lang="ts">
import { computed } from 'vue';
import { Calendar, Users, MapPin, Check, Waves, Droplets, ChevronRight } from 'lucide-vue-next';
import { courseSessions, instructors, type CourseLevel } from '@/data';

interface Props {
  courseId: CourseLevel;
}

const props = defineProps<Props>();
const emit = defineEmits<{ select: [sessionId: string] }>();

const filteredSessions = computed(() =>
  courseSessions.filter(s => s.courseId === props.courseId)
);

const getInstructor = (id: string) => instructors.find(i => i.id === id);

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return {
    month: `${d.getMonth() + 1}月`,
    day: d.getDate(),
    weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()],
  };
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-white font-bold text-lg flex items-center gap-2">
          <Calendar :size="22" class="text-ocean-300" />
          选择排期
        </h4>
        <p class="text-xs text-ocean-400 mt-1">
          共 {{ filteredSessions.length }} 个可选班次
        </p>
      </div>
    </div>

    <div v-if="filteredSessions.length === 0" class="p-8 text-center bg-ocean-800/40 rounded-2xl border border-ocean-600/30">
      <div class="text-ocean-400 text-sm">暂无该课程的排期，请稍后查看或联系顾问</div>
    </div>

    <div class="space-y-3">
      <div
        v-for="session in filteredSessions"
        :key="session.id"
        class="relative rounded-2xl overflow-hidden border border-ocean-600/30 cursor-pointer transition-all hover:border-ocean-500/50 group bg-ocean-800/40"
        @click="emit('select', session.id)"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-ocean-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div class="relative p-4 sm:p-5">
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="flex gap-3 sm:w-auto">
              <div v-if="session.poolDates.length" class="flex-1 sm:flex-none">
                <div class="text-xs text-ocean-400 mb-1.5 flex items-center gap-1">
                  <Waves :size="12" />
                  泳池课
                </div>
                <div class="flex gap-2">
                  <div
                    v-for="date in session.poolDates"
                    :key="date"
                    class="bg-ocean-600/40 rounded-xl p-2.5 text-center min-w-[64px]"
                  >
                    <div class="text-xs text-ocean-300">{{ formatDate(date).month }}</div>
                    <div class="text-xl font-bold text-white leading-none my-0.5">
                      {{ formatDate(date).day }}
                    </div>
                    <div class="text-xs text-ocean-400">{{ formatDate(date).weekday }}</div>
                  </div>
                </div>
              </div>

              <div v-if="session.openWaterDates.length" class="flex-1 sm:flex-none">
                <div class="text-xs text-coral-400 mb-1.5 flex items-center gap-1">
                  <Droplets :size="12" />
                  开放水域
                </div>
                <div class="flex gap-2">
                  <div
                    v-for="date in session.openWaterDates"
                    :key="date"
                    class="bg-coral-500/20 rounded-xl p-2.5 text-center min-w-[64px] border border-coral-500/20"
                  >
                    <div class="text-xs text-coral-300">{{ formatDate(date).month }}</div>
                    <div class="text-xl font-bold text-white leading-none my-0.5">
                      {{ formatDate(date).day }}
                    </div>
                    <div class="text-xs text-coral-400/80">{{ formatDate(date).weekday }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-1 flex flex-col sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-ocean-600/20 sm:pl-4 sm:min-w-[200px]">
              <div class="flex items-center gap-2 sm:justify-end w-full sm:w-auto">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center text-white text-xs font-bold">
                  {{ getInstructor(session.instructorId)?.avatar }}
                </div>
                <div class="flex-1 sm:flex-none sm:text-right">
                  <div class="text-sm font-semibold text-white">
                    {{ getInstructor(session.instructorId)?.name }}
                  </div>
                  <div class="text-xs text-ocean-400">
                    {{ getInstructor(session.instructorId)?.title }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1.5 text-xs">
                <Users :size="12" class="text-ocean-400" />
                <span class="text-ocean-300">
                  已报名 <span class="font-bold text-kelp-400">{{ session.enrolled }}</span>
                  <span class="text-ocean-500">/</span>
                  <span>{{ session.maxStudents }}</span> 人
                </span>
              </div>

              <div
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
                :class="[
                  session.maxStudents - session.enrolled <= 2
                    ? 'bg-coral-500/20 text-coral-300'
                    : 'bg-kelp-500/20 text-kelp-300',
                ]"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="[
                    session.maxStudents - session.enrolled <= 2
                      ? 'bg-coral-400 animate-pulse'
                      : 'bg-kelp-400',
                  ]"
                ></span>
                {{ session.maxStudents - session.enrolled <= 2 ? '名额紧张' : '名额充足' }}
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-ocean-600/20 flex items-center justify-between">
            <div class="text-xs text-ocean-400 flex items-center gap-1">
              <MapPin :size="12" />
              泳池：俱乐部训练池 | 开放水域：蜈支洲岛
            </div>
            <button class="inline-flex items-center gap-1 text-sm font-semibold text-ocean-300 group-hover:text-white transition-colors">
              选择此排期
              <ChevronRight :size="16" class="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
