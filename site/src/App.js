import React from 'react';

import Truncator from '../../src';

const App = () => (
  <div>
    <h2>Basic example</h2>
    <div className="text-wrapper">
      <Truncator>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempus auctor orci ut porta. Aenean quis porttitor enim, eget luctus ligula. Donec commodo massa lacus, eu bibendum nisi consequat a. Nam lacus risus, pellentesque a pellentesque a, tristique sed justo. Nullam porta sem ac ipsum suscipit feugiat. Duis porta ligula a eros lobortis euismod. In hac habitasse platea dictumst. Praesent eu nisl mi.

Nulla imperdiet elit non mi rutrum volutpat. Maecenas et nisl massa. Sed lectus felis, egestas et est et, finibus sollicitudin diam. Fusce eu ipsum condimentum, viverra diam a, consectetur libero. Sed sagittis enim ut velit ultrices mollis. Donec arcu velit, sodales eget orci nec, accumsan placerat massa. Morbi scelerisque lacus non tincidunt ullamcorper.

Suspendisse ex augue, malesuada ut cursus vitae, pretium molestie justo. Sed viverra risus ut nisl fermentum, eget ultrices urna imperdiet. Sed porttitor pretium lorem, quis lobortis ligula gravida sit amet. Nullam laoreet massa rutrum justo gravida finibus. Phasellus at mi tortor. Duis maximus quam vitae purus interdum dapibus. Quisque eu diam vitae enim gravida semper ut vitae lacus. Etiam ultrices dapibus enim, feugiat tincidunt justo ultricies eget. Praesent eget arcu mollis, lobortis erat quis, convallis arcu.

Etiam non convallis mauris, quis placerat neque. Donec venenatis feugiat felis et tempus. Cras vel maximus ante. Aenean eu urna in ipsum hendrerit auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam semper, orci et auctor malesuada, sem felis ultrices sem, sit amet egestas arcu arcu tristique tortor. Nunc vitae finibus tellus.


      </Truncator>
    </div>
  </div>
);

export default App;
