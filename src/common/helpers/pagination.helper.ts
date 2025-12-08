// src/common/helpers/pagination.helper.ts
export interface PaginateOptions {
  page?: number;
  limit?: number;
  route?: string;
}

export interface PaginateResult<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first?: string;
    previous?: string | null;
    next?: string | null;
    last?: string;
  };
}

export function paginate<T>(
  items: T[],
  total: number,
  options: PaginateOptions = {},
): PaginateResult<T> {
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 25;
  const totalPages = Math.ceil(total / limit);

  const result: PaginateResult<T> = {
    items,
    meta: {
      totalItems: total,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    },
    links: {},
  };

  const base = options.route ?? '';
  const makeLink = (p: number) => `${base}?page=${p}&limit=${limit}`;

  result.links.first = makeLink(1);
  result.links.last = makeLink(totalPages || 1);
  result.links.previous = page > 1 ? makeLink(page - 1) : null;
  result.links.next = page < totalPages ? makeLink(page + 1) : null;

  return result;
}
