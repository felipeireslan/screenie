import React from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import Screen from './Screen'
import PropTypes from 'prop-types'
import { titleCase } from '../utilities'
import Fullscreen from "react-full-screen"
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { withRouter } from 'react-router-dom'
import ModalDashboardForm from './ModalDashboardForm'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import './DashboardLayout.css'
import '../../node_modules/font-awesome/css/font-awesome.css'

class DashboardLayout extends React.Component {
  static propTypes = {
    onCurrentSelected: PropTypes.func.isRequired,
    current: PropTypes.object,
    available: PropTypes.arrayOf(PropTypes.object).isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  state = {
    drawerOpen: false,
    addNewDashboardOpen: false,
    isFullScreen: this.props.current && this.props.current.isFullScreen
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current) {
      this.setState({ isFullScreen: nextProps.current && nextProps.current.isFullScreen })
    }
  }

  onToggleDrawer = () => {
    this.setState({ drawerOpen: true })
  }

  handleSubmit = (dashboard) => {
    this.props.history.push(`/dashboards/${dashboard.name}`)
    this.props.onCurrentSelected(dashboard)
    this.setState({ drawerOpen: false })
  }


  handleAddDashboardOpened = () => {
    this.setState({ drawerOpen: false, addNewDashboardOpen: true })
  }

  handleAddDashboardClosed = () => {
    this.setState({ drawerOpen: true, addNewDashboardOpen: false })
  }

  goFull = () => {
    this.setState({ isFullScreen: true });
  }

  handleSetupClicked = () => {
    this.props.history.push('/setup')
  }

  renderContext = () =>
    <IconMenu
      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <MenuItem primaryText="Fullscreen" onClick={this.goFull} leftIcon={
        <FontIcon
          className="fa fa-desktop"
          style={{ color: 'white', cursor: 'pointer' }}
        />}
      />
      <MenuItem primaryText="Setup" onClick={this.handleSetupClicked} leftIcon={
        <FontIcon
          className="fa fa-cogs"
          style={{ color: 'white', cursor: 'pointer' }}
        />}
      />
    </IconMenu>

  render() {
    const appBarStyle = this.state.isFullScreen ? { display: 'none' } : {}
    const screenWrapperClass = this.state.isFullScreen
      ? 'fullscreen-dashboard'
      : 'dashboard'

    return (
      <div>
        <AppBar
          style={appBarStyle}
          title={titleCase(this.props.current.name)}
          onLeftIconButtonClick={this.onToggleDrawer}
          iconElementRight={this.renderContext()}
        />
        <Drawer
          docked={false}
          width={300}
          open={this.state.drawerOpen}
          onRequestChange={(drawerOpen) => this.setState({ drawerOpen })}>
          <AppBar showMenuIconButton={false} title="Dashboards" />
          <div>
            {this.props.available.map((dashboard, idx) =>
              <MenuItem key={idx}
                leftIcon={
                  <FontIcon
                    className="fa fa-tachometer"
                    style={{ marginRight: 24 }}
                  />}
                onClick={() => this.handleSubmit(dashboard)}>
                {titleCase(dashboard.name)}
              </MenuItem>)}
            <FloatingActionButton
              onClick={this.handleAddDashboardOpened}
              mini={true}
              style={{ marginTop: 40, marginRight: 20, float: 'right' }}>
              <ContentAdd />
            </FloatingActionButton>
          </div>
        </Drawer>

        <Fullscreen
          enabled={this.state.isFullScreen}
          onChange={isFullScreen => { this.setState({ isFullScreen }) }}>
          <div className={screenWrapperClass}>
            <Screen {...this.props} />
          </div>
        </Fullscreen>

        <ModalDashboardForm
          title="Add New Dashboard"
          open={this.state.addNewDashboardOpen}
          onClosed={this.handleAddDashboardClosed}
        />
      </div>
    )
  }
}

export default withRouter(DashboardLayout)