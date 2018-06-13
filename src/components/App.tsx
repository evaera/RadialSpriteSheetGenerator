import { AppBar, CssBaseline, Toolbar, Typography } from '@material-ui/core'
import * as React from 'react'
import Generator from './Generator'

// import logo from '../logo.svg'

class App extends React.Component {
  public render () {
    return (
      <React.Fragment>
        <CssBaseline />
        <header>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="title" color="inherit">Radial Sprite Sheet Generator</Typography>
            </Toolbar>
          </AppBar>
        </header>
        <Generator />
      </React.Fragment>
    )
  }
}

export default App
