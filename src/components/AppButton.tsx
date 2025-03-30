import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppButtonProps extends ButtonProps {
  tooltip?: string;
}

const AppButton: React.FC<AppButtonProps> = ({
  tooltip,
  children,
  ...props
}) => {
  if (tooltip) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button {...props}>{children}</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return <Button {...props}>{children}</Button>;
};

export default AppButton;
