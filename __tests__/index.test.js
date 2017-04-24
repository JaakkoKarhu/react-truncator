/* Truncator tests:
 *
 * - Doesn't delete html tags.
 */

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
	let page = nightmare()

	test('Truncates when wrapper bottom at the first initial binary text block', async () => {
		page.goto('http://localhost:3000/1st-half')
		let o = await page.evaluate(() => {
			let elem = document.getElementById('test')
			let child = elem.firstChild
			let isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
			return { text: elem.textContent, isInBoundaries }
		})
		expect(o.text.substr(-3)).toBe('...')
		expect(o.isInBoundaries).toBeTruthy()
	})

	test('Truncates when wrapper bottom at the second initial binary text block', async () => {
		page.goto('http://localhost:3000/2nd-half')
		let o = await page.evaluate(() => {
			let elem = document.getElementById('test')
			let child = elem.firstChild
			let isInBoundaries = (elem.offsetTop + elem.offsetHeight) > (child.offsetTop + child.offsetHeight)
			return { text: elem.textContent, isInBoundaries }
		})
		expect(o.text.substr(-3)).toBe('...')
		expect(o.isInBoundaries).toBeTruthy()
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
		expect(o.text.substr(-3)).toBe('...')
		expect(o.isInBoundaries).toBeTruthy()
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
		page.goto('http://localhost:3000/text-has-spans')
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

	afterAll(() => {
		page.halt() // page.end does not stop the node process for some reason
	})
})