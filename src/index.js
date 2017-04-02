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
      text: [],
      preventInfiniteLoop: 0,
      isFine: false
    }
  }

  traverse = (arr) => {
    let newArr = [ ...arr ]
    let lolArr
    for (let i = 0; i < 1; i++) {
      lolArr = []
      newArr.map((item, _i) => {
        let size = newArr[_i]
        let str = newArr[_i]
        let length = Math.ceil(str.length/2)
        let firstHalf = newArr[_i].substring(0, length);
        let secondHalf = newArr[_i].substring(length);
        let splitIndex = _i * 2
        lolArr[splitIndex] = firstHalf
        lolArr[splitIndex + 1] = secondHalf
      })
      newArr = lolArr
    }
    return newArr
  }

  componentDidMount() {
    let children = this.props.children
    let traversed = this.traverse([children])
    // this.setState({
    //   splitted: children.split(" ")
    // })
    this.setState({
      text: traversed
    })
  }

  componentDidUpdate(nextProps, nextState) {
    let elem = this.refs.truncated
    let children = elem.childNodes
    let parent = this.refs.truncated.parentNode
    let parentBottomY = parent.offsetTop + parent.offsetHeight
    let splitKey
    let prevY
    let child
    let isFine = this.state.isFine
    let newText = [ ...this.state.text ]
    let preventInfiniteLoop
    if(this.state.preventInfiniteLoop<10) {
      if (!isFine) {
        for (let i = 0; i < children.length; i++) {
          child = children[i]
          if (child.offsetTop===prevY&&!isFine) {
            // let xx = (_i, str) => {
            //   if (children[_i + 1 ].offsetTop>children[_i].offsetTop) {
            //     return str + newText[_i + 1].split(' ')[0]
            //   } else {
            //     let newStr = str + newText[_i + 1]
            //     return xx(_i + 1, newStr)
            //   }
            // }
            // let combined = xx(i - 1 , newText[i - 1])
            // let split = combined.split(" ").map((val) => val + ' ' )
            // newText.splice(i - 1 )
            // newText = [...newText, ...split ]
            isFine = true
            preventInfiniteLoop = 100
            break
          } else if (parentBottomY<child.offsetTop) {
            splitKey = i - 1
            let str = this.state.text[splitKey]
            let newSplit = this.traverse([str])
            //newText.splice(splitKey, 1)
            newSplit.map((val, key) => {
              newText.splice(splitKey+key, 0, val)
            })
            break
          }
          preventInfiniteLoop = this.state.preventInfiniteLoop + 1
          prevY = child.offsetTop
        }
      } 
      this.setState({
        text: newText,
        preventInfiniteLoop,
        isFine
      })
    }
  }

  getSpans = (text) => {
    let elems = []
    text.map((str, i) => {
      elems.push(<trnc-seg i={i}>{str}</trnc-seg>)
    })

    return elems
  }

  render() {
    let text = this.state.text

    return (
      <trnc-wrap ref="truncated">
        {
          text
          ? this.getSpans(text)
          : null
        }
      </trnc-wrap>
    );
  }
};

export default Truncator;