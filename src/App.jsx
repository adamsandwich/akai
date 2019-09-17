import React, { Component } from 'react'
import _ from 'lodash'
import dayjs from 'dayjs'
import { Button, Paper } from '@material-ui/core'
import { Save as SaveIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { getTabs, setTabs, getCurrentTabs, createTab } from './utils/storage'
import './App.css'
import 'animate.css'

const renderImmutableLinkItem = element => {
  return (
    <Paper className="link" key={element.url}>
      <span className="favIcon" style={{ backgroundImage: `url(${element.favIconUrl})` }}></span>
      <span className="link-href" href={element.url}>{element.title}</span>
    </Paper>
  )
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTabs: [],
      savedTabs: [],
    }
  }
  renderLinkItem = element => {
    return (
      <Paper className="link" key={element.url}>
        <span className="favIcon" style={{ backgroundImage: `url(${element.favIconUrl})` }}></span>
        <a className="link-href" href={element.url} onClick={() => createTab(element)}>{element.title}</a>
        <DeleteIcon className="link-delete wobble fast infinite animated" onClick={() => this.removeTab(element.url)}></DeleteIcon>
      </Paper>
    )
  }
  componentDidMount() {
    getTabs()
      .then((tabs) => {
        this.setState({
          savedTabs: tabs,
        })
      })
    getCurrentTabs()
      .then((tabs) => {
        this.setState({
          currentTabs: tabs,
        })
      })
  }
  setCurrentTabs = () => {
    const { currentTabs, savedTabs } = this.state
    const now = dayjs().unix()
    const currentTabsWithTime = currentTabs.map((tab) => {
      tab.time = now
      return tab
    })
    const newSavedTabs = [currentTabsWithTime, ...savedTabs]
    setTabs(newSavedTabs)
      .then(() => {
        this.setState({
          savedTabs: newSavedTabs
        })
      })
  }
  removeTab = (url) => {
    const { savedTabs } = this.state
    const newSavedTabs = savedTabs.map((tabs) => tabs.filter((tab) => tab.url != url))
    setTabs(newSavedTabs)
      .then(() => {
        this.setState({
          savedTabs: newSavedTabs
        })
      })
  }
  render() {
    const { currentTabs, savedTabs } = this.state
    return (
      <div>
        <h1>Akai</h1>
        <div id="buttonArea">
          <Button variant="contained" size="small" onClick={this.setCurrentTabs}>
            <SaveIcon style={{ marginRight: '8px' }} />
            保存
          </Button>
        </div>
        <div id="currentTabs" className="current tabs">
          <h2>当前 tabs</h2>
          {
            !currentTabs.length ? null : currentTabs.map(renderImmutableLinkItem)
          }
        </div>
        <div id="savedTabs" className="saved tabs">
          <h2>保存的 tabs</h2>
          {
            !savedTabs.length ? null : savedTabs.map((elements) => {
              if (!elements.length) return
              const time = elements[0].time
              return (
                <div className="links-container" key={time}>
                  <h3>{dayjs.unix(time).format('YYYY-MM-DD HH:mm:ss')}</h3>
                  {
                    !elements.length ? null : elements.map((this.renderLinkItem))
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default App