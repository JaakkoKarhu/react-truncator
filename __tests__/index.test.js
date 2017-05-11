/* TODO
 *
 * - Fix style to match linting rules
 */

import { mount, shallow } from 'enzyme'
import nightmare from 'nightmare'
import React from 'react'
import Truncator from '../src/index'

describe('Minimum requirements', () => {
  test('Truncator should render', () => {
    const truncator = shallow(
      <Truncator>
        Lol, text here
      </Truncator>
    )
  })
})

describe('Truncation scenarios', () => {
  const page = nightmare()
  const basicTruncationExpectations = (o) => {
    expect(o.text.substr(-3)).toBe('...')
    expect(o.text.length>3).toBeTruthy()
    expect(o.text.substr(-4, 1)).not.toBe(' ')
    expect(o.text.substr(-4, 1)).not.toBe(',')
    expect(o.isInBoundaries).toBeTruthy()
  }

  test('Truncates when wrapper bottom at the first initial binary text block', async () => {
    page.goto('http://localhost:3000/#/1st-half')
    const o = await page.evaluate(() => {
      const elem = document.getElementById('test')
      const child = elem.firstChild
      const isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
      return { text: elem.textContent, isInBoundaries }
    })
    basicTruncationExpectations(o)
  })

  test('Truncates when wrapper bottom at the second initial binary text block', async () => {
    page.goto('http://localhost:3000/#/2nd-half')
    const o = await page.evaluate(() => {
      const elem = document.getElementById('test')
      const child = elem.firstChild
      const isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
      return { text: elem.textContent, isInBoundaries }
    })
    basicTruncationExpectations(o)
  })

  test('Truncates when the middle of initial binary blocks overlaps the wrapper bottom', async () => {
    page.goto('http://localhost:3000/#/initial-middle')
    const o = await page.evaluate(() => {
      const elem = document.getElementById('test')
      const child = elem.firstChild
      const isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
      return { text: elem.textContent, isInBoundaries }
    })
    basicTruncationExpectations(o)
  })

  test('Don\'t truncate if text not flowing over the wrapper bottom', async () => {
    page.goto('http://localhost:3000/#/shorter-than-wrapper')
    const text = await page.evaluate(() => {
      return document.getElementById('test').textContent
    })
    expect(text.length>0).toBeTruthy()
  })

  test('If only one line, render as it is and don\'t crash', async () => {
    page.goto('http://localhost:3000/#/one-line')
    const text = await page.evaluate(() => {
      return document.getElementById('test').textContent
    })
    expect(text).toBe('One liner here.')
  })

  test('Take padding in account when truncating', async () => {
    page.goto('http://localhost:3000/#/with-padding')
    const o = await page.evaluate(() => {
      const elem = document.getElementById('test')
      const child = elem.firstChild
      const elemBottomY = elem.offsetTop + elem.offsetHeight
      const childBottomY = child.offsetTop + child.offsetHeight
      const paddingBottom = parseInt( window.getComputedStyle(elem).paddingBottom.replace('px', ''))
      const isInBoundaries = elemBottomY > childBottomY
      const hasBottomPadding = Math.abs(elemBottomY - childBottomY) > paddingBottom
      return { text: elem.textContent, isInBoundaries, hasBottomPadding }
    })
    basicTruncationExpectations(o)
    expect(o.hasBottomPadding).toBeTruthy()
  })

  test('Doesn\'t render any text if not enough space in wrapper', async () => {
    page.goto('http://localhost:3000/#/with-too-much-padding')
    const text1 = await page.evaluate(() => {
      const elem = document.getElementById('test')
      return elem.textContent
    })
    page.goto('http://localhost:3000/#/too-narrow-wrapper')
    const text2 = await page.evaluate(() => {
      const elem = document.getElementById('test')
      return elem.textContent
    })
    expect(text1).toBe('')
    expect(text2).toBe('')
  })

  test('Renders correctly with nested span elements', async () => {
    page.goto('http://localhost:3000/#/text-has-inline-elements')
    const o = await page.evaluate(() => {
      let isInBoundaries = true
      const elems = document.querySelectorAll('#test')
      for ( let i = 0; elems.length > i; i++) {
        const elem = elems[i]
        const child = elem.firstChild
        if (!((elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight))) {
          isInBoundaries = false
          break
        }
      }
      const hasElemCutout = Boolean(document.getElementsByClassName('cut-inside-nested-inline-element')[0].querySelector('#cutout'))
      const stringHasInlineElem = Boolean(document.getElementsByClassName('text-is-string-with-inline-elements')[0].querySelector('#nested'))
      return { isInBoundaries, hasElemCutout, stringHasInlineElem }
    })
    expect(o.isInBoundaries).toBeTruthy()
    expect(o.hasElemCutout).toBeTruthy()
    expect(o.stringHasInlineElem).toBeTruthy()
  })

  test('Truncates on resize', async () => {
    page.goto('http://localhost:3000/#/on-resize')
    const o = await page.evaluate(() => {
      const r1 = {}
      const r2 = {}
      const elem = document.getElementById('test')
      const child = elem.firstChild
      r1.text = elem.textContent
      r1.isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          r2.text = elem.textContent
          r2.isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
          resolve({ r1, r2 })
        }, 1300)
      })
    })
    expect(o.r1.text==o.r2.text).toBeFalsy()
    basicTruncationExpectations(o.r1)
    basicTruncationExpectations(o.r2)
  })

  // Identical with previous, combine.
  test('Truncates on prop change', async () => {
    page.goto('http://localhost:3000/#/on-props-change')
    const o = await page.evaluate(() => {
      const r1 = {}
      const r2 = {}
      const elem = document.getElementById('test')
      const child = elem.firstChild
      r1.text = elem.textContent
      r1.isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          r2.text = elem.textContent
          r2.isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
          resolve({ r1, r2 })
        }, 1300)
      })
    })
    expect(o.r1.text==o.r2.text).toBeFalsy()
    basicTruncationExpectations(o.r1)
    basicTruncationExpectations(o.r2)
  })

  test('Renders custom ellipsis', async () => {
    page.goto('http://localhost:3000/#/with-custom-ellipsis')
    const o = await page.evaluate(() => {
      const elem = document.getElementById('test')
      const child = elem.firstChild
      const isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
      return { text: elem.textContent, isInBoundaries }
    })
    expect(o.text.includes('[ Read more ]')).toBeTruthy()
  })

  afterAll(() => {
    page.halt() // page.end does not stop the node process for some reason
  })
})