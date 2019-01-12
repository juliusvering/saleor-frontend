import * as React from "react";
import { Mutation } from "react-apollo";

import { Button, Form, TextField } from "..";
import { PASSWORD_RESET_MUTATION } from "./queries";

import "./scss/index.scss";

const PasswordResetForm: React.SFC = () => (
  <div className="password-reset-form">
    <p>
      Bitte gib Deine E-Mail-Adresse ein, damit wir Dir einen Link zum zurücksetzen
      Deines Passworts zuschicken können
    </p>
    <Mutation mutation={PASSWORD_RESET_MUTATION}>
      {(passwordReset, { loading, data }) => {
        return (
          <Form
            errors={
              data &&
              data.customerPasswordReset &&
              data.customerPasswordReset.error
            }
            onSubmit={(event, data) => {
              event.preventDefault();
              passwordReset({
                variables: { email: data.email }
              });
            }}
          >
            <TextField
              name="email"
              autoComplete="email"
              label="E-Mail"
              type="email"
              required
            />
            <div className="password-reset-form__button">
              <Button type="submit" {...loading && { disabled: true }}>
                {loading ? "Lädt" : "Passwort zurücksetzen"}
              </Button>
            </div>
          </Form>
        );
      }}
    </Mutation>
  </div>
);

export default PasswordResetForm;
