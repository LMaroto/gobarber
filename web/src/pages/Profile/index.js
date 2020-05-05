import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Form } from '@unform/web';
import { updateProfileRequest } from '~/store/modules/user/actions';

import { Container } from './styles';

import AvatarInput from './AvatarInput';
import Input from '~/components/Input';

export default function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  function handleSubmit(data) {
    dispatch(updateProfileRequest(data));
  }

  return (
    <Container>
      <Form initialData={profile} onSubmit={handleSubmit}>
        <AvatarInput name="avatar_id" />
        <Input name="name" placeholder="Seu nome completo" />
        <Input name="email" type="email" placeholder="Seu email" />
        <hr />
        <Input
          name="oldPassword"
          type="password"
          placeholder="Sua senha atual"
        />
        <Input name="password" type="password" placeholder="Sua nova senha" />
        <Input
          name="newPassword"
          type="password"
          placeholder="Confirme a nova senha"
        />
        <button type="submit">Atualizar cadastro</button>
      </Form>
      <button type="button">Sair do GoBarber</button>
    </Container>
  );
}
