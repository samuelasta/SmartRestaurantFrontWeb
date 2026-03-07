// Modelo de Daily Menu según especificación del backend

export interface DailyMenuDish {
  id: string;
  name: string;
  price: string;
  photo: string;
}

export interface DailyMenuResponse {
  data: DailyMenuDish[] | string;
  error: boolean;
}
