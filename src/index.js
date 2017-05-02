/* TODO
 *
 * - Base trnc-seg keys something else than index
 * - Write docs
 */

import PropTypes from 'prop-types'
import React from 'react'
import ResizeObserver from 'resize-observer-polyfill'

const defaultState = {
  segs: [],
  concatted: null,
  fineIndex: null,
  needsParsing: false,
  needsEllipsis: false
}

class Truncator extends React.Component {

  static propTypes = {
    ellipsis: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object
    ])
  }

  constructor(props) {
    super(props)
    this.state = defaultState
  }

  componentDidMount() {
    this.init()
    this.ro = new ResizeObserver(() => {
      this.setState(defaultState, this.init)
    })
    this.ro.observe(this.refs.truncated.parentNode)
  }

  componentWillReceiveProps(nP) {
    if (nP.children!=this.props.children) {
      this.setState(defaultState, this.init)
    }
  }

  componentWillUnmount() {
    this.ro.unobserve(this.refs.truncated.parentNode)
  }


  init = () => {
    const { parentNode } = this.refs.truncated,
          { truncated } = this.refs,
          { children } = this.props,
          paddingBottom = parseInt( window.getComputedStyle(parentNode).paddingBottom.replace('px', '')),
          parentNodeOffsetBottom = parentNode.offsetTop + parentNode.offsetHeight,
          parentNodeBottomBoundary = parentNodeOffsetBottom - paddingBottom,
          truncatedOffsetBottom = truncated.offsetTop+truncated.offsetHeight,
          noNeedToTruncate = truncatedOffsetBottom<(parentNodeBottomBoundary)
    if (noNeedToTruncate) {
      this.setState({ concatted: children })
    } else {
      let segs
      if (typeof children=='object') {
        const str= this.convertToStr(children)
        segs = [ { str } ]
        this.setState({ needsParsing: true })
      } else if (typeof children=='string') {
        segs = [ { str: children } ]
      }
      this.splitSeg(segs, 0)
    }
  }

  getTruncatedReactElems = (children, childStr, stopIteration=false) => {
    /* Recurse through children, shorten the text content of elements,
     * strip unnecessary elements.
     */
    if (Array.isArray(children)) {
      const nChildren = []
      let childStrCp = childStr
      for (let i = 0; i < children.length; i++) {
        const child = children[i],
              truncatedElem = this.getTruncatedReactElems(child, childStrCp)
        nChildren.push(truncatedElem.nChildren)
        childStrCp = truncatedElem.childStr
        if (truncatedElem.stopIteration) break
      }
      return {
        childStr: childStrCp,
        nChildren,
        stopIteration
      }
    } else if (typeof children == 'object') {
      const grandChildren = children.props.children
      if (grandChildren) {
        const truncatedElem = this.getTruncatedReactElems(grandChildren, childStr)
        return {
          childStr: truncatedElem.childStr,
          nChildren: React.createElement(children.type, { ...children.props }, truncatedElem.nChildren),
          stopIteration: truncatedElem.stopIteration
        }
      } else {
        return {
          childStr,
          nChildren: React.createElement(children.type, { ...children.props }),
          stopIteration
        }
      }
    } else if (typeof children == 'string') {
      const { concatted } = this.state
      if (!concatted.includes(childStr + children)) {
        const cutOut = concatted.replace(childStr, '')
        return {
          childStr: childStr + children,
          nChildren: cutOut,
          stopIteration: true
        }
      } else {
        return {
          childStr: childStr + children,
          nChildren: children,
          stopIteration
        }
      }
    }
  }

  convertToStr = (children, str='') => {
    // Get content of the children as plain string
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (typeof child == 'object'&&child.props) {
          str = this.convertToStr(child.props.children, str)
        } else if (typeof child == 'string' ) {
          str += child
        }
      }
      return str
    } else if (typeof children == 'object'&&children.props) {
      return str = this.convertToStr(children.props.children, str)
    } else if (typeof children == 'string') {
      return str += children
    }
  }

  evaluateTruncation = () => {
    /* Wrap this function to setTimeout for visual debugging
     */
    const { parentNode } = this.refs.truncated,
          paddingBottom = parseInt( window.getComputedStyle(parentNode).paddingBottom.replace('px', '')),
          parentNodeOffsetBottom = parentNode.offsetTop + parentNode.offsetHeight,
          parentNodeBottomBoundary = parentNodeOffsetBottom - paddingBottom,
          { childNodes } = this.refs.truncated,
          segsCp = [ ...this.state.segs] // Could be segs copy etc
    let { fineIndex } = this.state
    if (fineIndex&&this.state.concatted===null) {
      /* FineIndex refers to the text segment, where iteration based on
       * space starts. When the offset top changes, the last fitting word
       * has been found.
       */
      const fineNode = childNodes[fineIndex],
            fineNodePrev = childNodes[fineIndex-1],
            hasSameHeight = fineNode.offsetHeight==fineNodePrev.offsetHeight,
            hasSameTop = fineNode.offsetTop==fineNodePrev.offsetTop,
            segsOnSameLine = (hasSameHeight)&&(hasSameTop),
            prevSegHigher = fineNode.offsetTop>fineNodePrev.offsetTop
      if (segsOnSameLine||prevSegHigher) {
        const { ellipsis } = this.props,
              ellipsisLength = this.getEllipsisLength(ellipsis || '...')
        let concatted = ''
        fineIndex = segsOnSameLine ? fineIndex + 1 : fineIndex
        segsCp.splice(fineIndex, segsCp.length)
        segsCp.map((seg) => concatted += seg.str )
        concatted = concatted.substring(0, concatted.length - ellipsisLength)
        concatted = this.removeTrails(concatted)
        this.setState({ concatted, needsEllipsis: true })
      } else if (!segsOnSameLine) {
        this.rearrangeSegsBySpace(segsCp, fineIndex)
      }
    } else if (this.state.concatted===null) {
      // Split segments to half until last fitting line is found
      for (let i = 0; i < childNodes.length; i++) {
        const { truncated } = this.refs,
              node = childNodes[i],
              nodeNext = childNodes[i+1],
              nodeOffsetBottom = node.offsetTop + node.offsetHeight,
              shouldRearrangeBySpace = nodeNext&&nodeNext.offsetTop===node.offsetTop,
              flowsOverBottom = parentNodeBottomBoundary<nodeOffsetBottom,
              isFirstLine = truncated.offsetTop==node.offsetTop
        if (!isFirstLine&&shouldRearrangeBySpace&&flowsOverBottom) {
          // Mid of the segments is overlapping bottom border
          this.splitSeg(segsCp, i-1)
          break
        } else if (shouldRearrangeBySpace&&flowsOverBottom) {
          // Text does not fit
          this.setState({ concatted: '' })
          break
        } else if (shouldRearrangeBySpace) {
          // Go to "fine search"
          this.rearrangeSegsBySpace(segsCp, i + 1)
          break
        } else if (flowsOverBottom) {
          this.splitSeg(segsCp, i)
          break
        }
      }
    }
  }

  getEllipsisLength = (e) => {
    let l
    if (Array.isArray(e)) {
      let str = ''
      e.map((o) => {
        if (o.props) {
          const { children } = o.props
          str += children || ''
        } else {
          str += o
        }
      })
      l = str.length
    } else if (typeof e == 'object') {
      l = e.props.children.length
    } else if (typeof e == 'string') {
      l = e.length
    }
    return l + 1 || l
  }

  getNodes = (segs) => {
    return segs.map((o, i) => {
      const trackerIndex = i===this.state.trackerIndex ? 'tracker' : ''
      return (
        <trnc-seg key={i}
                  class={ `${ o.className || '' } ${ trackerIndex }` }>
          {o.str}
        </trnc-seg>
      )
    })
  }

  rearrangeSegsBySpace = (segs, fineIndex) => {
    const segsCp = [ ...segs ],
          seg = segsCp[fineIndex],
          { str } = seg,
          indexOf = str.indexOf(' ') + 1,
          first = str.substring(0, indexOf),
          second = str.substring(indexOf, str.length)
    segsCp[fineIndex-1] = {
      str: segsCp[fineIndex-1].str + first,
      className: 'fineIndex'
    }
    segsCp[fineIndex] = {
      str: second,
      className: 'fineIndex'
    }
    this.setState({
      segs: segsCp,
      fineIndex
    }, this.evaluateTruncation)
  }

  removeTrails = (c) => {
    const l = c.substring(c.length-1)
    if (l==' '||l==',') {
      c = this.removeTrails(c.slice(0, c.length-1 ))
    }
    return c
  }

  splitSeg = (segs, i) => {
    const segsCp = [ ...segs ],
          seg = segsCp[i],
          { str } = seg,
          length = Math.ceil(str.length/2),
          first = str.substring(0, length),
          second = str.substring(length)
    segsCp.splice(i, 1)
    segsCp.splice(i, 0, { str: first })
    segsCp.splice(i+1, 0, { str: second })
    this.setState({
      segs: segsCp,
      trackerIndex: i
    }, this.evaluateTruncation)
  }

  render() {
    const { segs, concatted, needsParsing, needsEllipsis } = this.state,
          nodes = this.getNodes(segs)
    let { ellipsis, children } = this.props,
        elems,
        rendered
    ellipsis = ellipsis ? ellipsis : '...'
    if (concatted&&needsParsing) {
      elems = this.getTruncatedReactElems(children, '').nChildren
    } else  {
      elems = concatted
    }
    if (elems!==null) rendered = [elems, ( needsEllipsis ?  ellipsis : '' )]
    else rendered = nodes.length > 0 ? nodes : children

    return (
      <trnc-wrap ref='truncated'>
        {
          rendered
        }
      </trnc-wrap>
    )
  }
}

export default Truncator