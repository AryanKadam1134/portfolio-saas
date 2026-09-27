import { Skeleton } from "antd";

import SkeletonInput from "../ui/SkeletonInput";

export default function UserDetailsSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6 animate-pulse">
      {/* Profile Image */}
      <div className="row-span-3 col-span-12 sm:col-span-6 lg:col-span-3 flex items-center justify-center">
        <Skeleton.Avatar size={180} shape="circle" />
      </div>

      {[...Array(9)].map((_, idx) => (
        <SkeletonInput
          key={idx}
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        />
      ))}

      {[...Array(2)].map((_, idx) => (
        <SkeletonInput
          key={idx}
          inputHeight={140}
          colSpan="row-span-3 col-span-12 lg:col-span-3"
        />
      ))}

      <SkeletonInput
        inputHeight={140}
        colSpan="row-span-3 col-span-12 lg:col-span-6"
      />

      {[...Array(4)].map((_, idx) => (
        <SkeletonInput
          key={idx}
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        />
      ))}
    </div>
  );
}
