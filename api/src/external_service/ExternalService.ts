import axios, { AxiosInstance } from "axios";
import { config } from "../config";
import { ApiResponse, ApiResponseClass, ApiResponsePrice } from "./interfaces";
import https from "https";
// Criar um agente HTTPS que ignora a verificação SSL (apenas para DEV)
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const apiIntegraImpetus: AxiosInstance = axios.create({
  baseURL: config.apiIntegraImpetus.baseUrl,
  headers: { Authorization: `Bearer ${config.apiIntegraImpetus.apiKey}` },
  timeout: 180000,
  httpsAgent
});

const ExternalService = {
  async getLineAll<T>(): Promise<ApiResponse<T> | any> {
    try {
      const response = await apiIntegraImpetus.get<ApiResponse<T>>('/line?records_per_page=700&page=1');
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error('A requisição demorou mais de 3 minutos e foi cancelada.');
      } else {
        throw new Error(`API Error: ${error.message}`);
      }
    }
  },

  async getItineraryByLine<T>(line_code: string, page: number): Promise<ApiResponse<T> | any> {
    try {
      const response = await apiIntegraImpetus.get<ApiResponse<T> | any>(`/line/itinerary?line_code=${line_code}&records_per_page=1000&page=${page}`);
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error('A requisição demorou mais de 3 minutos e foi cancelada.');
        return { response: { data: false } }
      } else {
        throw new Error(`API Error: ${error.message}`);
      }

    }
  },

  async getClassAll<T>(): Promise<ApiResponseClass<T> | any> {
    try {
      const response = await apiIntegraImpetus.get<ApiResponseClass<T>>('/class');
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error('A requisição demorou mais de 3 minutos e foi cancelada.');
      } else {
        throw new Error(`API Error: ${error.message}`);
      }
    }
  },

  async getServiceAll<T>(line_code: string, page: number): Promise<ApiResponse<T> | any> {
    try {
      const response = await apiIntegraImpetus.get<ApiResponse<T>>(`/service?page=${page}&records_per_page=1000&line_code=${line_code}`);
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error('A requisição demorou mais de 3 minutos e foi cancelada.');
        throw new Error(`API Error: ${error.message}`);
      } else {
        throw new Error(`API Error: ${error.message}`);
      }
    }
  },

  async getPriceByAll<T>(line_code: string, operation_date: string, origin_code: string, destiny_code: string): Promise<ApiResponsePrice<T> | any> {
    try {
      const response = await apiIntegraImpetus.get<ApiResponsePrice<T>>(`/price/tariff?line_code=${line_code}&operation_date=${operation_date}&secctional_origin_code=${origin_code}&secctional_destiny_code=${destiny_code}`);
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error('A requisição demorou mais de 3 minutos e foi cancelada.');
      } else {
        throw new Error(`API Error: ${error.message}`);
      }
    }
  },

  async getPrice<T>(line_code: string, operation_date: string): Promise<ApiResponsePrice<T> | any> {
    try {
      const response = await apiIntegraImpetus.get<ApiResponsePrice<T>>(`/price/tariff?line_code=${line_code}&operation_date=${operation_date}`);
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error('A requisição demorou mais de 3 minutos e foi cancelada.');
      } else {
        throw new Error(`API Error: ${error.message}`);
      }
    }
  },

  async getAgencyAll<T>(page: number): Promise<ApiResponse<T> | any> {
    try {
      const response = await apiIntegraImpetus.get<ApiResponse<T>>(`/agency?page=${page}&records_per_page=1000`);
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        console.error('A requisição demorou mais de 3 minutos e foi cancelada.');
      } else {
        throw new Error(`API Error: ${error.message}`);
      }
    }
  },
};

export default ExternalService;
