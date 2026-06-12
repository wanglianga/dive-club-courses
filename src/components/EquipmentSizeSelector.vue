<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Glasses, Wind, Footprints, Shirt, Backpack, Settings,
  Hand, HardHat, Watch, Check, Ruler, Info
} from 'lucide-vue-next';
import { equipmentList, wetsuitSizeChart, type EquipmentItem } from '@/data';

const selectedSizes = ref<Record<string, string>>({});
const showSizeChart = ref(false);

const iconMap: Record<string, any> = {
  Glasses, Wind, Footprints, Shirt, Backpack, Settings,
  Hand, HardHat, Watch,
};

const requiredItems = computed(() => equipmentList.filter(e => e.required));
const optionalItems = computed(() => equipmentList.filter(e => !e.required));

const selectSize = (itemId: string, size: string) => {
  if (selectedSizes.value[itemId] === size) {
    delete selectedSizes.value[itemId];
  } else {
    selectedSizes.value[itemId] = size;
  }
};

const categoryLabels: Record<string, string> = {
  mask: '面镜',
  fins: '脚蹼',
  wetsuit: '潜水服',
  bcd: 'BCD',
  regulator: '调节器',
  accessory: '配件',
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-white font-bold text-lg">装备清单 & 尺码选择</h4>
        <p class="text-xs text-ocean-300 mt-1">请根据自身情况选择合适的装备尺码</p>
      </div>
      <button
        class="inline-flex items-center gap-1.5 text-xs text-ocean-300 hover:text-white bg-ocean-700/50 px-3 py-2 rounded-lg transition-colors"
        @click="showSizeChart = !showSizeChart"
      >
        <Ruler :size="14" />
        尺码对照表
      </button>
    </div>

    <div
      v-if="showSizeChart"
      class="bg-ocean-800/60 rounded-xl p-4 border border-ocean-600/40 overflow-x-auto"
    >
      <div class="text-sm text-ocean-200 font-semibold mb-3">湿式潜水服尺码参考（单位：cm）</div>
      <table class="w-full text-xs min-w-[480px]">
        <thead>
          <tr class="text-ocean-400 border-b border-ocean-600/40">
            <th class="py-2 px-3 text-left font-medium">尺码</th>
            <th class="py-2 px-3 text-center font-medium">身高</th>
            <th class="py-2 px-3 text-center font-medium">胸围</th>
            <th class="py-2 px-3 text-center font-medium">腰围</th>
            <th class="py-2 px-3 text-center font-medium">臀围</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="size in wetsuitSizeChart"
            :key="size.value"
            class="border-b border-ocean-700/30 hover:bg-ocean-700/20"
          >
            <td class="py-2 px-3">
              <span class="bg-ocean-600/50 text-white font-bold px-2 py-0.5 rounded">
                {{ size.label }}
              </span>
            </td>
            <td class="py-2 px-3 text-center text-ocean-200">{{ size.height }}</td>
            <td class="py-2 px-3 text-center text-ocean-200">{{ size.bust }}</td>
            <td class="py-2 px-3 text-center text-ocean-200">{{ size.waist }}</td>
            <td class="py-2 px-3 text-center text-ocean-200">{{ size.hip }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="space-y-4">
      <div>
        <div class="flex items-center gap-2 mb-3">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-coral-500 text-white text-xs font-bold">
            {{ requiredItems.length }}
          </span>
          <span class="text-sm font-semibold text-white">必备装备</span>
        </div>
        <div class="space-y-3">
          <div
            v-for="item in requiredItems"
            :key="item.id"
            class="bg-ocean-800/50 rounded-xl p-4 border border-ocean-600/30 hover:border-ocean-500/50 transition-colors"
          >
            <div class="flex items-start gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg bg-ocean-600/40 flex items-center justify-center text-ocean-200 flex-shrink-0">
                <component :is="iconMap[item.icon]" :size="18" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h5 class="font-semibold text-white">{{ item.name }}</h5>
                  <span class="text-xs bg-coral-500/20 text-coral-300 px-2 py-0.5 rounded-full">
                    必需
                  </span>
                  <span class="text-xs text-ocean-400">
                    {{ categoryLabels[item.category] }}
                  </span>
                </div>
                <p v-if="item.description" class="text-xs text-ocean-300/70 mt-1 flex items-start gap-1">
                  <Info :size="12" class="mt-0.5 flex-shrink-0" />
                  {{ item.description }}
                </p>
              </div>
            </div>

            <div v-if="item.sizes" class="flex flex-wrap gap-2">
              <button
                v-for="size in item.sizes"
                :key="size"
                class="min-w-[56px] px-3 py-2 rounded-lg text-sm font-medium transition-all"
                :class="[
                  selectedSizes[item.id] === size
                    ? 'bg-coral-gradient text-white shadow-lg shadow-coral-500/20 ring-2 ring-coral-300/50'
                    : 'bg-ocean-700/60 text-ocean-200 hover:bg-ocean-600/70 border border-ocean-500/30',
                ]"
                @click="selectSize(item.id, size)"
              >
                <span v-if="selectedSizes[item.id] === size" class="flex items-center justify-center gap-1">
                  <Check :size="14" />
                  {{ size }}
                </span>
                <span v-else>{{ size }}</span>
              </button>
            </div>
            <div v-else class="flex items-center gap-2 text-xs text-kelp-400">
              <Check :size="14" />
              标准尺寸，无需选择
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="flex items-center gap-2 mb-3">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-ocean-500 text-white text-xs font-bold">
            {{ optionalItems.length }}
          </span>
          <span class="text-sm font-semibold text-white">可选装备</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="item in optionalItems"
            :key="item.id"
            class="bg-ocean-800/30 rounded-xl p-3 border border-ocean-700/30 hover:border-ocean-600/50 transition-colors"
          >
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-ocean-700/50 flex items-center justify-center text-ocean-300 flex-shrink-0">
                <component :is="iconMap[item.icon]" :size="16" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h5 class="font-medium text-white text-sm">{{ item.name }}</h5>
                  <span class="text-xs bg-ocean-600/40 text-ocean-300 px-2 py-0.5 rounded-full">
                    可选
                  </span>
                </div>
                <p v-if="item.description" class="text-xs text-ocean-400 mt-1">
                  {{ item.description }}
                </p>
                <div v-if="item.sizes" class="flex flex-wrap gap-1.5 mt-2">
                  <button
                    v-for="size in item.sizes"
                    :key="size"
                    class="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                    :class="[
                      selectedSizes[item.id] === size
                        ? 'bg-kelp-500 text-white'
                        : 'bg-ocean-700/60 text-ocean-300 hover:bg-ocean-600/60',
                    ]"
                    @click="selectSize(item.id, size)"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-kelp-500/10 border border-kelp-500/30 rounded-xl p-4">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm font-semibold text-kelp-300">装备选择状态</div>
          <div class="text-xs text-ocean-300 mt-0.5">
            已选择 {{ Object.keys(selectedSizes).length }} 项装备尺码
          </div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-kelp-400">
            {{ Math.round((Object.keys(selectedSizes).length / requiredItems.filter(i => i.sizes).length) * 100) }}%
          </div>
          <div class="text-xs text-ocean-400">完成度</div>
        </div>
      </div>
    </div>
  </div>
</template>
