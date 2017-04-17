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

import React from 'react';

class Truncator extends React.Component {

  static propTypes = {
    children: React.PropTypes.string
  }

  constructor(props) {
    super (props)
    this.state = {
      segments: [],
      updateStopper: 0,
      concatenated: ''
    }
  }

  splitSegment = (_segments, splitKey) => {
    let newSegments = [ ..._segments ]
    let segment = newSegments[splitKey]
    let str = segment.str
    let length = Math.ceil(str.length/2)
    let _1st = str.substring(0, length);
    let _2nd = str.substring(length);
    newSegments.splice(splitKey, 1)
    newSegments.splice(splitKey, 0, { str: _1st })
    newSegments.splice(splitKey+1, 0, { str: _2nd})
    let updateStopper = this.state.updateStopper+1
    this.setState({ segments: newSegments, updateStopper })
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
    let updateStopper = this.state.updateStopper+1
    this.setState({ segments: newSegments, fine, updateStopper })
  }

  componentDidUpdate(nextProps, nextState) {
    setTimeout(() => {
      let parent = this.refs.truncated.parentNode
      let parentBottomY = parent.offsetTop + parent.offsetHeight
      let childNodes = this.refs.truncated.childNodes
      let fine = this.state.fine
      let segments = [ ...this.state.segments]
      if (fine&&!this.state.concatenated) {
        if (childNodes[fine].offsetTop===childNodes[fine-1].offsetTop) {
          this.fineSearch(segments, fine)
        } else {
          segments.splice(fine, segments.length)
          let concatenated = ''
          segments.map((segment) => {
            concatenated = concatenated + segment.str
          })
          concatenated = concatenated.substring(0, concatenated.length - 3) + '...'
          this.setState({ concatenated })
        }
      } else if (!this.state.concatenated) {
        let prevY
        for (let i = 0; i < childNodes.length; i++) {
          let child = childNodes[i]
          if (prevY===child.offsetTop) {
            this.fineSearch(segments, i)
            break
          } else if (parentBottomY<child.offsetTop) {
            let splitKey = i - 1
            this.splitSegment(segments, splitKey)
            break
          }
          prevY = child.offsetTop
        }
      }
    }, 300)
  }

  getSpans = (segments) => {
    let elems = []
    segments.map((o, i) => {
      elems.push(<trnc-seg i={i} offset={o.offset} class={ o.className ? o.className : '' }>{o.str}</trnc-seg>)
    })

    return elems
  }

  render() {
    console.log('index.js', 'RENDERZ', 'Log here');
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

    // let newArr = [ ...arr ]
    // let lolArr
    // lolArr = []
    // newArr.map((item, _i) => {
    //   let size = newArr[_i]
    //   let str = newArr[_i].str
    //   let length = Math.ceil(str.length/2)
    //   let firstHalf = str.substring(0, length);
    //   let secondHalf = str.substring(length);
    //   let splitIndex = _i * 2
    //   lolArr[splitIndex] = { str: firstHalf, id: 'will have original id' }
    //   lolArr[splitIndex + 1] = { str: secondHalf, id: 'will have new id' }
    // })
    // newArr = lolArr
    // return newArr

    // let parentBottomY = parent.offsetTop + parent.offsetHeight