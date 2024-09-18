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
