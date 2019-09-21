import React, { Component } from 'react'
import _ from 'lodash'
import dayjs from 'dayjs'
import { Button, Paper, Typography, Card, CardActionArea, CardActions, CardContent, Divider, FormControlLabel, Switch } from '@material-ui/core'
import { Save as SaveIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { getTabs, setTabs, getCurrentTabs, createTab } from './utils/storage'
import './App.css'
import 'animate.css'

const renderImmutableLinkItem = element => {
  return (
    <Paper className="link" key={element.url}>
      <span className="favIcon" style={{ backgroundImage: `url(${element.favIconUrl})` }}></span>
      <span className="link-href">{element.title}</span>
    </Paper>
  )
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTabs: [],
      savedTabs: [],
      checkOpenAndDelete: false,
    }
  }
  renderLinkItem = element => {
    return (
      <Paper className="link" key={element.url}>
        <span className="favIcon" style={{ backgroundImage: `url(${element.favIconUrl})` }}></span>
        <a className="link-href" onClick={() => this.createTab(element)}>{element.title}</a>
        <DeleteIcon className="link-delete wobble fast infinite animated" onClick={() => this.removeTab(element.url)}></DeleteIcon>
      </Paper>
    )
  }
  createTab = (element) => {
    createTab(element)
    this.state.checkOpenAndDelete ? this.removeTab(element.url) : null
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
  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
  }
  render() {
    const { currentTabs, savedTabs, checkOpenAndDelete } = this.state
    return (
      <div>
        <Card className="title">
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">Akai</Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" onClick={this.setCurrentTabs}>
              <SaveIcon style={{ marginRight: '8px' }} />
              保存
            </Button>
            <FormControlLabel
              style={{ padding: '0 8px' }}
              value="end"
              control={
                <Switch
                  color="primary"
                  size="small"
                  checked={checkOpenAndDelete}
                  onChange={this.handleChange('checkOpenAndDelete')}
                />
              }
              label="打开并删除"
              labelPlacement="end"
            />
          </CardActions>
        </Card>
        <div id="currentTabs" className="current tabs">
          <Typography variant="subtitle1"> 当前 tabs</Typography>
          {
            !currentTabs.length ? null : currentTabs.map(renderImmutableLinkItem)
          }
        </div>
        <div id="savedTabs" className="saved tabs">
          <Typography variant="subtitle1">保存的 tabs</Typography>
          {
            !savedTabs.length ? null : savedTabs.map((elements) => {
              if (!elements.length) return
              const time = elements[0].time
              return (
                <div className="links-container" key={time}>
                  <Typography className="subtitle2" variant="subtitle2">{dayjs.unix(time).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                  <Divider />
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