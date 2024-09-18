import { fetchApi } from "@/utils/api";
import { FC } from "react";

interface Bucket {
  name: string;
  creationDate: string;
}

export const Buckets: FC = async () => {
  const buckets = await fetchApi<{
    buckets: Bucket[];
  }>("/v3/files/list", { next: { revalidate: 30 } });

  return (
    <div>
      <hr />
      <h2>Buckets</h2>
      {buckets ? (
        buckets.buckets.map((bucket, index) => (
          <span key={index}>
            {bucket.name} ({bucket.creationDate})
          </span>
        ))
      ) : (
        <div>[]</div>
      )}
    </div>
  );
};
