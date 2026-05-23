import React, { Component } from 'react'
import Header from './components/Header/Header'
import Main from './components/Main/Main'
import TodoList from './components/TodoList/TodoList'
import Footer from './components/Footer/Footer'
//静态页面用了一下AI
import './App.css'

export default class App extends Component {
  state = {
    todos: [
      { id: 1, text: '完成React作业', completed: true },
      { id: 2, text: '学习Spring Boot', completed: false },
      { id: 3, text: '复习英语单词', completed: false },
      { id: 4, text: '去操场跑步', completed: true }
    ]
  }
  // 添加待办事项
  addTodo = (todoObj) => {
    const { todos } = this.state
    const newTodo = [todoObj, ...todos]
    this.setState({ todos: newTodo })
  }
  // 更新待办事项的完成状态
  updateTodo = (id) => {
    const { todos } = this.state
    const newTodos = todos.map((todo) => {
      if (todo.id === id) return { ...todo, completed: !todo.completed, uncompletedCount: todos.filter(t => !t.completed).length }
      else return todo
    })
    this.setState({ todos: newTodos })
  }
  // 删除待办事项
  onDelete = (id) => {
    const { todos } = this.state
    const newTodos = todos.filter((todo) => todo.id !== id)
    this.setState({ todos: newTodos })
  }
  // 全选/全不选待办事项
  CheckAllTodos = (completed) => {
    const { todos } = this.state
    const newTodos = todos.map((todo) => {
      return { ...todo, completed: completed }
    })
    this.setState({ todos: newTodos })
  }

  // 反选：每项单独取反
  toggleAllTodos = () => {
    const { todos } = this.state
    const newTodos = todos.map((todo) => ({
      ...todo,
      completed: !todo.completed
    }))
    this.setState({ todos: newTodos })
  }

  // 编辑待办事项内容
  editTodo = (id, newText) => {
    const { todos } = this.state
    const newTodos = todos.map((todo) => {
      if (todo.id === id) return { ...todo, text: newText }
      return todo
    })
    this.setState({ todos: newTodos })
  }

  render() {
    const { todos } = this.state
    return (
      <div className="app">
        {/* 拆分了组件 */}
        <Header />
        <Main todos={todos} addTodo={this.addTodo} updateTodo={this.updateTodo} onDelete={this.onDelete} editTodo={this.editTodo} />
        <Footer todos={todos} uncompletedCount={todos.filter((todo) => !todo.completed).length} CheckAllTodos={this.CheckAllTodos} toggleAllTodos={this.toggleAllTodos} />
      </div>
    )
  }
}
