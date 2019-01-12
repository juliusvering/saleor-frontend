import { createContext } from "react";

import { ShopInterface } from "../../core/types";

export const ShopContext = createContext<ShopInterface>({
  countries: [],
  defaultCountry: {
    code: "CH",
    country: "Schweiz"
  },
  geolocalization: {
    country: {
      code: "CH",
      country: "Schweiz"
    }
  }
});
