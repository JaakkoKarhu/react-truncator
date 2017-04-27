import nightmare from 'nightmare'
import React from 'react';
import { shallow, mount } from 'enzyme';
import Truncator from '../src/index';

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
		page.goto('http://localhost:3000/1st-half')
		let o = await page.evaluate(() => {
			let elem = document.getElementById('test')
			let child = elem.firstChild
			let isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
			return { text: elem.textContent, isInBoundaries }
		})
		basicTruncationExpectations(o)
	})

	test('Truncates when wrapper bottom at the second initial binary text block', async () => {
		page.goto('http://localhost:3000/2nd-half')
		let o = await page.evaluate(() => {
			let elem = document.getElementById('test')
			let child = elem.firstChild
			let isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
			return { text: elem.textContent, isInBoundaries }
		})
		basicTruncationExpectations(o)
	})

	test('Truncates when the middle of initial binary blocks overlaps the wrapper bottom', async () => {
		page.goto('http://localhost:3000/initial-middle')
		let o = await page.evaluate(() => {
			let elem = document.getElementById('test')
			let child = elem.firstChild
			let isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
			return { text: elem.textContent, isInBoundaries }
		})
		basicTruncationExpectations(o)
	})

	test('Don\'t truncate if text not flowing over the wrapper bottom', async () => {
		page.goto('http://localhost:3000/shorter-than-wrapper')
		let text = await page.evaluate(() => {
			return document.getElementById('test').textContent
		})
		expect(text.length>0).toBeTruthy()
	})

	test('If only one line, render as it is and don\'t crash', async () => {
		page.goto('http://localhost:3000/one-line')
		let text = await page.evaluate(() => {
			return document.getElementById('test').textContent
		})
		expect(text).toBe('One liner here.')
	})

	test('Take padding in account when truncating', async () => {
		page.goto('http://localhost:3000/with-padding')
		let o = await page.evaluate(() => {
			let elem = document.getElementById('test')
			let child = elem.firstChild
			let elemBottomY = elem.offsetTop + elem.offsetHeight
			let childBottomY = child.offsetTop + child.offsetHeight
			let paddingBottom = parseInt( window.getComputedStyle(elem).paddingBottom.replace('px', ''))
			let isInBoundaries = elemBottomY > childBottomY
			let hasBottomPadding = Math.abs(elemBottomY - childBottomY) > paddingBottom
			return { text: elem.textContent, isInBoundaries, hasBottomPadding }
		})
		basicTruncationExpectations(o)
		expect(o.hasBottomPadding).toBeTruthy()
	})

	test('Doesn\'t render any text if not enough space in wrapper', async () => {
		page.goto('http://localhost:3000/with-too-much-padding')
		let text1 = await page.evaluate(() => {
			let elem = document.getElementById('test')
			return elem.textContent
		})
		page.goto('http://localhost:3000/too-narrow-wrapper')
		let text2 = await page.evaluate(() => {
			let elem = document.getElementById('test')
			return elem.textContent
		})
		expect(text1).toBe('')
		expect(text2).toBe('')
	})

	test('Renders correctly with nested span elements', async () => {
		page.goto('http://localhost:3000/text-has-inline-elements')
		let o = await page.evaluate(() => {
			let isInBoundaries = true
			let elems = document.querySelectorAll('#test')
			for ( let i = 0; elems.length > i; i++) {
				let elem = elems[i]
				let child = elem.firstChild
				if (!((elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight))) {
					isInBoundaries = false
					break
				}
			}
			let hasElemCutout = !!document.getElementsByClassName('cut-inside-nested-inline-element')[0].querySelector('#cutout')
			let stringHasInlineElem = !!document.getElementsByClassName('text-is-string-with-inline-elements')[0].querySelector('#nested')
			return { isInBoundaries, hasElemCutout, stringHasInlineElem }
		})
		expect(o.isInBoundaries).toBeTruthy()
		expect(o.hasElemCutout).toBeTruthy()
		expect(o.stringHasInlineElem).toBeTruthy()
	})

	test('Truncates on resize', async () => {
		page.goto('http://localhost:3000/on-resize')
		let o = await page.evaluate(() => {
			let r1 = {}
			let r2 = {}
			let elem = document.getElementById('test')
			let child = elem.firstChild
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
		page.goto('http://localhost:3000/on-props-change')
		let o = await page.evaluate(() => {
			let r1 = {}
			let r2 = {}
			let elem = document.getElementById('test')
			let child = elem.firstChild
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
		page.goto('http://localhost:3000/with-custom-ellipsis')
		let o = await page.evaluate(() => {
			let elem = document.getElementById('test')
			let child = elem.firstChild
			let isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
			return { text: elem.textContent, isInBoundaries }
		})
		expect(o.text.includes('[ Read more ]')).toBeTruthy()
	})

	afterAll(() => {
		page.halt() // page.end does not stop the node process for some reason
	})
})