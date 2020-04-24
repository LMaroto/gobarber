import { takeLatest, call, put, all } from 'redux-saga/effects';

import { Toast } from '~/components/Dialogs/Toast';

import api from '~/services/api';

import { updateProfileSuccess, updateProfileFailure } from './actions';

export function* updateProfile({ payload }) {
  try {
    const { name, email, ...rest } = payload.data;

    const profile = Object.assign(
      { name, email },
      rest.oldPassword ? rest : {}
    );

    const response = yield call(api.put, 'users', profile);

    Toast.fire({
      icon: 'success',
      title: 'Perfil atualizado com sucesso!',
    });

    yield put(updateProfileSuccess(response.data));
  } catch (err) {
    Toast.fire({
      icon: 'error',
      title: 'Erro ao atualizar perfil. Por favor, verifique seus dados.',
    });
    yield put(updateProfileFailure());
  }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
