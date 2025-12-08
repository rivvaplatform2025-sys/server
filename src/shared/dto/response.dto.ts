export class ResponseDto<T> {
  success: boolean;
  timestamp: string;
  data?: T;
}
