import { smallScreen } from "../App/scss/variables.scss";
import "./scss/index.scss";

import * as React from "react";
import { Mutation } from "react-apollo";
import Media from "react-media";
import { RouteComponentProps } from "react-router";

import { AddressSummary, Button } from "..";
import { maybe } from "../../core/utils";
import CachedImage from "../CachedImage";
import { CheckoutContext } from "../CheckoutApp/context";
import { OverlayContext, OverlayType } from "../Overlay/context";
import { COMPLETE_CHECKOUT } from "./queries";

const noPhotoPng = require("../../images/nophoto.png");

class CheckoutReview extends React.Component<RouteComponentProps<{ id }>, {}> {
  render() {
    return (
      <CheckoutContext.Consumer>
        {({ cardData, checkout, clearCheckout }) => (
          <div className="checkout-review">
            <div className="checkout__step">
              <span>5</span>
              <h4 className="checkout__header">Prüfe Deine Bestellung</h4>
            </div>
            <div className="checkout-review__content">
              <table className="cart__table">
                <thead>
                  <tr>
                    <th>Artikel</th>
                    <Media query={{ minWidth: smallScreen }}>
                      {matches => (matches ? <th>Preis</th> : null)}
                    </Media>
                    <th>Anzahl</th>
                    <th>
                      <Media query={{ minWidth: smallScreen }}>
                        {matches => (matches ? "Summe" : "Preis")}
                      </Media>
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {checkout.lines.map(line => (
                    <tr key={line.id}>
                      <td className="checkout-review__content__thumbnail">
                        <Media
                          query={{ minWidth: smallScreen }}
                          render={() => (
                            <CachedImage
                              url={maybe(
                                () => line.variant.product.thumbnail.url,
                                noPhotoPng
                              )}
                              url2x={maybe(
                                () => line.variant.product.thumbnail2x.url
                              )}
                            />
                          )}
                        />
                        {line.variant.product.name}
                        {line.variant.name ? `(${line.variant.name})` : null}
                      </td>
                      <Media query={{ minWidth: smallScreen }}>
                        {matches =>
                          matches ? (
                            <td>{line.variant.price.localized}</td>
                          ) : null
                        }
                      </Media>
                      <td>{line.quantity}</td>
                      <td>{line.totalPrice.gross.localized}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="cart__table__subtotal">Subtotal</td>
                    <Media query={{ minWidth: smallScreen }}>
                      {matches => (matches ? <td /> : null)}
                    </Media>
                    <td />
                    <td>{checkout.subtotalPrice.gross.localized}</td>
                    <td />
                  </tr>
                  <tr>
                    <td className="cart__table__subtotal">Versandkosten</td>
                    <Media query={{ minWidth: smallScreen }}>
                      {matches => (matches ? <td /> : null)}
                    </Media>
                    <td />
                    <td>+{checkout.shippingPrice.gross.localized}</td>
                    <td />
                  </tr>
                  <tr>
                    <td className="cart__table__subtotal">Summe</td>
                    <Media query={{ minWidth: smallScreen }}>
                      {matches => (matches ? <td /> : null)}
                    </Media>
                    <td />
                    <td>{checkout.totalPrice.gross.localized}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
              <div className="checkout-review__content__summary">
                <div>
                  <h4>Versandadresse</h4>
                  <AddressSummary
                    address={checkout.shippingAddress}
                    email={checkout.email}
                  />
                </div>
                <div>
                  <h4>Rechnungsadresse</h4>
                  <AddressSummary address={checkout.billingAddress} />
                </div>
                <div>
                  <h4>Versandart</h4>
                  {checkout.shippingMethod.name}
                </div>
                <div>
                  <h4>Zahlungsmethode</h4>
                  Ending in {cardData.lastDigits}
                </div>
              </div>
              <div className="checkout-review__content__submit">
                <OverlayContext.Consumer>
                  {({ show }) => (
                    <Mutation mutation={COMPLETE_CHECKOUT}>
                      {(completeCheckout, { data, loading }) => {
                        if (data) {
                          if (data.checkoutComplete.errors.length === 0) {
                            clearCheckout();
                            show(OverlayType.message, null, {
                              status: "error",
                              title: "Bestellung erfolgreich!"
                            });
                            localStorage.removeItem("checkout");
                            localStorage.removeItem("cart");
                            this.props.history.push(`/`);
                          } else {
                            data.checkoutComplete.errors.map(error => {
                              show(OverlayType.message, null, {
                                title: error.message
                              });
                            });
                          }
                        }
                        return (
                          <Button
                            disabled={loading}
                            onClick={() =>
                              completeCheckout({
                                variables: {
                                  checkoutId: checkout.id
                                }
                              })
                            }
                          >
                            {loading ? "Lädt" : "Bestellen!"}
                          </Button>
                        );
                      }}
                    </Mutation>
                  )}
                </OverlayContext.Consumer>
              </div>
            </div>
          </div>
        )}
      </CheckoutContext.Consumer>
    );
  }
}

export default CheckoutReview;
