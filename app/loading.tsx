import Image from "next/image";

export default function Loading() {
  return (
    <div className="grid place-items-center h-screen text-white">
      <div className="flex align-center items-center">
        <Image
          src="/assets/icons/loader.svg"
          alt="loader"
          width={40}
          height={3240}
          className="animate-spin mr-2"
        />
        <span className="text-gray-900 dark:text-gray-50">Loading...</span>
      </div>
    </div>
  );
}
