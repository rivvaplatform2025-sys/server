// src/shared/dto/paginated-response.dto.ts
export class PaginatedResponseDto<T> {
  success: boolean;
  timestamp: string;
  data: {
    items: T[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  };
}
