import React from "react";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppToggleButtonProps {
  pressed: boolean;
  onPressedChange: () => void;
  className?: string;
  tooltip: string;
  children: React.ReactNode;
}

const AppToggleButton: React.FC<AppToggleButtonProps> = ({
  pressed,
  onPressedChange,
  className,
  tooltip,
  children,
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={pressed}
            onPressedChange={onPressedChange}
            className={className}
          >
            {children}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AppToggleButton;
