import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import Input from '~/components/Input';

import { signInRequest } from '~/store/modules/auth/actions';

import logo from '~/assets/logo.svg';

export default function SignIn() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const formRef = useRef(null);

  async function handleSubmit({ email, password }, { reset }) {
    // Definindo e verificando schema
    try {
      // Removendo erros anteriores
      formRef.current.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Insira um e-mail válido.')
          .required('O e-mail é obrigatório.'),
        password: Yup.string().required('A senha é obrigatória.'),
      });

      // Verificando schema
      await schema.validate(
        { email, password },
        {
          abortEarly: false,
        }
      );

      // Disparando action de SignIn
      dispatch(signInRequest(email, password));
    } catch (err) {
      const validationErrors = {};
      // Verificando se é erro do Yup
      if (err instanceof Yup.ValidationError) {
        // Exibindo erros
        err.inner.forEach((error) => {
          console.tron.log(error);
          validationErrors[error.path] = error.message;
        });

        formRef.current.setErrors(validationErrors);
      }
    }

    reset();
  }
  return (
    <>
      <img src={logo} alt="GoBarber" />

      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input name="password" type="password" placeholder="Sua senha" />

        <button type="submit">{loading ? 'Carregando ... ' : 'Acessar'}</button>
        <Link to="/register">Criar conta gratuita</Link>
      </Form>
    </>
  );
}
