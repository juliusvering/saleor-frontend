import * as React from "react";

import classNames from "classnames";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Button, ButtonProps } from "..";

interface AddToCartButtonState {
  animate: boolean;
  disabled: boolean;
}

class AddToCartButton extends React.PureComponent<
  ButtonProps,
  AddToCartButtonState
> {
  state = { animate: false, disabled: false };
  animationTimeout = 800;
  timeout;

  handleAnimation = (evt: React.MouseEvent<HTMLButtonElement>) => {
    if (!this.state.disabled) {
      this.props.onClick(evt);

      this.setState({ animate: true, disabled: true }, () => {
        setTimeout(() => {
          this.setState({ animate: false }, () => {
            setTimeout(
              () => this.setState({ disabled: false }),
              this.animationTimeout
            );
          });
        }, this.animationTimeout);
      });
    }
  };

  render() {
    const { animate } = this.state;

    return (
      <Button
        {...this.props}
        className={classNames(this.props.className, {
          "product-description__action--fade": animate
        })}
        onClick={this.handleAnimation}
      >
        <ReactCSSTransitionGroup
          transitionName="product-description__action--fade"
          transitionEnterTimeout={this.animationTimeout}
          transitionLeaveTimeout={this.animationTimeout}
        >
          {animate ? (
            <span key="text">Hinzugefügt</span>
          ) : (
            <span key="children">{this.props.children}</span>
          )}
        </ReactCSSTransitionGroup>
      </Button>
    );
  }
}

export default AddToCartButton;
