import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3';

function giveCountToTasks(tasks) {
  let count = 1
  tasks.forEach((task, i) => {
    if (i > 0 && task.date === tasks[i - 1].date) {
      count++
      task.count = count
    }
    else {
      count = 1
      task.count = count
    }
  })
}

//COMPONENT

export class Scatter extends Component {
  constructor(props) {
    super(props)
    this.height = 300
    this.width = 300
    this.padding = 40
    this.parseTime = d3.timeParse('%Y%m%d')
    this.countFunction = giveCountToTasks(this.props.tasks)
    //calculate min and max values of data for scale
    this.xDomain = (tasks) => d3.extent(tasks, task => this.parseTime(task.date))
    //for y axis, set the max to either be 10 or the max count
    this.yMax = (tasks) => Math.max(10, d3.max(tasks, task => task.count))
    //create scale with domain min and max and range of svg coordinates
    this.xScale = d3.scaleTime().domain(this.xDomain(this.props.tasks)).range([this.padding, this.width - this.padding])
    this.yScale = d3.scaleLinear().domain([0, this.yMax(this.props.tasks)]).range([this.height - this.padding, this.padding])
    //create axis with scales
    this.xAxis = d3.axisBottom(this.xScale).ticks(7)
    this.yAxis = d3.axisLeft(this.yScale).ticks(3)
  }

  componentDidMount(){
    d3.selectAll('.xAxis').call(this.xAxis)
    // d3.selectAll('.yAxis').call(this.yAxis)
  }

  render() {
    const {tasks} = this.props
    return (
      <div>
        <svg width={this.width} height={this.height}>
          {tasks.map((task, i) => (
            <g key={i}>
              <circle
                r="10"
                cx={this.xScale(this.parseTime(task.date))}
                cy={this.yScale(task.count)}
                fill={task.category.color.hex}
              />
            </g>)
          )}
          <g className="xAxis" transform={`translate(0, ${this.height - this.padding})`} />
          <g className="yAxis" transform={`translate(${this.padding}, 0)`} />
        </svg>
      </div>
    )
  }
}

//CONTAINER

const mapState = (state) => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(Scatter);



