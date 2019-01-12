import "./scss/index.scss";

import * as React from "react";

interface NotFoundProps {
  message?: string;
}

export const NotFound: React.SFC<NotFoundProps> = ({ message }) => (
  <div className="not-found-page">
    <h2 className="not-found-page__header">
      {message || "Hoppala, diese Seite konnten wir nicht finden :("}
    </h2>
  </div>
);
