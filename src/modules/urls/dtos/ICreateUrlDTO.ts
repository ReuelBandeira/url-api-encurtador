export default interface ICreateUrlDTO {
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  id_employee: number | null;
}
