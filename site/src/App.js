/* TODO
 *
 * - Make the examples to work with Github pages
 */

import React from 'react';
import Truncator from '../../src';
import {
  HashRouter as Router,
  Route,
  Link,
  NavLink
} from 'react-router-dom'
import './presentation.css'

const FirstHalf = () => (
  <div className="text-wrapper"
       id="test">
    <Truncator>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempus auctor orci ut porta. Aenean quis porttitor enim, eget luctus ligula. Donec commodo massa lacus, eu bibendum nisi consequat a. Nam lacus risus, pellentesque a pellentesque a, tristique sed justo. Nullam porta sem ac ipsum suscipit feugiat. Duis porta ligula a eros lobortis euismod. In hac habitasse platea dictumst. Praesent eu nisl mi.

      Nulla imperdiet elit non mi rutrum volutpat. Maecenas et nisl massa. Sed lectus felis, egestas et est et, finibus sollicitudin diam. Fusce eu ipsum condimentum, viverra diam a, consectetur libero. Sed sagittis enim ut velit ultrices mollis. Donec arcu velit, sodales eget orci nec, accumsan placerat massa. Morbi scelerisque lacus non tincidunt ullamcorper.

      Cras vel maximus ante. Aenean eu urna in ipsum hendrerit auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam semper, orci et auctor malesuada, sem felis ultrices sem, sit amet egestas arcu arcu tristique tortor. Nunc vitae finibus tellus.
    </Truncator>
  </div>
)

const SecondHalf = () => (
  <div className="text-wrapper"
       id="test">
    <Truncator>
      Sed sagittis enim ut velit ultrices mollis. Donec arcu velit, sodales eget orci nec, accumsan placerat massa. Morbi scelerisque lacus non tincidunt ullamcorper.
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempus auctor orci ut porta. Aenean quis porttitor enim, eget luctus ligula. Donec commodo massa lacus, eu bibendum nisi consequat a. Nam lacus risus, pellentesque a pellentesque a, tristique sed justo. Nullam porta sem ac ipsum suscipit feugiat. Duis porta ligula a eros lobortis euismod. In hac habitasse platea dictumst. Praesent eu nisl mi.
    </Truncator>
  </div>
)

const InitialMiddle = () => (
  <div className="text-wrapper"
       id="test">
    <Truncator>
      Aenean quis porttitor enim, luctus ligula. Donec commodo massa lacus, eu bibendum nisi consequat a. Nam lacus risus, pellentesque a pellentesque a, tristique sed justo. Nullam porta sem ac ipsum suscipit feugiat. Duis porta ligula a eros lobortis euismod.
      Donec arcu velit, sodales eget orci nec, accumsan placerat massa. Morbi scelerisque lacus non tincidunt ullamcorper. Donec arcu velit, sodales eget orci nec, accumsan placerat massa. Morbi scelerisque lacus non tincidunt ullamcorper. Morbi scelerisque lacus non tincidunt ullamcorper. Donec arcu velit, sodales eget orci nec, accumsan placerat massa. Morbi scelerisque lacus non tincidunt ullamcorper
    </Truncator>
  </div>
)

const ShorterThanWrapper = () => (
  <div className="text-wrapper"
       id="test">
    <Truncator>
      Donec arcu velit, sodales eget orci nec, accumsan placerat massa. Morbi scelerisque lacus non tincidunt ullamcorper.
    </Truncator>
  </div>
)

const OneLine = () => (
  <div className="text-wrapper"
       id="test">
    <Truncator>
      One liner here.
    </Truncator>
  </div>
)

const WithPadding = (padding) => (
  <div className="text-wrapper"
       id="test"
       style={ { padding } }>
    <Truncator>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempus auctor orci ut porta. Aenean quis porttitor enim, eget luctus ligula. Donec commodo massa lacus, eu bibendum nisi consequat a. Nam lacus risus, pellentesque a pellentesque a, tristique sed justo. Nullam porta sem ac ipsum suscipit feugiat. Duis porta ligula a eros lobortis euismod. In hac habitasse platea dictumst. Praesent eu nisl mi.

      Sed sagittis enim ut velit ultrices mollis. Donec arcu velit, sodales eget orci nec, accumsan placerat massa. Morbi scelerisque lacus non tincidunt ullamcorper.
    </Truncator>
  </div>
)

const TooNarrowWrapper = () => (
  <div className="text-wrapper"
       id="test"
       style={ { height: '10px'} }>
    <Truncator>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempus auctor orci ut porta. Aenean quis porttitor enim, eget luctus ligula. Donec commodo massa lacus, eu bibendum nisi consequat a. Nam lacus risus, pellentesque a pellentesque a, tristique sed justo. Nullam porta sem ac ipsum suscipit feugiat. Duis porta ligula a eros lobortis euismod.
    </Truncator>
  </div>
)

const TextHasInlineElements = () => (
  <section>
    <div className="text-wrapper text-is-wrapped-in-span"
         id="test">
      <Truncator>
        <span>Kansa on <b>ilmaissut tahtonsa, julisti Emmanuel Macron voittopuheessaan puoliltaöin</b> Suomen aikaa. <i>Keskustalaiseksi <b>mielletty</b></i> ehdokas edustaa En Marche -liikettä. Macron on alustavien tulosten mukaan saamassa noin 24 prosenttia äänistä. Olemme muuttaneet Ranskan politiikan kasvoja, hän sanoi hurraavalla kansalle. Lisäksi Macron kiitti Francois Fillonia kehotuksesta äänestää itseään vaalien toisella kierroksella. Emmanuel Macron on ensimmäisten tulosten mukaan saamassa <b>23,9</b> prosenttia äänistä ja Marine Le Pen 21,7 prosenttia.</span>
      </Truncator>
    </div>
    <div className="text-wrapper cut-inside-nested-inline-element"
         id="test">
      <Truncator>
        <span>Kansa on <b>ilmaissut tahtonsa, julisti Emmanuel Macron voittopuheessaan puoliltaöin</b> Suomen aikaa. <i>Keskustalaiseksi <b>mielletty</b></i> ehdokas edustaa En Marche -liikettä. Macron on alustavien tulosten mukaan saamassa noin 24 prosenttia äänistä. Olemme muuttaneet Ranskan politiikan kasvoja, <i id="cutout">hän sanoi hurraavalla</i> kansalle. Lisäksi Macron kiitti Francois Fillonia kehotuksesta äänestää itseään vaalien toisella kierroksella. Emmanuel Macron on ensimmäisten tulosten mukaan saamassa <b>23,9</b> prosenttia äänistä ja Marine Le Pen 21,7 prosenttia.</span>
      </Truncator>
    </div>
    <div className="text-wrapper text-is-string-with-inline-elements"
         id="test">
      <Truncator>
        Kansa on <b id="nested">ilmaissut tahtonsa, julisti Emmanuel Macron voittopuheessaan puoliltaöin</b> Suomen aikaa. <i>Keskustalaiseksi <b>mielletty</b></i> ehdokas edustaa En Marche -liikettä. Macron on alustavien tulosten mukaan saamassa noin 24 prosenttia äänistä. Olemme muuttaneet Ranskan politiikan kasvoja, hän sanoi hurraavalla kansalle. Lisäksi Macron kiitti Francois Fillonia kehotuksesta äänestää itseään vaalien toisella kierroksella. Emmanuel Macron on ensimmäisten tulosten mukaan saamassa <b>23,9</b> prosenttia äänistä ja Marine Le Pen 21,7 prosenttia.
      </Truncator>
    </div>
  </section>
)

const WithCustomEllipsis = () => (
  <div className="text-wrapper"
       id="test">
    <Truncator ellipsis={ [' ...', <span className="ellipsis">[ Read more ]</span>] }>
      Sed sagittis enim ut velit ultrices mollis. Donec arcu velit, sodales eget orci nec, accumsan placerat massa. Morbi scelerisque lacus non tincidunt ullamcorper.
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempus auctor orci ut porta. Aenean quis porttitor enim, eget luctus ligula. Donec commodo massa lacus, eu bibendum nisi consequat a. Nam lacus risus, pellentesque a pellentesque a, tristique sed justo. Nullam porta sem ac ipsum suscipit feugiat. Duis porta ligula a eros lobortis euismod. In hac habitasse platea dictumst. Praesent eu nisl mi.
    </Truncator>
  </div>
)

class OnResize extends React.Component {
  constructor(props) {
    super(props)
    this.interval = setInterval(() => {
      let elem = this.refs.onResize
      if (elem.offsetWidth>439) {
        elem.style.width = '220px'
      } else {
        elem.style.width = '440px'
      }
    }, 1200)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }
  
  render() {
    return (
      <div className="text-wrapper"
           id="test"
           ref="onResize">
        <Truncator>
          Sed sagittis enim ut velit ultrices mollis. Donec arcu velit, sodales eget orci nec, accumsan placerat massa. Morbi scelerisque lacus non tincidunt ullamcorper.
      
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempus auctor orci ut porta. Aenean quis porttitor enim, eget luctus ligula. Donec commodo massa lacus, eu bibendum nisi consequat a. Nam lacus risus, pellentesque a pellentesque a, tristique sed justo. Nullam porta sem ac ipsum suscipit feugiat. Duis porta ligula a eros lobortis euismod. In hac habitasse platea dictumst. Praesent eu nisl mi.
        </Truncator>
      </div>
    );
  }
};

class OnPropsChange extends React.Component {
  constructor(props) {
    super(props)
    this.texts = [
      "Sed sagittis enim ut velit ultrices mollis. Donec arcu velit, sodales eget orci nec, accumsan placerat massa. Morbi scelerisque lacus non tincidunt ullamcorper. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempus auctor orci ut porta. Aenean quis porttitor enim, eget luctus ligula. Donec commodo massa lacus, eu bibendum nisi consequat a. Nam lacus risus, pellentesque a pellentesque a, tristique sed justo. Nullam porta sem ac ipsum suscipit feugiat. Duis porta ligula a eros lobortis euismod. In hac habitasse platea dictumst. Praesent eu nisl mi.",
      <span>Lorem ipsum dolor sit amet, <b>consectetur</b> adipiscing elit. Duis tempus auctor orci ut porta. Aenean quis porttitor enim, eget luctus ligula. Donec commodo massa lacus, eu bibendum nisi consequat a. Nam lacus risus, pellentesque a pellentesque a, tristique sed justo. Nullam porta sem ac ipsum suscipit feugiat. Duis porta ligula a eros lobortis euismod. In hac habitasse platea dictumst. Praesent eu nisl mi. Nulla imperdiet elit non mi rutrum volutpat. Maecenas et nisl massa. Sed lectus felis, egestas et est et, finibus sollicitudin diam. Fusce eu ipsum condimentum, viverra diam a, consectetur libero. Sed sagittis enim ut velit ultrices mollis. Donec arcu velit, sodales eget orci nec, accumsan placerat massa. Morbi scelerisque lacus non tincidunt ullamcorper. Cras vel maximus ante. Aenean eu urna in ipsum hendrerit auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam semper, orci et auctor malesuada, sem felis ultrices sem, sit amet egestas arcu arcu tristique tortor. Nunc vitae finibus tellus.</span>
    ]
    this.interval = setInterval(() => {
      let content = this.state.content==0 ? 1 : 0
      this.setState({ content })
    }, 1200)
    this.state = {
      content: 0
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }
  
  render() {
    return (
      <div className="text-wrapper"
           id="test"
           ref="onResize">
        <Truncator>
          { this.texts[this.state.content] }
        </Truncator>
      </div>
    );
  }
};

const isActive = (location, pathname) => {
  console.log('App.js', '-->>', location, pathname);
  return location.pathname==pathname
}

const App = (props) => (
  <Router>
    <section>
      <div className='presentation-sidebar'>
        <ul>
          <li>
            <NavLink to="1st-half"
                     isActive={(m, loc) => isActive(loc, '/1st-half')}
                     activeClassName="active">
              Truncate in 1st initial half
            </NavLink>
          </li>
          <li>
            <NavLink to="2nd-half"
                     isActive={(m, loc) => isActive(loc, '/2nd-half')}
                     activeClassName="active">
              Truncate in 2nd initial half
            </NavLink>
          </li>
          <li>
            <NavLink to="initial-middle"
                     isActive={(m, loc) => isActive(loc, '/initial-middle')}
                     activeClassName="active">
              Truncate in initial middle
            </NavLink>
          </li>
          <li>
            <NavLink to="shorter-than-wrapper"
                     isActive={(m, loc) => isActive(loc, '/shorter-than-wrapper')}
                     activeClassName="active">
              Text shorter than wrapper
            </NavLink>
          </li>
          <li>
            <NavLink to="one-line"
                     isActive={(m, loc) => isActive(loc, '/one-line')}
                     activeClassName="active">
              Text is just one line
            </NavLink>
          </li>
          <li>
            <NavLink to="with-padding"
                     isActive={(m, loc) => isActive(loc, '/with-padding')}
                     activeClassName="active">
              Parent element has padding
            </NavLink>
          </li>
          <li>
            <NavLink to="with-too-much-padding"
                     isActive={(m, loc) => isActive(loc, '/with-too-much-padding')}
                     activeClassName="active">
              Parent element has too much padding
            </NavLink>
          </li>
          <li>
            <NavLink to="too-narrow-wrapper"
                     isActive={(m, loc) => isActive(loc, '/too-narrow-wrapper')}
                     activeClassName="active">
              Wrapper element is too narrow
            </NavLink>
          </li>
          <li>
            <NavLink to="text-has-inline-elements"
                     isActive={(m, loc) => isActive(loc, '/text-has-inline-elements')}
                     activeClassName="active">
              Text has inline elements
            </NavLink>
          </li>
          <li>
            <NavLink to="on-resize"
                     isActive={(m, loc) => isActive(loc, '/on-resize')}
                     activeClassName="active">
              On resize
            </NavLink>
          </li>
          <li>
            <NavLink to="on-props-change"
                     isActive={(m, loc) => isActive(loc, '/on-props-change')}
                     activeClassName="active">
              On props change
            </NavLink>
          </li>
          <li>
            <NavLink to="with-custom-ellipsis"
                     isActive={(m, loc) => isActive(loc, '/with-custom-ellipsis')}
                     activeClassName="active">
              With ellipsis
            </NavLink>
          </li>
        </ul>
      </div>
      <div className='presentation-content'>
        <Route path="/1st-half" component={ FirstHalf } />
        <Route path="/2nd-half" component={ SecondHalf } />
        <Route path="/initial-middle" component={ InitialMiddle } />
        <Route path="/shorter-than-wrapper" component={ ShorterThanWrapper } />
        <Route path="/one-line" component={ OneLine } />
        <Route path="/with-padding" component={ () => WithPadding('30px') } />
        <Route path="/with-too-much-padding" component={ () => WithPadding('50px') } />
        <Route path="/too-narrow-wrapper" component={ TooNarrowWrapper } />
        <Route path="/text-has-inline-elements" component={ TextHasInlineElements } />
        <Route path="/on-resize" component={ OnResize } />
        <Route path="/on-props-change" component={ OnPropsChange } />
        <Route path="/with-custom-ellipsis" component={ WithCustomEllipsis } />
      </div>
    </section>
  </Router>
);

export default App