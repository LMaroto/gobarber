import React from 'react';
import { Text } from 'react-native';

import Background from '~/components/Background';
import Input from '~/components/Input';
import Button from '~/components/Button';
// import { Container } from './styles';

const SignIn = () => {
  return (
    <Background>
      <Text>SignIn</Text>

      <Input icon="call" placeholder="Digite seu nome" />
      <Button>Entrar</Button>
    </Background>
  );
};

export default SignIn;
