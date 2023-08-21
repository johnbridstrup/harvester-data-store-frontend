import { useEffect, useState } from "react";
import { openapiSchema } from "@/features/base/services";

function useOpenApi(token: string) {
  const [schema, setSchema] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await openapiSchema(token);
        setLoading(false);
        setSchema(res.components?.schemas);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, [token]);

  return { schema, loading };
}

export default useOpenApi;
