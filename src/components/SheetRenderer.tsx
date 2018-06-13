import * as React from 'react'
import Canvas, { Slice } from './Canvas'

export interface Options {
  width: number,
  height: number,
  size?: number,
  increment: number,
  startAt?: number,
  name: string
}

export interface PreviewOptions {
  speed: number
}

export interface SheetRendererProps {
  image: HTMLImageElement,
  options: Options,
  preview?: PreviewOptions
}

interface SheetRendererState {
  frameIndex?: number
}
export default class SheetRenderer extends React.Component<SheetRendererProps> {
  state: SheetRendererState
  private dead?: boolean

  constructor (props: SheetRendererProps) {
    super(props)

    this.state = {}
  }

  componentWillReceiveProps (props: SheetRendererProps) {
    if (props.preview) {
      this.setState({ frameIndex: 0 })
      // this.updatePreview()
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
    console.log(time)
    const frameIndex = Math.floor(this.slices.length * time)
    // console.log(frameIndex)
    this.setState({ frameIndex })

    if (!this.dead) requestAnimationFrame(this.updatePreview)
  }

  get animationSpeed () {
    if (!this.props.preview) return 0
    return (this.props.preview.speed || 1) * 1000
  }

  get imageSize () {
    return this.props.options.size || this.props.image.naturalHeight
  }

  get maxSlicesPerCanvas (): number {
    return Math.floor((this.props.options.width / this.imageSize)) * Math.floor((this.props.options.height / this.imageSize)) || 1
  }

  get increment () {
    return this.props.options.increment <= 0 ? 20 : this.props.options.increment
  }

  get slices (): Slice[] {
    const steps: number[] = []
    for (let i = this.increment; i <= 360; i += this.increment) {
      steps.push(i)
    }

    if (steps[steps.length - 1] !== 360) {
      steps.push(360)
    }

    const startAt = (this.props.options.startAt !== undefined ? this.props.options.startAt : 0) + -90
    return steps.map((n): Slice => ({
      startAngle: startAt,
      endAngle: startAt + n
    }))// .sort((a, b) => a.n > b.n ? 1 : -1)
  }

  render () {
    const pages: Slice[][] = []
    let slices = this.slices

    if (this.state.frameIndex !== undefined) {
      slices = [this.slices[this.state.frameIndex]]
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
        {pages.map((page, index) => (
          <Canvas image={this.props.image} options={options} slices={page} size={this.imageSize} key={index} index={index} savable={this.props.preview === undefined} max={pages.length} />
        ))}
      </React.Fragment>
    )
  }
}
