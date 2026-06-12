<script setup lang="ts">
import { ref } from 'vue';
import {
  Anchor, Fish, Waves, UserCircle2, UserCog, Shell,
  Sun, Moon, Info, Phone, Mail, MapPin,
} from 'lucide-vue-next';
import StudentView from '@/components/StudentView.vue';
import AdvisorView from '@/components/AdvisorView.vue';

type ViewMode = 'student' | 'advisor';

const currentView = ref<ViewMode>('student');

const bubbles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  size: 6 + Math.random() * 18,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 8 + Math.random() * 10,
}));
</script>

<template>
  <div class="relative min-h-screen bg-ocean-gradient overflow-hidden">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-ocean-400/10 via-transparent to-transparent"></div>

      <div class="ocean-layer wave-layer" style="top: 15%; animation-delay: 0s;"></div>
      <div class="ocean-layer wave-layer" style="top: 35%; animation-delay: -2s; opacity: 0.7;"></div>
      <div class="ocean-layer wave-layer" style="top: 55%; animation-delay: -4s; opacity: 0.5;"></div>
      <div class="ocean-layer wave-layer" style="top: 75%; animation-delay: -6s; opacity: 0.3;"></div>

      <div
        v-for="bubble in bubbles"
        :key="bubble.id"
        class="bubble"
        :style="{
          width: bubble.size + 'px',
          height: bubble.size + 'px',
          left: bubble.left + '%',
          animationDelay: bubble.delay + 's',
          animationDuration: bubble.duration + 's',
        }"
      ></div>

      <Fish
        class="absolute text-ocean-400/10 animate-float-slow"
        :size="80"
        style="top: 12%; right: 8%; animation-delay: 0s;"
      />
      <Fish
        class="absolute text-ocean-400/8 animate-float-slow"
        :size="50"
        style="top: 45%; left: 5%; animation-delay: -2s; transform: scaleX(-1);"
      />
      <Shell
        class="absolute text-sand-400/10 animate-float-slow"
        :size="40"
        style="top: 80%; right: 15%; animation-delay: -4s;"
      />
      <Anchor
        class="absolute text-ocean-500/10 animate-wave-slow"
        :size="60"
        style="bottom: 8%; left: 12%;"
      />
    </div>

    <header class="relative z-20 border-b border-ocean-500/20 backdrop-blur-md bg-ocean-900/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-ocean-400 to-coral-500 flex items-center justify-center shadow-lg shadow-ocean-500/30">
              <Anchor :size="22" class="text-white sm:hidden" />
              <Anchor :size="26" class="text-white hidden sm:block" />
            </div>
            <div>
              <h1 class="font-bold text-white text-lg sm:text-xl tracking-tight">
                蓝珊瑚潜水俱乐部
              </h1>
              <p class="text-xs text-ocean-300/70 hidden sm:block">
                Blue Coral Diving Club · 探索蔚蓝深海
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-3">
            <div class="hidden md:flex items-center gap-1 p-1 bg-ocean-800/60 rounded-xl border border-ocean-600/30">
              <button
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                :class="[
                  currentView === 'student'
                    ? 'bg-coral-gradient text-white shadow-lg shadow-coral-500/20'
                    : 'text-ocean-300 hover:text-white hover:bg-ocean-700/50',
                ]"
                @click="currentView = 'student'"
              >
                <UserCircle2 :size="16" />
                <span class="hidden lg:inline">学员端</span>
                <span class="lg:hidden">学员</span>
              </button>
              <button
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                :class="[
                  currentView === 'advisor'
                    ? 'bg-gradient-to-r from-kelp-500 to-ocean-500 text-white shadow-lg shadow-kelp-500/20'
                    : 'text-ocean-300 hover:text-white hover:bg-ocean-700/50',
                ]"
                @click="currentView = 'advisor'"
              >
                <UserCog :size="16" />
                <span class="hidden lg:inline">顾问端</span>
                <span class="lg:hidden">顾问</span>
              </button>
            </div>

            <button class="p-2 rounded-xl bg-ocean-700/50 text-ocean-300 hover:bg-ocean-600/70 hover:text-white transition-colors">
              <Phone :size="18" />
            </button>
          </div>
        </div>

        <div class="md:hidden pb-3">
          <div class="flex items-center gap-1 p-1 bg-ocean-800/60 rounded-xl border border-ocean-600/30">
            <button
              class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              :class="[
                currentView === 'student'
                  ? 'bg-coral-gradient text-white shadow'
                  : 'text-ocean-300',
              ]"
              @click="currentView = 'student'"
            >
              <UserCircle2 :size="16" />
              学员端
            </button>
            <button
              class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              :class="[
                currentView === 'advisor'
                  ? 'bg-gradient-to-r from-kelp-500 to-ocean-500 text-white shadow'
                  : 'text-ocean-300',
              ]"
              @click="currentView = 'advisor'"
            >
              <UserCog :size="16" />
              顾问端
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div
        v-if="currentView === 'student'"
        class="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 bg-gradient-to-br from-ocean-500/10 via-ocean-600/5 to-coral-500/10 border border-ocean-500/20 backdrop-blur-sm"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-500/20 text-coral-300 text-xs font-medium mb-3">
              <Waves :size="12" />
              PADI 认证潜水中心
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
              开启你的<span class="bg-gradient-to-r from-coral-400 to-sand-400 bg-clip-text text-transparent">水下探险</span>之旅
            </h2>
            <p class="text-sm sm:text-base text-ocean-200/80 leading-relaxed">
              从体验潜水到专业救援，选择适合你的课程等级。专业教练全程陪同，全套装备免费提供，
              在蜈支洲岛清澈海域探索神秘的水下世界。
            </p>
          </div>
          <div class="flex flex-col items-end gap-2 text-right flex-shrink-0">
            <div class="flex items-center gap-2 text-xs text-ocean-300/70">
              <Sun :size="14" class="text-sand-400" />
              <span>今日水温 27°C · 能见度 20m</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-ocean-400">
              <Info :size="12" />
              手机端建议竖屏浏览体验更佳
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 bg-gradient-to-br from-kelp-500/10 via-ocean-600/5 to-ocean-500/10 border border-ocean-500/20 backdrop-blur-sm"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-kelp-500/20 text-kelp-300 text-xs font-medium mb-3">
              <UserCog :size="12" />
              顾问工作台
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
              高效管理<span class="bg-gradient-to-r from-kelp-400 to-ocean-400 bg-clip-text text-transparent">课程与学员</span>
            </h2>
            <p class="text-sm sm:text-base text-ocean-200/80 leading-relaxed">
              组合课程套餐、批量确认体检限制、一键分配装备尺码，让潜水课程管理更高效、更专业。
            </p>
          </div>
          <div class="flex flex-col items-end gap-2 text-right flex-shrink-0">
            <div class="flex items-center gap-2 text-xs text-ocean-300/70">
              <MapPin :size="14" class="text-kelp-400" />
              <span>当前班次：5 个进行中</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-ocean-400">
              <Info :size="12" />
              平板端横屏浏览体验更佳
            </div>
          </div>
        </div>
      </div>

      <StudentView v-if="currentView === 'student'" />
      <AdvisorView v-else />
    </div>

    <footer class="relative z-10 border-t border-ocean-500/20 mt-10 backdrop-blur-md bg-ocean-950/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-ocean-400 to-coral-500 flex items-center justify-center">
                <Anchor :size="16" class="text-white" />
              </div>
              <span class="font-bold text-white">蓝珊瑚潜水</span>
            </div>
            <p class="text-xs text-ocean-400 leading-relaxed">
              PADI 五星认证潜水中心，12年专业教学经验，累计服务学员超过10,000名。
            </p>
          </div>
          <div>
            <h5 class="font-semibold text-white text-sm mb-3">联系我们</h5>
            <ul class="space-y-2 text-xs text-ocean-400">
              <li class="flex items-center gap-2">
                <Phone :size="12" /> 400-888-8888
              </li>
              <li class="flex items-center gap-2">
                <Mail :size="12" /> dive@bluecoral.com
              </li>
              <li class="flex items-start gap-2">
                <MapPin :size="12" class="mt-0.5 flex-shrink-0" />
                三亚市海棠湾龙海路88号
              </li>
            </ul>
          </div>
          <div>
            <h5 class="font-semibold text-white text-sm mb-3">热门课程</h5>
            <ul class="space-y-2 text-xs text-ocean-400">
              <li>体验潜水 DSD</li>
              <li>开放水域 OW</li>
              <li>进阶开放水域 AOW</li>
              <li>救援潜水员 RD</li>
            </ul>
          </div>
          <div>
            <h5 class="font-semibold text-white text-sm mb-3">服务保障</h5>
            <ul class="space-y-2 text-xs text-ocean-400">
              <li>全程1:4小班教学</li>
              <li>全套进口装备免费</li>
              <li>不满意全额退款</li>
              <li>水下摄影免费赠送</li>
            </ul>
          </div>
        </div>
        <div class="mt-6 pt-6 border-t border-ocean-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ocean-500">
          <p>© 2026 蓝珊瑚潜水俱乐部 Blue Coral Diving. All rights reserved.</p>
          <p>PADI ® 认证编号：CDN-12345678</p>
        </div>
      </div>
    </footer>
  </div>
</template>
