import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import FielFirma from './FielFirma';

// Here we describe the stories we want to see of the Button. The component is
// pretty simple so we will just make two, one with text and one with emojis
// Simple call storiesOf and then chain .add() as many times as you wish
//
// .add() takes a name and then a function that should return what you want
// rendered in the rendering area
storiesOf('FirlFirma')
  .add('Firma de cadena', () => (
    <FielFirma onClick={action('clicked')}>oooHello Button</FielFirma>
  ))
  .add('con emoji', () => (
    <FielFirma onClick={action('clicked')}>🚿 🚿 🐈 🐈</FielFirma>
  ));
