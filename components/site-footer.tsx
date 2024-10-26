import { Link } from "lucide-react";
import React from "react";

export const SiteFooter = async () => {
  return (
    <div className=" m-2 pt-1 text-14-regular justify-center items-center border-t w-screen">
      {" "}
      <div className=" flex flex-col space-x-1">
        <div className="flex flex-1 m-2 items-center">
          {" "}
          <Link></Link>
          <span>About </span>
        </div>
        <div className="flex flex-1 m-2 items-center">
          <Link></Link>
          <span>Ressources</span>
        </div>
      </div>
      <p className=" mt-1 mb-1 text-dark-600 xxl:text-left text-center">
        Copyright © {new Date().getFullYear()} HML Tech. <br></br>All rights
        reserved
      </p>
    </div>
  );
};
