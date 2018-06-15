import { Button, TextField, Tooltip, FormControlLabel, Checkbox } from '@material-ui/core'
import * as React from 'react'
import './Generator.css'
import SheetRenderer, { Options, PreviewOptions } from './SheetRenderer'
import { MAX_DECAL_SIZE } from '../constants'

interface GeneratorState {
  image?: string,
  loaded: boolean,
  options: Options,
  preview: PreviewOptions,
}

const parseNumber = (s: string) => {
  const n = parseFloat(s)
  if (isNaN(n)) {
    return undefined
  }

  return n
}

export default class Generator extends React.Component {
  state: GeneratorState

  constructor (props: {}) {
    super(props)

    this.state = {
      loaded: false,
      options: {
        width: 1024,
        height: 1024,
        increment: 20,
        startAt: 0,
        name: 'untitled',
        roblox: false
      },
      preview: {
        speed: 5
      }
    }
  }

  handleImageSelected = (e: any) => {
    const target = e.target
    this.setState((prevState: GeneratorState) => ({
      image: target.files.length > 0 ? URL.createObjectURL(target.files[0]) : undefined,
      loaded: false,
      options: {
        ...prevState.options,
        name: target.files.length > 0 ? target.files[0].name : 'untitled'
      }
    }))
  }

  handleImageLoaded = (e: any) => {
    const target = e.target
    this.setState((prevState: GeneratorState) => ({
      loaded: true,
      options: {
        ...prevState.options,
        size: target.naturalHeight
      }
    }))
  }

  handleChange = (key: string, isNumber = false, subTree = 'options') => (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    this.setState((prevState: GeneratorState) => ({
      [subTree]: {
        ...prevState.options,
        [key]: isNumber ? parseNumber(value) : value
      }
    }))
  }

  render () {
    return (
      <main>
        {this.state.image ? (
          <img src={this.state.image} alt="Image" ref="image" style={{
            maxWidth: '200px',
            maxHeight: '200px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'none'
          }} onLoad={this.handleImageLoaded} width="200" height="200" />
        ) : '' }
        <form className="Generator-form">
          <p>This web app can generate a sprite sheet for radial/circular progress indicators, for use in platforms or game engines that do not support clipping masks (such as Roblox). Use the preview to ensure that your output will be smooth based on your intended display speed. Lower the increment for increased fidelity, but at the cost of requiring more images.</p>
          <div className="Generator-image-container">
            {this.state.image && this.state.loaded ? (
              <SheetRenderer image={this.refs.image as HTMLImageElement} options={this.state.options} preview={this.state.preview}/>
            ) : (
              <div className="Generator-drop"></div>
            )}
            <div className="Generator-image-container-control">
              <Button component="label" variant="contained" color="primary">
                {'Select File'}
                <input accept="image/*" type="file" style={{ display: 'none' }} onChange={this.handleImageSelected} />
              </Button>
            </div>
          </div>

          <div className="Generator-options">
            <Tooltip title="The preview animation speed, in seconds." placement="top">
              <TextField label="Preview speed" type="number" value={this.state.preview.speed || ''} onChange={this.handleChange('speed', true, 'preview')} inputProps={{
                max: 180
              }} />
            </Tooltip>

            <Tooltip title="The size of the sprite outputted onto the sheet, in pixels." placement="top">
              <TextField label="Size" type="number" value={this.state.options.size || ''} onChange={this.handleChange('size', true)} inputProps={{
                max: MAX_DECAL_SIZE
              }} error={this.state.options.size ? this.state.options.size > Math.min(this.state.options.width, this.state.options.height) : false}/>
            </Tooltip>

            <Tooltip title="The angle at which to start the slicing. 0 = Top" placement="top">
              <TextField label="Start at angle" type="number" value={this.state.options.startAt !== undefined ? this.state.options.startAt : ''} onChange={this.handleChange('startAt', true)} inputProps={{
                max: 180

              }} error={this.state.options.startAt ? (this.state.options.startAt > 180 || this.state.options.startAt < -180) : false}/>
            </Tooltip>

            <Tooltip title="The increment between each slice" placement="top">
              <TextField label="Increment" type="number" value={this.state.options.increment || ''} onChange={this.handleChange('increment', true)} inputProps={{
                max: 180
              }} error={this.state.options.increment ? this.state.options.increment > 180 : false}/>
            </Tooltip>

            <Tooltip title="The sprite sheet height." placement="top">
              <TextField label="Sheet height" type="number" value={this.state.options.height || ''} onChange={this.handleChange('height', true)} inputProps={{
                max: this.state.options.roblox ? MAX_DECAL_SIZE : undefined
              }} error={this.state.options.roblox && (this.state.options.height ? this.state.options.height > MAX_DECAL_SIZE : false)}/>
            </Tooltip>

            <Tooltip title="The sprite sheet width." placement="top">
              <TextField label="Sheet width" type="number" value={this.state.options.width || ''} onChange={this.handleChange('width', true)} inputProps={{
                max: this.state.options.roblox ? MAX_DECAL_SIZE : undefined
              }} error={this.state.options.roblox && (this.state.options.width ? this.state.options.width > MAX_DECAL_SIZE : false)}/>
            </Tooltip>

            <FormControlLabel control={
              <Checkbox checked={this.state.options.roblox} onChange={this.handleChange('roblox')} />
            } label="Using in Roblox" />

            {this.state.options.roblox && (
              <div>
                <p>For use in Roblox, please see our <a href="https://github.com/evaera/RadialSpriteSheetGenerator/blob/master/README.md#use-in-roblox" target="_blank">README</a> for instructions.</p>
                {this.state.options.width > MAX_DECAL_SIZE || this.state.options.height > MAX_DECAL_SIZE && (
                  <p className="error">The maximum Roblox image upload size is {MAX_DECAL_SIZE}x{MAX_DECAL_SIZE}.</p>
                )}
              </div>
            )}
          </div>
        </form>
        <div style={{ clear: 'both' }}></div>
        <div className="Generator-output">
          {this.refs.image && this.state.loaded ? (
            <SheetRenderer image={this.refs.image as HTMLImageElement} options={this.state.options} showConfiguration={true} />
          ) : ''}
        </div>
      </main>
    )
  }
}
