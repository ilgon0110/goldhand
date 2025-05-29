import { parseAsFloat, createLoader, parseAsString } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const searchParams = {
  page: parseAsFloat.withDefault(1),
};

export const loginParams = {
  access_token: parseAsString,
};

export const consultParams = {
  hideSecret: parseAsString.withDefault("false"),
  page: parseAsFloat.withDefault(1),
};

export const consultDetailParams = {
  docId: parseAsString,
};

export const reviewParams = {
  page: parseAsFloat.withDefault(1),
};

export const loadConsultDetailParams = createLoader(consultDetailParams);
export const loadConsultParams = createLoader(consultParams);
export const loadSearchParams = createLoader(searchParams);
export const loadLoginParams = createLoader(loginParams);
export const loadReviewParams = createLoader(reviewParams);
