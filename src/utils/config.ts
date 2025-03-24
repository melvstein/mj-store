import { TCurrencyCode } from "@/types";

const Config = {
    currencies: {
        PHP: { symbol: '₱' },
        USD: { symbol: '$' },
    } as Record<TCurrencyCode, { symbol: string }>,
    getCurrencySymbol(currencyCode?: TCurrencyCode) {
        return currencyCode ? this.currencies[currencyCode]?.symbol ?? null : null;
    }
};

export default Config;
