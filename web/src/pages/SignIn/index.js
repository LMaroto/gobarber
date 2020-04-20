import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import Input from '~/components/Input';
import logo from '~/assets/logo.svg';

export default function SignIn() {
  const formRef = useRef(null);

  async function handleSubmit(data, { reset }) {
    // Definindo e verificando schema
    try {
      // Removendo erros anteriores
      formRef.current.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().email().required('O e-mail é obrigatório.'),
        password: Yup.string().required('A senha é obrigatória.'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      const validationErrors = {};
      // Verificando se é erro do Yup
      if (err instanceof Yup.ValidationError) {
        // exibindo erros
        console.tron.log(err);
        err.inner.forEach((error) => {
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

        <button type="submit">Acessar</button>
        <Link to="/register">Criar conta gratuita</Link>
      </Form>
    </>
  );
}
