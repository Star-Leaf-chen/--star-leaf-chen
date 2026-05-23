import React, { Component } from 'react'
import TodoList from '../TodoList/TodoList'
import './Main.css'

export default class Main extends Component {

  handleAddTodo = (e) => {
    if (e.key !== 'Enter') return;
    const todoObj = {
      id: Date.now(),
      text: e.target.value,
      completed: false
    }
    if (e.target.value.trim() === '') {
      alert('输入不能为空！');
      return;
    }
    if (e.key === 'Enter') {
      this.props.addTodo(todoObj);
      e.target.value = '';
    }
  }

  render() {
    return (
      <div className="main">
        <div className="input-area">
          <input
            className="todo-input"
            type="text"
            placeholder="按回车键添加新的待办事项..."
            onKeyUp={this.handleAddTodo}
          />
          {/*添加按钮暂时没有功能，可以后续实现 */}
          <button className="add-btn" onClick={this.handleAddTodo}>
            添加
          </button>
        </div>
        <TodoList todos={this.props.todos} updateTodo={this.props.updateTodo} onDelete={this.props.onDelete} />
      </div>
    )
  }
}
