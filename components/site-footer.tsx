import React from "react";

export const SiteFooter = async () => {
  return (
    <div className=" m-2  text-14-regular justify-center items-center border-t w-screen">
      <p className=" mt-2 text-dark-600 xxl:text-left text-center">
        Copyright © {new Date().getFullYear()} HML Tech. <br></br>All rights
        reserved
      </p>
    </div>
  );
};
