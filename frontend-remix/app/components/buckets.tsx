import { FC } from "react";

interface Bucket {
  name: string;
  creationDate: string;
}

export const Buckets: FC<{ buckets: { buckets: Bucket[] } }> = ({
  buckets,
}) => {
  return (
    <div>
      <h2>Buckets</h2>
      {buckets && buckets.buckets.length > 0 ? (
        <ul className="font-thin">
          {buckets.buckets.map((bucket, index) => (
            <li key={index} className="flex gap-2">
              <span>{bucket.name}</span>
              <span className="font-mono italic text-gray-300">
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
