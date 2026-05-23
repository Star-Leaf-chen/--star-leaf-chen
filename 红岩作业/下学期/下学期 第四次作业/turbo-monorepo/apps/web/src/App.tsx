import { useState } from 'react'
import { Button, Card, Title } from '@monorepo/ui'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Title level={1} className="mb-8 text-center">
          Monorepo Demo
        </Title>

        <Card
          title="计数器"
          footer={
            <span className="text-sm text-gray-500">
              点击按钮增加计数
            </span>
          }
          className="mb-6"
        >
          <div className="text-center">
            <p className="text-6xl font-bold text-blue-600 mb-4">
              {count}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setCount(c => c - 1)} variant="secondary">
                减少
              </Button>
              <Button onClick={() => setCount(c => c + 1)} variant="primary">
                增加
              </Button>
              <Button onClick={() => setCount(0)} variant="danger">
                重置
              </Button>
            </div>
          </div>
        </Card>

        <Card title="组件展示">
          <div className="space-y-4">
            <div>
              <Title level={4} className="mb-2">按钮变体</Title>
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            <div>
              <Title level={4} className="mb-2">按钮尺寸</Title>
              <div className="flex gap-3 items-center flex-wrap">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <Button disabled>禁用状态</Button>
            </div>
          </div>
        </Card>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          使用 Turbo 构建 · 组件来自 @monorepo/ui
        </footer>
      </div>
    </div>
  )
}
