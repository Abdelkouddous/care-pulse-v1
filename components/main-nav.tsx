// "use client";
// import { User } from "lucide-react";
// import Link from "next/link";
// import * as React from "react";
// import { useState, useEffect, useRef } from "react";
// import { FiAlignJustify } from "react-icons/fi";

// import { Icons } from "@/components/icons";
// import { siteConfig } from "@/config/site";
// import { cn } from "@/lib/utils";
// import { NavItem } from "@/types/nav";

// import { ThemeToggle } from "./theme-toggle";
// import { Button } from "./ui/button";

// interface MainNavProps {
//   items?: NavItem[];
// }

// export function MainNav(
//   { items }: MainNavProps,
//   { searchParams }: SearchParamProps
// ) {
//   // variables and states ....
//   const isAdmin = searchParams?.admin === "true";
//   const isDoctor = searchParams?.doctor === "true";
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [isScrolling, setIsScrolling] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const dropdownRef = useRef<HTMLDivElement>(null); // Ref to the dropdown element
//   const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
//   let scrollTimeout: ReturnType<typeof setTimeout>;

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolling(true);
//       clearTimeout(scrollTimeout);

//       // Show navbar if scrolling paused for 2 seconds
//       scrollTimeout = setTimeout(() => {
//         setIsScrolling(false);
//       }, 2000);

//       // Check if scrolled to the top of the page
//       if (window.scrollY === 0) {
//         setIsScrolling(true);
//       }

//       setLastScrollY(window.scrollY);
//     };

//     const handleClickOutside = (event: MouseEvent) => {
//       // Close the dropdown if clicked outside
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setDropdownOpen(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     document.addEventListener("mousedown", handleClickOutside); // Listen for outside clicks

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       document.removeEventListener("mousedown", handleClickOutside);
//       clearTimeout(scrollTimeout);
//     };
//   }, []);

//   const handleMouseEnter = () => setIsScrolling(true); // HIDES THE NAVBAR WHEN WE CLICK OUTSIDE THE DIV ITSELF

//   return (
//     <div className="flex w-screen items-center justify-between ">
//       <div
//         className={`${
//           isScrolling ? "opacity-100" : "opacity-5"
//         } m-2 flex flex-1 items-center justify-between gap-8 p-1 px-4 shadow-md transition-opacity duration-300 ease-in-out md:gap-6 `}
//         onMouseEnter={handleMouseEnter} // Show navbar on hover
//       >
//         <Link
//           href="/"
//           className="flex items-center space-x-2 hover:scale-110 hover:opacity-85"
//         >
//           <Icons.logo className="size-6" />
//           <span className="inline-block font-bold">{siteConfig.name}</span>
//         </Link>
//         {items?.length ? (
//           <>
//             {/* Horizontal navigation, hidden on screens under 767px */}
//             <nav className="hidden md:flex md:flex-row md:justify-center md:gap-6  ">
//               {items.map(
//                 (item, index) =>
//                   item.href && (
//                     <Link
//                       key={index}
//                       href={item.href}
//                       className={cn(
//                         "flex items-center text-sm font-medium text-muted-foreground hover:scale-110 hover:opacity-85 ",
//                         item.disabled && "cursor-not-allowed opacity-80"
//                       )}
//                     >
//                       <Button variant="ghost"> {item.title} </Button>
//                     </Link>
//                   )
//               )}
//             </nav>

//             {/* Dropdown for smaller screens, visible only on screens <767px */}
//             <div
//               ref={dropdownRef}
//               className="relative z-50 m-auto items-center justify-between md:hidden"
//               // dark:text-slate-50 dark:bg-slate-900 text-slate-900 bg-slate-50
//             >
//               <Button
//                 onClick={toggleDropdown}
//                 variant="ghost"
//                 className="flex items-center text-sm font-medium text-muted-foreground "
//               >
//                 <FiAlignJustify className="size-6 hover:scale-105 ">
//                   {/* dark:text-slate-50 text-slate-900 */}
//                 </FiAlignJustify>
//               </Button>

//               {/* Conditionally render dropdown if `isDropdownOpen` is true */}
//               {isDropdownOpen && (
//                 <div className="absolute left-1/2 mt-2 -translate-x-1/2  space-y-1 rounded-md bg-medical-light p-1 shadow-md">
//                   {items?.map(
//                     (item, index) =>
//                       item.href && (
//                         <Link
//                           key={index}
//                           href={item.href}
//                           className={cn(
//                             "flex flex-row justify-center items-center text-sm font-medium text-muted-foreground hover:scale-105 p-3 my-1 ",
//                             item.disabled && "cursor-not-allowed opacity-80"
//                           )}
//                         >
//                           {" "}
//                           <Button variant="ghost"> {item.title} </Button>
//                         </Link>
//                       )
//                   )}
//                 </div>
//               )}
//             </div>
//             {(isAdmin || isDoctor) && <User className="size-6" />}
//             <div className="flex items-center justify-end ">
//               <Button
//                 variant="ghost"
//                 className="transition-ease-out m-2  border-s  shadow-lg duration-300 hover:bg-gray-100 dark:opacity-80 dark:shadow-lg dark:shadow-medical-dark dark:hover:bg-medical-dark dark:hover:text-medical-light"
//               >
//                 <User className="mr-2 size-4" />
//                 Sign In
//               </Button>
//               <ThemeToggle />
//             </div>

//             {/* <MessageSquareDashedIcon className="relative top-2 right-2 h-6 w-6 text-gray-500 dark:text-gray-200" /> */}
//           </>
//         ) : null}
//       </div>
//     </div>
//   );
// }

// export default MainNav;
"use client";

import { User } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { FiAlignJustify } from "react-icons/fi";

import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/nav";

import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

interface MainNavProps {
  items?: NavItem[];
  searchParams?: {
    admin?: string;
    doctor?: string;
  };
}

export function MainNav({ items, searchParams }: MainNavProps): JSX.Element {
  // Extract search parameters with proper typing
  const isAdmin = searchParams?.admin === "true";
  const isDoctor = searchParams?.doctor === "true";

  // State management
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Event handlers
  const toggleDropdown = (): void => setDropdownOpen((prev) => !prev);
  const handleMouseEnter = (): void => setIsScrolling(true);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Show navbar if scrolling paused for 2 seconds
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 2000);

      // Always show navbar at the top of the page
      if (window.scrollY === 0) {
        setIsScrolling(true);
      }

      setLastScrollY(window.scrollY);
    };

    const handleClickOutside = (event: MouseEvent): void => {
      // Close the dropdown if clicked outside
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="flex w-full items-center justify-between">
        <nav
          className={`${
            isScrolling ? "opacity-100" : "opacity-10 hover:opacity-100"
          } mx-auto my-2 flex w-full max-w-7xl items-center justify-between rounded-lg bg-white px-6 py-3 shadow-md transition-all duration-300 ease-in-out dark:bg-gray-800`}
          onMouseEnter={handleMouseEnter}
        >
          {/* Logo and brand name */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform duration-200 ease-in-out hover:scale-105"
          >
            <Icons.logo className="size-8" />
            <span className="inline-block text-lg font-bold text-gray-900 dark:text-white">
              {siteConfig.name}
            </span>
          </Link>

          {/* Navigation items */}
          {items?.length ? (
            <>
              {/* Desktop navigation */}
              <div className="hidden items-center space-x-1 md:flex">
                {items.map(
                  (item, index) =>
                    item.href && (
                      <Link
                        key={index}
                        href={item.href}
                        className={cn(
                          "flex items-center text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
                          item.disabled && "cursor-not-allowed opacity-60"
                        )}
                      >
                        <Button variant="ghost" className="font-medium">
                          {item.title}
                        </Button>
                      </Link>
                    )
                )}
              </div>

              {/* Mobile dropdown menu */}
              <div ref={dropdownRef} className="relative z-50 md:hidden">
                <Button
                  onClick={toggleDropdown}
                  variant="ghost"
                  aria-label="Toggle menu"
                  className="flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  <FiAlignJustify className="size-6" />
                </Button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                    {items.map(
                      (item, index) =>
                        item.href && (
                          <Link
                            key={index}
                            href={item.href}
                            className={cn(
                              "block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                              item.disabled && "cursor-not-allowed opacity-60"
                            )}
                            onClick={() => setDropdownOpen(false)}
                          >
                            {item.title}
                          </Link>
                        )
                    )}
                  </div>
                )}
              </div>

              {/* User section */}
              <div className="flex items-center space-x-2">
                {/* Show user icon for admin or doctor */}
                {(isAdmin || isDoctor) && (
                  <div className="flex items-center rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                    <User className="size-5 text-gray-700 dark:text-gray-300" />
                  </div>
                )}

                {/* Sign in button */}
                <Button
                  variant="outline"
                  className="flex items-center rounded-full bg-white px-4 py-2 font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <User className="mr-2 size-4" />
                  Sign In
                </Button>

                {/* Theme toggle */}
                <ThemeToggle />
              </div>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export default MainNav;
