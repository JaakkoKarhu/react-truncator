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
	let page = nightmare().goto('http://localhost:3000')

	test('Truncates when wrapper bottom at the first initial binary text block', async () => {
		let text = await page.evaluate(() => {
			return document.getElementById('initial1st').textContent
		})
		expect(text.substr(-3)).toBe('...')
	})

	test('Truncates when wrapper bottom at the second initial binary text block', async () => {
		let text = await page.evaluate(() => {
			return document.getElementById('initial2nd').textContent
		})
		expect(text.substr(-3)).toBe('...')
	})

	test('Don\'t truncate if text not flowing over the wrapper bottom', async () => {
		let text = await page.evaluate(() => {
			return document.getElementById('shorter-than-wrapper').textContent
		})
		expect(text).toBe('Lorem ipsum dolor sit amet.')
	})

	afterAll(() => {
		page.halt() // page.end does not stop the node process for some reason
	})
})