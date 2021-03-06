import * as React from "react";
import { RouteComponentProps } from "react-router";

import NetworkStatus from "../../components/NetworkStatus";
import { NotFound } from "../../components/NotFound";
import { OfflinePlaceholder } from "../../components/OfflinePlaceholder";
import { AttributeList, Filters } from "../../components/ProductFilters";
import { PRODUCTS_PER_PAGE } from "../../core/config";
import {
  convertSortByFromString,
  convertToAttributeScalar,
  getAttributesFromQs,
  getGraphqlIdFromDBId,
  maybe,
  parseQueryString,
  updateQueryString
} from "../../core/utils";
import { Page } from "./Page";
import { TypedCollectionProductsQuery } from "./queries";

type ViewProps = RouteComponentProps<{
  id: string;
}>;

export const View: React.SFC<ViewProps> = ({ match, location, history }) => {
  const querystring = parseQueryString(location);
  const updateQs = updateQueryString(location, history);
  const attributes: AttributeList = getAttributesFromQs(querystring);

  const filters: Filters = {
    attributes,
    pageSize: PRODUCTS_PER_PAGE,
    priceGte: querystring.priceGte || null,
    priceLte: querystring.priceLte || null,
    sortBy: querystring.sortBy || null
  };
  const variables = {
    ...filters,
    attributes: convertToAttributeScalar(filters.attributes),
    id: getGraphqlIdFromDBId(match.params.id, "Collection"),
    sortBy: convertSortByFromString(filters.sortBy)
  };

  return (
    <NetworkStatus>
      {isOnline => (
        <TypedCollectionProductsQuery
          variables={variables}
          errorPolicy="all"
          loaderFull
        >
          {({ loading, data, loadMore }) => {
            const canDisplayFilters = maybe(
              () => !!data.collection.name,
              false
            );

            if (canDisplayFilters) {
              const handleLoadMore = () =>
                loadMore(
                  (prev, next) => ({
                    ...prev,
                    products: {
                      ...prev.products,
                      edges: [...prev.products.edges, ...next.products.edges],
                      pageInfo: next.products.pageInfo
                    }
                  }),
                  data.products.pageInfo.endCursor
                );

              return (
                <Page
                  attributes={data.attributes.edges.map(edge => edge.node)}
                  collection={data.collection}
                  displayLoader={loading}
                  hasNextPage={maybe(
                    () => data.products.pageInfo.hasNextPage,
                    false
                  )}
                  filters={filters}
                  products={data.products}
                  onAttributeFiltersChange={updateQs}
                  onLoadMore={handleLoadMore}
                  onOrder={value => updateQs("sortBy", value)}
                  onPriceChange={updateQs}
                />
              );
            }

            if (data && data.collection === null) {
              return <NotFound />;
            }

            if (!isOnline) {
              return <OfflinePlaceholder />;
            }

            return null;
          }}
        </TypedCollectionProductsQuery>
      )}
    </NetworkStatus>
  );
};
