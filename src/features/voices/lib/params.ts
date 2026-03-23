// This file contains the search params for the voices page. It is used to parse the search params from the URL and provide default values if they are not present.
import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const voicesSearchParams = {
  query: parseAsString.withDefault(""),
};

export const voicesSearchParamsCache =
  createSearchParamsCache(voicesSearchParams);
