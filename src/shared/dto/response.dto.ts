// src/shared/dto/response.dto.ts
export class ResponseDto<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}
