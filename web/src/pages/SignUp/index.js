import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import Input from '~/components/Input';
import logo from '~/assets/logo.svg';

export default function SignUp() {
  const formRef = useRef(null);

  async function handleSubmit(data, { reset }) {
    // Definindo e verificando schema
    try {
      // Removendo erros anteriores

      formRef.current.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório.'),
        email: Yup.string()
          .email('Insira um e-mail válido.')
          .required('O e-mail é obrigatório.'),
        password: Yup.string()
          .min(6, 'No mínimo 6 caracteres.')
          .required('A senha é obrigatória.'),
      });

      // Verificando schema
      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      const validationErrors = {};
      // Verificando se o erro vem do Yup
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
        <Input name="name" placeholder="Nome completo" />
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input name="password" type="password" placeholder="Sua senha" />

        <button type="submit">Criar conta</button>
        <Link to="/">Já tenho login</Link>
      </Form>
    </>
  );
}
