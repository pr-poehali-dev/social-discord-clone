
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

type SidebarContextType = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCollapse: () => void;
  collapsible: "full" | "icon" | false;
  isSmallScreen: boolean;
};

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  toggleCollapse: () => {},
  collapsible: false,
  isSmallScreen: false,
});

type SidebarProviderProps = {
  children: ReactNode;
  collapsible?: "full" | "icon" | false;
  className?: string;
};

export const SidebarProvider = ({
  children,
  collapsible = false,
  className,
}: SidebarProviderProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isMobile } = useMobile();
  const [isSmallScreen, setIsSmallScreen] = useState(isMobile);

  useEffect(() => {
    setIsSmallScreen(isMobile);
    if (isMobile) setCollapsed(true);
    else setCollapsed(false);
  }, [isMobile]);

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggleCollapse,
        collapsible,
        isSmallScreen,
      }}
    >
      <div className={cn("flex h-screen w-full overflow-hidden", className)}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  collapsible?: "full" | "icon" | false;
};

export const Sidebar = ({
  className,
  children,
  collapsible = false,
  ...props
}: SidebarProps) => {
  const { collapsed, isSmallScreen } = useContext(SidebarContext);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-sidebar transition-all duration-300",
        collapsed && collapsible === "full" && "-ml-[--sidebar-width] md:ml-0 md:w-[--sidebar-collapsed-width]",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
};

type SidebarContentProps = React.HTMLAttributes<HTMLDivElement>;

export const SidebarContent = ({
  className,
  children,
  ...props
}: SidebarContentProps) => {
  const { collapsed, collapsible } = useContext(SidebarContext);

  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-y-auto",
        collapsible === "full" && collapsed && "px-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type SidebarInsetProps = React.HTMLAttributes<HTMLDivElement>;

export const SidebarInset = ({
  className,
  children,
  ...props
}: SidebarInsetProps) => {
  const { isSmallScreen } = useContext(SidebarContext);

  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-w-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
