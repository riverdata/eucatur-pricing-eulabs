import { ExternalServices } from "./ExternalServices";
import { ExternalAgency } from "./ExternalAgency";
import { ExternalClass } from "./ExternalClass";
import { ExternalItinerary } from "./ExternalItinerary";
import { ExternalLine } from "./ExternalLine";
import { ExternalPrice } from "./ExternalPrice";

interface ApiResponse<T> {
    data: {
        pagination?: {
            current_page: number;
            records_per_page: number;
            amount_pages: number;
            amount_records: number;
        };
        services?: ExternalServices[];
        agencies?: ExternalAgency[];
        sales?: any[];
        lines?: ExternalLine[];
        itineraries?: ExternalItinerary[]
    }
}

interface ApiResponsePrice<T> {
    data: {
        tariff: ExternalPrice[]
    }
}

interface ApiResponseClass<T> {
    data: {
        classes: ExternalClass[]
    }
}

export {
    ApiResponse, ApiResponsePrice, ApiResponseClass
}