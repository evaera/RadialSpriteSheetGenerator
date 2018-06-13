import * as React from 'react'
import { Options } from './SheetRenderer'

export interface Slice {
  startAngle: number,
  endAngle: number
}

interface CanvasProps {
  image: HTMLImageElement,
  options: Options,
  slices: Slice[],
  size: number,
  savable?: boolean,
  index?: number,
  max?: number
}

interface CanvasState {
  dataURL: string
}

export default class Canvas extends React.Component<CanvasProps> {
  state: CanvasState

  constructor (props: CanvasProps) {
    super(props)

    this.state = {
      dataURL: ''
    }
  }

  componentDidMount () {
    this.updateCanvas()
  }

  componentDidUpdate (prevProps: CanvasProps) {
    if (prevProps.options !== this.props.options) {
      this.updateCanvas()
    }
  }

  updateCanvas () {
    const canvas = this.refs.canvas as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const size = this.props.size
    const radius = size / 2

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let x = 0
    let y = 0

    this.props.slices.forEach(slice => {
      const cx = x + radius
      const cy = y + radius

      ctx.save()

      if (slice.startAngle !== slice.endAngle) {
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, size, slice.startAngle * (Math.PI / 180), slice.endAngle * (Math.PI / 180))
        ctx.lineTo(cx, cy)
        ctx.closePath()
        ctx.clip()
      }

      ctx.drawImage(this.props.image, x, y, size, size)
      ctx.restore()

      x += size

      if (x + size > this.props.options.width) {
        x = 0
        y += size
      }
    })

    this.setState({ dataURL: canvas.toDataURL() })
  }

  render () {
    return (
      <React.Fragment>
        {this.props.savable ? (
          <a href={this.state.dataURL} download={`${this.props.options.name.replace(/\..+$/, '')} #${this.props.index !== undefined ? (this.props.index + 1) : '1'} of ${this.props.max || '1'}`}>
            <canvas ref="canvas" width={Math.max(this.props.options.width, this.props.size)} height={Math.max(this.props.options.height, this.props.size)} />
          </a>
        ) : (
          <canvas ref="canvas" width={Math.max(this.props.options.width, this.props.size)} height={Math.max(this.props.options.height, this.props.size)} />
        )}
      </React.Fragment>
    )
  }
}
