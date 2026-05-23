import { describe, it, expect } from 'vitest'
import { isEmail, randomString, formatDate } from '../utils/index'

describe('工具函数测试', () => {
  describe('isEmail - 邮箱验证', () => {
    it('应该正确验证有效的邮箱', () => {
      expect(isEmail('test@example.com')).toBe(true)
      expect(isEmail('user.name+tag@domain.co.uk')).toBe(true)
      expect(isEmail('user123@test.org')).toBe(true)
    })

    it('应该拒绝无效的邮箱格式', () => {
      expect(isEmail('invalid')).toBe(false)
      expect(isEmail('invalid@')).toBe(false)
      expect(isEmail('@domain.com')).toBe(false)
      expect(isEmail('user@.com')).toBe(false)
      expect(isEmail('')).toBe(false)
    })
  })

  describe('randomString - 随机字符串生成', () => {
    it('应该生成指定长度的字符串', () => {
      expect(randomString(8).length).toBe(8)
      expect(randomString(16).length).toBe(16)
      expect(randomString(4).length).toBe(4)
    })

    it('应该只包含字母和数字', () => {
      const str = randomString(100)
      expect(/^[A-Za-z0-9]+$/.test(str)).toBe(true)
    })

    it('应该生成不同的字符串（概率上）', () => {
      const results = new Set()
      for (let i = 0; i < 100; i++) {
        results.add(randomString(10))
      }
      // 100 次随机生成 10 位字符串，应该有很高的唯一性
      expect(results.size).toBeGreaterThan(90)
    })
  })

  describe('formatDate - 日期格式化', () => {
    it('应该正确格式化日期', () => {
      const date = new Date('2024-03-15T14:30:45')
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-03-15')
      expect(formatDate(date, 'YYYY/MM/DD')).toBe('2024/03/15')
    })

    it('应该包含时间部分', () => {
      const date = new Date('2024-03-15T14:30:45')
      expect(formatDate(date, 'HH:mm:ss')).toBe('14:30:45')
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-03-15 14:30:45')
    })

    it('应该补零', () => {
      const date = new Date('2024-01-05T09:05:03')
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-01-05 09:05:03')
    })
  })
})
