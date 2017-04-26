/* THIS IS A PROTOTYPE OF A TRUNCATE COMPONENT
 * DO NOT USE YET!!
 *
 * Few words about logic:
 * - Split string, add elements
 * - Find element y
 * - Use y value to figure out if should be renedered
 * - Decision to truncate can be based on parent elem
 *   or line number
 *
 * - Recognise component/tag coming in - before that use proptypes
 * - Add resize event
 */

/* TODO
 * 
 * - Add element resize functions
 * - Check if needs parsing is actually even needed
 * - Add PropTypes
 * - Scenario: if text passed in props changes
 * - Rename fine search to something more descriptive
 * - Remove trackerIndexs and timers ment for presenting
 * - Add custom concenation instead of dot dot dot
 * - Split component did updat functions to pure functions
 * - Cleaning
 * - Make style passable directly to truncator
 */
import React from 'react';
// import ReactDOMServer from 'react-dom/server'

class Truncator extends React.Component {

  static propTypes = {
    //children: React.PropTypes.array
  }

  constructor(props) {
    super (props)
    this.state = { // Define defaults
      segments: [],
      concatted: null,
      fine: null,
      needsParsing: false,
      needsAffix: false
    }
  }

  init = () => {
    let parent = this.refs.truncated.parentNode
    let { truncated } = this.refs
    let paddingBottom = parseInt( window.getComputedStyle(parent).paddingBottom.replace('px', ''))
    let parentBottomY = parent.offsetTop + parent.offsetHeight - paddingBottom
    let noNeedToTruncate = (truncated.offsetTop+truncated.offsetHeight)<(parentBottomY)
    if (noNeedToTruncate) {
      this.setState({ concatted: this.props.children })
    } else {
      let segments
      let needsParsing
      if (typeof this.props.children=='object') {
        let plainString = this.convertToPlainString(this.props.children)
        segments = [ { str: plainString } ]
        this.setState({ needsParsing: true })
      } else if (typeof this.props.children=='string') {
        segments = [ { str: this.props.children} ]
      }
      this.splitSegment(segments, 0)
    }
  }

  convertToPlainString = (children, plain="") => {
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        let child = children[i]
        if (typeof child == 'object'&&child.props) {
          plain = this.convertToPlainString(child.props.children, plain)
        } else if (typeof child == 'string' ) {
          plain = plain + child
        }
      }
      return plain
    } else if (typeof children == 'object'&&children.props) {
      return plain = this.convertToPlainString(children.props.children, plain)
    } else if (typeof children == 'string') {
      return plain = plain + children
    }
  }

  splitSegment = (_segments, splitKey) => {
    let newSegments = [ ..._segments ] // Remove underscore naming
    let segment = newSegments[splitKey]
    let str = segment.str
    let length = Math.ceil(str.length/2)
    let _1st = str.substring(0, length);
    let _2nd = str.substring(length);
    newSegments.splice(splitKey, 1)
    newSegments.splice(splitKey, 0, { str: _1st }) // Why splice here, why just not set?
    newSegments.splice(splitKey+1, 0, { str: _2nd }) // Same applies here
    this.setState({ segments: newSegments, trackerIndex: splitKey }, this.evaluateTruncation)
  }
 
  componentDidMount() {
    this.init()
  }

  fineSearch = (_segments, fine) => {
    let newSegments = [ ..._segments ]
    let segment = newSegments[fine]
    let str = segment.str
    let indexOf = str.indexOf(' ') + 1
    let _1st = str.substring(0, indexOf)
    let _2nd = str.substring(indexOf, str.length)
    newSegments[fine-1] = { str: newSegments[fine-1].str + _1st, className: 'fine' }
    newSegments[fine] = { str: _2nd, className: 'fine' }
    this.setState({ segments: newSegments, fine }, this.evaluateTruncation)
  }

  evaluateTruncation = () => {
    setTimeout(() => {
    let parent = this.refs.truncated.parentNode
    let paddingBottom = parseInt( window.getComputedStyle(parent).paddingBottom.replace('px', ''))
    let parentBottomY = parent.offsetTop + parent.offsetHeight - paddingBottom
    let childNodes = this.refs.truncated.childNodes
    let fine = this.state.fine
    let segments = [ ...this.state.segments] // Could be segments copy etc
    if (fine&&this.state.concatted==null) {
      if (fine==childNodes.length-1) {
        // How does this differ from the last if on coarse iteration?
        this.setState({ concatted: this.props.children })
      } else if (childNodes[fine].offsetTop===childNodes[fine-1].offsetTop) {
        // Find the right spot...
        this.fineSearch(segments, fine)
      } else {
        // ...until can be set as plain text
        segments.splice(fine, segments.length)
        let concatted = ''
        segments.map((segment) => {
          concatted = concatted + segment.str
        })
        concatted = concatted.substring(0, concatted.length - 4)
        this.setState({ concatted, needsAffix: true })
      }
    } else if (this.state.concatted==null) {
      for (let i = 0; i < childNodes.length; i++) {
        let { truncated } = this.refs
        let child = childNodes[i]
        let nextChild = childNodes[i+1]
        let childBottomY = child.offsetTop + child.offsetHeight
        let shouldBeOnFineSearch = nextChild&&nextChild.offsetTop===child.offsetTop
        let flowsOverBottom = parentBottomY<childBottomY
        let isFirstLine = truncated.offsetTop==child.offsetTop
        if (!isFirstLine&&shouldBeOnFineSearch&&flowsOverBottom) {
          this.splitSegment(segments, i-1)
          break
        } else if (shouldBeOnFineSearch&&flowsOverBottom) {
          this.setState({ concatted: ''})
          break
        } else if (shouldBeOnFineSearch) {
          this.fineSearch(segments, i + 1)
          break
        } else if (flowsOverBottom) {
          this.splitSegment(segments, i)
          break
        }
      }
    }
    }, 50)
  }

  reactChildren = {}

  convertToConcattedChild = (children, childStr, stopIteration=false) => {
    if (Array.isArray(children)) {
      let reactElem = []
      let childStrCopy = childStr
      for (let i = 0; i < children.length; i++) {
        let child = children[i]
        let parsed = this.convertToConcattedChild(child, childStrCopy)
        reactElem.push(parsed.reactElem)
        childStrCopy = parsed.childStr
        stopIteration = parsed.stopIteration
        if (parsed.stopIteration) { break }
      }
      return {
        childStr: childStrCopy,
        reactElem,
        stopIteration
      }
    } else if (typeof children == 'object') {
      if (children.props.children) {
        let parsed = this.convertToConcattedChild(children.props.children, childStr)
        stopIteration = parsed.stopIteration
        return {
          childStr: parsed.childStr,
          reactElem: React.createElement(children.type, { ...children.props }, parsed.reactElem),
          stopIteration: parsed.stopIteration
        }
      } else {
        return {
          childStr,
          reactElem: React.createElement(children.type, { ...children.props }),
          stopIteration
        }
      }
    } else if (typeof children == 'string') {
      let concatted = this.state.concatted
      if (!concatted.includes(childStr + children)) {
        let cutOut = concatted.replace(childStr, '')
        return {
          childStr: childStr + children,
          reactElem: cutOut,
          stopIteration: true
        }
      } else {
        return {
          childStr: childStr + children,
          reactElem: children,
          stopIteration
        }
      }
    } 
  }

  getSpans = (segments) => {
    return segments.map((o, i) => {
      let trackerIndex = i===this.state.trackerIndex ? 'tracker' : ''
      return (
        <trnc-seg key={i}
                  class={ `${o.className ? o.className : ''} ${ trackerIndex }` }>
          {o.str}
        </trnc-seg>
      )
    })
  }

  render() {
    let segments = this.state.segments
    let concatted = this.state.concatted
    let needsParsing = this.state.needsParsing
    let needsAffix = this.state.needsAffix
    let elems
    let spans = this.getSpans(segments) // segs actually
    if (concatted&&needsParsing) {
      elems = this.convertToConcattedChild(this.props.children, '').reactElem
    } else  {
      elems = concatted
    }
    return (
      <trnc-wrap ref="truncated">
        {
          elems!=null
          ? [elems, ( needsAffix ? '...' : '' )]
          : spans.length > 0 ? spans : this.props.children
        }
      </trnc-wrap>
    );
  }
};

export default Truncator;