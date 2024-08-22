import { useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import {
  Pagination as PaginationCN,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "~/components/ui/pagination";
import { loader } from "~/routes/_index";
import { Button } from "./ui/button";
import { Listing } from "~/types";

export function Pagination({
  data: { total, listings },
}: {
  data: { total: number; listings: Listing[] };
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const offset = Number(searchParams.get("offset") || "0");
  const limit = Number(searchParams.get("limit") || "50");

  const totalPages = Math.ceil(total / limit);
  const currOffset = offset ? offset : 0;
  const nextOffset = Math.min(currOffset + limit, total);
  const prevOffset = Math.max(currOffset - limit, 0);
  const currPage = offset / limit;

  const previousQuery = new URLSearchParams(searchParams);
  previousQuery.set("offset", prevOffset.toString());

  const pageQuery = (pageNum: number) => {
    const query = new URLSearchParams(searchParams);
    query.set("offset", (limit * pageNum).toString());
    return query;
  };

  const nextQuery = new URLSearchParams(searchParams);
  nextQuery.set("offset", nextOffset.toString());

  return (
    <PaginationCN>
      <PaginationContent>
        {currOffset > 0 && (
          <PaginationItem>
            <PaginationPrevious to={`?${previousQuery.toString()}`} />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }).map((item, idx) => (
          <PaginationItem>
            <PaginationLink
              to={`?${pageQuery(idx).toString()}`}
              isActive={idx === currPage}
            >
              {idx + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currOffset + limit < total && (
          <PaginationItem>
            <PaginationNext to={`?${nextQuery.toString()}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationCN>
  );
}
