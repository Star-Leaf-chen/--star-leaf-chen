<template>
  <div class="container">
    <h1 class="title">Hello Webpack + Vue!</h1>
    <p class="subtitle">支持 TypeScript 和 CSS Module</p>

    <div class="card">
      <button class="button" @click="count++">
        count is {{ count }}
      </button>
      <p class="hint">Edit <code>src/App.vue</code></p>
    </div>

    <div class="features">
      <h2>功能特性</h2>
      <ul>
        <li>⚡ Webpack 5 打包</li>
        <li>🔷 TypeScript 类型支持</li>
        <li>🎨 CSS Module 作用域样式</li>
        <li>💚 Vue 3</li>
        <li>⚛️ React 已配置</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<style module>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  padding: 2rem;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0.5rem 0 2rem;
}

.card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 300px;
}

.button {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 184, 131, 0.4);
}

.hint {
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.875rem;
}

.features {
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  text-align: left;
}

.features h2 {
  margin: 0 0 1rem;
  font-size: 1.2rem;
}

.features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  padding: 0.4rem 0;
  font-size: 0.95rem;
}
</style>
