import "./scss/index.scss";

import * as React from "react";
import { Link } from "react-router-dom";

import { getDBIdFromGraphqlId, slugify } from "../../core/utils";
import { Category_category } from "../../views/Category/types/Category";
import { baseUrl } from "../App/routes";

export interface Breadcrumb {
  value: string;
  link: string;
}

export const extractBreadcrumbs = (category: Category_category) => {
  const constructLink = item => ({
    link: [
      `/category`,
      `/${slugify(item.name)}`,
      `/${getDBIdFromGraphqlId(item.id, "Category")}/`
    ].join(""),
    value: item.name
  });

  let breadcrumbs = [constructLink(category)];

  if (category.ancestors.edges.length) {
    const ancestorsList = category.ancestors.edges.map(constructLink);
    breadcrumbs = ancestorsList.concat(breadcrumbs);
  }
  return breadcrumbs;
};

const Breadcrumbs: React.SFC<{
  breadcrumbs: Breadcrumb[];
}> = ({ breadcrumbs }) => {
  return (
    <ul className="breadcrumbs">
      <li>
        <Link to={baseUrl}>Start</Link>
      </li>
      {breadcrumbs.map(breadcrumb => (
        <li key={breadcrumb.value}>
          <Link to={breadcrumb.link}>{breadcrumb.value}</Link>
        </li>
      ))}
    </ul>
  );
};
export default Breadcrumbs;
