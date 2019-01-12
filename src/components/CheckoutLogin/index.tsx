import * as React from "react";
import { ApolloConsumer } from "react-apollo";
import { RouteComponentProps } from "react-router";

import { LoginForm, PasswordResetForm } from "..";
import { CartContext } from "../CartProvider/context";
import { GoToCheckout } from "../GoToCheckout";
import { UserContext } from "../User/context";

import Offline from "../Offline";
import OfflinePlaceholder from "../OfflinePlaceholder";
import Online from "../Online";
import "./scss/index.scss";

class CheckoutLogin extends React.Component<
  RouteComponentProps<{}>,
  { resetPassword: boolean }
> {
  checkoutButton: any;
  constructor(props) {
    super(props);
    this.state = { resetPassword: false };
  }
  render() {
    return (
      <UserContext.Consumer>
        {({ user }) => {
          if (user) {
            this.checkoutButton.handleCheckoutCreation();
          }
          return (
            <div className="container">
              <Online>
                <div className="checkout-login">
                  <div className="checkout-login__guest">
                    <h3 className="checkout__header">Als Gast fortfahren</h3>
                    <p>
                      Wenn Du Dich nicht bei uns registrieren möchtest, kannst
                      Du Deinen Einkauf auch als Gast abschliessen. Wir werden Dich
                      genau so gut behandeln wie als registrierter Kunde.

                    </p>
                    <CartContext.Consumer>
                      {cart => (
                        <ApolloConsumer>
                          {client => (
                            <GoToCheckout
                              apolloClient={client}
                              cart={cart}
                              ref={node => (this.checkoutButton = node)}
                            >
                              Als Gast fortfahren
                            </GoToCheckout>
                          )}
                        </ApolloConsumer>
                      )}
                    </CartContext.Consumer>
                  </div>
                  <div className="checkout-login__user">
                    <h3 className="checkout__header">Registrierter Kunde</h3>

                    {this.state.resetPassword ? (
                      <>
                        <PasswordResetForm />
                        <div className="login__content__password-reminder">
                          <p>
                            <span
                              onClick={() => {
                                this.setState({ resetPassword: false });
                              }}
                            >
                              Zurück zum Login
                            </span>
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <LoginForm />
                        <div className="login__content__password-reminder">
                          <p>
                            Passwort vergessen?&nbsp;
                            <span
                              onClick={() => {
                                this.setState({ resetPassword: true });
                              }}
                            >
                              Hier klicken!
                            </span>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Online>
              <Offline>
                <OfflinePlaceholder />
              </Offline>
            </div>
          );
        }}
      </UserContext.Consumer>
    );
  }
}

export default CheckoutLogin;
