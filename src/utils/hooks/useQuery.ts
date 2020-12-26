import { useLocation, useNavigate } from "react-router-dom";
import qs from 'qs';
import { useCallback, useMemo } from "react";
import { isArray } from 'lodash';

export function useQuery(paramName: string) {
  const { search } = useLocation();
  const queryString = search.substr(1);
  const navigate = useNavigate();

  const queryParams = useMemo(() => {
    const result = qs.parse(queryString)[paramName];
    if (isArray(result)) {
      return {
        params: result as string[],
      }
    }
    return {
      param: String(result),
    }
  }, [queryString, paramName]);

  const setQueryParam = useCallback(function(newValue: string | string[]) {
    const result = qs.parse(queryString);
    const newSearch = qs.stringify({
      ...result,
      [paramName]: newValue,
    });
    console.log('setting query to: ', newSearch)
    navigate({ search: `?${newSearch}` });
  },[navigate, paramName, queryString]);
  console.log('queryParams', queryParams.param, queryParams.params);

  return {
    ...queryParams,
    setQueryParam,
  }
}
