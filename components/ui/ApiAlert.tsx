"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Server } from "lucide-react";
import { Badge, BadgeProps } from "./badge";
import { Button } from "./button";
import toast from "react-hot-toast";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}
// it's like writing [1,2,3][2] and getting the number 3 because indexOf 2 of this array is 3
// when it comes to an object {name: "Younes" | "Zaki"}["name"] you'll get Younes and zaki , string referse to the string value
const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = "public",
}) => {
  const onCopy = (description: string) => {
    // this is how to copy the text on clicking
    window.navigator.clipboard.writeText(description);
    toast.success("API Route copied to the clipboard.");
  };
  return (
    <Alert>
      <AlertTitle className="flex items-center gap-x-2">
        <Server className="h-4 w-4" />
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono md:text-sm text-xs font-semibold">
          {description}
        </code>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onCopy(description)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
