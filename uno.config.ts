import { defineConfig } from 'unocss'

export default defineConfig({
  rules: [
    [/^scrollbar-(.*)$/, ([, c]) => ({
      '@apply': `
        [&::-webkit-scrollbar]:w-8px
        [&::-webkit-scrollbar]:h-8px
        [&::-webkit-scrollbar-track]:bg-[var(--un-preset-${c}-track,#f1f1f1)]
        [&::-webkit-scrollbar-track]:rounded-4px
        [&::-webkit-scrollbar-thumb]:bg-[var(--un-preset-${c}-thumb,#888)]
        [&::-webkit-scrollbar-thumb]:rounded-4px
        [&::-webkit-scrollbar-thumb:hover]:bg-[var(--un-preset-${c}-thumb-hover,#555)]
      `
    })],
  ],
})