import "./scss/index.scss";

import * as React from "react";
import { Link } from "react-router-dom";

import { Button, Dropdown, ProductListItem } from "..";
import { generateProductUrl } from "../../core/utils";
import Loader from "../Loader";
import { Filters } from "../ProductFilters";

import { Product } from "../ProductListItem";

interface ProductsListProps {
  products: Product[];
  displayLoader: boolean;
  hasNextPage: boolean;
  filters: Filters;
  onLoadMore: () => void;
  onOrder: (order: string) => void;
  notFoundPhrase?: string;
  totalCount: number;
}

export const ProductList: React.SFC<ProductsListProps> = ({
  displayLoader,
  filters,
  hasNextPage,
  notFoundPhrase,
  onLoadMore,
  onOrder,
  products,
  totalCount
}) => {
  const filterOptions = [
    { value: "price", label: "Preis aufsteigend" },
    { value: "-price", label: "Preis absteigend" },
    { value: "name", label: "Name aufsteigend" },
    { value: "-name", label: "Name absteigend" }
  ];
  const sortValues = filterOptions.find(
    option => option.value === filters.sortBy
  );
  const hasProducts = !!totalCount;

  return (
    <div className="products-list">
      <div className="products-list__products container">
        <div className="products-list__products__subheader">
          <span className="products-list__products__subheader__total">
            {totalCount} Artikel
          </span>
          {displayLoader && (
            <div className="products-list__loader">
              <Loader />
            </div>
          )}
          <span className="products-list__products__subheader__sort">
            {hasProducts && (
              <>
                <span>Sort by:</span>{" "}
                <Dropdown
                  options={filterOptions}
                  value={sortValues || ""}
                  isSearchable={false}
                  onChange={event => onOrder(event.value)}
                />
              </>
            )}
          </span>
        </div>
        {hasProducts ? (
          <>
            <div className="products-list__products__grid">
              {products.map(product => (
                <Link
                  to={generateProductUrl(product.id, product.name)}
                  key={product.id}
                >
                  <ProductListItem product={product} />
                </Link>
              ))}
            </div>
            <div className="products-list__products__load-more">
              {displayLoader ? (
                <Loader />
              ) : (
                hasNextPage && (
                  <Button secondary onClick={onLoadMore}>
                    Mehr Artikel laden
                  </Button>
                )
              )}
            </div>
          </>
        ) : (
          <div className="products-list__products-not-found">
            {notFoundPhrase}
          </div>
        )}
      </div>
    </div>
  );
};

ProductList.defaultProps = {
  notFoundPhrase: "Wir konnten keine Artikel finden, die diese Bedingungen erfüllen"
};

export default ProductList;
