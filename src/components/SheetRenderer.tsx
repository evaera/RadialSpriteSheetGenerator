import * as React from 'react'
import Canvas, { Slice } from './Canvas'

export interface Options {
  width: number,
  height: number,
  size?: number,
  increment: number,
  startAt?: number,
  name: string,
  roblox: boolean
}

export interface PreviewOptions {
  speed: number
}

export interface SheetRendererProps {
  image: HTMLImageElement,
  options: Options,
  preview?: PreviewOptions,
  showConfiguration?: boolean
}

interface SheetRendererState {
  frameIndex?: number
}
export default class SheetRenderer extends React.Component<SheetRendererProps> {
  state: SheetRendererState
  private dead?: boolean
  private _length: number

  constructor (props: SheetRendererProps) {
    super(props)

    this._length = -1
    this.state = {}
  }

  componentWillReceiveProps (props: SheetRendererProps) {
    if (props.preview) {
      this.setState({ frameIndex: 0 })
    }
  }

  componentDidMount () {
    this.updatePreview()
  }

  componentWillUnmount () {
    this.dead = true
  }

  updatePreview = () => {
    if (!this.props.preview || this.dead) return
    const time = (Date.now() % this.animationSpeed) / this.animationSpeed
    const frameIndex = Math.floor(this.slices.length * time)
    this.setState({ frameIndex })

    if (!this.dead) requestAnimationFrame(this.updatePreview)
  }

  get configurationString (): string {
    return JSON.stringify({
      version: 1,
      size: this.imageSize,
      count: this.length,
      columns: Math.floor(this.props.options.width / this.imageSize),
      rows: Math.floor(this.props.options.height / this.imageSize),
      images: this.props.options.roblox ? Array.apply(null, { length: (Math.ceil(this.length / this.maxSlicesPerCanvas)) })
        .map(Number.call, Number).map((n: number) => (this.props.options.roblox ? 'rbxassetid://' : 'path/to/image') + (n + 1)) : undefined
    })
  }

  get length (): number {
    if (this._length === -1) {
      this._length = this.slices.length
    }

    return this._length
  }

  get animationSpeed (): number {
    if (!this.props.preview) return 0
    return (this.props.preview.speed || 1) * 1000
  }

  get imageSize (): number {
    return this.props.options.size || this.props.image.naturalHeight
  }

  get maxSlicesPerCanvas (): number {
    return Math.floor((this.props.options.width / this.imageSize)) * Math.floor((this.props.options.height / this.imageSize)) || 1
  }

  get increment (): number {
    return this.props.options.increment
  }

  get slices (): Slice[] {
    if (this.increment === 0) {
      this._length = 1

      return [{
        startAngle: 0,
        endAngle: 360
      }]
    }

    const steps: number[] = []
    for (let i = this.increment; (this.increment < 0 ? i >= -360 : i <= 360); i += this.increment) {
      steps.push(i)
    }

    const lastStep = steps[steps.length - 1]
    if (lastStep !== 360 && lastStep !== -360) {
      steps.push(this.increment < 0 ? -360 : 360)
    }

    this._length = steps.length

    const startAt = (this.props.options.startAt !== undefined ? this.props.options.startAt : 0) + -90
    return steps.map((n): Slice => ({
      startAngle: startAt + (n < 0 ? n : 0),
      endAngle: startAt + (n > 0 ? n : 0)
    }))
  }

  render () {
    const pages: Slice[][] = []
    let slices = this.slices

    if (this.state.frameIndex !== undefined) {
      slices = [slices[this.state.frameIndex]]
    }

    while (slices.length > 0) {
      pages.push(slices.splice(0, this.maxSlicesPerCanvas))
    }

    let options = this.props.options

    if (this.props.preview) {
      options = {
        ...options,
        width: this.imageSize,
        height: this.imageSize
      }
    }

    return (
      <React.Fragment>
        {this.props.showConfiguration && (
          <div className="center"><textarea value={this.configurationString} readOnly cols={30} rows={4} ref="textarea" onClick={() => (this.refs.textarea as HTMLTextAreaElement).select()} /></div>
        )}
        {pages.map((page, index) => (
          <Canvas image={this.props.image} options={options} slices={page} size={this.imageSize} key={index} index={index} savable={this.props.preview === undefined} max={pages.length} />
        ))}
      </React.Fragment>
    )
  }
}
