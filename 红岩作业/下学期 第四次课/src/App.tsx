import { useState } from 'react'
import styles from './App.module.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hello Webpack + React!</h1>
      <p className={styles.subtitle}>支持 TypeScript 和 CSS Module</p>

      <div className={styles.card}>
        <button className={styles.button} onClick={() => setCount(c => c + 1)}>
          count is {count}
        </button>
        <p className={styles.hint}>
          Edit <code className={styles.code}>src/App.tsx</code>
        </p>
      </div>

      <div className={styles.features}>
        <h2>功能特性</h2>
        <ul>
          <li>⚡ Webpack 5 打包</li>
          <li>🔷 TypeScript 类型支持</li>
          <li>🎨 CSS Module 作用域样式</li>
          <li>⚛️ React 18</li>
          <li>💚 Vue 3 已配置</li>
        </ul>
      </div>
    </div>
  )
}
