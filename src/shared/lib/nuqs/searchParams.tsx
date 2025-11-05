import { createLoader, parseAsFloat, parseAsString } from 'nuqs/server';

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const reservationParams = {
  hideSecret: parseAsString.withDefault('false'),
  page: parseAsFloat.withDefault(1),
};

export const reviewParams = {
  franchisee: parseAsString.withDefault('전체'),
  page: parseAsFloat.withDefault(1),
};

export const managerListParams = {
  page: parseAsFloat.withDefault(1),
};

export const eventParams = {
  status: parseAsString.withDefault('ALL'),
  page: parseAsFloat.withDefault(1),
};

export const loadReservationParams = createLoader(reservationParams);
export const loadReviewParams = createLoader(reviewParams);
export const loadManagerListParams = createLoader(managerListParams);
export const loadEventParams = createLoader(eventParams);
