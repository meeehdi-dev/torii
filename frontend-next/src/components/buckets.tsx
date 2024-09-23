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
      <h2>Buckets</h2>
      {buckets && buckets.buckets.length > 0 ? (
        <ul>
          {buckets.buckets.map((bucket, index) => (
            <li key={index} className="flex gap-2 font-thin">
              <span>{bucket.name}</span>
              <span className="font-mono text-gray-300 italic">
                ({bucket.creationDate})
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div>[]</div>
      )}
    </div>
  );
};
