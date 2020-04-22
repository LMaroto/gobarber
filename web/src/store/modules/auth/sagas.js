import { takeLatest, call, put, all } from 'redux-saga/effects';

import history from '~/services/history';
import api from '~/services/api';
import { signInSuccess, signFailure } from './actions';

import { Toast } from '~/components/Dialogs/Toast';

/* 
  Middleware que faz a requisição de login à API
  quando a action SIGN_IN_REQUEST é chamada.
*/
export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    if (!user.provider) {
      throw new Error('notProvider');
    }

    yield put(signInSuccess(token, user));

    history.push('/dashboard');
  } catch (err) {
    // Verificando o erro antes de exibir o toast.
    if (err.message === 'notProvider') {
      Toast.fire({
        icon: 'error',
        title: 'O usuário não é prestador de serviços.',
      });
    } else {
      Toast.fire({
        icon: 'error',
        title: 'Falha na autenticação. Por favor, verifique seus dados.',
      });
    }
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
      provider: true,
    });

    Toast.fire({
      icon: 'success',
      title: 'Cadastro realizado!',
    });

    history.push('/');
  } catch (err) {
    // Verificando o erro retornado pela API e definindo Toast relacionado
    const errMessage = err.response.data.error;

    if (errMessage === 'User already exists.') {
      Toast.fire({
        icon: 'error',
        title: 'O e-mail já foi cadastrado.',
      });
    } else {
      Toast.fire({
        icon: 'error',
        title: 'Falha no cadastro. Por favor, verifique seus dados.',
      });
    }
    yield put(signFailure());
  }
}

export default all([
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
