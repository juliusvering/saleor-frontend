import * as React from "react";
import { Link } from "react-router-dom";

import { baseUrl } from "../App/routes";
import Button from "../Button";

export const EmptyCart: React.SFC<{}> = () => (
  <div className="cart-page__empty">
    <h4>Dein Warenkorb ist leer</h4>
    <p>
      Du hast noch nichts zu Deinem Warenkorb hinzugefügt.
      Du findest sicher etwas in unserem Angebot!
    </p>
    <div className="cart-page__empty__action">
      <Link to={baseUrl}>
        <Button secondary>Weiter einkaufen</Button>
      </Link>
    </div>
  </div>
);
