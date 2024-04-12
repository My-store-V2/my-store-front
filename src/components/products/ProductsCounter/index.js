import React from 'react';

const Index = ({ productsLength, text }) => {

  text = text ?  text : 'produit'
  return (
    <span>
      {productsLength} {text}{productsLength > 1 ? 's' : ''}
    </span>
  );
}

export default Index;
