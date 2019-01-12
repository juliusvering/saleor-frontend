import "./scss/index.scss";

import * as React from "react";
import { ApolloConsumer } from "react-apollo";
import { Link } from "react-router-dom";
import ReactSVG from "react-svg";

import { Button } from "..";
import { maybe, priceToString } from "../../core/utils";
import { checkoutLoginUrl } from "../App/routes";
import { CartContext } from "../CartProvider/context";
import { Error } from "../Error";
import GoToCart from "../GoToCart";
import { GoToCheckout } from "../GoToCheckout";
import Loader from "../Loader";
import { Overlay } from "../Overlay";
import { OverlayContext, OverlayType } from "../Overlay/context";
import { ShopContext } from "../ShopProvider/context";
import { UserContext } from "../User/context";

import CachedImage from "../CachedImage";
import Offline from "../Offline";
import OfflinePlaceholder from "../OfflinePlaceholder";
import Online from "../Online";

const cartSvg = require("../../images/cart.svg");
const closeSvg = require("../../images/x.svg");
const noPhotoPng = require("../../images/nophoto.png");
const removeSvg = require("../../images/garbage.svg");

export const CartOverlay: React.SFC = () => (
  <OverlayContext.Consumer>
    {overlay =>
      overlay.type === OverlayType.cart ? (
        <Overlay context={overlay}>
          <Online>
            <ApolloConsumer>
              {client => (
                <CartContext.Consumer>
                  {cart => {
                    const { lines, loading, errors } = cart;
                    if (loading) {
                      return (
                        <div className="cart">
                          <Loader full />
                        </div>
                      );
                    }
                    if (errors) {
                      return errors.map(error => (
                        <Error error={error.message} />
                      ));
                    }
                    return (
                      <div className="cart">
                        <div className="overlay__header">
                          <ReactSVG
                            path={cartSvg}
                            className="overlay__header__cart-icon"
                          />
                          <div className="overlay__header-text">
                            Warenkorb,{" "}
                            <span className="overlay__header-text-items">
                              {lines.length || 0} Artikel
                            </span>
                          </div>
                          <ReactSVG
                            path={closeSvg}
                            onClick={() => overlay.hide()}
                            className="overlay__header__close-icon"
                          />
                        </div>
                        {lines.length ? (
                          <>
                            <ul className="cart__list">
                              {lines.map(line => (
                                <li
                                  key={line.variant.id}
                                  className="cart__list__item"
                                >
                                  <CachedImage
                                    url={maybe(
                                      () => line.variant.product.thumbnail.url,
                                      noPhotoPng
                                    )}
                                    url2x={maybe(
                                      () => line.variant.product.thumbnail2x.url
                                    )}
                                  />
                                  <div className="cart__list__item__details">
                                    <p>{line.variant.price.localized}</p>
                                    <p>{line.variant.product.name}</p>
                                    <span className="cart__list__item__details__variant">
                                      <span>{line.variant.name}</span>
                                      <span>{"Qty: " + line.quantity}</span>
                                    </span>
                                    <ReactSVG
                                      path={removeSvg}
                                      className="cart__list__item__details__delete-icon"
                                      onClick={() =>
                                        cart.remove(line.variant.id)
                                      }
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <div className="cart__footer">
                              <div className="cart__footer__subtotoal">
                                <span>Subtotal</span>
                                <ShopContext.Consumer>
                                  {({ defaultCountry, geolocalization }) => (
                                    <span>
                                      {priceToString(
                                        cart.getTotal(),
                                        geolocalization.country
                                          ? geolocalization.country.code
                                          : defaultCountry.code
                                      )}
                                    </span>
                                  )}
                                </ShopContext.Consumer>
                              </div>

                              <div className="cart__footer__button">
                                <GoToCart
                                  apolloClient={client}
                                  cart={cart}
                                  secondary
                                >
                                  Warenkorb
                                </GoToCart>
                              </div>
                              <div className="cart__footer__button">
                                <UserContext.Consumer>
                                  {({ user }) =>
                                    user ? (
                                      <GoToCheckout
                                        apolloClient={client}
                                        cart={cart}
                                      >
                                        Bezahlen
                                      </GoToCheckout>
                                    ) : (
                                      <Link to={checkoutLoginUrl}>
                                        <Button>Bezahlen</Button>
                                      </Link>
                                    )
                                  }
                                </UserContext.Consumer>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="cart__empty">
                            <h4>Dein Warenkorb ist leer</h4>
                            <p>
                              Du hast noch nichts zu Deinem Warenkorb hinzugefügt.
                              Du findest sicher etwas in unserem Angebot!
                            </p>
                            <div className="cart__empty__action">
                              <Button secondary onClick={() => overlay.hide()}>
                                Weiter einkaufen
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }}
                </CartContext.Consumer>
              )}
            </ApolloConsumer>
          </Online>
          <Offline>
            <div className="cart">
              <OfflinePlaceholder />
            </div>
          </Offline>
        </Overlay>
      ) : null
    }
  </OverlayContext.Consumer>
);
