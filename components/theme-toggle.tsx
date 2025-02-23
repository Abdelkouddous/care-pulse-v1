// "use client";

// import * as React from "react";
// import { Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";

// import { Button } from "@/components/ui/button";

// export function ThemeToggle() {
//   const { setTheme, theme } = useTheme();

//   return (
//     <Button
//       variant="ghost"
//       size="icon"
//       onClick={() =>
//         setTheme(theme === "medical-light" ? "medical-dark" : "light")
//       }
//     >
//       <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
//       <Moon className="hidden h-5 w-5 dark:block" />
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   );
// }
"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-[1.5rem] w-[1.3rem]" />
      </Button>
    );

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        setTheme(theme === "medical-light" ? "medical-dark" : "medical-light")
      }
    >
      {theme === "medical-dark" ? (
        <Sun className="h-5 w-5 text-foreground " />
      ) : (
        <Moon className="h-[1.5rem] w-[1.3rem] text-foreground " />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
