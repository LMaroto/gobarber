import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  max-width: 600px;
  margin: 30px auto 0;

  form {
    display: flex;
    flex-direction: column;

    input {
      background: rgba(1, 1, 1, 0.1);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: #fff;
      margin: 0 0 10px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    hr {
      height: 1px;
      margin: 10px 0 20px;
      border: 0;
      background: rgba(255, 255, 255, 0.2);
    }

    button {
      height: 44px;
      margin: 5px 0;
      padding: 0 15px;
      background: #3b9eff;
      border: 0;
      border-radius: 4px;
      font-weight: bold;
      font-size: 16px;
      color: #fff;

      &:hover {
        background: ${darken(0.03, '#3b9eff')};
      }
    }
  }

  > button {
    width: 100%;
    height: 44px;
    margin: 5px 0;
    padding: 0 15px;
    background: #f64c75;
    border: 0;
    border-radius: 4px;
    font-weight: bold;
    font-size: 16px;
    color: #fff;

    &:hover {
      background: ${darken(0.03, '#f64c75')};
    }
  }
`;
