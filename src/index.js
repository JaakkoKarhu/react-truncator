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
 * - Possible to wrap the lines even!
 * - Add resize event
 * - Maybe make a library out of this
 */

/* TODO
 * 
 * - Cleaning
 * - Remove trackerIndexs and timers ment for presenting
 * - Add PropTypes
 * - Add custom concenation instead of dot dot dot
 * - Add element resize functions
 * - Rename fine search to something more descriptive
 * - Test with text, which includes spans
 * - Make catch error for embedded html elements?
 * - Split component did updat functions to pure functions
 * - Make style passable directly to truncator
 * - Scenario: if text passed in props changes
 * - Fix text at the middle bug
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

  convertToPlainString = (c, plain="") => {
    let whatToDoWithTheChild = (child) => {
      if (typeof child == 'object'&&child.props) {
        plain = this.convertToPlainString(child.props.children, plain)
      } else if (typeof child == 'string' ) {
        plain = plain + child
      }
    }
    if (Array.isArray(c)) {
      for (let i = 0; i < c.length; i++) {
        let child = c[i]
        whatToDoWithTheChild(child)
      }
    } else {
      whatToDoWithTheChild(c)
    }
    return plain
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
    this.setState({ segments: newSegments, trackerIndex: splitKey })
  }
 
  componentDidMount() {
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

  fineSearch = (_segments, fine) => {
    let newSegments = [ ..._segments ]
    let segment = newSegments[fine]
    let str = newSegments[fine].str
    let indexOf = str.indexOf(' ') + 1
    let _1st = str.substring(0, indexOf)
    let _2nd = str.substring(indexOf, str.length)
    newSegments[fine-1] = { str: newSegments[fine-1].str + _1st, className: 'fine' }
    newSegments[fine] = { str: _2nd, className: 'fine' }
    this.setState({ segments: newSegments, fine })
  }

  componentDidUpdate() {
    //setTimeout(() => {
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
        let child = childNodes[i]
        let nextChild = childNodes[i+1]
        let childBottomY = child.offsetTop + child.offsetHeight
        let shouldBeOnFineSearch = nextChild&&nextChild.offsetTop===child.offsetTop
        if (shouldBeOnFineSearch&&parentBottomY<childBottomY) {
          this.setState({ concatted: ''})
          break
        } else if (shouldBeOnFineSearch) {
          this.fineSearch(segments, i + 1)
          break
        } else if (parentBottomY<childBottomY) {
          let splitKey = i
          this.splitSegment(segments, splitKey)
          break
        } else if (i == childNodes.length - 1) {
          this.setState({ concatted: this.props.children })
          break
        }
      }
    }
    //}, 350)
  }

  reactChildren = {}
  // Concatted is reference
  parseStringToChildren = (children, childstr, stopIteration=false) => {
    let reactElem = []
    let newChildstr = childstr
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        let child = children[i]
        let parsed = this.parseStringToChildren(child, newChildstr)
        reactElem.push(parsed.reactElem)
        newChildstr = parsed.childstr
        stopIteration = parsed.stopIteration
        if (parsed.stopIteration) {
          break
        }
      }
    } else if (typeof children == 'object') {
      let parsed
      if (children.props.children) {
        parsed = this.parseStringToChildren(children.props.children, newChildstr)
        newChildstr = parsed.childstr
        stopIteration = parsed.stopIteration
      }
      reactElem = React.createElement(children.type, { ...children.props }, parsed.reactElem)
    } else if (typeof children == 'string') {
      newChildstr = childstr + children
      if (!this.state.concatted.includes(newChildstr)) {
        let cutOut = this.state.concatted.replace(childstr, '')
        reactElem = cutOut
        stopIteration = true
      } else {
        reactElem = children
      }
    } 
    return { childstr: newChildstr, reactElem, stopIteration }
  }

  getSpans = (segments) => {
    return segments.map((o, i) => {
      let trackerIndex = i===this.state.trackerIndex ? 'trackerIndex' : ''
      return (
        <trnc-seg key={i}
                  class={ `${o.className ? o.className : ''} ${ trackerIndex } ` }>
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
    if (concatted&&needsParsing) {
      elems = this.parseStringToChildren(this.props.children, '').reactElem
    } else  {
      elems = concatted
    }
    return (
      <trnc-wrap ref="truncated">
        {
          elems!=null
          ? [elems, ( needsAffix ? '...' : '' )]
          : this.getSpans(segments)
        }
      </trnc-wrap>
    );
  }
};

export default Truncator;