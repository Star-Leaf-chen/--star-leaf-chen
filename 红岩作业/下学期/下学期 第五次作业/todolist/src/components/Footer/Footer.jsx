import React, { Component, useReducer } from 'react'
import './Footer.css'
export default class Footer extends Component {
  // 全选待办事项
  handleCheckAll = () => {
    this.props.CheckAllTodos(true)
  }
  //全不选待办事项
  handleunCheckAll = () => {
    this.props.CheckAllTodos(false)
  }
  // 反选：每项单独取反
  handleToggleAll = () => {
    this.props.toggleAllTodos()
  }
  render() {
    const { todos } = this.props
    const uncompletedCount = todos.filter((todo) => !todo.completed).length

    return (
      <div>
        <div className="footer">
          <span className="items-left">
            还有 <strong>{uncompletedCount}</strong> 项待完成
          </span>
          <div className="filter-btns">
            <button className="filter-btn active">全部</button>
          </div>
          <button className="clear-btn" onClick={this.handleCheckAll}>
            全选
          </button>
          <button className="clear-btn" onClick={this.handleunCheckAll}>
            全不选
          </button>
          <button className="clear-btn" onClick={this.handleToggleAll}>
            反选
          </button>
        </div>
      </div>
    )
  }
}
