import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import LlaveInput from './LlaveInput';

// Here we describe the stories we want to see of the Button. The component is
// pretty simple so we will just make two, one with text and one with emojis
// Simple call storiesOf and then chain .add() as many times as you wish
//
// .add() takes a name and then a function that should return what you want
// rendered in the rendering area
storiesOf('LlaveInput')
  .add('Llave pública', () => (
    <LlaveInput tipo="publica" onChanged={action('changed')} />
  ))
  .add('Llave privada', () => (
    <LlaveInput tipo="privada" onChanged={action('changed')} />
  ))
  .add('Personalizado', () => {
    const BotonPersonalizado = styled.button`
      border-radius: 10px;
      color: #fff;
      background: mediumvioletred;
      padding: 1em 3em;
      border: none;
      outline: none;
      cursor: pointer;
    `;

    return (
      <LlaveInput onChanged={action('changed')}>
        <BotonPersonalizado>Sube aquí tu llave pública</BotonPersonalizado>
      </LlaveInput>
    );
  });
