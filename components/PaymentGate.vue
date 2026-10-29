<script setup lang="ts">
import { computed, ref } from 'vue'

// 假資料：使用者只授權「付款給 vendor-A、單筆上限 500」
const policy = { payee: 'vendor-A', ceiling: 500 }

const calls = [
  { id: 'ok', label: '正常付款', payee: 'vendor-A', amount: 300, key: 'tx-001' },
  { id: 'inj', label: '被注入：付給攻擊者', payee: 'attacker-X', amount: 300, key: 'tx-002' },
  { id: 'big', label: '被注入：金額暴增', payee: 'vendor-A', amount: 9999, key: 'tx-003' },
  { id: 'dup', label: '重放同一筆', payee: 'vendor-A', amount: 300, key: 'tx-001' },
]

const gated = ref(false)
const selected = ref(calls[1])
const seen = ref<string[]>([])
const result = ref<null | { stages: { name: string; ok: boolean; note: string }[]; allowed: boolean }>(null)

function run() {
  const c = selected.value
  if (!gated.value) {
    result.value = { stages: [{ name: '只檢查「工具有沒有開放」', ok: true, note: 'payments.create 在清單內，放行' }], allowed: true }
    return
  }
  const stages: { name: string; ok: boolean; note: string }[] = []
  const push = (name: string, ok: boolean, note: string) => {
    stages.push({ name, ok, note })
    return ok
  }
  const done = () => (result.value = { stages, allowed: stages.every(s => s.ok) && stages.length === 5 })
  if (!push('1. Scope（工具在範圍內）', true, 'payments.create 在允許清單')) return done()
  if (!push('2. Authorization（這筆參數被授權）', c.payee === policy.payee, c.payee === policy.payee ? '收款人符合' : `收款人 ${c.payee} 未被授權`)) return done()
  if (!push('3. Money ceiling（金額上限）', c.amount <= policy.ceiling, c.amount <= policy.ceiling ? `${c.amount} ≤ ${policy.ceiling}` : `${c.amount} 超過上限 ${policy.ceiling}`)) return done()
  const dup = seen.value.includes(c.key)
  if (!push('4. Idempotency（不重複執行）', !dup, dup ? `${c.key} 已執行過` : '新的交易鍵')) return done()
  seen.value.push(c.key)
  push('5. Default deny（其餘一律拒絕）', true, '所有檢查通過才放行')
  done()
}

const verdict = computed(() => result.value && (result.value.allowed ? '✅ 付款已執行' : '⛔ 已攔截'))
</script>

<template>
  <div class="text-sm">
    <div class="flex gap-2 mb-3 items-center">
      <span class="opacity-70">模式：</span>
      <button class="px-3 py-1 rounded border" :class="!gated ? 'bg-red-500 text-white' : ''" @click="gated = false; result = null">無閘控（只看工具開放）</button>
      <button class="px-3 py-1 rounded border" :class="gated ? 'bg-green-600 text-white' : ''" @click="gated = true; result = null">ScopeGate 五階段</button>
    </div>
    <div class="mb-2 opacity-70">使用者授權：只付給 <b>{{ policy.payee }}</b>，單筆上限 <b>{{ policy.ceiling }}</b>。模型送出的呼叫：</div>
    <div class="flex flex-wrap gap-2 mb-3">
      <button v-for="c in calls" :key="c.id" class="px-3 py-1 rounded border" :class="selected.id === c.id ? 'bg-blue-600 text-white' : ''" @click="selected = c; result = null">{{ c.label }}</button>
    </div>
    <div class="font-mono mb-3 p-2 rounded bg-gray-100">pay(to="{{ selected.payee }}", amount={{ selected.amount }}, key="{{ selected.key }}")</div>
    <button class="px-4 py-1 rounded bg-black text-white mb-3" @click="run">送出</button>
    <button class="px-3 py-1 ml-2 rounded border mb-3" @click="seen = []; result = null">重置交易紀錄</button>
    <div v-if="result">
      <div v-for="s in result.stages" :key="s.name" class="py-1">
        <span :class="s.ok ? 'text-green-600' : 'text-red-600'">{{ s.ok ? '✔' : '✘' }}</span> {{ s.name }} <span class="opacity-60">— {{ s.note }}</span>
      </div>
      <div class="mt-2 text-lg font-bold" :class="result.allowed && !gated ? 'text-red-600' : ''">{{ verdict }}<span v-if="!gated && selected.id !== 'ok'">（本不該放行！）</span></div>
    </div>
  </div>
</template>
