import clsx from "clsx";
import Image from "next/image";

import { StatusIcon } from "@/constants";

export const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <div
      className={clsx(
        "status-badge",
        {
          "bg-dark-200": status === "scheduled",
          "bg-dark-300": status === "pending",
          "bg-dark-400": status === "cancelled",
        },
        "flex flex-row items-center justfiy-center"
      )}
    >
      <Image
        src={StatusIcon[status]}
        alt="doctor"
        width={24}
        height={24}
        className="h-fit w-3 mr-1"
      />

      <p
        className={clsx("text-12-semibold capitalize", {
          "text-dark-200": status === "scheduled",
          "text-dark-400": status === "pending",
          "text-dark-600": status === "cancelled",
        })}
      >
        {/* {(status === "scheduled" && "scheduled ✅") ||
          (status === "pending" && "pending ⏳") ||
          (status === "cancelled" && "cancelled ❌")} */}
        {status}
      </p>
    </div>
  );
};
