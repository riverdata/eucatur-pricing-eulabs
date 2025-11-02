import { useSearchParams } from "react-router-dom";

export default function useGetUrlParams(key: string) {
  const [searchParams] = useSearchParams();

  const value = searchParams.get(key) as string;

  return value;
}
