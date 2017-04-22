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
 * - Remove trackers and timers ment for presenting
 * - Add PropTypes
 * - Add custom concenation instead of dot dot dot
 * - Add element resize functions
 * - Rename fine search to something more descriptive
 * - Test with text, which includes spans
 * - Fix one liner bug
 * - Make catch error for embedded html elements?
 * - Split component did updat functions to pure functions
 * - Try with paddings
 * - Make style passable directly to truncator
 */
import React from 'react';

class Truncator extends React.Component {

  static propTypes = {
    children: React.PropTypes.string
  }

  constructor(props) {
    super (props)
    this.state = { // Define defaults
      segments: [],
      concatenated: ''
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
    this.setState({ segments: newSegments, tracker: splitKey })
  }
 
  componentDidMount() {
    let segments = [ { str: this.props.children} ]
    this.splitSegment(segments, 0)
  }

  fineSearch = (_segments, fine) => {
    let newSegments = [ ..._segments ]
    let segment = newSegments[fine]
    let str = newSegments[fine].str
    let indexOf = str.indexOf(' ') + 1
    let _1st = str.substring(0, indexOf)
    let _2nd = str.substring(indexOf, str.length)
    newSegments[fine - 1] = { str: newSegments[fine-1].str + _1st, className: 'fine' }
    newSegments[fine] = { str: _2nd, className: 'fine' }
    this.setState({ segments: newSegments, fine })
  }

  componentDidUpdate() {

    //setTimeout(() => {
      let parent = this.refs.truncated.parentNode
      let paddingBottom = parseInt( window.getComputedStyle(parent).paddingBottom.replace('px', ''))
      let parentBottomY = parent.offsetTop + parent.offsetHeight
      let childNodes = this.refs.truncated.childNodes
      let fine = this.state.fine
      let segments = [ ...this.state.segments] // Could be segments copy etc
      if (fine&&!this.state.concatenated) {
        if (childNodes[fine].offsetTop===childNodes[fine-1].offsetTop) {
          // Find the right spot...
          this.fineSearch(segments, fine)
        } else {
          // ...until can be set as plain text
          segments.splice(fine, segments.length)
          let concatenated = ''
          segments.map((segment) => {
            concatenated = concatenated + segment.str
          })
          concatenated = concatenated.substring(0, concatenated.length - 4) + '...'
          this.setState({ concatenated })
        }
      } else if (!this.state.concatenated) {
        let prevY
        for (let i = 0; i < childNodes.length; i++) {
          let child = childNodes[i]
          let childBottomY = child.offsetTop + child.offsetHeight + paddingBottom
          if (prevY===child.offsetTop) {
            this.fineSearch(segments, i)
            break
          } else if (parentBottomY<childBottomY) {
            let splitKey = i
            this.splitSegment(segments, splitKey)
            break
          } else if (i == childNodes.length - 1) {
            this.setState({ concatenated: this.props.children })
            break
          }
          prevY = child.offsetTop
        }
      }
    //}, 350)
  }

  getSpans = (segments) => {
    return segments.map((o, i) => {
      let trackerClass = i===this.state.tracker ? 'tracker' : ''
      return (
        <trnc-seg key={i}
                  class={ `${o.className ? o.className : ''} ${ trackerClass } ` }>
          {o.str}
        </trnc-seg>
      )
    })
  }

  render() {
    console.log('index.js', 'RENDER', 'Log here');
    let segments = this.state.segments
    let concatenated = this.state.concatenated
    return (
      <trnc-wrap ref="truncated">
        {
          concatenated
          ? concatenated
          : this.getSpans(segments)
        }
      </trnc-wrap>
    );
  }
};

export default Truncator;