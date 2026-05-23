import React, { Component } from 'react'
import './TodoList.css'
export default class TodoList extends Component {
  state = {
    editingId: null,    // 正在编辑的 todo id
    editText: ''         // 编辑中的文字
  }

  // 双击进入编辑模式
  handleDoubleClick = (todo) => {
    this.setState({ editingId: todo.id, editText: todo.text })
  }

  // 编辑输入变化
  handleEditChange = (e) => {
    this.setState({ editText: e.target.value })
  }

  // 按回车保存
  handleEditKeyUp = (e) => {
    if (e.key === 'Enter') {
      this.saveEdit()
    }
  }

  // 保存编辑并退出编辑模式
  saveEdit = () => {
    const { editingId, editText } = this.state
    if (editText.trim() === '') {
      alert('内容不能为空！')
      return
    }
    this.props.editTodo(editingId, editText.trim())
    this.setState({ editingId: null, editText: '' })
  }

  render() {
    const { editingId, editText } = this.state
    return (

      <ul className="todo-list">
        {this.props.todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => this.props.updateTodo(todo.id)}
            />
            {/* 编辑模式：显示输入框 */}
            {editingId === todo.id ? (
              <input
                className="edit-input"
                type="text"
                value={editText}
                onChange={this.handleEditChange}
                onKeyUp={this.handleEditKeyUp}
                onBlur={this.saveEdit}
                autoFocus
              />
            ) : (
              <span
                className="todo-text"
                onDoubleClick={() => this.handleDoubleClick(todo)}
              >
                {todo.text}
              </span>
            )}
            <button className="delete-btn" onClick={() => this.props.onDelete(todo.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

    )
  }
}
